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
        return data.credits
    } catch (e) {
        console.log(e)
        return 'invalid'
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
