"use client";

import { useCreditContext } from "@/wrapper/credits.wrapper";

export const ShowCredits = () => {
  const { showCredits, loading, creditsDetails } = useCreditContext();

  if (showCredits) {
    if (loading) {
      return (
        <div>
          <button
            disabled
            className="inline-flex h-12 w-28 animate-background-shine items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
        </div>
      );
    }
    return (
      <div className="button-connect-wallet rounded-full px-5 font-semibold h-12 flex justify-center items-center">
        {typeof creditsDetails?.credits === "number"
          ? creditsDetails?.credits
          : "-"}{" "}
        Credits
      </div>
    );
  }
  return <></>;
};
