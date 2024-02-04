/* eslint-disable @next/next/no-img-element */
"use client";
import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = ({
  params: { nftAddress },
}: {
  params: { nftAddress: string };
}) => {
  const { nfts, error, isNftLoaded } = useNFT();
  const { push } = useRouter();
  const { connected } = useWallet();

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="font-medium text-xl">Error loading NFT </p>
      </div>
    );
  }
  if (isNftLoaded === "loading" || isNftLoaded === "unloaded") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4  sm:p-24">
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-10">
          <button
            disabled
            className="inline-flex h-64 sm:w-96 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <button
            disabled
            className="inline-flex h-10 sm:w-[500px] w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 my-6"
          />

          <button
            disabled
            className="inline-flex h-44 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          />
          <div className="flex gap-2 flex-col mt-10">
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-64 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-96 w-72 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
            <button
              disabled
              className="inline-flex h-5 sm:w-80 w-48 animate-background-shine items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isNftLoaded === "loaded" && nfts) {
    const nftDetails = nfts.find(
      (nft) => nft.address.toBase58() === nftAddress
    );
    if (nftDetails) {
      const title = nftDetails.json?.name;
      const description = nftDetails.json?.description;
      const classDetails = getAttribute("Class", nftDetails.json?.attributes);
      const raceDetails = getAttribute("Species", nftDetails.json?.attributes);
      const level = getAttribute("Level", nftDetails.json?.attributes);
      const xpBonus = getAttribute("XP Bonus", nftDetails.json?.attributes);
      const tattoos = getAttribute(
        "Tattoos/Markings",
        nftDetails.json?.attributes
      );
      const alignment = getAttribute("Alignment", nftDetails.json?.attributes);
      const background = getAttribute(
        "Background",
        nftDetails.json?.attributes
      );
      const jewelry = getAttribute("Jewelry", nftDetails.json?.attributes);
      const hairColor = getAttribute(
        "Hair Colour",
        nftDetails.json?.attributes
      );
      const headpiece = getAttribute("Headpiece", nftDetails.json?.attributes);
      const clothing = getAttribute("Clothing", nftDetails.json?.attributes);
      const sex = getAttribute("Sex", nftDetails.json?.attributes);

      return (
        <main className="items-center justify-center px-4 py-24 sm:py-24 sm:p-24">
          <div className="flex justify-center items-center">
            <div className="relative inline-block overflow-hidden rounded-2xl h-full w-full sm:h-96 sm:w-96 p-1  transition ease-in-out duration-300">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] bg-white/30" />
              <div className="inline-flex h-full w-full cursor-pointer items-center justify-center bg-slate-950/90 text-sm font-medium rounded-xl text-white backdrop-blur-3xl">
                <img
                  src={nftDetails.json?.image}
                  className=" cursor-pointer rounded-xl"
                  alt="nft image"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center flex-col mt-4 sm:mt-10">
            <div className="font-bold text-2xl sm:text-4xl text-center text-balance">
              {nftDetails.json?.name?.split("").map((el, i) => (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: i / 10,
                  }}
                  key={i}
                  className="mr-px sm:mr-[3px]"
                >
                  {el}
                </motion.span>
              ))}
            </div>
            <div className="border border-white/15 bg-black p-4 my-4 sm:my-10 rounded-2xl relative sm:w-auto w-full">
              <div className="absolute top-0 flex w-full justify-center">
                <div className="left-0 h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
              </div>
              <div className="grid sm:grid-cols-2 gap-2 sm:max-w-3xl mx-auto sm:w-auto w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <p>Race:</p>
                  <p>{raceDetails}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="">XP Bonus:</p>
                  <p>{xpBonus}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <p>Class:</p>
                  <p>{classDetails}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p>Alignment:</p>
                  <p>{alignment}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <p>Level:</p>
                  <p>{level || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p>Background:</p>
                  <p>{background}</p>
                </div>
              </div>

              <motion.ul
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 sm:max-w-sm gap-2 mt-10 mb-3 m-auto sm:w-auto w-full"
              >
                {[sex, hairColor, clothing, headpiece, jewelry, tattoos].map(
                  (value) => (
                    <motion.li
                      key={value}
                      variants={item}
                      className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-800 bg-black px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-3xl sm:w-auto w-full"
                    >
                      <span className="bg-gradient-to-t from-[#fff] to-[#8678f9] bg-clip-text text-transparent">
                        {value || "-"}
                      </span>
                    </motion.li>
                  )
                )}
              </motion.ul>
            </div>

            <div className="max-w-xl mt-3 text-balance text-center">
              {nftDetails.json?.description?.split("").map((el, i) => (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: i / 80,
                  }}
                  key={i}
                >
                  {el}
                </motion.span>
              ))}
            </div>
            <div className="flex justify-center items-end gap-4 mt-6 flex-col sm:flex-row w-full">
              <Link
                href={`/nft/${nftAddress}/chat`}
                className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40"
              >
                Chat
              </Link>
              <Link
                href={`/nft/${nftAddress}/quest`}
                className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40"
              >
                Quest
              </Link>
            </div>
          </div>
        </main>
      );
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:p-24">
        <p className="font-medium text-xl">Nft Not found </p>
      </div>
    );
  }

  if (!connected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
        <ConnectWallet />
      </main>
    );
  }

  return null;
};

export default Page;

const getAttribute = (
  key: string,
  attribute?: { [key: string]: unknown; trait_type?: string; value?: string }[]
) => attribute?.find((att) => att.trait_type === key)?.value || "";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
