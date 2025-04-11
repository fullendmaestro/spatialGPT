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
      id,
      messages,
    }: {
      id: string;
      messages: Array<Message>;
    } = await request.json();

    console.log("incoming messages", JSON.stringify(messages, null, 2));

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel("chat-model-small"),
          system: systemPrompt,
          messages,
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
