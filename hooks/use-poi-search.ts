"use client";

import { useQuery } from "@tanstack/react-query";

export interface POICategory {
  id: string;
  name: string;
  value: string;
}

export interface POIResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  category: string;
  type: string;
  importance: number;
  icon?: string;
  distance?: number;
}

export const poiCategories: POICategory[] = [
  { id: "restaurant", name: "Restaurants", value: "amenity=restaurant" },
  { id: "cafe", name: "Cafes", value: "amenity=cafe" },
  { id: "hotel", name: "Hotels", value: "tourism=hotel" },
  { id: "attraction", name: "Attractions", value: "tourism=attraction" },
  { id: "park", name: "Parks", value: "leisure=park" },
  { id: "museum", name: "Museums", value: "tourism=museum" },
  { id: "hospital", name: "Hospitals", value: "amenity=hospital" },
  { id: "pharmacy", name: "Pharmacies", value: "amenity=pharmacy" },
  { id: "fuel", name: "Gas Stations", value: "amenity=fuel" },
  { id: "supermarket", name: "Supermarkets", value: "shop=supermarket" },
];

export function usePOISearch(
  category: string,
  radius: number,
  latitude: number,
  longitude: number,
  enabled: boolean
) {
  return useQuery<POIResult[]>({
    queryKey: ["poi", category, radius, latitude, longitude],
    queryFn: async () => {
      if (!category || !radius || !latitude || !longitude) return [];

      // Find the category value from our list
      const categoryObj = poiCategories.find((cat) => cat.id === category);
      if (!categoryObj) return [];

      // Use Overpass API for POI search
      const overpassQuery = `
        [out:json];
        node[${categoryObj.value}](around:${radius},${latitude},${longitude});
        out body;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Transform the data to match our POIResult interface
      return data.elements
        .map((element: any) => ({
          place_id: element.id,
          osm_id: element.id,
          lat: element.lat,
          lon: element.lon,
          display_name: element.tags.name || `${categoryObj.name} (Unnamed)`,
          category: categoryObj.name,
          type:
            element.tags.amenity ||
            element.tags.tourism ||
            element.tags.leisure ||
            element.tags.shop,
          importance: 0.5,
          // Calculate distance from center point (simplified)
          distance: calculateDistance(
            latitude,
            longitude,
            element.lat,
            element.lon
          ),
        }))
        .sort(
          (a: POIResult, b: POIResult) => (a.distance || 0) - (b.distance || 0)
        );
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Simple distance calculation using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 1000); // Return in meters
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
