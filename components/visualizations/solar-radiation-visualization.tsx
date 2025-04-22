"use client";

import { useSolarRadiation } from "@/hooks/use-weather-data";
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { format, parseISO } from "date-fns";

export function SolarRadiationVisualization() {
  const { data, isLoading, isError, error } = useSolarRadiation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
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
            : "Failed to load solar radiation data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Process data for charts
  const radiationData = data.hourly.time.map((time, index) => ({
    time,
    shortwave: data.hourly.shortwave_radiation[index],
    direct: data.hourly.direct_radiation[index],
    diffuse: data.hourly.diffuse_radiation[index],
  }));

  return (
    <div className="space-y-6">
      {/* Solar Radiation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Solar Radiation</CardTitle>
          <CardDescription>Solar radiation components in W/m²</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={radiationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => format(parseISO(time), "HH:mm")}
                  interval={2}
                />
                <YAxis
                  label={{
                    value: "W/m²",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) =>
                    format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")
                  }
                  formatter={(value, name) => [
                    `${value} W/m²`,
                    name === "shortwave"
                      ? "Shortwave Radiation"
                      : name === "direct"
                      ? "Direct Radiation"
                      : "Diffuse Radiation",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="shortwave"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                  name="Shortwave Radiation"
                />
                <Area
                  type="monotone"
                  dataKey="direct"
                  stroke="#ff7300"
                  fill="#ff7300"
                  fillOpacity={0.3}
                  name="Direct Radiation"
                />
                <Area
                  type="monotone"
                  dataKey="diffuse"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Diffuse Radiation"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Solar Radiation Information */}
      <Card>
        <CardHeader>
          <CardTitle>Solar Radiation Information</CardTitle>
          <CardDescription>
            Understanding solar radiation measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Shortwave Radiation</h4>
              <p className="text-muted-foreground">
                The total solar radiation reaching the Earth&apos;s surface,
                including both direct and diffuse components.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Direct Radiation</h4>
              <p className="text-muted-foreground">
                Solar radiation that comes directly from the sun without being
                scattered by the atmosphere.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Diffuse Radiation</h4>
              <p className="text-muted-foreground">
                Solar radiation that has been scattered by molecules and
                particles in the atmosphere but still reaches the Earth&apos;s
                surface.
              </p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Applications:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Solar power generation</li>
                <li>Agriculture and plant growth</li>
                <li>Building energy efficiency</li>
                <li>Climate modeling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
