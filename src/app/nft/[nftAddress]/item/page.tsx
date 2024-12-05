"use client";

import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import ClaimItem from "./ClaimItem";
import { useState, useEffect } from 'react';

const Page = ({
  params: { nftAddress },
}: {
  params: { nftAddress: string };
}) => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { connected } = useWallet();
  const { publicKey } = useWallet();
  const [silverBalance, setSilverBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchSilverBalance() {
      if (publicKey) {
        try {
          const response = await fetch('/api/get-silver-balance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nftAddress, walletAddress: publicKey.toBase58() }),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSilverBalance(data.silver);
        } catch (error) {
          console.error('Failed to fetch silver balance', error);
        }
      }
    }

    fetchSilverBalance();
  }, [publicKey, nftAddress]);

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
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-10">
          <button
            disabled
            className="inline-flex h-64 sm:w-96 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <button
            disabled
            className="inline-flex h-5 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
        </div>
      </div>
    );
  }

  if (isNftLoaded === "loaded" && nfts) {
    const nftDetails = nfts.find(
      (nft) => nft.address.toBase58() === nftAddress
    );
  
    if (nftDetails && nftDetails.json && Array.isArray(nftDetails.json.attributes)) {
      // Find the attribute for 'Gold'
      const goldAttribute = nftDetails.json.attributes.find((attr: { trait_type: string; value: string }) => attr.trait_type === 'Gold');
      const goldValue = goldAttribute && goldAttribute.value ? parseFloat(goldAttribute.value) : 0;
      // Ensure silverBalance is a number by parsing it with parseFloat
      const silverBalanceNumber = parseFloat(silverBalance.toString());
      const currentGoldValue = (goldValue + silverBalanceNumber).toFixed(2);
  
      // Console log the current value of gold
      console.log(`Current Gold Value: ${currentGoldValue}`);
  
      return (
        <ClaimItem
          currentGold={parseFloat(currentGoldValue)}
          nftAddress={nftAddress} // Add this line
        />
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