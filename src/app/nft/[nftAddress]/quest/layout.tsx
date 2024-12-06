import { CreditProvider } from "@/wrapper/credits.wrapper";
import { ShowCredits } from "@/components/showCradits";
import { ConnectWalletButton } from "@/components/connectWalletButton";

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { nftAddress: string };
}>) {
  return (
    <CreditProvider>
      <div className="absolute top-4 right-4 sm:top-10 sm:right-10 flex items-center space-x-4">
        <ShowCredits nftAddress={params.nftAddress} />
        <ConnectWalletButton />
      </div>
      {children}
    </CreditProvider>
  );
} 