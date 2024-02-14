'use server'

export const getCreditsFromAPI = async (nftAddress: string) => {
    try {
        const response = await fetch("http://localhost:3000/api/credits", {
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
