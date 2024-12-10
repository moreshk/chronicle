"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  PublicKey 
} from "@solana/web3.js";
import { 
  createInitializeMintInstruction, 
  getMinimumBalanceForRentExemptMint, 
  MINT_SIZE, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction
} from "@solana/spl-token";
import { ConnectWallet } from "@/components/connectWallet";

const CreateToken = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !sendTransaction) return;

    setIsCreating(true);
    try {
      const mint = Keypair.generate();
      const decimals = 9;
      const totalSupply = 1_000_000_000; // 1 Billion

      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint.publicKey,
        publicKey
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          publicKey,
          mint.publicKey
        ),
        createMintToInstruction(
          mint.publicKey,
          associatedTokenAddress,
          publicKey,
          totalSupply * (10 ** decimals)
        )
      );

      const signature = await sendTransaction(transaction, connection, { signers: [mint] });
      await connection.confirmTransaction(signature, 'confirmed');

      setTokenAddress(mint.publicKey.toBase58());

      // Here you would typically store the token name and description off-chain
      console.log(`Token created: ${mint.publicKey.toBase58()}`);
      console.log(`Name: ${tokenName}`);
      console.log(`Description: ${tokenDescription}`);
      console.log(`Total supply minted to ${publicKey.toBase58()}`);

    } catch (error) {
      console.error("Error creating token:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!publicKey) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
        <ConnectWallet />
      </main>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Create SPL Token</h1>
      <form onSubmit={handleCreateToken} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700">
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100 text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tokenDescription" className="block text-sm font-medium text-gray-700">
            Token Description
          </label>
          <textarea
            id="tokenDescription"
            value={tokenDescription}
            onChange={(e) => setTokenDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100 text-black"
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          {isCreating ? "Creating..." : "Create Token"}
        </button>
      </form>
      {tokenAddress && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Token Created Successfully!</h2>
          <p className="text-sm">Token Address: {tokenAddress}</p>
        </div>
      )}
    </div>
  );
};

export default CreateToken; 