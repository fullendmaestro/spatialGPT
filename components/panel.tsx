"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Maximize, X, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface PanelProps {
  description?: string;
  collapse?: () => void;
  children: React.ReactNode;
}

export function Panel({ description, collapse, children }: PanelProps) {
  return (
    <div className="flex flex-col bg-background border rounded-lg shadow-sm overflow-hidden transition-all duration-200">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b bg-muted/30"
        )}
      >
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted"
            onClick={collapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted"
            onClick={() => {}}
          >
            <Maximize className="h--4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted"
            onClick={() => {}}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}
