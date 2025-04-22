"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

export type WeatherMetric = "temperature" | "precipitation" | "wind"

export function useWeatherFilters() {
  const [selectedMetrics, setSelectedMetrics] = useState<WeatherMetric[]>(["temperature"])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return {
    selectedMetrics,
    setSelectedMetrics,
    dateRange,
    setDateRange,
  }
}
