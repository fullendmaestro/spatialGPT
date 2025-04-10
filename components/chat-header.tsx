"use client";

import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

// interface ChatHeaderProps {
//   onClose: () => void;
// }

export function ChatHeader() {
  return (
    <div className="flex sticky top-0 items-center justify-between border-b  py-1.5">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <h2 className="font-semibold">spatialGPT</h2>
      </div>
      <Button variant="ghost" size="icon">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
