"use client";

import { useState, useRef, useEffect } from "react";
import {
  useDrawerStore,
  type DataVisualizationType,
} from "@/lib/store/drawer-store";
import {
  Cloud,
  History,
  Wind,
  Thermometer,
  Waves,
  Droplets,
  Sun,
  BarChart3,
} from "lucide-react";

export function DataVisualizationTabs() {
  const { visualizationType, setVisualizationType } = useDrawerStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    {
      value: "weather-forecast",
      label: "Forecast",
      icon: Cloud,
      color: "text-blue-500",
    },
    {
      value: "weather-history",
      label: "History",
      icon: History,
      color: "text-purple-500",
    },
    {
      value: "air-quality",
      label: "Air Quality",
      icon: Wind,
      color: "text-green-500",
    },
    {
      value: "climate-change",
      label: "Climate",
      icon: Thermometer,
      color: "text-red-500",
    },
    { value: "marine", label: "Marine", icon: Waves, color: "text-cyan-500" },
    { value: "flood", label: "Flood", icon: Droplets, color: "text-blue-700" },
    {
      value: "solar-radiation",
      label: "Solar",
      icon: Sun,
      color: "text-yellow-500",
    },
    {
      value: "ensemble-models",
      label: "Ensemble",
      icon: BarChart3,
      color: "text-gray-500",
    },
  ];

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeIndex = tabs.findIndex(
      (tab) => tab.value === visualizationType
    );
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [visualizationType]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const initialElement = tabRefs.current[0];
      if (initialElement) {
        const { offsetLeft, offsetWidth } = initialElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return (
    <div className="flex justify-start items-center w-full mt-1">
      <div className="relative w-full max-w-[1200px] h-[40px] border-none shadow-none flex items-center">
        <div className="relative w-full">
          {/* Hover Highlight */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <div
                key={tab.value}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
                  tab.value === visualizationType
                    ? `text-[#0e0e10] dark:text-white ${tab.color}`
                    : `text-[#0e0f1199] dark:text-[#ffffff99]`
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() =>
                  setVisualizationType(tab.value as DataVisualizationType)
                }
              >
                <div
                  className={`text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full`}
                >
                  <tab.icon className={`h-4 w-4 mr-1 ${tab.color}`} />
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
