import { tool } from "ai";
import { z } from "zod";

export const getAirQuality = tool({
  description: "Get air quality information for a specific location",
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
      const url = new URL(
        "https://air-quality-api.open-meteo.com/v1/air-quality"
      );
      url.searchParams.append("latitude", latitude.toString());
      url.searchParams.append("longitude", longitude.toString());
      url.searchParams.append("timezone", timezone);

      // Current air quality variables
      url.searchParams.append(
        "current",
        [
          "pm10",
          "pm2_5",
          "carbon_monoxide",
          "nitrogen_dioxide",
          "sulphur_dioxide",
          "ozone",
          "aerosol_optical_depth",
          "dust",
          "uv_index",
          "uv_index_clear_sky",
          "alder_pollen",
          "birch_pollen",
          "grass_pollen",
          "mugwort_pollen",
          "olive_pollen",
          "ragweed_pollen",
          "european_aqi",
          "european_aqi_pm2_5",
          "european_aqi_pm10",
          "european_aqi_no2",
          "european_aqi_o3",
          "european_aqi_so2",
        ].join(",")
      );

      // Hourly air quality variables
      url.searchParams.append(
        "hourly",
        [
          "pm10",
          "pm2_5",
          "carbon_monoxide",
          "nitrogen_dioxide",
          "sulphur_dioxide",
          "ozone",
          "aerosol_optical_depth",
          "dust",
          "uv_index",
          "uv_index_clear_sky",
          "european_aqi",
          "european_aqi_pm2_5",
          "european_aqi_pm10",
          "european_aqi_no2",
          "european_aqi_o3",
          "european_aqi_so2",
        ].join(",")
      );

      url.searchParams.append("forecast_days", "3");

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        throw new Error(`Air quality API error: ${data.reason}`);
      }

      // Add AQI interpretations
      const aqiLevels: any = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor",
      };

      // Add AQI descriptions to the data
      if (data.current && data.current.european_aqi !== undefined) {
        data.current.aqi_level =
          aqiLevels[data.current.european_aqi] || "Unknown";
      }

      if (data.hourly && data.hourly.european_aqi) {
        data.hourly.aqi_level = data.hourly.european_aqi.map(
          (aqi: any) => aqiLevels[aqi] || "Unknown"
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      throw error;
    }
  },
});
