"use client";

import { Button } from "@/components/ui/button";
import { Bot, X, RefreshCw } from "lucide-react";

export function ChatHeader() {
  const handleReset = () => {
    // Add logic to reset or refresh the chat
    console.log("Chat reset triggered");
  };

  return (
    <div className="flex sticky top-0 items-center justify-between border-b bg-background py-2 px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-none">SpatialGPT</h2>
          <p className="text-sm text-muted-foreground">
            Your intelligent geospatial assistant
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          aria-label="Reset Chat"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Close Chat">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
