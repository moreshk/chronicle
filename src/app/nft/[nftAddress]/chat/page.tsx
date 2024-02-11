"use client";

import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import ChatWithNft from "./ChatWithNFT";

const Page = ({
  params: { nftAddress },
}: {
  params: { nftAddress: string };
}) => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { publicKey, connected } = useWallet(); // publicKey is the user's wallet address

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="font-medium text-xl">Error loading NFT</p>
      </div>
    );
  }

  if (isNftLoaded === "loading" || isNftLoaded === "unloaded") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        {/* Loading or unloaded state UI */}
      </div>
    );
  }

  if (isNftLoaded === "loaded" && nfts) {
    const nftDetails = nfts.find(
      (nft) => nft.address.toBase58() === nftAddress
    );

    if (nftDetails) {
      const hash = nftAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomNumber = (hash % 10) + 1;
      const speakingStyles = [
         "rude",  "over excited",
        "flowery",  "bored", "snarky", "curt", "witty", "angry", "goofy", "bombastic",
      ];
      const speakingStyle = speakingStyles[randomNumber - 1];

      if (nftDetails.json && nftDetails.json.image && nftDetails.json.description &&
          nftDetails.json.name && nftDetails.json.attributes) {
        return (
          <ChatWithNft
            image={nftDetails.json.image}
            description={nftDetails.json.description}
            title={nftDetails.json.name}
            properties={nftDetails.json.attributes}
            speakingStyle={speakingStyle}
            nftAddress={nftAddress} // Pass the NFT address to the ChatWithNft component
            walletAddress={publicKey!.toBase58()} // Pass the user's wallet address to the ChatWithNft component
          />
        );
      }
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        <p className="font-medium text-xl">NFT Not found</p>
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