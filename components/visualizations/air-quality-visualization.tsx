"use client"

import { useAirQuality } from "@/hooks/use-weather-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { format, parseISO } from "date-fns"

export function AirQualityVisualization() {
  const { data, isLoading, isError, error } = useAirQuality()

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
          {error instanceof Error ? error.message : "Failed to load air quality data"}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  // Process data for charts
  const airQualityData = data.hourly.time.map((time, index) => ({
    time,
    pm10: data.hourly.pm10?.[index],
    pm2_5: data.hourly.pm2_5?.[index],
    nitrogen_dioxide: data.hourly.nitrogen_dioxide?.[index],
    ozone: data.hourly.ozone?.[index],
  }))

  return (
    <div className="space-y-6">
      {/* PM10 and PM2.5 Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Particulate Matter</CardTitle>
          <CardDescription>PM10 and PM2.5 concentrations in µg/m³</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d, HH:mm")} interval={12} />
                <YAxis
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [`${value} µg/m³`, name === "pm10" ? "PM10" : "PM2.5"]}
                />
                <Legend />
                <Line type="monotone" dataKey="pm10" stroke="#8884d8" name="PM10" />
                <Line type="monotone" dataKey="pm2_5" stroke="#82ca9d" name="PM2.5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Nitrogen Dioxide and Ozone Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Gases</CardTitle>
          <CardDescription>Nitrogen Dioxide and Ozone concentrations in µg/m³</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(time) => format(parseISO(time), "MMM d, HH:mm")} interval={12} />
                <YAxis
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")}
                  formatter={(value, name) => [`${value} µg/m³`, name === "nitrogen_dioxide" ? "NO₂" : "O₃"]}
                />
                <Legend />
                <Line type="monotone" dataKey="nitrogen_dioxide" stroke="#ff7300" name="NO₂" />
                <Line type="monotone" dataKey="ozone" stroke="#0088fe" name="O₃" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Air Quality Information */}
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Information</CardTitle>
          <CardDescription>Understanding air quality measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">PM10</h4>
              <p className="text-muted-foreground">
                Particulate matter with diameter less than 10 micrometers. Can penetrate the lungs and cause respiratory
                issues.
              </p>
            </div>
            <div>
              <h4 className="font-medium">PM2.5</h4>
              <p className="text-muted-foreground">
                Fine particulate matter with diameter less than 2.5 micrometers. Can enter the bloodstream and cause
                cardiovascular issues.
              </p>
            </div>
            <div>
              <h4 className="font-medium">NO₂ (Nitrogen Dioxide)</h4>
              <p className="text-muted-foreground">
                A gaseous air pollutant produced by combustion processes. Can cause inflammation of the airways.
              </p>
            </div>
            <div>
              <h4 className="font-medium">O₃ (Ozone)</h4>
              <p className="text-muted-foreground">
                A gas that can be good or bad depending on where it's found. Ground-level ozone can trigger health
                problems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
