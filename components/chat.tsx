"use client";

import type { Attachment } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ChatHeader } from "@/components/chat-header";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { useMapStore } from "@/lib/store";

export function Chat() {
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const { userPosition } = useMapStore();

  const {
    messages,
    input,
    status,
    setInput,
    handleSubmit,
    append,
    stop,
    setMessages,
  } = useChat({
    sendExtraMessageFields: true,
    body: {
      userPosition: userPosition
        ? {
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
          }
        : null, // Include userPosition in the body if available
    },
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-[calc(100vh-3.5625rem)] bg-background">
        <ChatHeader />

        <Messages status={status} messages={messages} />

        <form className="flex mx-auto px-4 bg-background pb-1 md:pb-3 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
