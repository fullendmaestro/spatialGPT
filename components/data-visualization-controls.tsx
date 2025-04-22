"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDrawerStore,
  type DataVisualizationType,
} from "@/lib/store/drawer-store";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DataVisualizationControls() {
  const {
    visualizationType,
    dateRange,
    setDateRange,
    resetDateRange,
    units,
    setUnits,
  } = useDrawerStore();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Get the appropriate date format based on visualization type
  const getDateFormat = (type: DataVisualizationType): string => {
    switch (type) {
      case "climate-change":
        return "yyyy";
      case "flood":
        return "MMM yyyy";
      default:
        return "MMM d, yyyy";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize your visualization settings
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Date Range</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDateRange}
            className="h-8 px-2 text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Reset
          </Button>
        </div>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, getDateFormat(visualizationType))} -{" "}
                    {format(dateRange.to, getDateFormat(visualizationType))}
                  </>
                ) : (
                  format(dateRange.from, getDateFormat(visualizationType))
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[1004]" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({
                    from: range.from,
                    to: range.to,
                  });
                  setCalendarOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Units Selector - Only show for relevant visualization types */}
      {(visualizationType === "weather-forecast" ||
        visualizationType === "weather-history" ||
        visualizationType === "climate-change" ||
        visualizationType === "ensemble-models") && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Temperature Unit</Label>
            <RadioGroup
              value={units.temperature}
              onValueChange={(value) =>
                setUnits({ temperature: value as "celsius" | "fahrenheit" })
              }
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label htmlFor="celsius">°C</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label htmlFor="fahrenheit">°F</Label>
              </div>
            </RadioGroup>
          </div>

          {(visualizationType === "weather-forecast" ||
            visualizationType === "weather-history") && (
            <>
              <div className="space-y-2">
                <Label>Wind Speed Unit</Label>
                <Select
                  value={units.wind}
                  onValueChange={(value) =>
                    setUnits({ wind: value as "kmh" | "ms" | "mph" | "kn" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kmh">km/h</SelectItem>
                    <SelectItem value="ms">m/s</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                    <SelectItem value="kn">knots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Precipitation Unit</Label>
                <RadioGroup
                  value={units.precipitation}
                  onValueChange={(value) =>
                    setUnits({ precipitation: value as "mm" | "inch" })
                  }
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mm" id="mm" />
                    <Label htmlFor="mm">mm</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="inch" id="inch" />
                    <Label htmlFor="inch">inch</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>
      )}

      {/* Visualization-specific controls */}
      {visualizationType === "air-quality" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-pm10" defaultChecked />
            <Label htmlFor="show-pm10">Show PM10</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-pm25" defaultChecked />
            <Label htmlFor="show-pm25">Show PM2.5</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-no2" />
            <Label htmlFor="show-no2">Show NO₂</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-o3" />
            <Label htmlFor="show-o3">Show O₃</Label>
          </div>
        </div>
      )}

      {visualizationType === "climate-change" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Climate Models</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="model-ec-earth" defaultChecked />
                <Label htmlFor="model-ec-earth">EC Earth3P</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="model-mpi" defaultChecked />
                <Label htmlFor="model-mpi">MPI ESM1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="model-fgoals" defaultChecked />
                <Label htmlFor="model-fgoals">FGOALS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="model-cmcc" defaultChecked />
                <Label htmlFor="model-cmcc">CMCC CM2</Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {visualizationType === "marine" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Wave Height Threshold (m)</Label>
            <Slider defaultValue={[0.5]} max={5} step={0.1} className="py-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0m</span>
              <span>5m</span>
            </div>
          </div>
        </div>
      )}

      {visualizationType === "solar-radiation" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-shortwave" defaultChecked />
            <Label htmlFor="show-shortwave">Shortwave Radiation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-direct" />
            <Label htmlFor="show-direct">Direct Radiation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-diffuse" />
            <Label htmlFor="show-diffuse">Diffuse Radiation</Label>
          </div>
        </div>
      )}
    </div>
  );
}
