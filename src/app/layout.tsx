import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from "@/wrapper/client.wrapper";
import { NetworkProvider } from "@/context/network.context";
import WalletWrapper from "@/wrapper/wallet.wrapper";
import { NFTCollectionProvider } from "@/context/nftCollection.context";
import { ConnectWalletButton } from "@/components/connectWalletButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chronicle NFT",
  description: "Mint an nft with AI generated image",
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
