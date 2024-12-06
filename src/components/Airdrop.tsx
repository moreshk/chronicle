import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { MerkleDistributorIDL, MerkleDistributorJSON } from "@/program/merkle_distributor_idl";
import { findClaimStatusKey } from "@/utils/pda";
import { BalanceTree } from "@/utils/balance-tree";
import { toBytes32Array } from "@/utils/bytes32";
import { BN } from "@project-serum/anchor";

interface AirdropProps {
    distributerAccount: string;
    snapshotTree: {
        claims: Record<string, { amount: string }>[];
    };
    tokenMint: string;
}

const PROGRAM_ID = new PublicKey("2DVtQm2Tw4rMiwZdLw3ccvaYD3ksXYyMXRJozDJ1vWNc");

const Airdrop = ({ distributerAccount, snapshotTree, tokenMint }: AirdropProps) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [status, setStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    const getNetworkName = async () => {
        const genesisHash = await connection.getGenesisHash();

        // Mainnet genesis hash
        if (genesisHash === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") {
            return "mainnet-beta";
        }
        // Devnet genesis hash
        else if (genesisHash === "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG") {
            return "devnet";
        }
        // Testnet genesis hash
        else if (genesisHash === "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY") {
            return "testnet";
        }
        return "unknown";
    };

    const handleClaim = async () => {
        if (!publicKey || !connection) {
            setStatus({
                type: 'error',
                message: 'Please connect your wallet to continue'
            });
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const provider = new AnchorProvider(
                connection,
                window.solana,
                { commitment: "confirmed" }
            );

            const program = new Program(
                MerkleDistributorJSON as any,
                PROGRAM_ID,
                provider
            );

            // Find user's snapshot index
            const snapShotIndex = snapshotTree.claims.findIndex(
                (item) => publicKey.toBase58() in item
            );

            console.log("snapshot index: ", snapShotIndex);
            const network = await getNetworkName();
            console.log("Current network:", network);

            if (snapShotIndex === -1) {
                setStatus({
                    type: 'error',
                    message: 'This wallet is not eligible for the airdrop'
                });
                return;
            }

            const DISTRIBUTOR_ACCOUNT = new PublicKey(distributerAccount);
            const [claimStatus, bump] = await findClaimStatusKey(
                snapShotIndex,
                DISTRIBUTOR_ACCOUNT,
                PROGRAM_ID
            );

            // Create balance tree
            const tree = new BalanceTree(
                snapshotTree.claims.map((claim) => {
                    const [authority, details] = Object.entries(claim)[0];
                    return {
                        account: new PublicKey(authority),
                        amount: details.amount,
                    };
                })
            );

            const walletSnapshot = snapshotTree.claims[snapShotIndex][publicKey.toBase58()];
            const proof = tree.getProof(snapShotIndex, publicKey, walletSnapshot.amount);

            // Get token accounts
            const fromATA = await getAssociatedTokenAddress(
                new PublicKey(tokenMint),
                DISTRIBUTOR_ACCOUNT,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            const toATA = await getAssociatedTokenAddress(
                new PublicKey(tokenMint),
                publicKey,
                false,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // Check if the toATA exists
            const toAccountInfo = await connection.getAccountInfo(toATA);
            const instructions: TransactionInstruction[] = [];

            if (!toAccountInfo) {
                // Add instruction to create the ATA if it doesn't exist
                instructions.push(
                    createAssociatedTokenAccountInstruction(
                        publicKey, // payer
                        toATA,     // associated token account
                        publicKey, // owner
                        new PublicKey(tokenMint)
                    )
                );
            }

            console.log("ATA Accounts", fromATA, toATA);

            const amount = new BN(walletSnapshot.amount);
            const snapShotIndexBN = new BN(snapShotIndex);
            console.log(amount, "amount", walletSnapshot.amount);

            const transaction = await program.methods
                .claim(
                    bump,
                    snapShotIndexBN,
                    amount,
                    proof.map(toBytes32Array)
                )
                .accounts({
                    distributor: DISTRIBUTOR_ACCOUNT,
                    claimStatus,
                    from: fromATA,
                    to: toATA,
                    claimant: publicKey,
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .preInstructions(instructions)
                .transaction();

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            await connection.confirmTransaction(signature);

            setStatus({
                type: 'success',
                message: 'Congratulations! Your tokens have been claimed successfully'
            });
            
            setTimeout(() => {
                setStatus({ type: null, message: '' });
            }, 5000);

        } catch (error) {
            // Log the detailed error to console for debugging
            console.error("Error claiming airdrop:", error);
            
            // Show user-friendly message in UI
            let userMessage = 'Something went wrong while claiming your tokens. Please try again later.';
            
            // Check for specific error patterns
            if (error instanceof Error) {
                const errorString = error.toString();
                
                // Check for already claimed error
                if (errorString.includes("already in use")) {
                    userMessage = "You have already claimed your tokens";
                }
                // Check for insufficient balance
                else if (errorString.toLowerCase().includes("insufficient")) {
                    userMessage = "Insufficient SOL balance for transaction fees";
                }
            }

            setStatus({
                type: 'error',
                message: userMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center gap-4">
            <button
                onClick={handleClaim}
                disabled={loading}
                className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 whitespace-nowrap"
            >
                {loading ? "Claiming..." : "Claim Airdrop"}
            </button>
            
            {status.type && (
                <div className={`
                    max-w-md text-center p-4 rounded-lg transition-all duration-500 
                    ${status.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }
                `}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default Airdrop;