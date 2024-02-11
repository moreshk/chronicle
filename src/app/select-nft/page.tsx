/* eslint-disable @next/next/no-img-element */
"use client";
import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Page = () => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { push } = useRouter();
  const { connected } = useWallet();

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="font-medium text-xl">Error loading NFT </p>
      </div>
    );
  }
  if (isNftLoaded === "loading" || isNftLoaded === "unloaded") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        <p className="font-bold text-3xl sm:text-4xl text-center text-balance">
          Loading all your NFT&apos;s
        </p>
        <div className="flex flex-col sm:flex-row gap-10 mt-10">
          <button
            disabled
            className="inline-flex h-64 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <button
            disabled
            className="inline-flex h-64 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
        </div>
      </div>
    );
  }

  if (isNftLoaded === "loaded" && nfts) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="font-bold text-3xl sm:text-4xl text-center text-balance"
        >
          {nfts.length} Chronicle NFTs Detected!
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-2 sm:mt-8"
        >
          Select to see character profiles
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-10 mt-6 sm:mt-10">
          {nfts.map((nft) => (
            <div
              onClick={() => push(`/nft/${nft.address.toBase58()}/`)}
              className="group"
              key={nft.json?.image}
            >
              <div className="relative inline-block overflow-hidden rounded-2xl h-64 w-64 p-1 transition ease-in-out duration-300">
                <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] bg-white/30" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center bg-slate-950/90 text-sm font-medium rounded-xl text-white backdrop-blur-3xl">
                  <img
                    src={nft.json?.image}
                    className="cursor-pointer rounded-xl"
                    alt="nft"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
  if (!connected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
        <ConnectWallet />
      </main>
    );
  }
  return null;
};

export default Page;
