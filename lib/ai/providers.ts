import { google } from "@ai-sdk/google";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": google("gemini-1.5-flash-002"),
    "chat-model-large": google("gemini-1.5-pro-002"),
    "title-model": google("gemini-1.5-flash-002"),
    "artifact-model": google("gemini-1.5-flash-002"),
  },
});
