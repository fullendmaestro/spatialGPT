import { systemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { getWeather } from "@/lib/ai/tools/get-weather";

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
    }: {
      messages: Array<ExtUIMessage>;
    } = await request.json();

    // Reformat messages
    const reformattedMessages = reformatMessages(messages);

    console.log(
      "Reformatted Messages",
      JSON.stringify(reformattedMessages, null, 2)
    );

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel("chat-model-small"),
          system: systemPrompt,
          messages: reformattedMessages,
          maxSteps: 5,
          experimental_activeTools: ["getWeather"],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
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
