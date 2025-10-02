import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  Navigation,
  Globe,
  Crosshair,
  Star,
  Clock,
  TrendingUp,
  Wind,
  Thermometer,
  Eye,
  Satellite,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  currentLocation: Location | null;
}

interface LocationData {
  location: Location;
  aqi: number;
  temperature: number;
  population: number;
  lastUpdated: string;
  trending: boolean;
  featured: boolean;
}

const featuredLocations: LocationData[] = [
  {
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      city: "New York",
      country: "USA",
    },
    aqi: 85,
    temperature: 22,
    population: 8400000,
    lastUpdated: new Date().toISOString(),
    trending: true,
    featured: true,
  },
  {
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      city: "Los Angeles",
      country: "USA",
    },
    aqi: 120,
    temperature: 28,
    population: 3900000,
    lastUpdated: new Date().toISOString(),
    trending: false,
    featured: true,
  },
  {
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      city: "London",
      country: "UK",
    },
    aqi: 65,
    temperature: 18,
    population: 9000000,
    lastUpdated: new Date().toISOString(),
    trending: true,
    featured: true,
  },
  {
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: "Paris",
      country: "France",
    },
    aqi: 72,
    temperature: 20,
    population: 2200000,
    lastUpdated: new Date().toISOString(),
    trending: false,
    featured: true,
  },
  {
    location: {
      latitude: 35.6762,
      longitude: 139.6503,
      city: "Tokyo",
      country: "Japan",
    },
    aqi: 95,
    temperature: 25,
    population: 13900000,
    lastUpdated: new Date().toISOString(),
    trending: true,
    featured: true,
  },
  {
    location: {
      latitude: 28.6139,
      longitude: 77.209,
      city: "Delhi",
      country: "India",
    },
    aqi: 180,
    temperature: 32,
    population: 32900000,
    lastUpdated: new Date().toISOString(),
    trending: true,
    featured: true,
  },
  {
    location: {
      latitude: 39.9042,
      longitude: 116.4074,
      city: "Beijing",
      country: "China",
    },
    aqi: 155,
    temperature: 24,
    population: 21500000,
    lastUpdated: new Date().toISOString(),
    trending: false,
    featured: true,
  },
  {
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      city: "São Paulo",
      country: "Brazil",
    },
    aqi: 110,
    temperature: 26,
    population: 12300000,
    lastUpdated: new Date().toISOString(),
    trending: true,
    featured: true,
  },
];

const recentLocations: LocationData[] = [
  {
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: "San Francisco",
      country: "USA",
    },
    aqi: 78,
    temperature: 19,
    population: 875000,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    trending: false,
    featured: false,
  },
  {
    location: {
      latitude: 55.7558,
      longitude: 37.6176,
      city: "Moscow",
      country: "Russia",
    },
    aqi: 88,
    temperature: 15,
    population: 12500000,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    trending: false,
    featured: false,
  },
  {
    location: {
      latitude: -33.8688,
      longitude: 151.2093,
      city: "Sydney",
      country: "Australia",
    },
    aqi: 45,
    temperature: 23,
    population: 5300000,
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    trending: false,
    featured: false,
  },
];

