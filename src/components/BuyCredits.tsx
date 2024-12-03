import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

const BuyCredits = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const handleBuyCredits = async () => {
        if (!publicKey || !connection) {
            console.error("Wallet not connected");
            return;
        }

        const receiverAddress = new PublicKey("9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj");
        const tokenMint = new PublicKey("53ctv3wwFXQbXruKWsbQcCe7sefowyu96pXK6FRLTjfv");
        const amount = 100; // Amount of SPL tokens to transfer

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

            console.log("Transaction successful:", signature);
            // You may want to update the user's credit balance here
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
        <button
            className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 whitespace-nowrap text-sm px-4 h-10 animate-background-shine"
            onClick={handleBuyCredits}
        >
            Buy Credits
        </button>
    );
};

export default BuyCredits; 