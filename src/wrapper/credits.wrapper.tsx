"use client";
import { getCreditsFromAPI } from "@/serverAction/getCreditsForNFT";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface CreditContextProps {
  credits: number;
  loading: boolean;
  showCredits: boolean;
  setShowCredits: (show: boolean) => void;
  updateCredits: (newCredits: number) => void;
  fetchData: () => void;
}

const CreditContext = createContext<CreditContextProps | undefined>(undefined);

interface CreditProviderProps {
  children: ReactNode;
}

export const CreditProvider: React.FC<CreditProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCredits, setShowCredits] = useState(false);
  const { connected, publicKey } = useWallet();
  const params = useParams() as { nftAddress?: string };

  const fetchData = async () => {
    setLoading(true);
    try {
      const count = await getCreditsFromAPI(params.nftAddress!);
      setCredits(count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowCredits(false);
  }, [params]);

  useEffect(() => {
    if (connected && publicKey && params?.nftAddress) fetchData();
  }, [connected, params?.nftAddress]);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  return (
    <CreditContext.Provider
      value={{
        credits,
        loading,
        updateCredits,
        fetchData,
        setShowCredits,
        showCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};

// Custom hook to easily access the context
export const useCreditContext = (): CreditContextProps => {
  const context = useContext(CreditContext);

  if (!context) {
    throw new Error("useCreditContext must be used within a CreditProvider");
  }

  return context;
};
