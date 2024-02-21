
'use client'

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getMintcNftAPI } from "@/serverAction/getCreditsForNFT";


export const useMintNft = () => {
    const [loading, setLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState('')
    const { publicKey } = useWallet()
    const createMerkelTree = async () => {
        const key = publicKey?.toString()
        if (!key) return
        try {
            setLoading(true)
            const data = await getMintcNftAPI(key)
            setLoading(true);
            if (data.publicKey) {
                setMintAddress(data.publicKey)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return { createMerkelTree, loading, mintAddress };
};
