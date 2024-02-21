"use client";
import { useState, FC, useEffect } from "react";
import { useMintNft } from "@/hooks/useMintNft";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { motion, useAnimation } from "framer-motion";
import { publicKey } from "@metaplex-foundation/umi";
import { clientUmi } from "@/utils/client-umi";

type ClaimItemProps = {
  currentGold: number;
  nftAddress: string;
};

const ClaimItem: FC<ClaimItemProps> = ({ currentGold, nftAddress }) => {
  const { mintNft, loading } = useMintNft();
  const { width, height } = useWindowSize();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [confetti, setShowConfetti] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(0);
  const controls = useAnimation();

  const handleGoldButtonClick = async (goldAmount: number) => {
    if (currentGold > goldAmount) {
      const onSuccess = () => {
        setShowSuccessScreen(true);
        setShowConfetti(true);
        setButtonLoading(0);
        controls.stop();
        controls.set("reset");
      };

      const onError = () => {
        setButtonLoading(0);
        controls.stop();
        controls.set("reset");
      };

      setButtonLoading(goldAmount);
      controls.start("start");
      mintNft(nftAddress, goldAmount, onSuccess, onError);
    }
  };
  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col justify-center items-center min-h-screen p-6">
      {!showSuccessScreen ? (
        <>
          <p className="text-lg font-bold mb-4">Current Gold: {currentGold}</p>
          <motion.div variants={variants} animate={controls} className="mb-4">
            <img src="/item.png" alt="Item Chest" />
          </motion.div>
          <div className="flex flex-col sm:flex-row justify-around w-full">
            {[50, 60, 70].map((goldAmount) => (
              <button
                key={goldAmount}
                onClick={() => handleGoldButtonClick(goldAmount)}
                type="button"
                disabled={currentGold < goldAmount || loading}
                className={`inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40 mb-2 sm:mb-0 ${
                  currentGold >= goldAmount
                    ? "bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] animate-background-shine"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={{ minWidth: "200px" }}
              >
                {buttonLoading === goldAmount
                  ? "Opening Chest..."
                  : `${goldAmount} Gold`}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="globe" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 760,
                damping: 300,
              }}
            >
              <img
                src="https://nftstorage.link/ipfs/bafybeicvrfz5bpscllthtnagufy27wypnduwblprf5vtybtzkmpwn3ltgi"
                alt="Item Chest"
                className="mb-4 w-72 h-72 rounded-2xl"
              />
            </motion.div>
          </div>
          <Confetti width={width} height={height} run={confetti} />
        </>
      )}
    </div>
  );
};

export default ClaimItem;

const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

const randomDuration = () => Math.random() * 0.07 + 0.23;

const variants = {
  start: () => ({
    rotate: [1, -1.4, 0],
    transition: {
      delay: getRandomDelay(),
      repeat: Infinity,
      duration: randomDuration(),
    },
  }),
  reset: {
    rotate: 0,
  },
};
