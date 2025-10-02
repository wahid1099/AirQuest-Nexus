import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  TreePine,
  Car,
  Factory,
  Building,
  Heart,
  Clock,
  Target,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
// Simple Progress component replacement
const Progress = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import {
  GameLocation,
  PlayerState,
  GameAction,
  AirQualityData,
  WeatherData,
  SimulationState,
  HealthPrecaution,
} from "../../types";
import { enhancedNasaApiService } from "../../services/enhancedNasaApiService";
import {
  SimulationEngine,
  defaultGameConfig,
} from "../../services/simulationEngine";

interface CleanSpaceGameProps {
  selectedLocation?: GameLocation;
  onLocationSelect?: (location: GameLocation) => void;
}

const mockLocations: GameLocation[] = [
  {
    id: "nyc",
    name: "New York City",
    latitude: 40.7128,
    longitude: -74.006,
    regionSize: 5,
    city: "New York",
    country: "USA",
  },
  {
    id: "la",
    name: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    regionSize: 5,
    city: "Los Angeles",
    country: "USA",
  },
  {
    id: "delhi",
    name: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    regionSize: 5,
    city: "Delhi",
    country: "India",
  },
  {
    id: "beijing",
    name: "Beijing",
    latitude: 39.9042,
    longitude: 116.4074,
    regionSize: 5,
    city: "Beijing",
    country: "China",
  },
];

const gameActions = [
  {
    id: "plant_tree",
    name: "Plant Tree",
    icon: TreePine,
    cost: 10,
    cooldown: 300,
    description: "Plant trees in empty lots to improve air quality",
    color: "text-green-500",
  },
  {
    id: "plant_rooftop_garden",
    name: "Rooftop Garden",
    icon: Building,
    cost: 15,
    cooldown: 600,
    description: "Install rooftop gardens for cleaner air",
    color: "text-emerald-500",
  },
  {
    id: "remove_vehicle",
    name: "Remove Vehicle",
    icon: Car,
    cost: 5,
    cooldown: 180,
    description: "Temporarily remove polluting vehicles",
    color: "text-blue-500",
  },
  {
    id: "shutdown_factory",
    name: "Shutdown Factory",
    icon: Factory,
    cost: 50,
    cooldown: 1800,
    description: "Shut down polluting factories",
    color: "text-red-500",
  },
  {
    id: "retrofit_factory",
    name: "Retrofit Factory",
    icon: Factory,
    cost: 100,
    cooldown: 3600,
    description: "Upgrade factories with cleaner technology",
    color: "text-orange-500",
  },
];

