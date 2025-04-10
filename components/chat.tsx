"use client";

import type { Attachment, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ChatHeader } from "@/components/chat-header";
import { generateUUID } from "@/lib/utils";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { toast } from "sonner";

export function Chat() {
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const {
    messages,
    input,
    status,
    setInput,
    handleSubmit,
    handleInputChange,
    append,
    stop,
    setMessages,
  } = useChat();

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
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
