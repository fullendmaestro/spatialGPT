"use client"

import { useFloodData } from "@/hooks/use-weather-data"
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
  ReferenceLine,
} from "recharts"
import { format, parseISO } from "date-fns"

export function FloodVisualization() {
  const { data, isLoading, isError, error } = useFloodData()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error instanceof Error ? error.message : "Failed to load flood data"}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  // Process data for charts
  const riverData = data.daily.time.map((time, index) => ({
    time,
    discharge: data.daily.river_discharge[index],
  }))

  // Calculate average discharge for reference line
  const avgDischarge = riverData.reduce((sum, item) => sum + item.discharge, 0) / riverData.length

  // Calculate flood threshold (for example, 1.5 times the average)
  const floodThreshold = avgDischarge * 1.5

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>River Discharge</CardTitle>
          <CardDescription>River discharge forecast in m³/s</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => format(parseISO(time), "MMM d")}
                  interval={Math.floor(riverData.length / 10)} // Show ~10 ticks
                />
                <YAxis
                  label={{
                    value: "m³/s",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "EEEE, MMM d, yyyy")}
                  formatter={(value, name) => [`${value} m³/s`, "River Discharge"]}
                />
                <Legend />
                <ReferenceLine y={avgDischarge} label="Average" stroke="#888888" strokeDasharray="3 3" />
                <ReferenceLine y={floodThreshold} label="Flood Risk" stroke="#ff0000" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="discharge" stroke="#0088fe" name="River Discharge" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flood Risk Information</CardTitle>
          <CardDescription>Understanding river discharge and flood risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              River discharge is the volume of water flowing through a river channel, measured in cubic meters per
              second (m³/s).
            </p>
            <p>
              The chart above shows the predicted river discharge over time. The average discharge level is shown as a
              reference line, and a flood risk threshold is indicated at 1.5 times the average discharge.
            </p>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Flood Risk Levels:</h4>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Low Risk: Below average discharge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Moderate Risk: Between average and flood threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>High Risk: Above flood threshold</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
