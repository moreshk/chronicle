/* eslint-disable @next/next/no-img-element */
"use client";
import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const Page = ({
  params: { nftAddress },
}: {
  params: { nftAddress: string };
}) => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { connected } = useWallet();

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="font-medium text-xl">Error loading NFT</p>
      </div>
    );
  }

  if (isNftLoaded === "loading" || isNftLoaded === "unloaded") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4  sm:p-24">
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-10">
          <button
            disabled
            className="inline-flex h-64 sm:w-96 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <button
            disabled
            className="inline-flex h-10 sm:w-[500px] w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 my-6"
          />

          <button
            disabled
            className="inline-flex h-44 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <div className="flex gap-2 flex-col mt-10">
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-80 w-48 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isNftLoaded === "loaded" && nfts) {
    const nftDetails = nfts.find(
      (nft) => nft.address.toBase58() === nftAddress
    );

    if (nftDetails) {
      const attributes = nftDetails.json?.attributes?.reduce((acc, attr) => {
        acc[attr.trait_type as string] = attr.value;
        return acc;
      }, {} as Record<string, unknown>) ?? {};

      return (
        <main className="items-center justify-center px-4 py-24 sm:py-24 sm:p-24">
          <div className="flex justify-center items-center">
            <img
              src={nftDetails.json?.image}
              alt={nftDetails.json?.name}
              className="rounded-xl w-full h-auto max-w-md sm:max-w-sm"
            />
          </div>
          <h1 className="text-4xl font-bold text-center my-4">
            {nftDetails.json?.name}
          </h1>
          
          <p className="text-center mx-auto max-w-4xl">
            {nftDetails.json?.description}
          </p>

          <div className="flex justify-center items-end gap-4 mt-6 flex-col sm:flex-row w-full">
            <Link
              href={`/nft/${nftAddress}/chat`}
              className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40"
            >
              Chat
            </Link>
            {/* <Link
                href={`/nft/${nftAddress}/quest`}
                className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40"
              >
                Quest
              </Link> */}
          </div>
          <div className="border border-white/15 bg-black p-4 my-4 sm:my-10 rounded-2xl relative mx-auto max-w-4xl">
            <div className="grid sm:grid-cols-2 gap-2 sm:max-w-3xl mx-auto sm:w-auto w-full">
              {Object.entries(attributes).map(([key, value]) => (
                <div className="grid grid-cols-2 gap-1" key={key}>
                  <p className="font-bold">{key}:</p>
                  <p>{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
         
          
        </main>
      );
    } else {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <p className="font-medium text-xl">NFT not found</p>
        </div>
      );
    }
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