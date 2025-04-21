"use client";

import { useQuery } from "@tanstack/react-query";
import { reverseGeocode, PlaceResult } from "@/lib/services/places-service";

/**
 * Hook to fetch the reverse geocoded place name for given coordinates.
 * @param latitude Latitude of the location.
 * @param longitude Longitude of the location.
 * @param enabled Whether the query should be enabled.
 */
export function useReverseGeocode(
  latitude: number | null,
  longitude: number | null,
  enabled: boolean = true
) {
  return useQuery<PlaceResult | null, Error>({
    queryKey: ["reverseGeocode", latitude, longitude],
    queryFn: async () => {
      if (latitude === null || longitude === null) return null;
      return await reverseGeocode(latitude, longitude);
    },
    enabled: enabled && latitude !== null && longitude !== null, // Only fetch if enabled and coordinates are provided
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
