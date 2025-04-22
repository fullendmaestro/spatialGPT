import { tool } from "ai";
import { z } from "zod";

// Define the type for weather alerts
type WeatherAlert = {
  type: string;
  severity: string;
  date: string; // or Date if you are using Date objects
  details: string;
};

export const getWeatherAlerts = tool({
  description: "Get weather alerts and warnings for a specific location",
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
      // First, get the detailed forecast to analyze for potential weather alerts
      const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
      forecastUrl.searchParams.append("latitude", latitude.toString());
      forecastUrl.searchParams.append("longitude", longitude.toString());
      forecastUrl.searchParams.append("timezone", timezone);

      // Daily forecast variables
      forecastUrl.searchParams.append(
        "daily",
        [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "precipitation_probability_max",
          "wind_speed_10m_max",
          "wind_gusts_10m_max",
        ].join(",")
      );

      // Hourly forecast variables for more detailed analysis
      forecastUrl.searchParams.append(
        "hourly",
        [
          "temperature_2m",
          "precipitation_probability",
          "precipitation",
          "weather_code",
          "wind_speed_10m",
          "wind_gusts_10m",
        ].join(",")
      );

      forecastUrl.searchParams.append("forecast_days", "3");

      const response = await fetch(forecastUrl.toString());
      const forecastData = await response.json();

      if (forecastData.error) {
        return `Weather API error: ${forecastData.reason}`;
      }

      // Define alert thresholds
      const alertThresholds = {
        highTemp: 35, // °C
        lowTemp: -10, // °C
        heavyRain: 20, // mm per day
        highWinds: 60, // km/h
        severeWindGusts: 80, // km/h
        highPrecipProb: 80, // %
      };

      // Define severe weather codes
      const severeWeatherCodes = [
        65, 67, 71, 73, 75, 77, 82, 85, 86, 95, 96, 99,
      ];

      // Initialize the alerts array with the defined type
      const alerts: WeatherAlert[] = [];

      // Generate alerts based on forecast data
      // Check daily data for alerts
      if (forecastData.daily) {
        const {
          time,
          weather_code,
          temperature_2m_max,
          temperature_2m_min,
          precipitation_sum,
          precipitation_probability_max,
          wind_speed_10m_max,
          wind_gusts_10m_max,
        } = forecastData.daily;

        for (let i = 0; i < time.length; i++) {
          const date = time[i];

          // Check for high temperature
          if (temperature_2m_max[i] >= alertThresholds.highTemp) {
            alerts.push({
              type: "High Temperature",
              severity: "Moderate",
              date,
              details: `High temperature of ${temperature_2m_max[i]}°C expected.`,
            });
          }

          // Check for low temperature
          if (temperature_2m_min[i] <= alertThresholds.lowTemp) {
            alerts.push({
              type: "Low Temperature",
              severity: "Moderate",
              date,
              details: `Low temperature of ${temperature_2m_min[i]}°C expected.`,
            });
          }

          // Check for heavy rain
          if (precipitation_sum[i] >= alertThresholds.heavyRain) {
            alerts.push({
              type: "Heavy Precipitation",
              severity: "Moderate",
              date,
              details: `Heavy precipitation of ${precipitation_sum[i]}mm expected.`,
            });
          }

          // Check for high winds
          if (wind_speed_10m_max[i] >= alertThresholds.highWinds) {
            alerts.push({
              type: "High Winds",
              severity: "Moderate",
              date,
              details: `High winds of ${wind_speed_10m_max[i]}km/h expected.`,
            });
          }

          // Check for severe wind gusts
          if (wind_gusts_10m_max[i] >= alertThresholds.severeWindGusts) {
            alerts.push({
              type: "Severe Wind Gusts",
              severity: "High",
              date,
              details: `Severe wind gusts of ${wind_gusts_10m_max[i]}km/h expected.`,
            });
          }

          // Check for high precipitation probability
          if (
            precipitation_probability_max[i] >= alertThresholds.highPrecipProb
          ) {
            alerts.push({
              type: "High Precipitation Probability",
              severity: "Low",
              date,
              details: `${precipitation_probability_max[i]}% chance of precipitation.`,
            });
          }

          // Check for severe weather codes
          if (severeWeatherCodes.includes(weather_code[i])) {
            const weatherDescriptions: any = {
              65: "Heavy rain",
              67: "Heavy freezing rain",
              71: "Snow fall",
              73: "Moderate snow fall",
              75: "Heavy snow fall",
              77: "Snow grains",
              82: "Violent rain showers",
              85: "Slight snow showers",
              86: "Heavy snow showers",
              95: "Thunderstorm",
              96: "Thunderstorm with slight hail",
              99: "Thunderstorm with heavy hail",
            };

            alerts.push({
              type: "Severe Weather",
              severity: "High",
              date,
              details: `${weatherDescriptions[weather_code[i]]} expected.`,
            });
          }
        }
      }

      return {
        location: {
          latitude,
          longitude,
          timezone,
        },
        alerts:
          alerts.length > 0
            ? alerts
            : [
                {
                  type: "No Alerts",
                  severity: "None",
                  details: "No weather alerts for this location.",
                },
              ],
        forecast_summary: {
          daily: forecastData.daily,
        },
      };
    } catch (error) {
      return {
        error: `Error generating weather alerts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  },
});
