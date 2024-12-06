'use client';

import Airdrop from "@/components/Airdrop";
import { ConnectWallet } from "@/components/connectWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { claims } from "../../../airdrop_list";

export default function ClaimPage() {
  const { connected } = useWallet();
  
  const airdropConfig = {
    distributerAccount: "HYh5S9XAxbCSSC8xy3TN1HyRPePAwPWrLzX4ZsRJPG2e",
    tokenMint: "8vWj3EB7hbqXiRutkK8hweEGFL49BWkVMdRyQxtCkrje",
    snapshotTree: {
      claims,
    }
  };

  if (!connected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
        <ConnectWallet />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
      <h1 className="font-bold text-3xl sm:text-7xl text-center text-balance mb-10">
        Claim Your Airdrop
      </h1>
      <Airdrop {...airdropConfig} />
    </main>
  );
}