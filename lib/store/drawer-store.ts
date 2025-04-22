import { create } from "zustand"
import { addDays, subDays } from "date-fns"

export type DataVisualizationType =
  | "weather-forecast"
  | "weather-history"
  | "air-quality"
  | "climate-change"
  | "marine"
  | "flood"
  | "solar-radiation"
  | "ensemble-models"

export interface DateRange {
  from: Date
  to: Date
}

interface DrawerState {
  isOpen: boolean
  coordinate: { latitude: number; longitude: number }
  visualizationType: DataVisualizationType
  dateRange: DateRange
  units: {
    temperature: "celsius" | "fahrenheit"
    wind: "kmh" | "ms" | "mph" | "kn"
    precipitation: "mm" | "inch"
  }
  setOpen: (open: boolean) => void
  setCoordinate: (coordinate: { latitude: number; longitude: number }) => void
  setVisualizationType: (type: DataVisualizationType) => void
  setDateRange: (range: DateRange) => void
  setUnits: (units: Partial<DrawerState["units"]>) => void
  resetDateRange: () => void
}

// Default date ranges based on visualization type
const getDefaultDateRange = (type: DataVisualizationType): DateRange => {
  const now = new Date()

  switch (type) {
    case "weather-forecast":
      return {
        from: now,
        to: addDays(now, 7),
      }
    case "weather-history":
      return {
        from: subDays(now, 14),
        to: now,
      }
    case "air-quality":
      return {
        from: subDays(now, 5),
        to: addDays(now, 2),
      }
    case "climate-change":
      // For climate change, we want to show a much longer period
      const currentYear = now.getFullYear()
      const startDate = new Date(1950, 0, 1)
      const endDate = new Date(2050, 11, 31)
      return {
        from: startDate,
        to: endDate,
      }
    case "marine":
      return {
        from: now,
        to: addDays(now, 7),
      }
    case "flood":
      return {
        from: subDays(now, 30),
        to: addDays(now, 90),
      }
    case "solar-radiation":
      return {
        from: now,
        to: addDays(now, 1),
      }
    case "ensemble-models":
      return {
        from: now,
        to: addDays(now, 7),
      }
    default:
      return {
        from: subDays(now, 7),
        to: addDays(now, 7),
      }
  }
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  coordinate: { latitude: 52.52, longitude: 13.41 }, // Default to Berlin
  visualizationType: "weather-forecast",
  dateRange: getDefaultDateRange("weather-forecast"),
  units: {
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm",
  },
  setOpen: (open) => set({ isOpen: open }),
  setCoordinate: (coordinate) => set({ coordinate }),
  setVisualizationType: (type) =>
    set((state) => ({
      visualizationType: type,
      dateRange: getDefaultDateRange(type),
    })),
  setDateRange: (range) => set({ dateRange: range }),
  setUnits: (units) =>
    set((state) => ({
      units: { ...state.units, ...units },
    })),
  resetDateRange: () =>
    set((state) => ({
      dateRange: getDefaultDateRange(state.visualizationType),
    })),
}))
