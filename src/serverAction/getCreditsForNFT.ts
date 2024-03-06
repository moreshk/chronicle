'use server'

export const getCreditsFromAPI = async (nftAddress: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/credits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nftAddress,
            }),
        });
        const data = await response.json()
        return data
    } catch (e) {
        console.log(e)
        return undefined
    }
}


export const checkCredits = async (nftAddress: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/check-credits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nftAddress }),
    });
    const data = await response.json();
    return data.enoughCredits;
};

export const deductCredits = async (nftAddress: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/deduct-credits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nftAddress }),
    });
    return response.ok;
};

export const recordChatHistory = async (
    message_sent: string,
    response_received: string,
    nftAddress: string,
    walletAddress: string
) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/track-message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nft_id: nftAddress, // Use the NFT address as the ID
                wallet_address: walletAddress, // Use the actual wallet address passed as a prop
                message_sent,
                response_received,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to record chat history");
        }
    } catch (error) {
        console.error("Error recording chat history", error);
    }
};

export const recordQuestHistory = async (
    message_sent: string,
    response_received: string,
    nftAddress: string,
    walletAddress: string
) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/add-quest-history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nft_id: nftAddress, // Use the NFT address as the ID
                wallet_address: walletAddress, // Use the actual wallet address passed as a prop
                message_sent,
                response_received,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to record chat history");
        }
    } catch (error) {
        console.error("Error recording chat history", error);
    }
};

export const getMintcNftAPI = async (walletAddress: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cnft/mintNft`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress,
            }),
        });
        const data = await response.json()
        return data
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export const deductGold = async (nftAddress: string, walletAddress: string, amount: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/deduct-silver`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nftAddress, walletAddress, amount, }),
        });
        if (response.ok) {
            console.log(response)
            const newResponse = await getMintcNftAPI(walletAddress)
            return newResponse
        } else {
            return false
        }
    } catch (error) {
        console.log("🚀 ~ deductGold ~ error:", error)
        return false
    }
}

export const upsertHeroJourney = async (nftId: string, story: string): Promise<boolean> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upsert-hero-journey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nft_id: nftId,
                story,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to upsert hero journey: ${response.statusText}`);
        }

        // You can return more data from the response if needed
        return true;
    } catch (error) {
        console.error('Error in upsertHeroJourney', error);
        return false;
    }
};


export const getHeroJourneyByNFTId = async (nftId: string): Promise<string | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-hero-journey?nft_id=${encodeURIComponent(nftId)}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('No hero journey found for the given NFT ID');
                return null;
            }
            throw new Error(`Failed to retrieve hero journey: ${response.statusText}`);
        }

        const data = await response.json();
        return data.story;
    } catch (error) {
        console.error('Error in getHeroJourneyByNFTId', error);
        throw error; // Rethrow the error for further handling if necessary
    }
};
