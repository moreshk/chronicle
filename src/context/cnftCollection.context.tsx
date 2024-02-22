"use client";

import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { useMetaplex } from "./metaplex.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { clientUmi } from "@/utils/client-umi";
import { publicKey as convertPK } from "@metaplex-foundation/umi";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";

export const CNFTCollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cnfts, setcNfts] = useState<DasApiAsset[] | undefined>();
  const [isNftLoaded, setIsNftLoaded] = useState<
    "unloaded" | "loading" | "loaded"
  >("loading");
  const [error, setError] = useState<string | undefined>();
  const { metaplex } = useMetaplex();
  const { connected, connecting, publicKey } = useWallet();

  const onWalletConnect = async () => {
    if (metaplex && connected && publicKey) {
      const useWalletAddress = convertPK(publicKey.toString());
      try {
        const assetsByOwner = await clientUmi.rpc.getAssetsByOwner({
          owner: useWalletAddress,
        });
        const colletion = assetsByOwner.items.filter(
          (cnft) =>
            cnft.grouping.length &&
            cnft.grouping[0].group_value ===
              process.env.NEXT_PUBLIC_COLLECTION_ADDRESS
        );
        console.log(colletion);
        if (colletion) setcNfts(colletion);
      } catch (e) {
        setError("unable to load nfts");
      } finally {
        setIsNftLoaded("loaded");
      }
    } else {
      if (!connecting) {
        setIsNftLoaded("unloaded");
        setcNfts(undefined);
        setError(undefined);
      }
    }
  };
  useEffect(() => {
    onWalletConnect();
  }, [connected, connecting]);

  return (
    <CNFTCollectionContext.Provider value={{ cnfts, isNftLoaded, error }}>
      {children}
    </CNFTCollectionContext.Provider>
  );
};

const DEFAULT_CONTEXT: {
  cnfts: DasApiAsset[] | undefined;
  isNftLoaded: "unloaded" | "loading" | "loaded" | "error";
  error: string | undefined;
} = {
  cnfts: undefined,
  isNftLoaded: "unloaded",
  error: undefined,
};

export const CNFTCollectionContext = createContext(DEFAULT_CONTEXT);

export function useCNFT() {
  return useContext(CNFTCollectionContext);
}
