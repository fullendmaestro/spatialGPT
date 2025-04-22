"use client"

import { useDrawerStore } from "@/lib/store/drawer-store"
import { WeatherForecastVisualization } from "./visualizations/weather-forecast-visualization"
import { HistoricalWeatherVisualization } from "./visualizations/historical-weather-visualization"
import { AirQualityVisualization } from "./visualizations/air-quality-visualization"
import { ClimateChangeVisualization } from "./visualizations/climate-change-visualization"
import { MarineVisualization } from "./visualizations/marine-visualization"
import { FloodVisualization } from "./visualizations/flood-visualization"
import { SolarRadiationVisualization } from "./visualizations/solar-radiation-visualization"
import { EnsembleModelsVisualization } from "./visualizations/ensemble-models-visualization"

export function DataVisualizationContent() {
  const { visualizationType } = useDrawerStore()

  // Render the appropriate visualization based on the selected type
  const renderVisualization = () => {
    switch (visualizationType) {
      case "weather-forecast":
        return <WeatherForecastVisualization />
      case "weather-history":
        return <HistoricalWeatherVisualization />
      case "air-quality":
        return <AirQualityVisualization />
      case "climate-change":
        return <ClimateChangeVisualization />
      case "marine":
        return <MarineVisualization />
      case "flood":
        return <FloodVisualization />
      case "solar-radiation":
        return <SolarRadiationVisualization />
      case "ensemble-models":
        return <EnsembleModelsVisualization />
      default:
        return <div>Select a visualization type</div>
    }
  }

  return <div className="h-full">{renderVisualization()}</div>
}
