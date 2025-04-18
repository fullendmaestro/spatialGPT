"use client";

import * as React from "react";
import { PanelCollapsedHeader } from "./panel-collapsed-header";

interface PanelCollapsedListProps {
  items: { id: string; description: string }[];
  onCollapse?: (id: string) => void;
}

export function PanelCollapsedList({
  items,
  onCollapse,
}: PanelCollapsedListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg shadow-sm">
          <PanelCollapsedHeader
            description={item.description}
            collapse={() => onCollapse?.(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
