import { tool } from "ai";
import { z } from "zod";

export const getPOI = tool({
  description: "Get points of interest near a specific location",
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
    radius: z.number().default(1000).describe("Search radius in meters"),
  }),
  execute: async ({ latitude, longitude, radius }) => {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radius},${latitude},${longitude})[amenity];out;`
    );
    const data = await response.json();

    if (!data.elements || !data.elements.length) {
      return "No points of interest found in the given radius.";
    }

    return data.elements.map((poi: any) => ({
      name: poi.tags.name || "Unknown",
      type: poi.tags.amenity,
      latitude: poi.lat,
      longitude: poi.lon,
    }));
  },
});
