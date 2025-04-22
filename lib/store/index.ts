// Re-export all stores from this file
export * from "./drawer-store"

// Original store exports
import { create } from "zustand"
import { addDays } from "date-fns"

interface Coordinate {
  latitude: number
  longitude: number
}

interface MapState {
  coordinate: Coordinate
  userPosition: Coordinate | null // New state for user's position
  contextMenuPosition: { x: number; y: number } | null
  isContextMenuOpen: boolean
  centerRequest: Coordinate | null
  weatherhistoricalDrawerOpen: boolean
  setWeatherhistoricalDrawerOpen: (open: boolean) => void
  setCoordinate: (coordinate: Coordinate) => void
  setUserPosition: (position: Coordinate | null) => void // New setter for user's position
  openContextMenu: (x: number, y: number) => void
  closeContextMenu: () => void
  centerMapTo: (latitude: number, longitude: number) => void
  clearCenterRequest: () => void
}

export const useMapStore = create<MapState>((set) => ({
  coordinate: { latitude: 37.7749, longitude: -122.4194 }, // Default to San Francisco
  userPosition: null, // Initialize user position as null
  contextMenuPosition: null,
  isContextMenuOpen: false,
  centerRequest: null,
  weatherhistoricalDrawerOpen: false,
  setWeatherhistoricalDrawerOpen: (open: boolean) => {
    set({ weatherhistoricalDrawerOpen: open })
  },
  setCoordinate: (coordinate) => set({ coordinate }),
  setUserPosition: (position) => set({ userPosition: position }), // Setter for user position
  openContextMenu: (x, y) => set({ contextMenuPosition: { x, y }, isContextMenuOpen: true }),
  closeContextMenu: () => set({ isContextMenuOpen: false, contextMenuPosition: null }),
  centerMapTo: (latitude, longitude) => set({ centerRequest: { latitude, longitude } }),
  clearCenterRequest: () => set({ centerRequest: null }),
}))

interface ChatState {
  coordinateAttachments: Coordinate[]
  addCoordinateAttachment: (coordinate: Coordinate) => void
  removeCoordinateAttachment: (index: number) => void
  clearCoordinateAttachments: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  coordinateAttachments: [],
  addCoordinateAttachment: (coordinates) =>
    set((state) => ({
      coordinateAttachments: [...state.coordinateAttachments, coordinates],
    })),
  removeCoordinateAttachment: (index) =>
    set((state) => ({
      coordinateAttachments: state.coordinateAttachments.filter((_, i) => i !== index),
    })),
  clearCoordinateAttachments: () => set({ coordinateAttachments: [] }),
}))

export interface WeatherParams {
  latitude: number
  longitude: number
  forecastDays: number
  timezone: string
  temperatureUnit: "celsius" | "fahrenheit"
  windspeedUnit: "kmh" | "ms" | "mph" | "kn"
  precipitationUnit: "mm" | "inch"
  startDate?: Date
  endDate?: Date
}

interface WeatherState {
  isDrawerOpen: boolean
  params: WeatherParams
  setDrawerOpen: (open: boolean) => void
  setParams: (params: Partial<WeatherParams>) => void
  resetParams: () => void
}

const defaultParams: WeatherParams = {
  latitude: 52.52,
  longitude: 13.41,
  forecastDays: 7,
  timezone: "auto",
  temperatureUnit: "celsius",
  windspeedUnit: "kmh",
  precipitationUnit: "mm",
  startDate: new Date(),
  endDate: addDays(new Date(), 7),
}

export const useWeatherStore = create<WeatherState>((set) => ({
  isDrawerOpen: false,
  params: defaultParams,
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setParams: (params) => set((state) => ({ params: { ...state.params, ...params } })),
  resetParams: () => set({ params: defaultParams }),
}))
