import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useCreditContext } from "@/wrapper/credits.wrapper";

const BuyCredits = ({ nftAddress }: { nftAddress: string }) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { updateCredits, creditsDetails } = useCreditContext();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleBuyCredits = async () => {
        if (!publicKey || !connection) {
            console.error("Wallet not connected");
            return;
        }

        const receiverAddress = new PublicKey("9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj");
        const tokenMint = new PublicKey("53ctv3wwFXQbXruKWsbQcCe7sefowyu96pXK6FRLTjfv");
        const amount = 1000000; // Amount of SPL tokens to transfer

        try {
            const fromTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                publicKey,
                false,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            const toTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                receiverAddress,
                false,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            const transaction = new Transaction().add(
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    publicKey,
                    amount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            await connection.confirmTransaction(signature);

            // console.log("Transaction successful:", signature);
            
            const response = await fetch('/api/increase-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nftAddress: nftAddress, amount: 20 }),
            });

            if (response.ok) {
                const newCredits = creditsDetails?.credits ? creditsDetails.credits + 20 : 20;
                updateCredits(newCredits);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000); // Hide message after 3 seconds
            } else {
                throw new Error('Failed to increase credits');
            }
        } catch (error) {
            console.error("Error buying credits:", error);
            if (error instanceof Error) {
                alert(`Failed to buy credits: ${error.message}`);
            } else {
                alert("An unknown error occurred while buying credits");
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleBuyCredits}
                className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 whitespace-nowrap"
            >
                Buy Credits
            </button>
            {showSuccessMessage && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                    Credits purchased successfully!
                </div>
            )}
        </div>
    );
};

export default BuyCredits; 