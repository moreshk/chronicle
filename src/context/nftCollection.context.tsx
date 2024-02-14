"use client";

import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { FindNftsByOwnerOutput, PublicKey } from "@metaplex-foundation/js";
import { useMetaplex } from "./metaplex.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

const minPubKey = new PublicKey(process.env.NEXT_PUBLIC_MINT_ADDRESS || "");

export const NFTCollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nfts, setNfts] = useState<FindNftsByOwnerOutput | undefined>();
  const [isNftLoaded, setIsNftLoaded] = useState<
    "unloaded" | "loading" | "loaded"
  >("loading");
  const [error, setError] = useState<string | undefined>();
  const { metaplex } = useMetaplex();
  const router = useRouter();
  const { connected, connecting } = useWallet();

  const onWalletConnect = async () => {
    if (metaplex && connected) {
      try {
        const myAssets = await metaplex
          .nfts()
          .findAllByOwner({ owner: metaplex.identity().publicKey });
        let counterI = 0;
        const collection = myAssets.filter(
          (nft) => nft.collection?.address.toBase58() === minPubKey.toBase58()
        );
        for (var i in collection) {
          counterI += 1;
          let fetchResult = await fetch(collection[i].uri);
          let json = await fetchResult.json();
          collection[i] = { ...collection[i], json: json, jsonLoaded: true };
        }
        setNfts(collection);
      } catch (e) {
        setError("unable to load nfts");
      } finally {
        setIsNftLoaded("loaded");
      }
    } else {
      if (!connecting) {
        setIsNftLoaded("unloaded");
        setNfts(undefined);
        setError(undefined);
      }
    }
  };
  useEffect(() => {
    onWalletConnect();
  }, [connected, connecting]);

  return (
    <NFTCollectionContext.Provider value={{ nfts, isNftLoaded, error }}>
      {children}
    </NFTCollectionContext.Provider>
  );
};

const DEFAULT_CONTEXT: {
  nfts: FindNftsByOwnerOutput | undefined;
  isNftLoaded: "unloaded" | "loading" | "loaded" | "error";
  error: string | undefined;
} = {
  nfts: undefined,
  isNftLoaded: "unloaded",
  error: undefined,
};

export const NFTCollectionContext = createContext(DEFAULT_CONTEXT);

export function useNFT() {
  return useContext(NFTCollectionContext);
}
