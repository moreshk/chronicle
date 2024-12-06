type Message = {
    role: "system" | "user" | "assistant";
    content: string;
};

type ChatCompletionMessageParam = {
    role: "system" | "user" | "assistant";
    content: string;
    name?: string;
};

type SnapShortTree = {
    merkleRoot: string,
    tokenTotal: string,
    tokenMint: string
    claims: {
        [key: string]: {
            index: number,
            amount: string,
            proof: string[]
        }
    }[]
}


interface SolTokenDetails {
    decimal: number,
    description: string
    image: string
    name: string
    symbol: string
}
