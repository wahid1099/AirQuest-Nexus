import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Satellite,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Share,
  Filter,
  Calendar,
  MapPin,
  Zap,
  Eye,
  Wind,
  Thermometer,
  CloudRain,
  Sun,
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

interface NASADashboardProps {
  currentLocation: Location | null;
}

interface SatelliteData {
  name: string;
  status: "active" | "maintenance" | "offline";
  lastUpdate: string;
  coverage: number;
  dataQuality: number;
  measurements: {
    parameter: string;
    value: number;
    unit: string;
    trend: "up" | "down" | "stable";
    quality: "excellent" | "good" | "fair" | "poor";
  }[];
}

interface APIStatus {
  name: string;
  endpoint: string;
  status: "online" | "offline" | "degraded";
  responseTime: number;
  lastCheck: string;
  successRate: number;
}

export function NASADashboard({ currentLocation }: NASADashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([
    {
      name: "MODIS (Terra/Aqua)",
      status: "active",
      lastUpdate: new Date().toISOString(),
      coverage: 95,
      dataQuality: 92,
      measurements: [
        {
          parameter: "Aerosol Optical Depth",
          value: 0.15,
          unit: "",
          trend: "stable",
          quality: "excellent",
        },
        {
          parameter: "Cloud Cover",
          value: 45,
          unit: "%",
          trend: "down",
          quality: "good",
        },
        {
          parameter: "Land Surface Temperature",
          value: 22.5,
          unit: "°C",
          trend: "up",
          quality: "excellent",
        },
        {
          parameter: "Fire Hotspots",
          value: 12,
          unit: "count",
          trend: "down",
          quality: "good",
        },
      ],
    },
    {
      name: "OMI (Aura)",
      status: "active",
      lastUpdate: new Date().toISOString(),
      coverage: 88,
      dataQuality: 89,
      measurements: [
        {
          parameter: "NO₂ Column",
          value: 2.8e15,
          unit: "molec/cm²",
          trend: "down",
          quality: "good",
        },
        {
          parameter: "O₃ Column",
          value: 285,
          unit: "DU",
          trend: "stable",
          quality: "excellent",
        },
        {
          parameter: "SO₂ Column",
          value: 1.2e15,
          unit: "molec/cm²",
          trend: "stable",
          quality: "fair",
        },
        {
          parameter: "UV Index",
          value: 6.2,
          unit: "",
          trend: "up",
          quality: "excellent",
        },
      ],
    },
    {
      name: "TEMPO",
      status: "active",
      lastUpdate: new Date().toISOString(),
      coverage: 78,
      dataQuality: 94,
      measurements: [
        {
          parameter: "NO₂ Hourly",
          value: 15.2,
          unit: "ppb",
          trend: "down",
          quality: "excellent",
        },
        {
          parameter: "O₃ Hourly",
          value: 42.8,
          unit: "ppb",
          trend: "up",
          quality: "good",
        },
        {
          parameter: "HCHO Column",
          value: 8.5e15,
          unit: "molec/cm²",
          trend: "stable",
          quality: "good",
        },
        {
          parameter: "Aerosol Index",
          value: 0.8,
          unit: "",
          trend: "down",
          quality: "excellent",
        },
      ],
    },
    {
      name: "VIIRS (Suomi NPP)",
      status: "active",
      lastUpdate: new Date().toISOString(),
      coverage: 91,
      dataQuality: 87,
      measurements: [
        {
          parameter: "Active Fires",
          value: 8,
          unit: "count",
          trend: "down",
          quality: "good",
        },
        {
          parameter: "Night Lights",
          value: 125,
          unit: "nW/cm²/sr",
          trend: "stable",
          quality: "excellent",
        },
        {
          parameter: "Vegetation Index",
          value: 0.65,
          unit: "",
          trend: "up",
          quality: "good",
        },
        {
          parameter: "Sea Surface Temperature",
          value: 18.2,
          unit: "°C",
          trend: "up",
          quality: "excellent",
        },
      ],
    },
    {
      name: "CALIPSO",
      status: "maintenance",
      lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      coverage: 45,
      dataQuality: 78,
      measurements: [
        {
          parameter: "Aerosol Profile",
          value: 0.12,
          unit: "km⁻¹",
          trend: "stable",
          quality: "fair",
        },
        {
          parameter: "Cloud Top Height",
          value: 8.5,
          unit: "km",
          trend: "down",
          quality: "good",
        },
        {
          parameter: "Dust Layer Thickness",
          value: 2.1,
          unit: "km",
          trend: "up",
          quality: "fair",
        },
      ],
    },
  ]);

  const [apiStatus, setApiStatus] = useState<APIStatus[]>([
    {
      name: "NASA FIRMS",
      endpoint: "https://firms.modaps.eosdis.nasa.gov/api",
      status: "online",
      responseTime: 245,
      lastCheck: new Date().toISOString(),
      successRate: 98.5,
    },
    {
      name: "NASA Power",
      endpoint: "https://power.larc.nasa.gov/api",
      status: "online",
      responseTime: 180,
      lastCheck: new Date().toISOString(),
      successRate: 99.2,
    },
    {
      name: "OpenAQ",
      endpoint: "https://api.openaq.org/v2",
      status: "online",
      responseTime: 320,
      lastCheck: new Date().toISOString(),
      successRate: 96.8,
    },
    {
      name: "AirNow",
      endpoint: "https://www.airnowapi.org",
      status: "degraded",
      responseTime: 850,
      lastCheck: new Date().toISOString(),
      successRate: 89.3,
    },
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const refreshData = async () => {
    setIsLoading(true);

    // Simulate API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update satellite data with slight variations
    setSatelliteData((prev) =>
      prev.map((satellite) => ({
        ...satellite,
        lastUpdate: new Date().toISOString(),
        coverage: Math.max(
          0,
          Math.min(100, satellite.coverage + (Math.random() - 0.5) * 5)
        ),
        dataQuality: Math.max(
          0,
          Math.min(100, satellite.dataQuality + (Math.random() - 0.5) * 3)
        ),
        measurements: satellite.measurements.map((measurement) => ({
          ...measurement,
          value: measurement.value * (1 + (Math.random() - 0.5) * 0.1),
          trend:
            Math.random() > 0.7
              ? Math.random() > 0.5
                ? "up"
                : "down"
              : measurement.trend,
        })),
      }))
    );

    // Update API status
    setApiStatus((prev) =>
      prev.map((api) => ({
        ...api,
        responseTime: Math.max(
          50,
          api.responseTime + (Math.random() - 0.5) * 100
        ),
        lastCheck: new Date().toISOString(),
        successRate: Math.max(
          80,
          Math.min(100, api.successRate + (Math.random() - 0.5) * 2)
        ),
      }))
    );

    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "online":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "maintenance":
      case "degraded":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "offline":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "fair":
        return "text-yellow-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-gray-400";
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
            🛰️ NASA Data Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time monitoring of NASA Earth observation systems
          </p>
          {currentLocation && (
            <div className="flex items-center space-x-2 mt-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400">
                {currentLocation.city}, {currentLocation.country}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="text-sm text-white">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <Button
            onClick={refreshData}
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
          <TabsTrigger value="satellites">Satellites</TabsTrigger>
          <TabsTrigger value="apis">API Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-morphism">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Active Satellites</p>
                    <p className="text-2xl font-bold text-green-400">
                      {
                        satelliteData.filter((s) => s.status === "active")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Avg Data Quality</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.round(
                        satelliteData.reduce(
                          (sum, s) => sum + s.dataQuality,
                          0
                        ) / satelliteData.length
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Global Coverage</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {Math.round(
                        satelliteData.reduce((sum, s) => sum + s.coverage, 0) /
                          satelliteData.length
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">API Uptime</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {Math.round(
                        apiStatus.reduce(
                          (sum, api) => sum + api.successRate,
                          0
                        ) / apiStatus.length
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Measurements */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span>Latest Measurements</span>
                {currentLocation && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                    {currentLocation.city}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {satelliteData
                  .filter((s) => s.status === "active")
                  .slice(0, 2)
                  .flatMap((satellite) =>
                    satellite.measurements.slice(0, 2).map((measurement) => (
                      <div
                        key={`${satellite.name}-${measurement.parameter}`}
                        className="p-4 rounded-lg bg-gray-800/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            {measurement.parameter}
                          </span>
                          {getTrendIcon(measurement.trend)}
                        </div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-lg font-bold text-white">
                            {typeof measurement.value === "number" &&
                            measurement.value > 1000
                              ? measurement.value.toExponential(2)
                              : measurement.value.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-400">
                            {measurement.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {satellite.name}
                          </span>
                          <Badge
                            className={`text-xs ${getQualityColor(
                              measurement.quality
                            )} bg-transparent border`}
                          >
                            {measurement.quality}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Satellites Tab */}
        <TabsContent value="satellites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {satelliteData.map((satellite) => (
              <motion.div
                key={satellite.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-morphism glow-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Satellite className="w-5 h-5 text-purple-400" />
                        <span>{satellite.name}</span>
                      </CardTitle>
                      <Badge className={getStatusColor(satellite.status)}>
                        {satellite.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Coverage
                          </span>
                          <span className="text-sm text-white">
                            {satellite.coverage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={satellite.coverage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Data Quality
                          </span>
                          <span className="text-sm text-white">
                            {satellite.dataQuality.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={satellite.dataQuality}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">
                        Recent Measurements
                      </h4>
                      {satellite.measurements.map((measurement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded bg-gray-800/30"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">
                              {measurement.parameter}
                            </span>
                            {getTrendIcon(measurement.trend)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">
                              {typeof measurement.value === "number" &&
                              measurement.value > 1000
                                ? measurement.value.toExponential(2)
                                : measurement.value.toFixed(1)}{" "}
                              {measurement.unit}
                            </span>
                            <Badge
                              className={`text-xs ${getQualityColor(
                                measurement.quality
                              )} bg-transparent border`}
                            >
                              {measurement.quality}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-400 text-center">
                      Last updated:{" "}
                      {new Date(satellite.lastUpdate).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* API Status Tab */}
        <TabsContent value="apis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apiStatus.map((api) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-morphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <span>{api.name}</span>
                      </CardTitle>
                      <Badge className={getStatusColor(api.status)}>
                        {api.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400 font-mono bg-gray-800/30 p-2 rounded">
                      {api.endpoint}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Response Time</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {api.responseTime}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <p className="text-lg font-bold text-green-400">
                          {api.successRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Uptime</span>
                        <span className="text-sm text-white">
                          {api.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={api.successRate} className="h-2" />
                    </div>

                    <div className="text-xs text-gray-400 text-center">
                      Last checked: {new Date(api.lastCheck).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Performance */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>System Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Overall Health
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      94.2%
                    </span>
                  </div>
                  <Progress value={94.2} className="h-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Data Freshness
                    </span>
                    <span className="text-lg font-bold text-blue-400">
                      98.7%
                    </span>
                  </div>
                  <Progress value={98.7} className="h-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      API Reliability
                    </span>
                    <span className="text-lg font-bold text-purple-400">
                      96.1%
                    </span>
                  </div>
                  <Progress value={96.1} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>Data Usage (24h)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-cyan-400">
                      2.4TB
                    </div>
                    <div className="text-sm text-gray-400">Data Processed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-green-400">
                      15.2K
                    </div>
                    <div className="text-sm text-gray-400">API Requests</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-purple-400">
                      847
                    </div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-orange-400">
                      99.2%
                    </div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts and Notifications */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-400">
                      CALIPSO Maintenance
                    </p>
                    <p className="text-xs text-gray-400">
                      Scheduled maintenance affecting data quality
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400">
                      TEMPO Data Quality Improved
                    </p>
                    <p className="text-xs text-gray-400">
                      Calibration update completed successfully
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">4h ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-400">
                      New MODIS Data Available
                    </p>
                    <p className="text-xs text-gray-400">
                      Latest fire detection data processed
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">6h ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
