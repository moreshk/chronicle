/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from 'react';
import { ConnectWallet } from "@/components/connectWallet";
import { useNFT } from "@/context/nftCollection.context";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCreditContext } from "@/wrapper/credits.wrapper";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BuyCredits from "@/components/BuyCredits";

const Page = ({
    params: { nftAddress },
}: {
    params: { nftAddress: string };
}) => {
    const { nfts, error, isNftLoaded } = useNFT();
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();
    const [silverBalance, setSilverBalance] = useState(0);
    const [canClaimSilver, setCanClaimSilver] = useState(false);
    const { creditsDetails } = useCreditContext();

    // Define species and background at the component level
    const [species, setSpecies] = useState('');
    const [background, setBackground] = useState('');
    // When NFT details are loaded, set the species and background
    useEffect(() => {
        if (isNftLoaded === "loaded" && nfts) {
            const nftDetails = nfts.find(
                (nft) => nft.address.toBase58() === nftAddress
            );

            if (nftDetails) {
                const attributes = nftDetails.json?.attributes?.reduce((acc, attr) => {
                    acc[attr.trait_type as string] = attr.value;
                    return acc;
                }, {} as Record<string, unknown>) ?? {};

                // Set species and background using the state setters
                setSpecies(attributes['Species'] as string);
                setBackground(attributes['Background'] as string);
            }
        }
    }, [nfts, isNftLoaded, nftAddress]);


    useEffect(() => {
        async function fetchSilverBalance() {
            if (publicKey) {
                try {
                    const response = await fetch('/api/get-silver-balance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nftAddress, walletAddress: publicKey.toBase58() }),
                    });
                    if (!response.ok) {
                        const errorData = await response.text(); // Get the error message from the response
                        console.error('Error response from the server:', errorData);
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setSilverBalance(data.silver);
                    const lastClaimedDate = data.lastClaimed ? new Date(data.lastClaimed) : null;
                    if (lastClaimedDate && !isNaN(lastClaimedDate.getTime())) {
                        const minutesSinceLastClaim = (new Date().getTime() - lastClaimedDate.getTime()) / (1000 * 60);
                        const cooldown = parseInt(process.env.NEXT_PUBLIC_SILVER_CLAIM_COOLDOWN_MINUTES ?? "1", 10);
                        setCanClaimSilver(minutesSinceLastClaim >= cooldown);
                    } else {
                        setCanClaimSilver(true);
                    }
                } catch (error) {
                    console.error('Failed to fetch silver balance', error);
                }
            }
        }

        fetchSilverBalance();
    }, [publicKey, nftAddress]);



    const handleClaimSilver = async () => {
        console.log(species);
        console.log(background);

        if (publicKey && species && background) {
            const response = await fetch('/api/claim-silver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nftAddress,
                    walletAddress: publicKey.toBase58(),
                    species, // Include species in the request
                    background // Include background in the request
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSilverBalance(data.silver);
                setCanClaimSilver(false); // Disable the button until 24 hours have passed
            } else {
                console.error('Failed to claim silver');
            }
        }
    };

    // Render error if there is an issue loading the NFT
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-24">
                <p className="font-medium text-xl">Error loading NFT</p>
            </div>
        );
    }

    // Render loading state
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

    // Render main content if NFT is loaded and exists
    if (isNftLoaded === "loaded" && nfts) {
        const nftDetails = nfts.find(
            (nft) => nft.address.toBase58() === nftAddress
        );

        // let species = '';
        // let background = '';

        if (nftDetails) {
            const attributes = nftDetails.json?.attributes?.reduce((acc, attr) => {
                acc[attr.trait_type as string] = attr.value;
                return acc;
            }, {} as Record<string, unknown>) ?? {};

            // species = attributes['Species'] as string;
            // background = attributes['Background'] as string;

            // console.log(species);
            // console.log(background);
            const buttonBaseStyle = "inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 whitespace-nowrap";

            return (
                <main className="items-center justify-center px-4 py-24 sm:py-24 sm:p-24">
                    <div className="flex justify-center items-center">
                        <img
                            src={nftDetails.json?.image}
                            alt={nftDetails.json?.name}
                            className="rounded-xl w-full h-auto max-w-md sm:max-w-sm"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-4 mt-4 mb-2">
                        <div>
                            <span className="font-semibold">Credits:</span>{' '}
                            {creditsDetails?.credits !== undefined ? creditsDetails.credits : 'Loading...'}
                        </div>
                        <BuyCredits nftAddress={nftAddress} />
                    </div>
                    <h1 className="text-4xl font-bold text-center my-4">
                        {nftDetails.json?.name}
                    </h1>

                    <p className="text-center mx-auto max-w-4xl">
                        {nftDetails.json?.description}
                    </p>
                    <div className="flex justify-center items-end gap-4 mt-6 flex-col sm:flex-row w-full">

                        <Link
                            href={`/nft/${nftAddress}/chat`}
                            className={`${buttonBaseStyle} w-full sm:w-auto sm:min-w-[12rem] animate-background-shine`}
                        >
                            Chat
                        </Link>

                        <button
                            onClick={handleClaimSilver}
                            disabled={!canClaimSilver}
                            className={`${buttonBaseStyle} w-full sm:w-auto sm:min-w-[12rem] ${canClaimSilver ? 'animate-background-shine' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            Collect Gold
                        </button>

                        <Link
                            href={`/nft/${nftAddress}/quest`}
                            className={`${buttonBaseStyle} w-full sm:w-auto sm:min-w-[12rem] animate-background-shine`}
                        >
                            Solo Adventure
                        </Link>


                        {/* <Link
                            href={`/nft/${nftAddress}/item`}
                            className="inline-flex h-12 animate-background-shine items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-40"
                        >
                            Items
                        </Link> */}
                    </div>

                    <div className="border border-white/15 bg-black p-4 my-4 sm:my-10 rounded-2xl relative mx-auto max-w-4xl">
                        <div className="grid sm:grid-cols-2 gap-2 sm:max-w-3xl mx-auto sm:w-auto w-full">
                            {/* Gold attribute display with Silver balance */}
                            {attributes.Gold !== undefined && (
                                <div className="grid grid-cols-2 gap-1">
                                    <p className="font-bold">Starting Gold : </p>
                                    <p>{String(Number(attributes.Gold))}</p>
                                </div>
                            )}

                            {/* Gold attribute display with Silver balance */}
                            {attributes.Gold !== undefined && (
                                <div className="grid grid-cols-2 gap-1">
                                    <p className="font-bold"> Current Gold : </p>
                                    {/* Parse both values as floats and then add them */}
                                    {/* <p>{(parseFloat(attributes.Gold) + parseFloat(silverBalance)).toFixed(2)}</p> */}
                                    <p>{(parseFloat(attributes.Gold as string || '0') + parseFloat(silverBalance.toString())).toFixed(2)}</p>
                                </div>
                            )}
                            {/* Displaying other attributes except Gold */}
                            {Object.entries(attributes).filter(([key]) => key !== 'Gold').map(([key, value]) => (
                                <div className="grid grid-cols-2 gap-1" key={key}>
                                    <p className="font-bold">{key}:</p>
                                    <p>{String(value)}</p>
                                </div>
                            ))}


                        </div>
                    </div>


                </main>
            );
        } else {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-24">
                    <p className="font-medium text-xl">NFT not found</p>
                </div>
            );
        }
    }

    // Render a message if the wallet is not connected
    if (!connected) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 px-4">
                <ConnectWallet />
            </main>
        );
    }

    // Return null if none of the above conditions are met
    return null;
};

export default Page;