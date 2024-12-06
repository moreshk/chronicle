"use client";

import { useState, useRef, useEffect } from "react";
import { useCreditContext } from "@/wrapper/credits.wrapper";
import BuyCredits from "@/components/BuyCredits";

export const ShowCredits = ({ nftAddress }: { nftAddress: string }) => {
  const { showCredits, loading, creditsDetails } = useCreditContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // console.log("ShowCredits nftAddress:", nftAddress);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex h-12 animate-background-shine items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          {typeof creditsDetails?.credits === "number"
            ? creditsDetails?.credits
            : "-"}{" "}
          Credits
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-900 ring-1 ring-slate-700 ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <BuyCredits nftAddress={nftAddress} />
            </div>
          </div>
        )}
      </div>
    );
  }
  return <></>;
};
