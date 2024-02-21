
'use client'

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { deductGold } from "@/serverAction/getCreditsForNFT";


export const useMintNft = () => {
    const [loading, setLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState('')
    const { publicKey } = useWallet()

    const mintNft = async (nftAddress: string, amount: number, callback: () => void, onError: () => void) => {
        const key = publicKey?.toString()
        if (!key) return
        try {
            setLoading(true)
            const data = await deductGold(nftAddress, key, amount)
            if (data) {
                setMintAddress('yes')
                callback()
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);

        }
    };

    return { mintNft, loading, mintAddress };
};
