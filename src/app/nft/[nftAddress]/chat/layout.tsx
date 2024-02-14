import { CreditProvider } from "@/wrapper/credits.wrapper";
import { ShowCredits } from "@/components/showCradits";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CreditProvider>
      <div className="absolute top-6 right-48 sm:top-12 sm:right-60">
        <ShowCredits />
      </div>
      {children}
    </CreditProvider>
  );
}
