"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export interface PlaceResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export function usePlacesSearch(searchQuery: string) {
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [enabled, setEnabled] = useState(false);

  // Only enable the query if we have at least 2 characters
  useEffect(() => {
    setEnabled(debouncedQuery.length >= 2);
  }, [debouncedQuery]);

  return useQuery<PlaceResult[]>({
    queryKey: ["places", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedQuery
        )}&limit=5`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
