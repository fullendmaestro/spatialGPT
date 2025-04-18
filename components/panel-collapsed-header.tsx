"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Maximize, X, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface CollapsedPanelHeaderProps {
  description?: string;
  collapse?: () => void;
}

export function CollapsedPanelHeader({
  description,
  collapse,
}: CollapsedPanelHeaderProps) {
  return (
    <div className="flex flex-col items-center bg-background border rounded-lg shadow-sm overflow-hidden">
      <div
        className={cn(
          "flex flex-col items-center justify-between px-2 py-3 border-b bg-muted/30 w-full"
        )}
      >
        {description && (
          <p className="text-xs text-muted-foreground text-center mb-2 rotate-90 origin-center">
            {description}
          </p>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-muted"
          onClick={collapse}
        >
          <ChevronUp className="h-4 w-4 rotate-90" />
        </Button>
        {/* <div className="flex flex-col items-center gap-2"></div> */}
      </div>
    </div>
  );
}
