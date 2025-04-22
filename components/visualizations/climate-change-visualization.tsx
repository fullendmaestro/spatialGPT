"use client";

import { useClimateChange } from "@/hooks/use-weather-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

export function ClimateChangeVisualization() {
  const { data, isLoading, isError, error } = useClimateChange();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load climate change data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Process data for charts - assuming data structure with multiple models
  const temperatureData = data.daily.time.map((time, index) => {
    const entry: any = { time };

    // Add data for each model
    Object.keys(data.daily).forEach((key) => {
      if (
        key.includes("temperature_2m_max_") &&
        Array.isArray(data.daily[key])
      ) {
        const modelName = key.replace("temperature_2m_max_", "");
        entry[modelName] = data.daily[key][index];
      }
    });

    return entry;
  });

  // Get model names for the legend
  const modelNames = Object.keys(data.daily)
    .filter((key) => key.includes("temperature_2m_max_"))
    .map((key) => key.replace("temperature_2m_max_", ""));

  // Generate colors for each model
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Climate Change Projections</CardTitle>
          <CardDescription>
            Temperature projections from multiple climate models in{" "}
            {data.daily_units.temperature_2m_max}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => {
                    // For climate data, just show the year
                    const date = parseISO(time);
                    return format(date, "yyyy");
                  }}
                  interval={Math.floor(temperatureData.length / 10)} // Show ~10 ticks
                />
                <YAxis
                  label={{
                    value: data.daily_units.temperature_2m_max,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    const date = parseISO(label);
                    return format(date, "yyyy");
                  }}
                  formatter={(value, name, props) => [
                    `${value} ${data.daily_units.temperature_2m_max}`,
                    name,
                  ]}
                />
                <Legend />
                {modelNames.map((model, index) => (
                  <Line
                    key={model}
                    type="monotone"
                    dataKey={model}
                    stroke={colors[index % colors.length]}
                    dot={false}
                    name={model}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Climate Models</CardTitle>
          <CardDescription>
            Understanding climate change projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Climate models are mathematical representations of the
              Earth&apos;s climate system. They simulate how the atmosphere,
              oceans, land surface, and ice interact over decades and centuries.
            </p>
            <p>
              The chart above shows temperature projections from multiple
              climate models. Each line represents a different model&apos;s
              projection of maximum temperature over time.
            </p>
            <p>
              These models help scientists understand how the climate might
              change in response to different scenarios of greenhouse gas
              emissions and other factors.
            </p>
            <div className="mt-4">
              <h4 className="font-medium">Models shown:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>EC_Earth3P_HR: High-resolution Earth system model</li>
                <li>
                  FGOALS_f3_H: Flexible Global Ocean-Atmosphere-Land System
                  model
                </li>
                <li>MPI_ESM1_2_XR: Max Planck Institute Earth System Model</li>
                <li>
                  CMCC_CM2_VHR4: Centro Euro-Mediterraneo sui Cambiamenti
                  Climatici Climate Model
                </li>
                <li>HiRAM_SIT_HR: High-Resolution Atmospheric Model</li>
                <li>
                  MRI_AGCM3_2_S: Meteorological Research Institute Atmospheric
                  General Circulation Model
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
