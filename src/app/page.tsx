"use client";

import { ConnectWallet } from "@/components/connectWallet";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
      <ConnectWallet />
    </main>
  );
}
