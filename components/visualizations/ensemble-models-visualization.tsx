"use client";

import { useEnsembleModels } from "@/hooks/use-weather-data";
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

export function EnsembleModelsVisualization() {
  const { data, isLoading, isError, error } = useEnsembleModels();

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
            : "Failed to load ensemble models data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Process data for charts - assuming data structure with multiple ensemble members
  const temperatureData = data.hourly.time.map((time, index) => {
    const entry: any = { time };

    // Add data for each ensemble member
    Object.keys(data.hourly).forEach((key) => {
      if (
        key.includes("temperature_2m_member") &&
        Array.isArray(data.hourly[key])
      ) {
        entry[key] = data.hourly[key][index];
      }
    });

    return entry;
  });

  // Get ensemble member names for the legend
  const memberNames = Object.keys(data.hourly).filter((key) =>
    key.includes("temperature_2m_member")
  );

  // Generate colors for each ensemble member
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
    "#8dd1e1",
    "#83a6ed",
    "#8a2be2",
    "#b22222",
    "#32cd32",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ensemble Weather Forecast</CardTitle>
          <CardDescription>
            Temperature forecasts from multiple ensemble members in{" "}
            {data.hourly_units.temperature_2m}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) =>
                    format(parseISO(time), "MMM d, HH:mm")
                  }
                  interval={12}
                />
                <YAxis
                  label={{
                    value: data.hourly_units.temperature_2m,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) =>
                    format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")
                  }
                  formatter={(value, name) => {
                    const memberName =
                      typeof name === "string"
                        ? `Member ${name.replace("temperature_2m_member", "")}`
                        : name;
                    return [
                      `${value} ${data.hourly_units.temperature_2m}`,
                      memberName,
                    ];
                  }}
                />
                <Legend />
                {memberNames.map((member, index) => (
                  <Line
                    key={member}
                    type="monotone"
                    dataKey={member}
                    stroke={colors[index % colors.length]}
                    dot={false}
                    name={`Member ${member.replace(
                      "temperature_2m_member",
                      ""
                    )}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Ensemble Forecasts</CardTitle>
          <CardDescription>
            Understanding ensemble weather prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Ensemble forecasting is a method used in weather prediction where
              multiple forecasts are created to account for the uncertainty in
              the initial conditions and model physics.
            </p>
            <p>
              Each line in the chart represents a different ensemble member - a
              separate forecast run with slightly different initial conditions
              or model parameters.
            </p>
            <p>
              When ensemble members show similar forecasts (lines close
              together), there is higher confidence in the prediction. When they
              diverge significantly, there is greater uncertainty.
            </p>
            <div className="mt-4">
              <h4 className="font-medium">Benefits of Ensemble Forecasting:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provides a range of possible outcomes</li>
                <li>Quantifies forecast uncertainty</li>
                <li>Helps identify extreme weather possibilities</li>
                <li>
                  Improves decision-making for weather-dependent activities
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
