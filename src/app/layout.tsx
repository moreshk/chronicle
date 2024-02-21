import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from "@/wrapper/client.wrapper";
import { NetworkProvider } from "@/context/network.context";
import WalletWrapper from "@/wrapper/wallet.wrapper";
import { NFTCollectionProvider } from "@/context/nftCollection.context";
import { ConnectWalletButton } from "@/components/connectWalletButton";
import { CreditProvider } from "@/wrapper/credits.wrapper";
import { ShowCredits } from "@/components/showCradits";
import "web-streams-polyfill";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chronicle",
  description: "AI D&D for NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          <NetworkProvider>
            <WalletWrapper>
              <NFTCollectionProvider>
                <div className="absolute top-4 right-4 sm:top-10 sm:right-10">
                  <ConnectWalletButton />
                </div>
                {children}
              </NFTCollectionProvider>
            </WalletWrapper>
          </NetworkProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
