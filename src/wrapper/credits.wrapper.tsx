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
  creditsDetails:
    | {
        credits: number;
        lastUpdated: string;
      }
    | undefined;
  loading: boolean;
  showCredits: boolean;
  setShowCredits: (show: boolean) => void;
  updateCredits: (newCredits: number) => void;
  fetchData: () => void;
  getSeconds: () => number;
}

const CreditContext = createContext<CreditContextProps | undefined>(undefined);

interface CreditProviderProps {
  children: ReactNode;
}

export const CreditProvider: React.FC<CreditProviderProps> = ({ children }) => {
  const [creditsDetails, setCreditsDetails] = useState<
    | {
        credits: number;
        lastUpdated: string;
      }
    | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const [showCredits, setShowCredits] = useState(false);
  const { connected, publicKey } = useWallet();
  const params = useParams() as { nftAddress?: string };

  const fetchData = async () => {
    setLoading(true);
    try {
      const details = (await getCreditsFromAPI(params.nftAddress!)) as {
        credits: number;
        lastUpdated: string;
      };
      setCreditsDetails(details);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params.nftAddress) {
      setShowCredits(false);
    }
  }, [params]);

  useEffect(() => {
    if (connected && publicKey && params?.nftAddress) fetchData();
  }, [connected, params?.nftAddress]);

  const updateCredits = (newCredits: number) => {
    setCreditsDetails({
      credits: newCredits,
      lastUpdated: new Date().toISOString(),
    });
  };
  const getSeconds = () => {
    const resetCreditsMin = process.env.NEXT_PUBLIC_RESET_CREDITS_MINUTES
      ? parseInt(process.env.NEXT_PUBLIC_RESET_CREDITS_MINUTES, 10)
      : 10;
    if (creditsDetails) {
      return getRemainingSeconds(creditsDetails.lastUpdated, resetCreditsMin);
    }

    return resetCreditsMin * 60;
  };

  return (
    <CreditContext.Provider
      value={{
        creditsDetails,
        loading,
        updateCredits,
        fetchData,
        setShowCredits,
        showCredits,
        getSeconds,
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

function getRemainingSeconds(
  lastUpdatedTimeString: string,
  defaultMinutes: number
) {
  const lastUpdatedTime = new Date(lastUpdatedTimeString);

  // Calculate the remaining time in seconds
  const currentTime = new Date();
  const timeDifferenceInSeconds =
    (currentTime.getTime() - lastUpdatedTime.getTime()) / 1000;
  const remainingSeconds = Math.max(
    defaultMinutes * 60 - timeDifferenceInSeconds,
    0
  );

  return remainingSeconds;
}
