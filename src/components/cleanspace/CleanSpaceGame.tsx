import { useState, useEffect, useRef, useCallback } from "react";
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
  Navigation,
  Crosshair,
  Trophy,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
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
import { MissionSelector } from "./MissionSelector";
import { MissionLevel } from "../../data/missionLevels";

interface CleanSpaceGameProps {
  selectedLocation?: GameLocation;
  onLocationSelect?: (location: GameLocation) => void;
}

interface UserProgress {
  completedMissions: string[];
  totalScore: number;
  unlockedAchievements: string[];
  currentLevel: number;
  totalXP: number;
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
  // Remove unused selectedAction state
  const [gameEngine] = useState(() => new SimulationEngine(defaultGameConfig));
  const [showLocationSelector, setShowLocationSelector] = useState(
    !selectedLocation
  );
  const [userLocation, setUserLocation] = useState<GameLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMissionSelector, setShowMissionSelector] = useState(true);
  const [currentMission, setCurrentMission] = useState<MissionLevel | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedMissions: [],
    totalScore: 0,
    unlockedAchievements: [],
    currentLevel: 1,
    totalXP: 0,
  });
  const [missionObjectives, setMissionObjectives] = useState<Array<{
    id: string;
    type: string;
    target: number;
    current: number;
    description: string;
    points: number;
    isCompleted: boolean;
  }>>([]);
  const [missionStartTime, setMissionStartTime] = useState<number | null>(null);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  // Remove unused missionTimerRef

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc: GameLocation = {
            id: "current",
            name: "Current Location",
            latitude,
            longitude,
            regionSize: 5,
            city: "Your Location",
            country: "Current",
          };
          setUserLocation(userLoc);
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

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
    loadUserProgress();
  }, []);

  // Load user progress from localStorage or API
  const loadUserProgress = () => {
    const savedProgress = localStorage.getItem('cleanspace_progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  // Save user progress
  const saveUserProgress = (progress: UserProgress) => {
    localStorage.setItem('cleanspace_progress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  // Handle mission selection
  const handleMissionSelect = (mission: MissionLevel) => {
    setCurrentMission(mission);
    setCurrentLocation(mission.location);
    setShowMissionSelector(false);
    setShowLocationSelector(false);
    setMissionObjectives(mission.objectives.map(obj => ({ ...obj, current: 0 })));
    setMissionStartTime(Date.now());
    
    // Initialize player with mission-specific credits
    const missionPlayer: PlayerState = {
      id: "player1",
      health: 100,
      energy: 100,
      credits: mission.initialCredits,
      disguise: "asthma_patient",
      location: mission.location,
      safeTimeRemaining: mission.estimatedTime * 60, // Convert to seconds
      isInSafeZone: false,
      inventory: {
        saplings: 10,
        credits: mission.initialCredits,
        tools: ["shovel", "watering_can"],
        upgrades: [],
      },
    };
    
    setPlayer(missionPlayer);
  };

  // Complete mission and award rewards
  const completeMission = useCallback(() => {
    if (!currentMission || !missionStartTime) return;

    const completionTime = (Date.now() - missionStartTime) / 1000; // in seconds
    const totalScore = missionObjectives.reduce((sum, obj) => sum + (obj.isCompleted ? obj.points : 0), 0);

    // Calculate bonus points for time
    const timeBonus = completionTime < (currentMission.estimatedTime * 60) ? 100 : 0;
    const finalScore = totalScore + timeBonus;

    // Update user progress
    const newProgress: UserProgress = {
      ...userProgress,
      completedMissions: [...userProgress.completedMissions, currentMission.id],
      totalScore: userProgress.totalScore + finalScore,
      totalXP: userProgress.totalXP + currentMission.rewards.xp,
      unlockedAchievements: [...userProgress.unlockedAchievements, ...currentMission.rewards.achievements],
    };

    saveUserProgress(newProgress);
    
    // Show completion modal or return to mission selector
    setTimeout(() => {
      setShowMissionSelector(true);
      setCurrentMission(null);
      setIsGameActive(false);
    }, 3000);
  }, [currentMission, missionStartTime, missionObjectives, userProgress]);

  // Check mission completion
  const checkMissionCompletion = useCallback(() => {
    if (!currentMission || !missionObjectives.length) return;

    const completedObjectives = missionObjectives.filter(obj => obj.isCompleted);
    const allCompleted = completedObjectives.length === missionObjectives.length;

    if (allCompleted && !currentMission.isCompleted) {
      completeMission();
    }
  }, [currentMission, missionObjectives, completeMission]);

  // Update mission objectives based on game actions
  const updateMissionObjectives = useCallback((actionType: string, value: number = 1) => {
    if (!currentMission) return;

    setMissionObjectives(prev => prev.map(obj => {
      if (obj.type === actionType && !obj.isCompleted) {
        const newCurrent = Math.min(obj.current + value, obj.target);
        return {
          ...obj,
          current: newCurrent,
          isCompleted: newCurrent >= obj.target
        };
      }
      return obj;
    }));
  }, [currentMission]);

  const initializeGame = useCallback(async () => {
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
  }, [currentLocation]);

  const updateGame = useCallback(() => {
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
  }, [player, airQuality, gameEngine]);

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
      type: actionId as
        | "plant_tree"
        | "plant_rooftop_garden"
        | "remove_vehicle"
        | "shutdown_factory"
        | "retrofit_factory",
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

    // Update mission objectives
    if (actionId === "plant_tree" || actionId === "plant_rooftop_garden") {
      updateMissionObjectives("plant_trees", 1);
    } else if (actionId === "remove_vehicle" || actionId === "shutdown_factory" || actionId === "retrofit_factory") {
      updateMissionObjectives("remove_pollution", 1);
    }
    
    // Check if AQI objective is met
    updateMissionObjectives("reduce_aqi", newAirQuality.aqi);

    // Action completed successfully
  };

  // Initialize game when location is selected
  useEffect(() => {
    if (currentLocation && !player) {
      initializeGame();
    }
  }, [currentLocation, player, initializeGame]);

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
  }, [isGameActive, isPaused, player, updateGame]);

  // Check mission completion when objectives change
  useEffect(() => {
    checkMissionCompletion();
  }, [missionObjectives, checkMissionCompletion]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400 bg-green-500/20 border-green-500/50";
    if (aqi <= 100)
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    if (aqi <= 150)
      return "text-orange-400 bg-orange-500/20 border-orange-500/50";
    if (aqi <= 200) return "text-red-400 bg-red-500/20 border-red-500/50";
    if (aqi <= 300)
      return "text-purple-400 bg-purple-500/20 border-purple-500/50";
    return "text-red-300 bg-red-600/20 border-red-600/50";
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  // Show mission selector if no mission is selected
  if (showMissionSelector) {
    return (
      <MissionSelector
        onMissionSelect={handleMissionSelect}
        onBack={() => setShowMissionSelector(false)}
        userProgress={userProgress}
      />
    );
  }

  if (showLocationSelector) {
    return (
      <div className="min-h-screen cosmic-gradient p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              CleanSpace Mission
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Choose a location to start your air quality improvement mission
            </motion.p>
          </div>

          {/* Current Location Option */}
          {userLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Card className="glass-morphism glow-border hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center pulse-glow">
                      <Crosshair className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-cyan-400">
                        {userLocation.name}
                      </h3>
                      <p className="text-gray-300">
                        {userLocation.city}, {userLocation.country}
                      </p>
                      <p className="text-sm text-gray-400">
                        Lat: {userLocation.latitude.toFixed(4)}, Lng:{" "}
                        {userLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      Current
                    </Badge>
                  </div>
                  <Button
                    onClick={() => selectLocation(userLocation)}
                    className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Get Location Button */}
          {!userLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-center"
            >
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
              >
                {isLoadingLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Crosshair className="w-4 h-4 mr-2" />
                )}
                {isLoadingLocation
                  ? "Getting Location..."
                  : "Use My Current Location"}
              </Button>
            </motion.div>
          )}

          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">
              Or choose from popular locations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-morphism glow-border hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">
                          {location.name}
                        </h3>
                        <p className="text-gray-300">
                          {location.city}, {location.country}
                        </p>
                        <p className="text-sm text-gray-400">
                          Region: {location.regionSize}km
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => selectLocation(location)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
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
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-500 border-r-purple-500 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cyan-500/20 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-lg mb-2">
            Initializing CleanSpace Mission
          </p>
          <p className="text-gray-400 text-sm">
            Loading NASA satellite data...
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="glass-morphism border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                CleanSpace Mission
              </h1>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <p className="text-gray-300">{currentLocation?.name}</p>
                {currentLocation?.id === "current" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                    Live
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowLocationSelector(true)}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Change Location
              </Button>
              {!isGameActive ? (
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 pulse-glow"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Mission
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={pauseGame}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetGame}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                  >
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gradient">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>Air Quality Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold border-2 ${getAQIColor(
                          airQuality.aqi
                        )} pulse-glow`}
                      >
                        AQI: {airQuality.aqi}
                      </div>
                      <p className="text-sm text-gray-300 mt-2">
                        {getAQILevel(airQuality.aqi)}
                      </p>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-cyan-400">
                        {airQuality.pm25.toFixed(1)} µg/m³
                      </div>
                      <p className="text-sm text-gray-400">PM2.5</p>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-purple-400">
                        {airQuality.no2.toFixed(1)} ppb
                      </div>
                      <p className="text-sm text-gray-400">NO₂</p>
                    </motion.div>
                  </div>

                  {healthPrecautions && (
                    <motion.div
                      className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold text-yellow-300">
                          Health Advisory
                        </span>
                      </div>
                      <p className="text-yellow-200 mb-2">
                        {healthPrecautions.message}
                      </p>
                      <ul className="text-sm text-yellow-300 space-y-1">
                        {healthPrecautions.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weather Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gradient">
                    <Wind className="w-5 h-5 text-cyan-400" />
                    <span>Weather Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Thermometer className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-red-300">
                        {weather.temperature.toFixed(1)}°C
                      </div>
                      <div className="text-sm text-gray-400">Temperature</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-300">
                        {weather.humidity.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Humidity</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Wind className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-cyan-300">
                        {weather.windSpeed.toFixed(1)} m/s
                      </div>
                      <div className="text-sm text-gray-400">Wind Speed</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-purple-300">
                        {weather.visibility.toFixed(1)} km
                      </div>
                      <div className="text-sm text-gray-400">Visibility</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="text-gradient">
                    Available Actions
                  </CardTitle>
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
                            className={`cursor-pointer transition-all glass-morphism border-2 ${
                              canAfford
                                ? "hover:shadow-lg hover:shadow-cyan-500/20 border-cyan-500/30 hover:border-cyan-400/50"
                                : "opacity-50 cursor-not-allowed border-gray-600/30"
                            }`}
                            onClick={() => {
                              // Action selection handled in execute button
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${
                                    action.id === "plant_tree"
                                      ? "from-green-500/20 to-emerald-500/20"
                                      : action.id === "plant_rooftop_garden"
                                      ? "from-emerald-500/20 to-green-600/20"
                                      : action.id === "remove_vehicle"
                                      ? "from-blue-500/20 to-cyan-500/20"
                                      : action.id === "shutdown_factory"
                                      ? "from-red-500/20 to-orange-500/20"
                                      : "from-orange-500/20 to-yellow-500/20"
                                  }`}
                                >
                                  <Icon className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-100">
                                    {action.name}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    Cost: {action.cost} credits
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">
                                {action.description}
                              </p>
                              <Button
                                size="sm"
                                className={`w-full ${
                                  canAfford
                                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                                    : "bg-gray-700 text-gray-400 border-gray-600"
                                }`}
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
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gradient">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>Player Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Health</span>
                      <span className="text-red-400 font-semibold">
                        {player.health.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={player.health} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Energy</span>
                      <span className="text-blue-400 font-semibold">
                        {player.energy.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={player.energy} className="h-3" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <span className="text-sm text-gray-300">Credits</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      {player.credits}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <span className="text-sm text-gray-300">Saplings</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      {player.inventory.saplings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission Objectives */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gradient">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>Mission Objectives</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentMission && (
                    <>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-cyan-400 mb-1">
                          {currentMission.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Level {currentMission.level} • {currentMission.difficulty}
                        </p>
                      </div>
                      
                      {missionObjectives.map((objective, index) => (
                        <motion.div
                          key={objective.id}
                          className={`p-3 rounded-lg border transition-all ${
                            objective.isCompleted
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-gray-800/30 border-gray-700/50"
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {objective.isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
                              )}
                              <span className={`text-sm ${
                                objective.isCompleted ? "text-green-400" : "text-gray-300"
                              }`}>
                                {objective.description}
                              </span>
                            </div>
                            <Badge className={`${
                              objective.isCompleted
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                            }`}>
                              +{objective.points}
                            </Badge>
                          </div>
                          
                          {objective.type !== "time_limit" && objective.type !== "budget_limit" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-gray-400">
                                  {objective.current}/{objective.target}
                                </span>
                              </div>
                              <Progress 
                                value={(objective.current / objective.target) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      
                      {missionStartTime && (
                        <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-gray-300">Mission Time</span>
                            </div>
                            <span className="text-sm text-purple-400 font-semibold">
                              {Math.floor((Date.now() - missionStartTime) / 60000)}:{
                                Math.floor(((Date.now() - missionStartTime) % 60000) / 1000)
                                  .toString().padStart(2, '0')
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {!currentMission && (
                    <div className="text-center py-4">
                      <Trophy className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No active mission</p>
                      <Button
                        size="sm"
                        onClick={() => setShowMissionSelector(true)}
                        className="mt-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                      >
                        Select Mission
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="text-gradient">
                    Recent Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {simulationState.actionsApplied
                      .slice(-5)
                      .map((action, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 text-sm p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                          <span className="text-gray-300">
                            {action.type.replace("_", " ")}
                          </span>
                        </motion.div>
                      ))}
                    {simulationState.actionsApplied.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No actions taken yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
