"use client";

import type React from "react";
import { useMapStore, useChatStore } from "@/lib/store";
import { MapPin, Navigation, Info, X, Plus, Cloud } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";

interface MapContextMenuProps {
  onClose: () => void;
}

export function MapContextMenu({ onClose }: MapContextMenuProps) {
  const {
    contextMenuPosition,
    coordinate,
    closeContextMenu,
    setWeatherhistoricalDrawerOpen,
  } = useMapStore();
  const { addCoordinateAttachment } = useChatStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: placeNameResult, isLoading } = useReverseGeocode(
    coordinate?.latitude ?? null,
    coordinate?.longitude ?? null
  );

  const placeName = placeNameResult?.display_name;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeContextMenu]);

  if (!contextMenuPosition) return null;

  const menuItems = [
    {
      label: "Add location as attachment",
      icon: <Plus className="h-4 w-4" />,
      onClick: () => {
        addCoordinateAttachment({ ...coordinate });
        closeContextMenu();
      },
    },
    {
      label: "Location info",
      icon: <Info className="h-4 w-4" />,
      onClick: () => {
        alert(
          `Latitude: ${coordinate.latitude.toFixed(
            4
          )}, Longitude: ${coordinate.longitude.toFixed(4)}`
        );
        closeContextMenu();
      },
    },
    {
      label: "Weather Forecast",
      icon: <Cloud className="h-4 w-4 text-blue-500" />,
      onClick: () => {
        setWeatherhistoricalDrawerOpen(true);
        closeContextMenu();
      },
    },
  ];

  // Ensure the menu stays within viewport bounds
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${contextMenuPosition.y}px`,
    left: `${contextMenuPosition.x}px`,
    zIndex: 1000,
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={closeContextMenu} />
      <div
        ref={menuRef}
        className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-64"
        style={style}
      >
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Map Options</span>
          </div>
          <button
            onClick={closeContextMenu}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-xs">
            <div className="font-medium truncate bg-gray-200 dark:bg-gray-700 h-4 w-3/4 animate-pulse"></div>
            <div className="text-gray-500 dark:text-gray-400 truncate bg-gray-200 dark:bg-gray-700 h-3 w-1/2 animate-pulse mt-1"></div>
          </div>
        ) : (
          placeName && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-xs">
              <div className="font-medium truncate">
                {placeName.split(",")[0]}
              </div>
              <div className="text-gray-500 dark:text-gray-400 truncate">
                {placeName}
              </div>
            </div>
          )
        )}

        <div className="p-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
        </div>
      </div>
    </>
  );
}
