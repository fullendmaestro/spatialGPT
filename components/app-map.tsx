"use client";
import dynamic from "next/dynamic";

// Dynamically import the Map component with no SSR
export const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "500px", width: "100%" }}>Loading map...</div>
  ),
});
