import { useQuery } from "@tanstack/react-query"
import {
  fetchWeatherForecast,
  fetchHistoricalWeather,
  fetchAirQuality,
  fetchClimateChange,
  fetchMarineForecast,
  fetchFloodData,
  fetchSolarRadiation,
  fetchEnsembleModels,
} from "@/lib/services/open-meteo-api"
import { useDrawerStore } from "@/lib/store/drawer-store"

// Weather Forecast Hook
export const useWeatherForecast = () => {
  const { coordinate, dateRange, units } = useDrawerStore()

  return useQuery({
    queryKey: ["weather-forecast", coordinate, dateRange, units],
    queryFn: () =>
      fetchWeatherForecast(
        coordinate.latitude,
        coordinate.longitude,
        dateRange,
        units.temperature,
        units.wind,
        units.precipitation,
      ),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Historical Weather Hook
export const useHistoricalWeather = () => {
  const { coordinate, dateRange, units } = useDrawerStore()

  return useQuery({
    queryKey: ["weather-history", coordinate, dateRange, units],
    queryFn: () =>
      fetchHistoricalWeather(
        coordinate.latitude,
        coordinate.longitude,
        dateRange,
        units.temperature,
        units.wind,
        units.precipitation,
      ),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Air Quality Hook
export const useAirQuality = () => {
  const { coordinate, dateRange } = useDrawerStore()

  return useQuery({
    queryKey: ["air-quality", coordinate, dateRange],
    queryFn: () => fetchAirQuality(coordinate.latitude, coordinate.longitude, dateRange),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Climate Change Hook
export const useClimateChange = () => {
  const { coordinate, dateRange, units } = useDrawerStore()

  return useQuery({
    queryKey: ["climate-change", coordinate, dateRange, units.temperature],
    queryFn: () => fetchClimateChange(coordinate.latitude, coordinate.longitude, dateRange, units.temperature),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Marine Forecast Hook
export const useMarineForecast = () => {
  const { coordinate, dateRange } = useDrawerStore()

  return useQuery({
    queryKey: ["marine", coordinate, dateRange],
    queryFn: () => fetchMarineForecast(coordinate.latitude, coordinate.longitude, dateRange),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Flood Data Hook
export const useFloodData = () => {
  const { coordinate, dateRange } = useDrawerStore()

  return useQuery({
    queryKey: ["flood", coordinate, dateRange],
    queryFn: () => fetchFloodData(coordinate.latitude, coordinate.longitude, dateRange),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Solar Radiation Hook
export const useSolarRadiation = () => {
  const { coordinate, dateRange } = useDrawerStore()

  return useQuery({
    queryKey: ["solar-radiation", coordinate, dateRange],
    queryFn: () => fetchSolarRadiation(coordinate.latitude, coordinate.longitude, dateRange),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Ensemble Models Hook
export const useEnsembleModels = () => {
  const { coordinate, dateRange, units } = useDrawerStore()

  return useQuery({
    queryKey: ["ensemble-models", coordinate, dateRange, units.temperature],
    queryFn: () => fetchEnsembleModels(coordinate.latitude, coordinate.longitude, dateRange, units.temperature),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}
