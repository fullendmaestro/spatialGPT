"use client"

import { useMarineForecast } from "@/hooks/use-weather-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { format, parseISO } from "date-fns"

export function MarineVisualization() {
  const { data, isLoading, isError, error } = useMarineForecast()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load marine forecast data"}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  // Process data for charts
  const waveData = data.hourly.time.map((time, index) => ({
    time,
    waveHeight: data.hourly.wave_height[index],
    windWaveHeight: data.hourly.wind_wave_height[index],
    swellWaveHeight: data.hourly.swell_wave_height[index],
  }))

  const windData = data.hourly.time.map((time, index) => ({
    time,
    windSpeed: data.hourly.wind_speed_10m[index],
    windGusts: data.hourly.wind_gusts_10m[index],
  }))

  return (
    <div className="space-y-6">
      {/* Wave Height Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Wave Height</CardTitle>
          <CardDescription>Wave height forecast in meters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d, HH:mm")} interval={12} />
                <YAxis
                  label={{
                    value: "m",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [
                    `${value} m`,
                    name === "waveHeight"
                      ? "Total Wave Height"
                      : name === "windWaveHeight"
                        ? "Wind Wave Height"
                        : "Swell Wave Height",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="waveHeight"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Total Wave Height"
                />
                <Area
                  type="monotone"
                  dataKey="windWaveHeight"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  name="Wind Wave Height"
                />
                <Area
                  type="monotone"
                  dataKey="swellWaveHeight"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                  name="Swell Wave Height"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wind Speed Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Wind Speed</CardTitle>
          <CardDescription>Wind speed and gusts forecast in km/h</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={windData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d, HH:mm")} interval={12} />
                <YAxis
                  label={{
                    value: "km/h",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [`${value} km/h`, name === "windSpeed" ? "Wind Speed" : "Wind Gusts"]}
                />
                <Legend />
                <Line type="monotone" dataKey="windSpeed" stroke="#0088fe" name="Wind Speed" />
                <Line type="monotone" dataKey="windGusts" stroke="#ff7300" name="Wind Gusts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Marine Information */}
      <Card>
        <CardHeader>
          <CardTitle>Marine Terminology</CardTitle>
          <CardDescription>Understanding marine weather forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Wave Height</h4>
              <p className="text-muted-foreground">
                The vertical distance between the crest (top) and trough (bottom) of a wave.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Wind Waves</h4>
              <p className="text-muted-foreground">Waves generated by local winds blowing across the water surface.</p>
            </div>
            <div>
              <h4 className="font-medium">Swell Waves</h4>
              <p className="text-muted-foreground">
                Waves that have traveled out of their generating area and are no longer affected by the local wind.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Wind Gusts</h4>
              <p className="text-muted-foreground">
                Sudden, brief increases in wind speed above the average wind speed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
