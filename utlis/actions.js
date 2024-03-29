"use server";

import OpenAI from "openai";
import prisma from "./db";
import { revalidatePath } from "next/cache";

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
      max_tokens: 100,
    });
    return {
      message: response.choices[0].message,
      tokens: response.usage.total_tokens,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateTourResponse({ city, country }) {
  const query = `Find a exact ${city} in this exact ${country}.
If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "short description of the city and tour",
    "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
  }
}
"stops" property should include only three stops.
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "you are a tour guide",
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });
    const tourData = JSON.parse(response.choices[0].message.content);
    if (!tourData.tour) {
      return null;
    }
    return { tour: tourData.tour, tokens: response.usage.total_tokens };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getExistingTour({ city, country }) {
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
}

export async function createNewTour(tour) {
  return prisma.tour.create({
    data: tour,
  });
}

export async function getAllTours(searchTerm) {
  if (!searchTerm) {
    const tours = await prisma.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  }
  const tours = await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      city: "asc",
    },
  });
  return tours;
}

export async function getSingleTour(id) {
  return prisma.tour.findUnique({
    where: {
      id,
    },
  });
}

export async function generateTourImage({ city, country }) {
  try {
    const TourImage = await openai.images.generate({
      prompt: `a panoramic view of the ${city} ${country}`,
      n: 1,
      size: "512x512",
    });
    return TourImage?.data[0].url;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserTokensById(clerkId) {
  const result = await prisma.token.findUnique({
    where: { clerkId },
  });

  return result?.tokens;
}

export async function generateUserTokensForId(clerkId) {
  const result = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  return result?.tokens;
}

export async function fetchOrGenerateTokens(clerkId) {
  const result = await getUserTokensById(clerkId);
  if (result) return result.tokens;

  return (await generateUserTokensForId(clerkId)).tokens;
}

export async function subtractTokens(clerkId, tokens) {
  const result = await prisma.token.update({
    where: {
      clerkId,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  revalidatePath("/profile");
  return result.tokens;
}
