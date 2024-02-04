"use client";
import { useState } from "react";
import ChatWithQuestNft from "./ChatQuestNFT";

const StartQuest = ({
  image,
  description,
  title,
  properties,
}: {
  image: string;
  title: string;
  description: string;
  properties: { [key: string]: unknown; trait_type?: string; value?: string }[];
}) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      {showChat ? (
        <ChatWithQuestNft
          image={image}
          description={description}
          title={title}
          properties={properties}
        />
      ) : (
        <div className="mx-auto max-w-4xl w-full flex justify-center items-center min-h-screen p-6 ">
          <div className="flex items-center flex-col gap-4 h-full">
            <div className="relative inline-block overflow-hidden rounded-2xl h-80 w-80 p-1  transition ease-in-out duration-300">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] bg-white/30" />
              <div className="inline-flex h-full w-full cursor-pointer items-center justify-center bg-slate-950/90 text-sm font-medium rounded-xl text-white backdrop-blur-3xl">
                <img
                  src={image}
                  className="cursor-pointer rounded-xl"
                  alt="nft image"
                />
              </div>
            </div>
            <p className="font-bold text-lg tracking-widest">{title}</p>
            <button
              onClick={() => {
                setShowChat(true);
              }}
              type="button"
              className="inline-flex h-12 w-full animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Start Quest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartQuest;
