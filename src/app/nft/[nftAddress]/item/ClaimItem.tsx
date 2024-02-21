"use client";
import { useState, FC } from "react";

type ClaimItemProps = {
  currentGold: number;
};

const ClaimItem: FC<ClaimItemProps> = ({ currentGold }) => {

  const [showChat, setShowChat] = useState(false);

  const handleGoldButtonClick = (goldAmount: number) => {
    // You can handle the gold button click here
    console.log(`${goldAmount} Gold button clicked`);
    setShowChat(true);
  };

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col justify-center items-center min-h-screen p-6">
      <p className="text-lg font-bold mb-4">Current Gold: {currentGold}</p>
      <img src="/item.png" alt="Item Chest" className="mb-4" /> {/* Add this line */}
      <div className="flex flex-col sm:flex-row justify-around w-full">
        {[50, 60, 70].map((goldAmount) => (
          <button
            key={goldAmount}
            onClick={() => handleGoldButtonClick(goldAmount)}
            type="button"
            disabled={currentGold < goldAmount} // Disable button if currentGold is less than goldAmount
            className={`inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40 mb-2 sm:mb-0 ${currentGold >= goldAmount ? 'bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] animate-background-shine' : 'opacity-50 cursor-not-allowed'}`}
            style={{ minWidth: '200px' }} // Makes buttons wider
          >
            {goldAmount} Gold
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClaimItem;