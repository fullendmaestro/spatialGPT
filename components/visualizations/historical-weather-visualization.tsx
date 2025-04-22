"use client"

import { useHistoricalWeather } from "@/hooks/use-weather-data"
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
  BarChart,
  Bar,
} from "recharts"
import { format, parseISO } from "date-fns"

export function HistoricalWeatherVisualization() {
  const { data, isLoading, isError, error } = useHistoricalWeather()

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
          {error instanceof Error ? error.message : "Failed to load historical weather data"}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  // Process data for charts
  const temperatureData = data.hourly.time.map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
  }))

  const precipitationData = data.hourly.time.map((time, index) => ({
    time,
    precipitation: data.hourly.precipitation[index],
  }))

  return (
    <div className="space-y-6">
      {/* Historical Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Temperature</CardTitle>
          <CardDescription>Temperature data in {data.hourly_units.temperature_2m}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d")} interval={24} />
                <YAxis
                  label={{
                    value: data.hourly_units.temperature_2m,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [`${value} ${data.hourly_units.temperature_2m}`, "Temperature"]}
                />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" dot={false} name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Historical Precipitation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Precipitation</CardTitle>
          <CardDescription>Precipitation data in {data.hourly_units.precipitation}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precipitationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d")} interval={24} />
                <YAxis
                  label={{
                    value: data.hourly_units.precipitation,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [`${value} ${data.hourly_units.precipitation}`, "Precipitation"]}
                />
                <Legend />
                <Bar dataKey="precipitation" fill="#82ca9d" name="Precipitation" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
