"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getResponse = async (
  messages: ChatCompletionMessageParam[]
): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  } catch (e) {
    return null;
  }
};
export const getQuestResponse = async (
  messages: ChatCompletionMessageParam[]
): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4-1106-preview",
    });
    return completion.choices[0].message.content;
  } catch (e) {
    return null;
  }
};


export const createImageFromPrompt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
    });
    // Assuming the response structure is correct and there is a data array with a url property
    const imageUrl = response.data[0]?.url; // Using optional chaining to handle undefined
    return imageUrl ?? null; // Using nullish coalescing operator to return null if imageUrl is undefined
  } catch (e) {
    console.error(e);
    return null;
  }
};