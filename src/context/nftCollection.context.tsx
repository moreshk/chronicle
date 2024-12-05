"use client";

import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export const NFTCollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isNftLoaded, setIsNftLoaded] = useState<
    "unloaded" | "loading" | "loaded"
  >("loading");
  const [error, setError] = useState<string | undefined>();
  const { connected, publicKey } = useWallet();

  const fetchNftsFromHelius = async (ownerAddress: string) => {
    const url = `https://mainnet.helius-rpc.com/?api-key=1bd7151b-2c57-45f5-8172-b32538120d8e`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "searchAssets",
          params: {
            ownerAddress,
            grouping: ["collection", "HrDFFFacT6xVUUEBWDjvGvR6z1eDuKd2egtQsA8p3yd2"],
            page: 1,
            limit: 1000,
          },
        }),
      });
      const { result } = await response.json();
      setNfts(result.items);
      setIsNftLoaded("loaded");
    } catch (e) {
      setError("unable to load nfts");
      setIsNftLoaded("unloaded");
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      setIsNftLoaded("loading");
      fetchNftsFromHelius(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  return (
    <NFTCollectionContext.Provider value={{ nfts, isNftLoaded, error }}>
      {children}
    </NFTCollectionContext.Provider>
  );
};

const DEFAULT_CONTEXT: {
  nfts: any[] | undefined;
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
