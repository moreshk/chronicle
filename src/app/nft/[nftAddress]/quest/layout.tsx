import { CreditProvider } from "@/wrapper/credits.wrapper";
import { ShowCredits } from "@/components/showCradits";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CreditProvider>
      <div className="absolute top-4 right-52 sm:top-10 sm:right-56">
        <ShowCredits />
      </div>
      {children}
    </CreditProvider>
  );
} 