export function LocationSelector({
  onLocationSelect,
  currentLocation,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] =
    useState<LocationData[]>(featuredLocations);
  const [selectedCategory, setSelectedCategory] = useState<
    "featured" | "recent" | "search"
  >("featured");

  useEffect(() => {
    if (searchQuery.trim()) {
      setSelectedCategory("search");
      const filtered = [...featuredLocations, ...recentLocations].filter(
        (locationData) =>
          locationData.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          locationData.location.country
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setSelectedCategory("featured");
      setFilteredLocations(featuredLocations);
    }
  }, [searchQuery]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Current Location",
            country: "Auto-detected",
          };
          setUserLocation(location);
          onLocationSelect(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
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

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    }
    if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
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
          📍 Location Explorer
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Choose a location to explore air quality data and start missions
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for cities or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-gray-800/50 border-gray-600 text-white text-lg h-12"
          />
        </div>

        {/* Current Location Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 mb-6"
        >
          {isLoadingLocation ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Navigation className="w-4 h-4 mr-2" />
          )}
          {isLoadingLocation
            ? "Getting Location..."
            : "Use My Current Location"}
        </Button>
      </motion.div>

      {/* Current Location Display */}
      {currentLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="glass-morphism glow-border max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center">
                <Crosshair className="w-5 h-5 text-cyan-400" />
                <span>Selected Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentLocation.city}
              </h3>
              <p className="text-gray-400 mb-4">{currentLocation.country}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Latitude</p>
                  <p className="text-white font-mono">
                    {currentLocation.latitude.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Longitude</p>
                  <p className="text-white font-mono">
                    {currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <Button
          variant={selectedCategory === "featured" ? "default" : "outline"}
          onClick={() => {
            setSelectedCategory("featured");
            setFilteredLocations(featuredLocations);
            setSearchQuery("");
          }}
          className={
            selectedCategory === "featured"
              ? "bg-cyan-500 hover:bg-cyan-600"
              : "border-gray-600 text-gray-400"
          }
        >
          <Star className="w-4 h-4 mr-2" />
          Featured
        </Button>
        <Button
          variant={selectedCategory === "recent" ? "default" : "outline"}
          onClick={() => {
            setSelectedCategory("recent");
            setFilteredLocations(recentLocations);
            setSearchQuery("");
          }}
          className={
            selectedCategory === "recent"
              ? "bg-cyan-500 hover:bg-cyan-600"
              : "border-gray-600 text-gray-400"
          }
        >
          <Clock className="w-4 h-4 mr-2" />
          Recent
        </Button>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredLocations.map((locationData, index) => (
            <motion.div
              key={`${locationData.location.city}-${locationData.location.country}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="glass-morphism glow-border hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer group"
                onClick={() => onLocationSelect(locationData.location)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-100 group-hover:text-cyan-400 transition-colors flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{locationData.location.city}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        {locationData.location.country}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {locationData.trending && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {locationData.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg bg-gray-800/30">
                      <Badge
                        className={`${getAQIColor(
                          locationData.aqi
                        )} text-xs mb-1`}
                      >
                        AQI
                      </Badge>
                      <div className="text-lg font-bold text-white">
                        {locationData.aqi}
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gray-800/30">
                      <div className="flex items-center justify-center mb-1">
                        <Thermometer className="w-3 h-3 text-blue-400 mr-1" />
                        <span className="text-xs text-gray-400">TEMP</span>
                      </div>
                      <div className="text-lg font-bold text-blue-400">
                        {locationData.temperature}°C
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-purple-400" />
                        <span className="text-gray-400">Population</span>
                      </div>
                      <span className="text-purple-400 font-medium">
                        {formatPopulation(locationData.population)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Satellite className="w-3 h-3 text-cyan-400" />
                        <span className="text-gray-400">Data Status</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        Live
                      </Badge>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="text-xs text-gray-500 text-center font-mono bg-gray-800/20 p-2 rounded">
                    {locationData.location.latitude.toFixed(4)},{" "}
                    {locationData.location.longitude.toFixed(4)}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLocationSelect(locationData.location);
                    }}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Explore Location
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredLocations.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No locations found
          </h3>
          <p className="text-gray-400 mb-4">
            Try searching for a different city or country name
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            Clear Search
          </Button>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-center text-gradient">
              Global Air Quality Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {featuredLocations.filter((l) => l.aqi <= 50).length}
                </div>
                <div className="text-sm text-gray-400">Good AQI</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {
                    featuredLocations.filter((l) => l.aqi > 50 && l.aqi <= 100)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-400">Moderate AQI</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {
                    featuredLocations.filter((l) => l.aqi > 100 && l.aqi <= 150)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-400">Unhealthy AQI</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {featuredLocations.filter((l) => l.aqi > 150).length}
                </div>
                <div className="text-sm text-gray-400">Hazardous AQI</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
