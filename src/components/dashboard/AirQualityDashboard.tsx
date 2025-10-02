import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  Satellite,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Download,
  Share,
  Info,
  Zap,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  status: "good" | "moderate" | "unhealthy" | "hazardous";
  trend: "improving" | "stable" | "worsening";
  lastUpdated: string;
  source: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
}
interface HealthRecommendation {
  level: "low" | "moderate" | "high" | "very_high";
  message: string;
  recommendations: string[];
  sensitiveGroups: string[];
}

interface HistoricalData {
  timestamp: string;
  aqi: number;
  pm25: number;
  temperature: number;
}

export function AirQualityDashboard() {
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 40.7128,
    longitude: -74.006,
    city: "New York",
    country: "USA",
  });

  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [healthRecommendation, setHealthRecommendation] =
    useState<HealthRecommendation | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAirQualityData();
    if (autoRefresh) {
      const interval = setInterval(loadAirQualityData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, currentLocation]);

  const loadAirQualityData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls with realistic data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAQI = Math.floor(Math.random() * 200) + 20;
      const mockPM25 = Math.floor(Math.random() * 50) + 5;

      setAirQuality({
        aqi: mockAQI,
        pm25: mockPM25,
        pm10: Math.floor(Math.random() * 80) + 10,
        no2: Math.floor(Math.random() * 40) + 10,
        so2: Math.floor(Math.random() * 20) + 2,
        o3: Math.floor(Math.random() * 60) + 20,
        co: Math.floor(Math.random() * 15) + 1,
        status:
          mockAQI <= 50
            ? "good"
            : mockAQI <= 100
            ? "moderate"
            : mockAQI <= 150
            ? "unhealthy"
            : "hazardous",
        trend:
          Math.random() > 0.5
            ? "improving"
            : Math.random() > 0.5
            ? "stable"
            : "worsening",
        lastUpdated: new Date().toISOString(),
        source: "NASA + OpenAQ APIs",
      });

      setWeather({
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 2,
        windDirection: Math.floor(Math.random() * 360),
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 10) + 5,
        uvIndex: Math.floor(Math.random() * 11),
        cloudCover: Math.floor(Math.random() * 100),
      });

      // Generate health recommendations
      setHealthRecommendation(generateHealthRecommendation(mockAQI));

      // Generate historical data
      const historical = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(
          Date.now() - (23 - i) * 60 * 60 * 1000
        ).toISOString(),
        aqi: Math.floor(Math.random() * 100) + 20,
        pm25: Math.floor(Math.random() * 30) + 5,
        temperature: Math.floor(Math.random() * 20) + 10,
      }));
      setHistoricalData(historical);

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading air quality data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHealthRecommendation = (aqi: number): HealthRecommendation => {
    if (aqi <= 50) {
      return {
        level: "low",
        message: "Air quality is good. Perfect for outdoor activities!",
        recommendations: [
          "Great day for outdoor exercise",
          "Enjoy activities like jogging, cycling, or sports",
          "Windows can be opened for fresh air",
        ],
        sensitiveGroups: ["No restrictions for any groups"],
      };
    } else if (aqi <= 100) {
      return {
        level: "moderate",
        message: "Air quality is acceptable for most people.",
        recommendations: [
          "Outdoor activities are generally safe",
          "Sensitive individuals should monitor symptoms",
          "Consider reducing prolonged outdoor exertion",
        ],
        sensitiveGroups: [
          "People with respiratory conditions",
          "Children",
          "Elderly",
        ],
      };
    } else if (aqi <= 150) {
      return {
        level: "high",
        message: "Air quality is unhealthy for sensitive groups.",
        recommendations: [
          "Limit prolonged outdoor activities",
          "Consider wearing masks outdoors",
          "Keep windows closed",
          "Use air purifiers indoors",
        ],
        sensitiveGroups: [
          "Children",
          "Elderly",
          "People with heart/lung disease",
          "Pregnant women",
        ],
      };
    } else {
      return {
        level: "very_high",
        message: "Air quality is unhealthy for everyone.",
        recommendations: [
          "Avoid outdoor activities",
          "Stay indoors with windows closed",
          "Use air purifiers",
          "Wear N95 masks if you must go outside",
          "Seek medical attention if experiencing symptoms",
        ],
        sensitiveGroups: ["Everyone should take precautions"],
      };
    }
  };
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400 bg-green-500/20 border-green-500/50";
    if (aqi <= 100)
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    if (aqi <= 150)
      return "text-orange-400 bg-orange-500/20 border-orange-500/50";
    return "text-red-400 bg-red-500/20 border-red-500/50";
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    return "Unhealthy";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "worsening":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getHealthLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "moderate":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/50";
      case "very_high":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            🌬️ Air Quality Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time air quality monitoring and health recommendations
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">
              {currentLocation.city}, {currentLocation.country}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="text-sm text-white">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <Button
            onClick={loadAirQualityData}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={
              autoRefresh
                ? "border-green-500 text-green-400"
                : "border-gray-600 text-gray-400"
            }
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto: {autoRefresh ? "ON" : "OFF"}
          </Button>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pollutants">Pollutants</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              {/* Main AQI Card */}
              {airQuality && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="glass-morphism glow-border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-6 h-6 text-cyan-400" />
                          <span>Air Quality Index</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(airQuality.trend)}
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            <Satellite className="w-3 h-3 mr-1" />
                            {airQuality.source}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.8 }}
                          className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getAQIColor(
                            airQuality.aqi
                          )} mb-4`}
                        >
                          <span className="text-4xl font-bold">
                            {airQuality.aqi}
                          </span>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {getAQIStatus(airQuality.aqi)}
                        </h3>
                        <p className="text-gray-400">
                          Last updated:{" "}
                          {new Date(airQuality.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Weather and Environmental Conditions */}
              {weather && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="glass-morphism">
                      <CardContent className="p-4 text-center">
                        <Thermometer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400">
                          {weather.temperature}°C
                        </div>
                        <div className="text-sm text-gray-400">Temperature</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="glass-morphism">
                      <CardContent className="p-4 text-center">
                        <Droplets className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-cyan-400">
                          {weather.humidity}%
                        </div>
                        <div className="text-sm text-gray-400">Humidity</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="glass-morphism">
                      <CardContent className="p-4 text-center">
                        <Wind className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-400">
                          {weather.windSpeed} m/s
                        </div>
                        <div className="text-sm text-gray-400">Wind Speed</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="glass-morphism">
                      <CardContent className="p-4 text-center">
                        <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-400">
                          {weather.visibility} km
                        </div>
                        <div className="text-sm text-gray-400">Visibility</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        {/* Pollutants Tab */}
        <TabsContent value="pollutants" className="space-y-6">
          {airQuality && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "PM2.5",
                  value: airQuality.pm25,
                  unit: "μg/m³",
                  color: "text-orange-400",
                  limit: 25,
                },
                {
                  name: "PM10",
                  value: airQuality.pm10,
                  unit: "μg/m³",
                  color: "text-red-400",
                  limit: 50,
                },
                {
                  name: "NO₂",
                  value: airQuality.no2,
                  unit: "ppb",
                  color: "text-purple-400",
                  limit: 40,
                },
                {
                  name: "SO₂",
                  value: airQuality.so2,
                  unit: "ppb",
                  color: "text-yellow-400",
                  limit: 20,
                },
                {
                  name: "O₃",
                  value: airQuality.o3,
                  unit: "ppb",
                  color: "text-blue-400",
                  limit: 70,
                },
                {
                  name: "CO",
                  value: airQuality.co,
                  unit: "ppm",
                  color: "text-green-400",
                  limit: 9,
                },
              ].map((pollutant, index) => (
                <motion.div
                  key={pollutant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{pollutant.name}</span>
                        <Badge
                          className={
                            pollutant.value > pollutant.limit
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }
                        >
                          {pollutant.value > pollutant.limit
                            ? "High"
                            : "Normal"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div
                          className={`text-3xl font-bold ${pollutant.color}`}
                        >
                          {pollutant.value.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {pollutant.unit}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">WHO Limit</span>
                          <span className="text-white">
                            {pollutant.limit} {pollutant.unit}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            (pollutant.value / pollutant.limit) * 100,
                            100
                          )}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          {healthRecommendation && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-morphism glow-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span>Health Advisory</span>
                      <Badge
                        className={getHealthLevelColor(
                          healthRecommendation.level
                        )}
                      >
                        {healthRecommendation.level
                          .replace("_", " ")
                          .toUpperCase()}{" "}
                        RISK
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-lg text-blue-300 font-medium">
                        {healthRecommendation.message}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {healthRecommendation.recommendations.map(
                          (rec, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">{rec}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Sensitive Groups
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {healthRecommendation.sensitiveGroups.map(
                          (group, index) => (
                            <Badge
                              key={index}
                              className="bg-orange-500/20 text-orange-400 border-orange-500/50"
                            >
                              {group}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-purple-400" />
                  <span>24-Hour Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Historical trend chart would be displayed here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Showing AQI, PM2.5, and temperature trends over the last
                      24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">12%</div>
                <div className="text-sm text-gray-400">
                  Better than yesterday
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">6h</div>
                <div className="text-sm text-gray-400">Peak pollution time</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">85</div>
                <div className="text-sm text-gray-400">Weekly average AQI</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
