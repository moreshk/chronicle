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
      (nft) => nft.id === nftAddress
    );

    if (nftDetails) {
      const hash = nftAddress
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomNumber = (hash % 10) + 1;
      const speakingStyles = [
        "rude",
        "over excited",
        "flowery",
        "bored",
        "snarky",
        "curt",
        "witty",
        "angry",
        "goofy",
        "bombastic",
      ];
      const speakingStyle = speakingStyles[randomNumber - 1];

      const content = nftDetails.content;
      if (
        content &&
        content.files &&
        content.files[0] &&
        content.metadata &&
        content.metadata.name &&
        content.metadata.description &&
        content.metadata.attributes
      ) {
        return (
          <ChatWithNft
            image={content.files[0].uri || content.links?.image}
            description={content.metadata.description}
            title={content.metadata.name}
            properties={content.metadata.attributes}
            speakingStyle={speakingStyle}
            nftAddress={nftAddress}
            walletAddress={publicKey!.toBase58()}
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
