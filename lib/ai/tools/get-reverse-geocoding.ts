import { tool } from "ai";
import { z } from "zod";

export const getReverseGeocoding = tool({
  description: "Get the address or location name for given coordinates",
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
  }),
  execute: async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(`Reverse geocoding API error: ${data.error}`);
    }

    return {
      address: data.display_name,
      latitude: data.lat,
      longitude: data.lon,
    };
  },
});
