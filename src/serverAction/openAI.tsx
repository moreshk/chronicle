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
      model: "gpt-3.5-turbo-1106",
    });
    return completion.choices[0].message.content;
  } catch (e) {
    return null;
  }
};
