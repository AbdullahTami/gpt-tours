"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatResponse(chatMessages) {
  //   console.log(chatMessages);
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "you are a helpful assistant",
        },
        ...chatMessages,
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });
    return response.choices[0].message;
  } catch (error) {
    console.log(error);
    return null;
  }
}