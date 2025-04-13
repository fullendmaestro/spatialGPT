"use client";

import { MapPinIcon } from "lucide-react";
import { useMapStore } from "@/lib/store";
import { Button } from "./ui/button";

interface CoordinateAttachmentProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onRemove?: () => void;
  showRemove?: boolean;
}

export function CoordinateAttachment({
  coordinate,
  onRemove,
  showRemove = true,
}: CoordinateAttachmentProps) {
  const { centerMapTo } = useMapStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Center the map to the coordinate with animation
    centerMapTo(coordinate.latitude, coordinate.longitude);
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      <Button
        onClick={handleClick}
        variant="outline"
        className="w-20 h-16 p-0 flex flex-col items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800"
      >
        <MapPinIcon className="h-6 w-6 text-blue-500" />
        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
          Location
        </span>
      </Button>
      <div className="text-xs text-zinc-500 max-w-20 truncate flex items-center gap-1">
        {showRemove && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="Remove coordinate"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
        <span>
          {coordinate.latitude.toFixed(2)}, {coordinate.longitude.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
