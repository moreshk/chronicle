"use server";
import OpenAI from "openai";
import { CharacterOptions } from '../app/create-character/characterData';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getResponse = async (
  messages: ChatCompletionMessageParam[]
): Promise<string | null> => {
  try {
    // console.log("Attempting to create chat completion");
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
    });
    // console.log("Chat completion successful");
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
    // Generate improved prompt using OpenAI chat completion
    const improvedPromptCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a image gen prompt creator, you are good at creating prompts so that sd xl turbo image gen models can create images relevant to the input. I will provide you instructions and you will respond with a suitable prompt that can then be fed to sd xl turbo image gen model. This prompt will be messages from a dungeon master from a DnD game, your task is to take the most interesting parts of the message and construct a prompt that will generate a suitable image for them. Your message is: "
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const improvedPrompt = improvedPromptCompletion.choices[0]?.message.content;
    // console.log("Improved prompt:", improvedPrompt);

    // Generate image using Stability AI SDXL Turbo via Deep Infra API
    const response = await fetch('https://api.deepinfra.com/v1/inference/stabilityai/sdxl-turbo', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${process.env.DEEP_INFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: improvedPrompt || prompt,
        num_images: 1,
        width: 1024,
        height: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deep Infra API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.images[0];

    return imageUrl ?? null;
  } catch (e) {
    console.error("Error in createImageFromPrompt:", e);
    return null;
  }
};

export const createCharacterImage = async (characterOptions: CharacterOptions): Promise<string | null> => {
  try {
    // Generate improved prompt using OpenAI chat completion
    const improvedPromptCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating prompts for SDXL Turbo image generation models. Your task is to create a detailed prompt for a character image in an RPG style game based on the given characteristics. Focus on visual details and avoid mentioning game mechanics or non-visual elements."
        },
        {
          role: "user",
          content: `Create a prompt for an RPG character with the following characteristics:
            Class: ${characterOptions.class}
            Species: ${characterOptions.species}
            Hair Color: ${characterOptions.hairColour}
            Skin Color: ${characterOptions.skinColour}
            Clothing: ${characterOptions.clothing}
            Headpiece: ${characterOptions.headpiece}
            
            The image should be a full-body portrait in a dynamic pose, showcasing the character's class and equipment.`
        }
      ],
    });

    const improvedPrompt = improvedPromptCompletion.choices[0]?.message.content;
    // console.log("Improved character prompt:", improvedPrompt);

    // Generate image using Stability AI SDXL Turbo via Deep Infra API
    const response = await fetch('https://api.deepinfra.com/v1/inference/stabilityai/sdxl-turbo', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${process.env.DEEP_INFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: improvedPrompt || `RPG character, ${characterOptions.class}, ${characterOptions.species}, ${characterOptions.hairColour} hair, ${characterOptions.skinColour} skin, wearing ${characterOptions.clothing} and ${characterOptions.headpiece}, full body portrait, dynamic pose, detailed, fantasy art style`,
        num_images: 1,
        width: 1024,
        height: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deep Infra API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.images[0];

    return imageUrl ?? null;
  } catch (e) {
    console.error("Error in createCharacterImage:", e);
    return null;
  }
};