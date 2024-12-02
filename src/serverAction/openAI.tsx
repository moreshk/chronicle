"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getResponse = async (
  messages: ChatCompletionMessageParam[]
): Promise<string | null> => {
  try {
    console.log("Attempting to create chat completion");
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
    });
    console.log("Chat completion successful");
    return completion.choices[0].message.content;
  } catch (e) {
    console.error("Error in getResponse:", e);
    if (e instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", e.status, e.message, e.code);
    }
    throw e; // Re-throw the error to be handled by the caller
  }
};
export const getQuestResponse = async (
  messages: ChatCompletionMessageParam[]
): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
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