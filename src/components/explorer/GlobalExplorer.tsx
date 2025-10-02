import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  MapPin,
  Satellite,
  Wind,
  Thermometer,
  Eye,
  Activity,
  Zap,
  TreePine,
  Factory,
  Car,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Search,
  Filter,
  Layers,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface GlobalExplorerProps {
  currentLocation: Location | null;
  onLocationChange: (location: Location) => void;
}

interface AirQualityData {
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  status: "good" | "moderate" | "unhealthy" | "hazardous";
  trend: "improving" | "stable" | "worsening";
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
}

interface NASAData {
  fires: number;
  vegetation: number;
  cloudCover: number;
  aerosols: number;
  lastUpdated: string;
}

const popularLocations = [
  { latitude: 40.7128, longitude: -74.006, city: "New York", country: "USA" },
  {
    latitude: 34.0522,
    longitude: -118.2437,
    city: "Los Angeles",
    country: "USA",
  },
  { latitude: 51.5074, longitude: -0.1278, city: "London", country: "UK" },
  { latitude: 48.8566, longitude: 2.3522, city: "Paris", country: "France" },
  { latitude: 35.6762, longitude: 139.6503, city: "Tokyo", country: "Japan" },
  { latitude: 28.6139, longitude: 77.209, city: "Delhi", country: "India" },
  { latitude: 39.9042, longitude: 116.4074, city: "Beijing", country: "China" },
  {
    latitude: -23.5505,
    longitude: -46.6333,
    city: "São Paulo",
    country: "Brazil",
  },
];

