import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
// @ts-ignore
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CharacterOptions } from "@/app/create-character/data/characterData";

interface GenerateCharacterImageProps {
  characterOptions: CharacterOptions;
  onImageGenerated: (imageUrl: string) => void;
}

const GenerateCharacterImage: React.FC<GenerateCharacterImageProps> = ({ characterOptions, onImageGenerated }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!publicKey || !connection) {
      console.error("Wallet not connected");
      return;
    }

    setLoading(true);

    const receiverAddress = new PublicKey("F3nfkmvct4WGNvUywUX7qpSaEhnbpSgxaKRouqJWnmop");
    const tokenMint = new PublicKey("8vWj3EB7hbqXiRutkK8hweEGFL49BWkVMdRyQxtCkrje");
    const amount = 100000000000000; // Amount of SPL tokens to transfer

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

      // Token transfer confirmed, now generate the image
      const response = await fetch('/api/generate-character-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterOptions),
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        onImageGenerated(imageUrl);
      } else {
        throw new Error('Failed to generate character image');
      }
    } catch (error) {
      console.error("Error generating character image:", error);
      if (error instanceof Error) {
        alert(`Failed to generate character image: ${error.message}`);
      } else {
        alert("An unknown error occurred while generating character image");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerateImage}
      disabled={loading}
      className="w-full max-w-xl inline-flex h-12 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      {loading ? 'Generating...' : 'Generate Character Image'}
    </button>
  );
};

export default GenerateCharacterImage; 