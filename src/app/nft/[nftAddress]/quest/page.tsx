"use client";

import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import StartQuest from "./StartQuest";
import { CreditProvider } from "@/wrapper/credits.wrapper";

const Page = ({
  params: { nftAddress },
}: {
  params: { nftAddress: string };
}) => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { connected, publicKey } = useWallet();

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
      (nft) => nft.id === nftAddress
    );

    if (nftDetails && nftDetails.content) {
      const content = nftDetails.content;
      if (
        content.files &&
        content.files[0] &&
        content.metadata &&
        content.metadata.name &&
        content.metadata.description &&
        content.metadata.attributes
      ) {
        return (
          <div className="pt-20">
            <StartQuest
              image={content.files[0].uri || content.links?.image}
              description={content.metadata.description}
              title={content.metadata.name}
              properties={content.metadata.attributes}
              nftAddress={nftAddress}
              walletAddress={publicKey?.toBase58() ?? ''}
            />
          </div>
        );
      }
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        <p className="font-medium text-xl">Nft Not found </p>
      </div>
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