export function GlobalExplorer({
  currentLocation,
  onLocationChange,
}: GlobalExplorerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    currentLocation
  );
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [nasaData, setNASAData] = useState<NASAData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    airQuality: true,
    fires: true,
    weather: true,
    vegetation: false,
    population: false,
  });

  useEffect(() => {
    if (selectedLocation) {
      loadLocationData(selectedLocation);
    }
  }, [selectedLocation]);

  const loadLocationData = async (location: Location) => {
    setIsLoading(true);
    try {
      // Simulate API calls with realistic data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock air quality data
      const mockAQI = Math.floor(Math.random() * 200) + 20;
      setAirQuality({
        aqi: mockAQI,
        pm25: Math.floor(Math.random() * 50) + 5,
        no2: Math.floor(Math.random() * 40) + 10,
        o3: Math.floor(Math.random() * 60) + 20,
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
      });

      // Mock weather data
      setWeather({
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 2,
        visibility: Math.floor(Math.random() * 10) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
      });

      // Mock NASA data
      setNASAData({
        fires: Math.floor(Math.random() * 20),
        vegetation: Math.floor(Math.random() * 100) + 20,
        cloudCover: Math.floor(Math.random() * 80) + 10,
        aerosols: Math.floor(Math.random() * 100) + 10,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error loading location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationChange(location);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400 bg-green-500/20 border-green-500/50";
    if (aqi <= 100)
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    if (aqi <= 150)
      return "text-orange-400 bg-orange-500/20 border-orange-500/50";
    return "text-red-400 bg-red-500/20 border-red-500/50";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "worsening":
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">
          🌍 Global Air Quality Explorer
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Explore real-time air quality data from NASA satellites worldwide
        </p>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for a city or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowLayers(!showLayers)}
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
          <Button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    city: "Current Location",
                    country: "Auto-detected",
                  };
                  handleLocationSelect(location);
                });
              }
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Use My Location
          </Button>
        </div>
      </motion.div>

      {/* Layer Controls */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-gradient">Data Layers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(activeLayers).map(([key, active]) => (
                    <Button
                      key={key}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setActiveLayers((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof prev],
                        }))
                      }
                      className={
                        active
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : "border-gray-600 text-gray-400"
                      }
                    >
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Selector */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Location */}
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>Current Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedLocation.city}
                      </h3>
                      <p className="text-gray-400">
                        {selectedLocation.country}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Lat: {selectedLocation.latitude.toFixed(4)}</p>
                      <p>Lng: {selectedLocation.longitude.toFixed(4)}</p>
                    </div>
                    {airQuality && (
                      <div className="flex items-center space-x-2">
                        <Badge className={getAQIColor(airQuality.aqi)}>
                          AQI: {airQuality.aqi}
                        </Badge>
                        {getTrendIcon(airQuality.trend)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Popular Locations */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>Popular Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularLocations.map((location, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">
                          {location.city}
                        </p>
                        <p className="text-sm text-gray-400">
                          {location.country}
                        </p>
                      </div>
                      <div className="text-cyan-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Visualization */}
        <div className="lg:col-span-2 space-y-6">
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
              {/* Air Quality Dashboard */}
              {airQuality && activeLayers.airQuality && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-morphism glow-border">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        <span>Air Quality Data</span>
                        <Badge className={getAQIColor(airQuality.aqi)}>
                          {airQuality.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-gray-800/30">
                          <div className="text-2xl font-bold text-cyan-400">
                            {airQuality.aqi}
                          </div>
                          <div className="text-sm text-gray-400">AQI</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-800/30">
                          <div className="text-2xl font-bold text-orange-400">
                            {airQuality.pm25}
                          </div>
                          <div className="text-sm text-gray-400">PM2.5</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-800/30">
                          <div className="text-2xl font-bold text-red-400">
                            {airQuality.no2}
                          </div>
                          <div className="text-sm text-gray-400">NO₂</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-800/30">
                          <div className="text-2xl font-bold text-purple-400">
                            {airQuality.o3}
                          </div>
                          <div className="text-sm text-gray-400">O₃</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Weather Data */}
              {weather && activeLayers.weather && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wind className="w-5 h-5 text-blue-400" />
                        <span>Weather Conditions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <Thermometer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-lg font-bold text-blue-400">
                            {weather.temperature}°C
                          </div>
                          <div className="text-xs text-gray-400">
                            Temperature
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="text-lg font-bold text-cyan-400">
                            {weather.humidity}%
                          </div>
                          <div className="text-xs text-gray-400">Humidity</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <Wind className="w-6 h-6 text-green-400 mx-auto mb-2" />
                          <div className="text-lg font-bold text-green-400">
                            {weather.windSpeed} m/s
                          </div>
                          <div className="text-xs text-gray-400">
                            Wind Speed
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="text-lg font-bold text-yellow-400">
                            {weather.visibility} km
                          </div>
                          <div className="text-xs text-gray-400">
                            Visibility
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="text-lg font-bold text-purple-400">
                            {weather.pressure}
                          </div>
                          <div className="text-xs text-gray-400">
                            Pressure (hPa)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* NASA Satellite Data */}
              {nasaData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Satellite className="w-5 h-5 text-purple-400" />
                        <span>NASA Satellite Data</span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                          Live
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activeLayers.fires && (
                          <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                            <div className="text-2xl font-bold text-red-400">
                              {nasaData.fires}
                            </div>
                            <div className="text-sm text-gray-400">
                              Active Fires
                            </div>
                          </div>
                        )}
                        {activeLayers.vegetation && (
                          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                            <div className="text-2xl font-bold text-green-400">
                              {nasaData.vegetation}%
                            </div>
                            <div className="text-sm text-gray-400">
                              Vegetation
                            </div>
                          </div>
                        )}
                        <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                          <div className="text-2xl font-bold text-blue-400">
                            {nasaData.cloudCover}%
                          </div>
                          <div className="text-sm text-gray-400">
                            Cloud Cover
                          </div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                          <div className="text-2xl font-bold text-orange-400">
                            {nasaData.aerosols}
                          </div>
                          <div className="text-sm text-gray-400">Aerosols</div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                          Last updated:{" "}
                          {new Date(nasaData.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={() => (window.location.hash = "#cleanspace")}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Mission
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => (window.location.hash = "#atmosphere")}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        View 3D
                      </Button>
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                        onClick={() =>
                          (window.location.hash = "#nasa-dashboard")
                        }
                      >
                        <Satellite className="w-4 h-4 mr-2" />
                        NASA Data
                      </Button>
                      <Button
                        variant="outline"
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        onClick={() => (window.location.hash = "#leaderboard")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
