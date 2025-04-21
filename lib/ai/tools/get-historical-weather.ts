import { tool } from "ai";
import { z } from "zod";

export const getHistoricalWeather = tool({
  description:
    "Get historical weather data for a specific location and time period",
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
    start_date: z.string().describe("Start date in YYYY-MM-DD format"),
    end_date: z.string().describe("End date in YYYY-MM-DD format"),
    timezone: z
      .string()
      .optional()
      .describe("The timezone of the location (optional)"),
  }),
  execute: async ({
    latitude,
    longitude,
    start_date,
    end_date,
    timezone = "auto",
  }) => {
    try {
      const url = new URL("https://archive-api.open-meteo.com/v1/archive");
      url.searchParams.append("latitude", latitude.toString());
      url.searchParams.append("longitude", longitude.toString());
      url.searchParams.append("start_date", start_date);
      url.searchParams.append("end_date", end_date);
      url.searchParams.append("timezone", timezone);

      // Daily variables
      url.searchParams.append(
        "daily",
        [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "temperature_2m_mean",
          "apparent_temperature_max",
          "apparent_temperature_min",
          "apparent_temperature_mean",
          "sunrise",
          "sunset",
          "daylight_duration",
          "sunshine_duration",
          "precipitation_sum",
          "rain_sum",
          "snowfall_sum",
          "precipitation_hours",
          "wind_speed_10m_max",
          "wind_gusts_10m_max",
          "wind_direction_10m_dominant",
          "shortwave_radiation_sum",
        ].join(",")
      );

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        throw new Error(`Historical weather API error: ${data.reason}`);
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
      if (data.daily && data.daily.weather_code) {
        data.daily.weather_description = data.daily.weather_code.map(
          (code: any) => weatherCodes[code] || "Unknown"
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching historical weather data:", error);
      throw error;
    }
  },
});
