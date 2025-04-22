import { tool } from "ai";
import { z } from "zod";

export const getDetailedForecast = tool({
  description:
    "Get a detailed multi-day weather forecast for a specific location",
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
    days: z
      .number()
      .min(1)
      .max(16)
      .default(7)
      .describe("Number of forecast days (1-16)"),
    timezone: z
      .string()
      .optional()
      .describe("The timezone of the location (optional)"),
  }),
  execute: async ({ latitude, longitude, days = 7, timezone = "auto" }) => {
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.append("latitude", latitude.toString());
      url.searchParams.append("longitude", longitude.toString());
      url.searchParams.append("timezone", timezone);

      // Current weather variables
      url.searchParams.append(
        "current",
        [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "precipitation",
          "rain",
          "showers",
          "snowfall",
          "weather_code",
          "cloud_cover",
          "pressure_msl",
          "surface_pressure",
          "wind_speed_10m",
          "wind_direction_10m",
          "wind_gusts_10m",
        ].join(",")
      );

      // Daily forecast variables
      url.searchParams.append(
        "daily",
        [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "apparent_temperature_max",
          "apparent_temperature_min",
          "sunrise",
          "sunset",
          "uv_index_max",
          "precipitation_sum",
          "rain_sum",
          "showers_sum",
          "snowfall_sum",
          "precipitation_hours",
          "precipitation_probability_max",
          "wind_speed_10m_max",
          "wind_gusts_10m_max",
          "wind_direction_10m_dominant",
        ].join(",")
      );

      // Hourly forecast variables
      url.searchParams.append(
        "hourly",
        [
          "temperature_2m",
          "relative_humidity_2m",
          "dew_point_2m",
          "apparent_temperature",
          "precipitation_probability",
          "precipitation",
          "rain",
          "showers",
          "snowfall",
          "snow_depth",
          "weather_code",
          "pressure_msl",
          "surface_pressure",
          "cloud_cover",
          "cloud_cover_low",
          "cloud_cover_mid",
          "cloud_cover_high",
          "visibility",
          "wind_speed_10m",
          "wind_direction_10m",
          "wind_gusts_10m",
          "uv_index",
          "is_day",
        ].join(",")
      );

      url.searchParams.append("forecast_days", days.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        return `Weather API error: ${data.reason}`;
      }

      // Add weather code interpretations
      const weatherCodes: any = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      // Add weather code descriptions to the data
      if (data.current && data.current.weather_code !== undefined) {
        data.current.weather_description =
          weatherCodes[data.current.weather_code] || "Unknown";
      }

      if (data.daily && data.daily.weather_code) {
        data.daily.weather_description = data.daily.weather_code.map(
          (code: any) => weatherCodes[code] || "Unknown"
        );
      }

      if (data.hourly && data.hourly.weather_code) {
        data.hourly.weather_description = data.hourly.weather_code.map(
          (code: any) => weatherCodes[code] || "Unknown"
        );
      }

      return data;
    } catch (error) {
      return {
        error: `Error fetching detailed forecast data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  },
});
