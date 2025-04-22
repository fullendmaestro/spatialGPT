import { tool } from "ai";
import { z } from "zod";

export const getClimateData = tool({
  description: "Get climate data and seasonal patterns for a specific location",
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
    timezone: z
      .string()
      .optional()
      .describe("The timezone of the location (optional)"),
  }),
  execute: async ({ latitude, longitude, timezone = "auto" }) => {
    try {
      const url = new URL("https://climate-api.open-meteo.com/v1/climate");
      url.searchParams.append("latitude", latitude.toString());
      url.searchParams.append("longitude", longitude.toString());
      url.searchParams.append("timezone", timezone);

      // Monthly climate variables
      url.searchParams.append(
        "monthly",
        [
          "temperature_2m_mean",
          "temperature_2m_min",
          "temperature_2m_max",
          "precipitation_sum",
          "rain_sum",
          "snowfall_sum",
          "precipitation_hours",
          "wind_speed_10m_mean",
        ].join(",")
      );

      // Use historical data for climate averages
      url.searchParams.append("models", "era5_reanalysis");
      url.searchParams.append("start_date", "1991-01-01");
      url.searchParams.append("end_date", "2020-12-31");

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        return `Climate API error: ${data.reason}`;
      }

      // Add season information
      const getSeasonForMonth = (month: any, isNorthernHemisphere: any) => {
        if (isNorthernHemisphere) {
          if (month >= 3 && month <= 5) return "Spring";
          if (month >= 6 && month <= 8) return "Summer";
          if (month >= 9 && month <= 11) return "Fall";
          return "Winter";
        } else {
          if (month >= 3 && month <= 5) return "Fall";
          if (month >= 6 && month <= 8) return "Winter";
          if (month >= 9 && month <= 11) return "Spring";
          return "Summer";
        }
      };

      // Determine hemisphere based on latitude
      const isNorthernHemisphere = latitude >= 0;

      // Add month names and seasons
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      if (data.monthly) {
        data.monthly.month_names = monthNames;
        data.monthly.seasons = monthNames.map((_, index) =>
          getSeasonForMonth(index + 1, isNorthernHemisphere)
        );
      }

      return data;
    } catch (error) {
      return {
        error: `Error fetching climate data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  },
});
