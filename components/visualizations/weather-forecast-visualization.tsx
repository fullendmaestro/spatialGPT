"use client";

import { useWeatherForecast } from "@/hooks/use-weather-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";

export function WeatherForecastVisualization() {
  const { data, isLoading, isError, error } = useWeatherForecast();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
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
            : "Failed to load weather forecast data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Process hourly data for charts
  const hourlyData = data.hourly.time.map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    precipitation: data.hourly.precipitation[index],
    humidity: data.hourly.relative_humidity_2m[index],
    windSpeed: data.hourly.wind_speed_10m[index],
    windDirection: data.hourly.wind_direction_10m[index],
  }));

  // Process daily data for charts
  const dailyData = data.daily.time.map((time, index) => ({
    time,
    maxTemperature: data.daily.temperature_2m_max[index],
    minTemperature: data.daily.temperature_2m_min[index],
    precipitation: data.daily.precipitation_sum[index],
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hourly">
        <TabsList>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-6">
          {/* Temperature Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Temperature</CardTitle>
              <CardDescription>
                Hourly temperature forecast in{" "}
                {data.hourly_units.temperature_2m}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
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
                      formatter={(value, name) => [
                        `${value} ${data.hourly_units.temperature_2m}`,
                        "Temperature",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                      name="Temperature"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Precipitation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Precipitation</CardTitle>
              <CardDescription>
                Hourly precipitation forecast in{" "}
                {data.hourly_units.precipitation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
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
                        value: data.hourly_units.precipitation,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")
                      }
                      formatter={(value, name) => [
                        `${value} ${data.hourly_units.precipitation}`,
                        "Precipitation",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="precipitation"
                      fill="#8884d8"
                      name="Precipitation"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Wind Speed Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Wind Speed</CardTitle>
              <CardDescription>
                Hourly wind speed forecast in {data.hourly_units.wind_speed_10m}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
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
                        value: data.hourly_units.wind_speed_10m,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        format(parseISO(label), "EEEE, MMM d, yyyy HH:mm")
                      }
                      formatter={(value, name) => [
                        `${value} ${data.hourly_units.wind_speed_10m}`,
                        "Wind Speed",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#82ca9d"
                      name="Wind Speed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          {/* Daily Temperature Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Temperature</CardTitle>
              <CardDescription>
                Daily min/max temperature forecast in{" "}
                {data.daily_units.temperature_2m_max}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(time) => format(parseISO(time), "MMM d")}
                    />
                    <YAxis
                      label={{
                        value: data.daily_units.temperature_2m_max,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        format(parseISO(label), "EEEE, MMM d, yyyy")
                      }
                      formatter={(value, name) => [
                        `${value} ${data.daily_units.temperature_2m_max}`,
                        name === "maxTemperature"
                          ? "Max Temperature"
                          : "Min Temperature",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="maxTemperature"
                      stroke="#ff7300"
                      name="Max Temperature"
                    />
                    <Line
                      type="monotone"
                      dataKey="minTemperature"
                      stroke="#0088fe"
                      name="Min Temperature"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Precipitation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Precipitation</CardTitle>
              <CardDescription>
                Daily precipitation sum in {data.daily_units.precipitation_sum}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(time) => format(parseISO(time), "MMM d")}
                    />
                    <YAxis
                      label={{
                        value: data.daily_units.precipitation_sum,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        format(parseISO(label), "EEEE, MMM d, yyyy")
                      }
                      formatter={(value, name) => [
                        `${value} ${data.daily_units.precipitation_sum}`,
                        "Precipitation",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="precipitation"
                      fill="#8884d8"
                      name="Precipitation"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
