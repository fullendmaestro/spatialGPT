import { tool } from "ai";
import { z } from "zod";

export const getGeocoding = tool({
  description: "Get coordinates for a given address or location name",
  parameters: z.object({
    query: z.string().describe("The address or location name to search for"),
  }),
  execute: async ({ query }) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();

    if (!data.length) {
      throw new Error("No results found for the given query.");
    }

    return data.map((result: any) => ({
      address: result.display_name,
      latitude: result.lat,
      longitude: result.lon,
    }));
  },
});
