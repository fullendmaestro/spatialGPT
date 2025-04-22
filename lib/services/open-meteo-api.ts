import axios from "axios"
import type { DateRange } from "../store/drawer-store"
import { format } from "date-fns"

// Base URLs for different Open Meteo APIs
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
const HISTORICAL_WEATHER_API_URL = "https://archive-api.open-meteo.com/v1/archive"
const AIR_QUALITY_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
const CLIMATE_API_URL = "https://climate-api.open-meteo.com/v1/climate"
const MARINE_API_URL = "https://marine-api.open-meteo.com/v1/marine"
const FLOOD_API_URL = "https://flood-api.open-meteo.com/v1/flood"
const ENSEMBLE_API_URL = "https://ensemble-api.open-meteo.com/v1/ensemble"

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd")
}

// Weather Forecast API
export const fetchWeatherForecast = async (
  latitude: number,
  longitude: number,
  dateRange: DateRange,
  temperatureUnit: "celsius" | "fahrenheit",
  windUnit: "kmh" | "ms" | "mph" | "kn",
  precipitationUnit: "mm" | "inch",
) => {
  const response = await axios.get(WEATHER_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly:
        "temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,wind_speed_10m,wind_speed_100m,wind_direction_10m,wind_direction_100m,wind_gusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration",
      timezone: "auto",
      temperature_unit: temperatureUnit,
      windspeed_unit: windUnit,
      precipitation_unit: precipitationUnit,
    },
  })
  return response.data
}

// Historical Weather API
export const fetchHistoricalWeather = async (
  latitude: number,
  longitude: number,
  dateRange: DateRange,
  temperatureUnit: "celsius" | "fahrenheit",
  windUnit: "kmh" | "ms" | "mph" | "kn",
  precipitationUnit: "mm" | "inch",
) => {
  const response = await axios.get(HISTORICAL_WEATHER_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly:
        "temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
      timezone: "auto",
      temperature_unit: temperatureUnit,
      windspeed_unit: windUnit,
      precipitation_unit: precipitationUnit,
    },
  })
  return response.data
}

// Air Quality API
export const fetchAirQuality = async (latitude: number, longitude: number, dateRange: DateRange) => {
  const response = await axios.get(AIR_QUALITY_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly:
        "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen",
      timezone: "auto",
    },
  })
  return response.data
}

// Climate Change API
export const fetchClimateChange = async (
  latitude: number,
  longitude: number,
  dateRange: DateRange,
  temperatureUnit: "celsius" | "fahrenheit",
) => {
  const response = await axios.get(CLIMATE_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      models: "EC_Earth3P_HR,FGOALS_f3_H,MPI_ESM1_2_XR,NICAM16_8S,CMCC_CM2_VHR4,HiRAM_SIT_HR,MRI_AGCM3_2_S",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
      temperature_unit: temperatureUnit,
    },
  })
  return response.data
}

// Marine Forecast API
export const fetchMarineForecast = async (latitude: number, longitude: number, dateRange: DateRange) => {
  const response = await axios.get(MARINE_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly:
        "wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
      daily:
        "wave_height_max,wave_direction_dominant,wave_period_max,wind_wave_height_max,wind_wave_direction_dominant,wind_wave_period_max,swell_wave_height_max,swell_wave_direction_dominant,swell_wave_period_max",
      timezone: "auto",
    },
  })
  return response.data
}

// Flood API
export const fetchFloodData = async (latitude: number, longitude: number, dateRange: DateRange) => {
  const response = await axios.get(FLOOD_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      daily: "river_discharge",
      timezone: "auto",
    },
  })
  return response.data
}

// Solar Radiation API
export const fetchSolarRadiation = async (latitude: number, longitude: number, dateRange: DateRange) => {
  const response = await axios.get(WEATHER_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly:
        "shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,terrestrial_radiation,shortwave_radiation_instant,direct_radiation_instant,diffuse_radiation_instant,direct_normal_irradiance_instant,terrestrial_radiation_instant",
      timezone: "auto",
    },
  })
  return response.data
}

// Ensemble Models API
export const fetchEnsembleModels = async (
  latitude: number,
  longitude: number,
  dateRange: DateRange,
  temperatureUnit: "celsius" | "fahrenheit",
) => {
  const response = await axios.get(ENSEMBLE_API_URL, {
    params: {
      latitude,
      longitude,
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to),
      hourly: "temperature_2m",
      temperature_unit: temperatureUnit,
      timezone: "auto",
    },
  })
  return response.data
}
