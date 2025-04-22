import { systemPrompt as baseSystemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { getAirQuality } from "@/lib/ai/tools/get-air-quality";
import { getClimateData } from "@/lib/ai/tools/get-climate-data";
import { getDetailedForecast } from "@/lib/ai/tools/get-detailed-forecast";
import { getHistoricalWeather } from "@/lib/ai/tools/get-historical-weather";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { getWeatherAlerts } from "@/lib/ai/tools/get-weather-alerts";
import { getReverseGeocoding } from "@/lib/ai/tools/get-reverse-geocoding";
import { getGeocoding } from "@/lib/ai/tools/get-geocoding";
import { getPOI } from "@/lib/ai/tools/get-poi";

import { generateUUID } from "@/lib/utils";
import { ExtUIMessage } from "@/types";
import { createDataStreamResponse, smoothStream, streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

function reformatMessages(messages: Array<ExtUIMessage>): Array<ExtUIMessage> {
  return messages.map((message) => {
    if (message.role === "user") {
      const coordinateAttachments = message?.coordinateAttachments || [];
      const coordinatesText = coordinateAttachments
        .map(
          (coord, index) =>
            `Coordinate ${index + 1}: Latitude ${coord.latitude}, Longitude ${
              coord.longitude
            }`
        )
        .join("\n");

      const updatedParts = [
        ...(message.parts || []),
        {
          type: "text" as const, // Explicitly define the type as the string literal "text"
          text: coordinatesText,
        },
      ];

      return {
        ...message,
        content: `${message.content}\n\n${coordinatesText}`,
        parts: updatedParts,
      };
    }
    return message;
  });
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      userPosition,
    }: {
      messages: Array<ExtUIMessage>;
      userPosition: { latitude: number; longitude: number } | null;
    } = await request.json();

    // Reformat messages.
    // Note: This is just a workaround to get the coordinates
    //        into the ai message as vercel ai sdk will remove extra fields
    //        except the ai message schema.
    const reformattedMessages = reformatMessages(messages);

    // Get the current time
    const currentTime = new Date().toLocaleString();

    // Inject user position into the prompt if available
    const userPositionText = userPosition
      ? `The user's current position is Latitude ${userPosition.latitude}, Longitude ${userPosition.longitude}.`
      : "The user's position is not available.";

    // Dynamically update the system prompt
    const systemPrompt = `${baseSystemPrompt}

Current Time: ${currentTime}
${userPositionText}`;
    console.log("System Prompt:", systemPrompt);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel("chat-model-small"),
          system: systemPrompt,
          messages: reformattedMessages,
          maxSteps: 5,
          experimental_activeTools: [
            "getWeather",
            "getDetailedForecast",
            "getHistoricalWeather",
            "getAirQuality",
            "getClimateData",
            "getWeatherAlerts",
            "getReverseGeocoding",
            "getGeocoding",
            "getPOI",
          ],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            getDetailedForecast,
            getHistoricalWeather,
            getAirQuality,
            getClimateData,
            getWeatherAlerts,
            getReverseGeocoding,
            getGeocoding,
            getPOI,
          },
          onFinish: async ({ response }) => {
            console.log("Response:", response.messages[0].content);
          },
        });
        result.consumeStream();
        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error("Error in chat stream:", error);
        return "Sorry, there was an error processing your request. Please try again.";
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