export function CleanSpaceGame({
  selectedLocation,
  onLocationSelect,
}: CleanSpaceGameProps) {
  const [currentLocation, setCurrentLocation] = useState<GameLocation | null>(
    selectedLocation || null
  );
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [simulationState, setSimulationState] =
    useState<SimulationState | null>(null);
  const [healthPrecautions, setHealthPrecautions] =
    useState<HealthPrecaution | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [gameEngine] = useState(() => new SimulationEngine(defaultGameConfig));
  const [showLocationSelector, setShowLocationSelector] = useState(
    !selectedLocation
  );

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // Initialize game when location is selected
  useEffect(() => {
    if (currentLocation && !player) {
      initializeGame();
    }
  }, [currentLocation]);

  // Game loop
  useEffect(() => {
    if (isGameActive && !isPaused && player) {
      gameLoopRef.current = setInterval(() => {
        updateGame();
      }, 1000); // Update every second

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [isGameActive, isPaused, player]);

  const initializeGame = async () => {
    if (!currentLocation) return;

    try {
      // Use enhanced NASA API service for comprehensive data
      const nasaReport =
        await enhancedNasaApiService.generateNASASpaceAppsReport(
          currentLocation
        );

      console.log("NASA Space Apps Report generated:", nasaReport);
      console.log("Data sources used:", nasaReport.nasaDataSources);
      console.log("Data quality:", nasaReport.dataQuality);

      if (nasaReport.airQuality && nasaReport.weather) {
        setAirQuality(nasaReport.airQuality);
        setWeather(nasaReport.weather);

        // Initialize simulation with enhanced NASA data
        const simulationEngineInstance = new SimulationEngine(
          defaultGameConfig
        );
        simulationEngineInstance.initializeSimulation(
          [nasaReport.airQuality],
          currentLocation
        );
        const initialState = simulationEngineInstance.getCurrentState();
        setSimulationState(initialState);

        // Set health precautions from NASA report
        if (nasaReport.healthPrecautions) {
          setHealthPrecautions(
            nasaReport.healthPrecautions as HealthPrecaution
          );
        }

        // Initialize player
        const newPlayer: PlayerState = {
          id: "player1",
          health: 100,
          energy: 100,
          credits: 200,
          disguise: "asthma_patient",
          location: currentLocation,
          safeTimeRemaining: defaultGameConfig.missionTimeLimit,
          isInSafeZone:
            nasaReport.airQuality.aqi <= defaultGameConfig.safeAQIThreshold,
          inventory: {
            saplings: 10,
            credits: 200,
            tools: ["shovel", "watering_can"],
            upgrades: [],
          },
        };

        setPlayer(newPlayer);

        console.log(
          "Game initialized with NASA Space Apps data for:",
          currentLocation.city
        );
        console.log("TEMPO data available:", !!nasaReport.tempo);
        console.log(
          "Ground station data available:",
          !!nasaReport.groundStations
        );
        console.log("Fire data available:", !!nasaReport.fires);
      }
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  };

  const updateGame = () => {
    if (!player || !airQuality) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000; // Convert to seconds
    lastUpdateRef.current = now;

    // Update simulation time
    gameEngine.updateTime(deltaTime);

    // Update player health
    const updatedPlayer = gameEngine.updatePlayerHealth(player, deltaTime);
    setPlayer(updatedPlayer);

    // Update simulation state
    const newSimState = gameEngine.getCurrentState();
    setSimulationState(newSimState);

    // Check game end conditions
    if (gameEngine.isMissionCompleted()) {
      setIsGameActive(false);
      // Show success message
    } else if (gameEngine.isMissionFailed()) {
      setIsGameActive(false);
      // Show failure message
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setIsPaused(false);
    lastUpdateRef.current = Date.now();
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setIsGameActive(false);
    setIsPaused(false);
    setPlayer(null);
    setAirQuality(null);
    setWeather(null);
    setSimulationState(null);
    setHealthPrecautions(null);
    gameEngine.reset();
  };

  const selectLocation = (location: GameLocation) => {
    setCurrentLocation(location);
    setShowLocationSelector(false);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const executeAction = (actionId: string) => {
    if (!player || !airQuality || !simulationState) return;

    const actionConfig = gameActions.find((a) => a.id === actionId);
    if (!actionConfig) return;

    // Check if player has enough credits
    if (player.credits < actionConfig.cost) {
      alert("Not enough credits!");
      return;
    }

    // Create game action
    const action: GameAction = {
      id: `action_${Date.now()}`,
      type: actionId as any,
      location: {
        latitude: currentLocation!.latitude + (Math.random() - 0.5) * 0.01,
        longitude: currentLocation!.longitude + (Math.random() - 0.5) * 0.01,
        area: 100 + Math.random() * 200,
      },
      cost: actionConfig.cost,
      cooldown: actionConfig.cooldown,
      effect: {
        pm25Change: 0,
        no2Change: 0,
        o3Change: 0,
        areaOfEffect: 0,
        duration: 0,
        description: "",
      },
      timestamp: new Date(),
      status: "pending",
    };

    // Apply action to simulation
    const newAirQuality = gameEngine.applyAction(action, airQuality);
    setAirQuality(newAirQuality);

    // Update player credits
    setPlayer({
      ...player,
      credits: player.credits - actionConfig.cost,
    });

    // Update health precautions
    const newPrecautions = enhancedNasaApiService.calculateHealthPrecautions(
      newAirQuality.aqi
    );
    setHealthPrecautions(newPrecautions);

    setSelectedAction(null);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-500 bg-green-100";
    if (aqi <= 100) return "text-yellow-500 bg-yellow-100";
    if (aqi <= 150) return "text-orange-500 bg-orange-100";
    if (aqi <= 200) return "text-red-500 bg-red-100";
    if (aqi <= 300) return "text-purple-500 bg-purple-100";
    return "text-red-800 bg-red-200";
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  if (showLocationSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              CleanSpace
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose a location to start your air quality improvement mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockLocations.map((location) => (
              <motion.div
                key={location.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {location.name}
                        </h3>
                        <p className="text-gray-600">
                          {location.city}, {location.country}
                        </p>
                        <p className="text-sm text-gray-500">
                          Region: {location.regionSize}km
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => selectLocation(location)}
                      className="w-full mt-4"
                    >
                      Select Location
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!player || !airQuality || !weather || !simulationState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CleanSpace</h1>
              <p className="text-gray-600">{currentLocation?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowLocationSelector(true)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Change Location
              </Button>
              {!isGameActive ? (
                <Button onClick={startGame}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Mission
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={pauseGame}>
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetGame}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Air Quality Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Air Quality Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getAQIColor(
                        airQuality.aqi
                      )}`}
                    >
                      AQI: {airQuality.aqi}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getAQILevel(airQuality.aqi)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {airQuality.pm25.toFixed(1)} µg/m³
                    </div>
                    <p className="text-sm text-gray-600">PM2.5</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {airQuality.no2.toFixed(1)} ppb
                    </div>
                    <p className="text-sm text-gray-600">NO₂</p>
                  </div>
                </div>

                {healthPrecautions && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Health Advisory
                      </span>
                    </div>
                    <p className="text-yellow-700 mb-2">
                      {healthPrecautions.message}
                    </p>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {healthPrecautions.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weather Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="w-5 h-5" />
                  <span>Weather Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      {weather.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      {weather.humidity.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  <div className="text-center">
                    <Wind className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      {weather.windSpeed.toFixed(1)} m/s
                    </div>
                    <div className="text-sm text-gray-600">Wind Speed</div>
                  </div>
                  <div className="text-center">
                    <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      {weather.visibility.toFixed(1)} km
                    </div>
                    <div className="text-sm text-gray-600">Visibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameActions.map((action) => {
                    const Icon = action.icon;
                    const canAfford = player.credits >= action.cost;

                    return (
                      <motion.div
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            canAfford
                              ? "hover:shadow-md"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            canAfford && setSelectedAction(action.id)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Icon className={`w-6 h-6 ${action.color}`} />
                              <div>
                                <h3 className="font-semibold">{action.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Cost: {action.cost} credits
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                              {action.description}
                            </p>
                            <Button
                              size="sm"
                              className="w-full"
                              disabled={!canAfford}
                              onClick={(e) => {
                                e.stopPropagation();
                                executeAction(action.id);
                              }}
                            >
                              Execute
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Player Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span>{player.health.toFixed(0)}%</span>
                  </div>
                  <Progress value={player.health} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy</span>
                    <span>{player.energy.toFixed(0)}%</span>
                  </div>
                  <Progress value={player.energy} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credits</span>
                  <Badge variant="outline">{player.credits}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Saplings</span>
                  <Badge variant="outline">{player.inventory.saplings}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mission Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Mission Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time Remaining</span>
                    <span>
                      {Math.floor(simulationState.timeRemaining / 3600)}h{" "}
                      {Math.floor((simulationState.timeRemaining % 3600) / 60)}m
                    </span>
                  </div>
                  <Progress
                    value={
                      (simulationState.timeRemaining /
                        defaultGameConfig.missionTimeLimit) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target AQI</span>
                    <span>{simulationState.targetAQI}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current AQI</span>
                    <span>{simulationState.currentAQI}</span>
                  </div>
                </div>
                <div className="text-center">
                  {simulationState.currentAQI <= simulationState.targetAQI ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mission Complete!
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Target className="w-4 h-4 mr-1" />
                      In Progress
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {simulationState.actionsApplied
                    .slice(-5)
                    .map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {action.type.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  {simulationState.actionsApplied.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                      No actions taken yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
