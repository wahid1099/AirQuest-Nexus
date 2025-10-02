import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Wifi,
  WifiOff,
  RefreshCw,
  Pause,
  Play,
  Download,
  Share2,
  Maximize2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AirQualityData, WeatherData } from "../../types";
import { offlineService } from "../../services/offlineService";

interface RealTimeChartProps {
  data: AirQualityData[];
  weatherData?: WeatherData[];
  title: string;
  type: "line" | "area" | "bar" | "pie";
  metric: "aqi" | "pm25" | "pm10" | "no2" | "o3" | "co" | "so2";
  height?: number;
  showControls?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  autoUpdate?: boolean;
  updateInterval?: number;
  onDataUpdate?: () => void;
}

interface ChartDataPoint {
  timestamp: string;
  time: string;
  value: number;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  category?: string;
  color?: string;
}

const AQI_COLORS = {
  good: "#00E400",
  moderate: "#FFFF00",
  unhealthy_sensitive: "#FF7E00",
  unhealthy: "#FF0000",
  very_unhealthy: "#8F3F97",
  hazardous: "#7E0023",
};

const AQI_CATEGORIES = [
  { min: 0, max: 50, label: "Good", color: AQI_COLORS.good },
  { min: 51, max: 100, label: "Moderate", color: AQI_COLORS.moderate },
  {
    min: 101,
    max: 150,
    label: "Unhealthy for Sensitive Groups",
    color: AQI_COLORS.unhealthy_sensitive,
  },
  { min: 151, max: 200, label: "Unhealthy", color: AQI_COLORS.unhealthy },
  {
    min: 201,
    max: 300,
    label: "Very Unhealthy",
    color: AQI_COLORS.very_unhealthy,
  },
  { min: 301, max: 500, label: "Hazardous", color: AQI_COLORS.hazardous },
];

export function RealTimeChart({
  data,
  weatherData,
  title,
  type,
  metric,
  height = 300,
  showControls = true,
  showLegend = true,
  showGrid = true,
  autoUpdate = true,
  updateInterval = 30000,
  onDataUpdate,
}: RealTimeChartProps) {
  const [isPlaying, setIsPlaying] = useState(autoUpdate);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateChartData();
  }, [data, weatherData, metric]);

  useEffect(() => {
    if (isPlaying && autoUpdate) {
      intervalRef.current = setInterval(() => {
        onDataUpdate?.();
      }, updateInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoUpdate, updateInterval, onDataUpdate]);

  const updateChartData = () => {
    const processedData: ChartDataPoint[] = data.map((item, index) => {
      const weatherItem = weatherData?.[index];
      const timestamp = new Date(item.timestamp);

      const dataPoint: ChartDataPoint = {
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: item[metric] || 0,
        aqi: item.aqi,
        pm25: item.pm25,
        pm10: item.pm10,
        no2: item.no2,
        o3: item.o3,
        co: item.co,
        so2: item.so2,
        temperature: weatherItem?.temperature,
        humidity: weatherItem?.humidity,
        windSpeed: weatherItem?.windSpeed,
      };

      // Add AQI category and color for AQI-related metrics
      if (metric === "aqi" || metric === "pm25") {
        const aqiValue = metric === "aqi" ? item.aqi : item.aqi;
        const category = AQI_CATEGORIES.find(
          (cat) => aqiValue >= cat.min && aqiValue <= cat.max
        );
        dataPoint.category = category?.label || "Unknown";
        dataPoint.color = category?.color || "#666";
      }

      return dataPoint;
    });

    setChartData(processedData);

    // Calculate trend
    if (processedData.length >= 2) {
      const recent = processedData.slice(-5);
      const avg =
        recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
      const previous = processedData.slice(-10, -5);
      const prevAvg =
        previous.length > 0
          ? previous.reduce((sum, item) => sum + item.value, 0) /
            previous.length
          : avg;

      const change = ((avg - prevAvg) / prevAvg) * 100;

      if (Math.abs(change) < 5) {
        setTrend("stable");
      } else if (change > 0) {
        setTrend("up");
      } else {
        setTrend("down");
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRefresh = () => {
    onDataUpdate?.();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Time", "Value", "AQI", "PM2.5", "PM10", "NO2", "O3", "CO", "SO2"].join(
        ","
      ),
      ...chartData.map((item) =>
        [
          item.time,
          item.value,
          item.aqi || "",
          item.pm25 || "",
          item.pm10 || "",
          item.no2 || "",
          item.o3 || "",
          item.co || "",
          item.so2 || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - CleanSpace`,
          text: `Check out this air quality data from CleanSpace!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderChart = () => {
    const chartHeight = isFullscreen ? window.innerHeight - 100 : height;

    switch (type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={chartData}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              )}
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06B6D4"
                fill="#06B6D4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              )}
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        const pieData = AQI_CATEGORIES.map((category) => ({
          name: category.label,
          value: chartData.filter(
            (item) =>
              item.aqi && item.aqi >= category.min && item.aqi <= category.max
          ).length,
          color: category.color,
        })).filter((item) => item.value > 0);

        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={chartData}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              )}
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#06B6D4", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const isOffline = offlineService.isOffline;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-gray-900" : ""}`}
    >
      <Card
        className={`${
          isFullscreen ? "h-full" : ""
        } bg-gray-900 border-gray-700`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold text-white">
              {title}
            </CardTitle>
            {getTrendIcon()}
            {isOffline && (
              <Badge
                variant="outline"
                className="text-orange-400 border-orange-400"
              >
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-lg font-bold">
              {currentValue.toFixed(1)}
            </Badge>

            {showControls && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-gray-400 hover:text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-gray-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-400 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-gray-400 hover:text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {chartData.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No data available</p>
                {isOffline && (
                  <p className="text-sm mt-2">
                    You're offline. Real-time data unavailable.
                  </p>
                )}
              </div>
            </div>
          )}

          {isOffline && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-orange-400 text-sm">
                {offlineService.getOfflineMessage()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
