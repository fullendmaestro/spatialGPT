"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import { UseChatHelpers } from "@ai-sdk/react";

interface SuggestedActionsProps {
  append: UseChatHelpers["append"];
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "What’s the weather",
      label: "in Tokyo this weekend?",
      action: "What’s the weather in Tokyo this weekend?",
    },
    {
      title: "Will it snow",
      label: "in Berlin tomorrow?",
      action: "Will it snow in Berlin tomorrow?",
    },
    {
      title: "How hot will it get",
      label: "in Phoenix next week?",
      action: "How hot will it get in Phoenix next week?",
    },
    {
      title: "Where is it sunny",
      label: "and warm in Europe right now?",
      action: "Where is it sunny and warm in Europe right now?",
    },
    {
      title: "Warn me if",
      label: "a strong wind alert is issued nearby.",
      action: "Warn me if a strong wind alert is issued nearby.",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
