"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const ConnectWalletButton = () => {
  const { connected } = useWallet();
  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    if (connected && pathname === "/") route.push("/select-nft");
  }, [connected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.3 }}
    >
      <WalletMultiButton className="button-connect-wallet" />
    </motion.div>
  );
};
