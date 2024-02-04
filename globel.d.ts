type Message = {
    role: "system" | "user" | "assistant";
    content: string;
};

type ChatCompletionMessageParam = {
    role: "system" | "user" | "assistant";
    content: string;
    name?: string;
};
