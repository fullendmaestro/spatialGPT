"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Maximize, X, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface PanelProps {
  description?: string;
  collapse?: () => void;
  maximize?: () => void;
  restore?: () => void;
  isMaximized?: boolean;
  children: React.ReactNode;
}

export function Panel({
  description,
  collapse,
  maximize,
  restore,
  isMaximized,
  children,
}: PanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden transition-all duration-200",
        isMaximized && "h-screen w-screen"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b bg-muted/30"
        )}
      >
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}

        <div className="flex items-center gap-1 ml-2">
          {!isMaximized && collapse && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-muted"
              onClick={collapse}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {!isMaximized && maximize && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-muted"
              onClick={maximize}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          )}
          {isMaximized && restore && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-muted"
              onClick={restore}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
