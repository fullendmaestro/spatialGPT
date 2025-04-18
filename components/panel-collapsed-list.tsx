"use client";

import * as React from "react";
import { CollapsedPanelHeader } from "./panel-collapsed-header";

interface CollapsedPanelListProps {
  items: { id: string; description: string }[];
  onCollapse?: (id: string) => void;
}

export function CollapsedPanelList({
  items,
  onCollapse,
}: CollapsedPanelListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg shadow-sm">
          <CollapsedPanelHeader
            description={item.description}
            collapse={() => onCollapse?.(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
