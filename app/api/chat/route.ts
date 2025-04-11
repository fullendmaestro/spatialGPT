import { systemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { getWeather } from "@/lib/ai/tools/get-weather";

import { generateUUID } from "@/lib/utils";
import {
  createDataStreamResponse,
  smoothStream,
  streamText,
  type Message,
} from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      coordinates,
      messages,
    }: {
      coordinates: any;
      messages: Array<Message>;
    } = await request.json();

    console.log("request body", JSON.stringify(coordinates, null, 2));

    console.log("incoming messages", JSON.stringify(messages, null, 2));

    //  Inject the coordinates into the last user message
    //  This is a workaround for the fact that the vercel ai sdk does not support
    const updateMessages = messages.map((message, index) => {
      if (message.role === "user" && index === messages.length - 1) {
        return {
          ...message,
          parts: message?.parts?.map((part, partIndex) => {
            if (part.type === "text" && partIndex === 0) {
              return {
                ...part,
                text: `${part.text} Coordinates: ${JSON.stringify(
                  coordinates
                )}`,
              };
            }
            return part;
          }),
        };
      }
      return message;
    });

    console.log("updated messages", JSON.stringify(updateMessages, null, 2));

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel("chat-model-small"),
          system: systemPrompt,
          messages: updateMessages,
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
