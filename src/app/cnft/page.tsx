"use client";
import { useMintNft } from "@/hooks/useMintNft";

const Page = () => {
  const { createMerkelTree, loading, mintAddress } = useMintNft();

  return (
    <div>
      <div className="flex gap-2 mt-10">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={createMerkelTree}
        >
          {loading ? "Minting......." : "Mint free cNFT"}
        </button>
        {mintAddress && (
          <a
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            href={`https://solscan.io/tx/${mintAddress}?cluster=devnet`}
            target="_blank"
          >
            {showFirstAndLastThree(mintAddress)}
          </a>
        )}
      </div>
    </div>
  );
};

export default Page;

function showFirstAndLastThree(inputString: string) {
  if (inputString.length >= 6) {
    var firstThree = inputString.substring(0, 3);
    var lastThree = inputString.substring(inputString.length - 3);
    return firstThree + "...." + lastThree;
  } else {
    return inputString;
  }
}
