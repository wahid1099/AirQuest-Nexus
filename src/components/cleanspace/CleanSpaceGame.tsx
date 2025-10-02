import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Gamepad2,
  Trophy,
  ArrowLeft,
  Satellite,
  Award,
  Star,
  Bot,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { MissionSelector } from "./MissionSelector";
import { MissionLevel } from "../../data/missionLevels";
// Removed incorrect import

// Enhanced types for mission system
interface GameLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  regionSize?: number;
}

interface PlayerState {
  health: number;
  energy: number;
  credits: number;
  location: GameLocation;
  safeTimeRemaining?: number;
  isInSafeZone?: boolean;
}

interface AirQuality {
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  co?: number;
  so2?: number;
  status: "good" | "moderate" | "unhealthy" | "hazardous";
  timestamp?: Date;
  source?: string;
  dataQuality?: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure?: number;
  windDirection?: number;
  cloudCover?: number;
  timestamp?: Date;
  source?: string;
}

interface GameAction {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  cost: number;
  cooldown: number;
  description: string;
  color: string;
}

interface UserProgress {
  completedMissions: string[];
  totalScore: number;
  unlockedAchievements: string[];
  currentLevel: number;
  totalXP: number;
}

interface MissionObjective {
  id: string;
  type: string;
  target: number;
  current: number;
  description: string;
  points: number;
  isCompleted: boolean;
}

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
    city: "New York",
    country: "USA",
    regionSize: 5,
  },
  {
    id: "la",
    name: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    city: "Los Angeles",
    country: "USA",
    regionSize: 5,
  },
  {
    id: "delhi",
    name: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    city: "Delhi",
    country: "India",
    regionSize: 5,
  },
  {
    id: "beijing",
    name: "Beijing",
    latitude: 39.9042,
    longitude: 116.4074,
    city: "Beijing",
    country: "China",
    regionSize: 5,
  },
];

const gameActions: GameAction[] = [
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
];

export function CleanSpaceGame({
  selectedLocation,
  onLocationSelect,
}: CleanSpaceGameProps) {
  // Mission System State
  const [showMissionSelector, setShowMissionSelector] = useState(true);
  const [currentMission, setCurrentMission] = useState<MissionLevel | null>(
    null
  );
  const [missionObjectives, setMissionObjectives] = useState<
    MissionObjective[]
  >([]);
  const [missionStartTime, setMissionStartTime] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedMissions: [],
    totalScore: 0,
    unlockedAchievements: [],
    currentLevel: 1,
    totalXP: 0,
  });

  // Game State
  const [currentLocation, setCurrentLocation] = useState<GameLocation>(
    selectedLocation || mockLocations[0]
  );
  const [player, setPlayer] = useState<PlayerState>({
    health: 100,
    energy: 100,
    credits: 100,
    location: selectedLocation || mockLocations[0],
    safeTimeRemaining: 300,
    isInSafeZone: false,
  });
  const [airQuality, setAirQuality] = useState<AirQuality>({
    aqi: 85,
    pm25: 18.2,
    no2: 28.7,
    o3: 45.1,
    status: "moderate",
    timestamp: new Date(),
    source: "NASA APIs",
    dataQuality: 0.85,
  });
  const [weather, setWeather] = useState<Weather>({
    temperature: 22,
    humidity: 65,
    windSpeed: 3.2,
    visibility: 8.5,
    pressure: 1013,
    windDirection: 180,
    cloudCover: 40,
    timestamp: new Date(),
    source: "NASA Power",
  });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameTime, setGameTime] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionCooldowns, setActionCooldowns] = useState<
    Record<string, number>
  >({});
  const [nasaDataStatus, setNasaDataStatus] = useState<
    "loading" | "success" | "error" | "not-tested"
  >("not-tested");
  const [nasaDataLogs, setNasaDataLogs] = useState<string[]>([]);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [missionResults, setMissionResults] = useState<{
    score: number;
    completionTime: number;
    objectivesCompleted: number;
    totalObjectives: number;
    bonusPoints: number;
  } | null>(null);

  // Add log function
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setNasaDataLogs((prev) => [...prev.slice(-9), logMessage]); // Keep last 10 logs
  };

  // Load user progress from localStorage
  const loadUserProgress = useCallback(() => {
    const savedProgress = localStorage.getItem("cleanspace_progress");
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save user progress
  const saveUserProgress = useCallback((progress: UserProgress) => {
    localStorage.setItem("cleanspace_progress", JSON.stringify(progress));
    setUserProgress(progress);
  }, []);

  // Handle mission selection
  const handleMissionSelect = useCallback((mission: MissionLevel) => {
    console.log("🎯 Mission selected:", mission.title);
    setCurrentMission(mission);
    setCurrentLocation(mission.location);
    setShowMissionSelector(false);

    // Initialize mission objectives
    const objectives = mission.objectives.map((obj) => ({
      ...obj,
      current: 0,
      isCompleted: false,
    }));
    setMissionObjectives(objectives);
    setMissionStartTime(Date.now());

    // Initialize player with mission-specific settings
    setPlayer({
      health: 100,
      energy: 100,
      credits: mission.initialCredits,
      location: mission.location,
      safeTimeRemaining: mission.estimatedTime * 60,
      isInSafeZone: false,
    });

    // Set game time based on mission
    setGameTime(mission.estimatedTime * 60);
    setScore(0);
    setActionCooldowns({});

    // Load NASA data for the mission location
    addLog(`🚀 Starting mission: ${mission.title}`);
    addLog(
      `📍 Location: ${mission.location.city}, ${mission.location.country}`
    );
    loadNasaData(mission.location);
  }, []);

  // Update mission objectives
  const updateMissionObjectives = useCallback(
    (actionType: string, value: number = 1) => {
      if (!currentMission) return;

      setMissionObjectives((prev) =>
        prev.map((obj) => {
          if (obj.type === actionType && !obj.isCompleted) {
            const newCurrent = Math.min(obj.current + value, obj.target);
            const isCompleted = newCurrent >= obj.target;

            if (isCompleted && !obj.isCompleted) {
              addLog(`✅ Objective completed: ${obj.description}`);
              setScore((prevScore) => prevScore + obj.points);
            }

            return {
              ...obj,
              current: newCurrent,
              isCompleted,
            };
          }
          return obj;
        })
      );
    },
    [currentMission]
  );

  // Check mission completion
  const checkMissionCompletion = useCallback(() => {
    if (!currentMission || !missionObjectives.length || !missionStartTime)
      return;

    const completedObjectives = missionObjectives.filter(
      (obj) => obj.isCompleted
    );
    const allCompleted =
      completedObjectives.length === missionObjectives.length;

    if (allCompleted) {
      const completionTime = (Date.now() - missionStartTime) / 1000;
      const timeBonus =
        completionTime < currentMission.estimatedTime * 60 ? 500 : 0;
      const healthBonus = player.health > 80 ? 200 : 0;
      const totalScore = score + timeBonus + healthBonus;

      setMissionResults({
        score: totalScore,
        completionTime: Math.round(completionTime),
        objectivesCompleted: completedObjectives.length,
        totalObjectives: missionObjectives.length,
        bonusPoints: timeBonus + healthBonus,
      });

      // Update user progress
      const newProgress: UserProgress = {
        ...userProgress,
        completedMissions: [
          ...userProgress.completedMissions,
          currentMission.id,
        ],
        totalScore: userProgress.totalScore + totalScore,
        totalXP: userProgress.totalXP + currentMission.rewards.xp,
        unlockedAchievements: [
          ...userProgress.unlockedAchievements,
          ...currentMission.rewards.achievements,
        ],
        currentLevel:
          Math.floor(
            (userProgress.totalXP + currentMission.rewards.xp) / 1000
          ) + 1,
      };

      saveUserProgress(newProgress);
      setIsGameActive(false);
      setShowMissionComplete(true);

      addLog(`🎉 Mission completed! Score: ${totalScore}`);
      addLog(`⏱️ Completion time: ${Math.round(completionTime)}s`);
    }
  }, [
    currentMission,
    missionObjectives,
    missionStartTime,
    score,
    player.health,
    userProgress,
    saveUserProgress,
  ]);

  // Handle mission completion modal close
  const handleMissionCompleteClose = useCallback(() => {
    setShowMissionComplete(false);
    setShowMissionSelector(true);
    setCurrentMission(null);
    setMissionResults(null);
    setMissionObjectives([]);
    setMissionStartTime(null);
  }, []);

  // Load real NASA data
  const loadNasaData = async (location: GameLocation) => {
    setNasaDataStatus("loading");
    addLog("🚀 Starting NASA data loading...");

    try {
      // Check environment variables
      const firmsKey = import.meta.env.VITE_FIRMS_API_KEY;
      const openaqKey = import.meta.env.VITE_OPENAQ_API_KEY;
      const airnowKey = import.meta.env.VITE_AIRNOW_API_KEY;

      addLog(
        `🔑 API Keys - FIRMS: ${firmsKey ? "✓" : "✗"}, OpenAQ: ${
          openaqKey ? "✓" : "✗"
        }, AirNow: ${airnowKey ? "✓" : "✗"}`
      );

      // Test multiple NASA/Air Quality APIs
      const apiTests = [];

      // 1. NASA FIRMS API (Fire data)
      if (firmsKey && firmsKey !== "DEMO_KEY") {
        addLog("🔥 Testing NASA FIRMS API...");
        const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${firmsKey}/VIIRS_SNPP_NRT/world/1/2024-10-01`;
        apiTests.push(
          fetch(firmsUrl)
            .then((response) => {
              if (response.ok) {
                addLog("✅ NASA FIRMS API: Success");
                return response.text().then((data) => {
                  addLog(`📊 FIRMS data sample: ${data.substring(0, 100)}...`);
                  return {
                    api: "FIRMS",
                    status: "success",
                    data: data.split("\n").length,
                  };
                });
              } else {
                throw new Error(`HTTP ${response.status}`);
              }
            })
            .catch((error) => {
              addLog(`❌ NASA FIRMS API failed: ${error.message}`);
              return { api: "FIRMS", status: "error", error: error.message };
            })
        );
      }

      // 2. OpenAQ API (Air Quality)
      if (openaqKey) {
        addLog("🌬️ Testing OpenAQ API...");
        const openaqUrl = `https://api.openaq.org/v2/latest?limit=10&page=1&offset=0&sort=desc&coordinates=${location.latitude},${location.longitude}&radius=25000`;
        apiTests.push(
          fetch(openaqUrl, {
            headers: {
              "X-API-Key": openaqKey,
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json().then((data) => {
                  addLog(
                    `✅ OpenAQ API: Success - ${
                      data.results?.length || 0
                    } stations found`
                  );
                  if (data.results && data.results.length > 0) {
                    const sample = data.results[0];
                    addLog(
                      `📊 Sample data: ${sample.parameter} = ${sample.value} ${sample.unit}`
                    );

                    // Update air quality with real data
                    const pm25Data = data.results.find(
                      (r: any) => r.parameter === "pm25"
                    );
                    const no2Data = data.results.find(
                      (r: any) => r.parameter === "no2"
                    );
                    const o3Data = data.results.find(
                      (r: unknown) => r.parameter === "o3"
                    );

                    if (pm25Data || no2Data || o3Data) {
                      setAirQuality((prev) => ({
                        ...prev,
                        pm25: pm25Data?.value || prev.pm25,
                        no2: no2Data?.value || prev.no2,
                        o3: o3Data?.value || prev.o3,
                        aqi: pm25Data?.value
                          ? Math.round(pm25Data.value * 3)
                          : prev.aqi, // Rough AQI calculation
                      }));
                      addLog("🔄 Updated air quality with real data");
                    }
                  }
                  return {
                    api: "OpenAQ",
                    status: "success",
                    data: data.results?.length || 0,
                  };
                });
              } else {
                throw new Error(`HTTP ${response.status}`);
              }
            })
            .catch((error) => {
              addLog(`❌ OpenAQ API failed: ${error.message}`);
              return { api: "OpenAQ", status: "error", error: error.message };
            })
        );
      }

      // 3. NASA Power API (Weather data)
      addLog("🌡️ Testing NASA Power API...");
      const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,RH2M,WS10M,PS&community=RE&longitude=${location.longitude}&latitude=${location.latitude}&start=20241001&end=20241001&format=JSON`;
      apiTests.push(
        fetch(powerUrl)
          .then((response) => {
            if (response.ok) {
              return response.json().then((data) => {
                addLog("✅ NASA Power API: Success");
                if (data.properties && data.properties.parameter) {
                  const params = data.properties.parameter;
                  const date = "20241001";

                  setWeather((prev) => ({
                    ...prev,
                    temperature: params.T2M?.[date] || prev.temperature,
                    humidity: params.RH2M?.[date] || prev.humidity,
                    windSpeed: params.WS10M?.[date] || prev.windSpeed,
                  }));
                  addLog(
                    `🔄 Updated weather: ${params.T2M?.[date]}°C, ${params.RH2M?.[date]}% humidity`
                  );
                }
                return {
                  api: "NASA Power",
                  status: "success",
                  data: Object.keys(data.properties?.parameter || {}).length,
                };
              });
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          })
          .catch((error) => {
            addLog(`❌ NASA Power API failed: ${error.message}`);
            return { api: "NASA Power", status: "error", error: error.message };
          })
      );

      // Wait for all API tests
      const results = await Promise.all(apiTests);
      const successCount = results.filter((r) => r.status === "success").length;

      addLog(`📈 API Results: ${successCount}/${results.length} successful`);

      if (successCount > 0) {
        setNasaDataStatus("success");
        addLog("🎉 NASA data loading completed successfully!");
      } else {
        setNasaDataStatus("error");
        addLog("⚠️ All APIs failed, using simulated data");
      }
    } catch (error) {
      addLog(
        `💥 Critical error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setNasaDataStatus("error");
    }
  };

  // Initialize NASA data loading on component mount
  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  // Check mission completion when objectives change
  useEffect(() => {
    checkMissionCompletion();
  }, [missionObjectives, checkMissionCompletion]);

  // Game loop
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const interval = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 0) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });

      // Update cooldowns
      setActionCooldowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] = Math.max(0, updated[key] - 1);
          }
        });
        return updated;
      });

      // Simulate air quality changes
      setAirQuality((prev) => ({
        ...prev,
        aqi: Math.max(0, prev.aqi + (Math.random() - 0.5) * 2),
      }));

      // Health effects
      if (airQuality.aqi > 100) {
        setPlayer((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - 0.5),
        }));
      } else if (airQuality.aqi < 50) {
        setPlayer((prev) => ({
          ...prev,
          health: Math.min(100, prev.health + 0.2),
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isPaused, airQuality.aqi]);

  const handleActionSelect = (actionId: string) => {
    const action = gameActions.find((a) => a.id === actionId);
    if (!action) return;

    if (player.credits < action.cost) {
      alert("Not enough credits!");
      return;
    }

    if (actionCooldowns[actionId] > 0) {
      alert("Action is on cooldown!");
      return;
    }

    // Apply action effects
    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - action.cost,
    }));

    setActionCooldowns((prev) => ({
      ...prev,
      [actionId]: action.cooldown,
    }));

    // Improve air quality based on action
    const improvement =
      {
        plant_tree: -5,
        plant_rooftop_garden: -3,
        remove_vehicle: -2,
        shutdown_factory: -10,
      }[actionId] || 0;

    setAirQuality((prev) => ({
      ...prev,
      aqi: Math.max(0, prev.aqi + improvement),
      timestamp: new Date(),
    }));

    // Update mission objectives
    if (actionId === "plant_tree" || actionId === "plant_rooftop_garden") {
      updateMissionObjectives("plant_trees", 1);
    } else if (
      actionId === "remove_vehicle" ||
      actionId === "shutdown_factory"
    ) {
      updateMissionObjectives("remove_pollution", 1);
    }

    // Check AQI objective
    const newAQI = Math.max(0, airQuality.aqi + improvement);
    if (newAQI < 50) {
      updateMissionObjectives("reduce_aqi", 1);
    }

    setScore((prev) => prev + Math.abs(improvement) * 10);
    setSelectedAction(null);

    addLog(`🎯 Action completed: ${action.name} (AQI: ${newAQI.toFixed(1)})`);
  };

  const startGame = () => {
    setIsGameActive(true);
    setIsPaused(false);
    setGameTime(300);
    setScore(0);
    setPlayer((prev) => ({ ...prev, health: 100, energy: 100, credits: 100 }));

    // Load real NASA data when game starts
    addLog("🎮 Game started - Loading NASA satellite data...");
    loadNasaData(currentLocation);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setIsGameActive(false);
    setIsPaused(false);
    setGameTime(300);
    setScore(0);
    setPlayer((prev) => ({ ...prev, health: 100, energy: 100, credits: 100 }));
    setAirQuality({
      aqi: 85,
      pm25: 18.2,
      no2: 28.7,
      o3: 45.1,
      status: "moderate",
    });
    setActionCooldowns({});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400";
    if (aqi <= 100) return "text-yellow-400";
    if (aqi <= 150) return "text-orange-400";
    return "text-red-400";
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    return "Unhealthy";
  };

  // Show mission selector if no mission is selected
  if (showMissionSelector) {
    return (
      <div className="min-h-screen cosmic-gradient p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              CleanSpace Missions Debug
            </h1>
            <p className="text-gray-300">Mission selector should load here</p>
          </div>
          <MissionSelector
            onMissionSelect={handleMissionSelect}
            onBack={() => setShowMissionSelector(false)}
            userProgress={userProgress}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-gradient relative">
      {/* Header */}
      <div className="bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowMissionSelector(true)}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Missions
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  {currentMission?.title || "CleanSpace Mission"}
                </h1>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <p className="text-gray-400">
                    {currentLocation.city}, {currentLocation.country}
                  </p>
                  {currentMission && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 ml-2">
                      Level {currentMission.level}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Time: {formatTime(gameTime)}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Objectives:{" "}
                {missionObjectives.filter((obj) => obj.isCompleted).length}/
                {missionObjectives.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Game Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">
                    {currentLocation.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentLocation.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-semibold text-white">
                    Health: {Math.round(player.health)}%
                  </p>
                  <Progress value={player.health} className="w-16 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-semibold text-white">
                    Credits: {player.credits}
                  </p>
                  <p className="text-xs text-gray-400">Available funds</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-br border ${
              airQuality.aqi <= 50
                ? "from-green-500/10 to-emerald-500/10 border-green-500/30"
                : airQuality.aqi <= 100
                ? "from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                : "from-red-500/10 to-pink-500/10 border-red-500/30"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <p className={`font-semibold ${getAQIColor(airQuality.aqi)}`}>
                    AQI: {Math.round(airQuality.aqi)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getAQIStatus(airQuality.aqi)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Game Controls</span>
              <div className="flex space-x-2">
                {!isGameActive ? (
                  <Button
                    onClick={startGame}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                ) : (
                  <Button onClick={pauseGame} variant="outline">
                    {isPaused ? (
                      <Play className="w-4 h-4 mr-2" />
                    ) : (
                      <Pause className="w-4 h-4 mr-2" />
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                )}
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => loadNasaData(currentLocation)}
                  variant="outline"
                  disabled={nasaDataStatus === "loading"}
                  className={
                    nasaDataStatus === "success"
                      ? "border-green-500 text-green-400"
                      : nasaDataStatus === "error"
                      ? "border-red-500 text-red-400"
                      : ""
                  }
                >
                  {nasaDataStatus === "loading"
                    ? "Loading..."
                    : nasaDataStatus === "success"
                    ? "✓ NASA Data"
                    : nasaDataStatus === "error"
                    ? "✗ NASA Data"
                    : "Load NASA Data"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Environmental Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span>Air Quality Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">PM2.5</p>
                  <p className="text-lg font-semibold text-orange-400">
                    {airQuality.pm25.toFixed(1)} μg/m³
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">NO₂</p>
                  <p className="text-lg font-semibold text-red-400">
                    {airQuality.no2.toFixed(1)} ppb
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">O₃</p>
                  <p className="text-lg font-semibold text-purple-400">
                    {airQuality.o3.toFixed(1)} ppb
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">AQI</p>
                  <p
                    className={`text-lg font-semibold ${getAQIColor(
                      airQuality.aqi
                    )}`}
                  >
                    {Math.round(airQuality.aqi)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-blue-400" />
                <span>Weather Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Temperature</p>
                  <p className="text-lg font-semibold text-blue-400">
                    {weather.temperature}°C
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Humidity</p>
                  <p className="text-lg font-semibold text-cyan-400">
                    {weather.humidity}%
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Wind Speed</p>
                  <p className="text-lg font-semibold text-green-400">
                    {weather.windSpeed} m/s
                  </p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Visibility</p>
                  <p className="text-lg font-semibold text-yellow-400">
                    {weather.visibility} km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span>Available Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gameActions.map((action) => {
                const canAfford = player.credits >= action.cost;
                const onCooldown = actionCooldowns[action.id] > 0;
                const isDisabled = !canAfford || onCooldown || !isGameActive;

                return (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        isDisabled ? "opacity-50" : "hover:bg-gray-800/30"
                      } ${
                        selectedAction === action.id
                          ? "ring-2 ring-cyan-500"
                          : ""
                      }`}
                      onClick={() =>
                        !isDisabled && handleActionSelect(action.id)
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800/50 flex items-center justify-center ${action.color}`}
                        >
                          <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">
                          {action.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                          {action.description}
                        </p>
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">
                            Cost: {action.cost} credits
                          </Badge>
                          {onCooldown && (
                            <Badge variant="destructive" className="text-xs">
                              Cooldown:{" "}
                              {Math.ceil(actionCooldowns[action.id] / 60)}m
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* NASA Data Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
              <span>NASA Data Loading Logs</span>
              <Badge
                variant={
                  nasaDataStatus === "success"
                    ? "default"
                    : nasaDataStatus === "error"
                    ? "destructive"
                    : nasaDataStatus === "loading"
                    ? "secondary"
                    : "outline"
                }
              >
                {nasaDataStatus === "loading"
                  ? "Loading..."
                  : nasaDataStatus === "success"
                  ? "Success"
                  : nasaDataStatus === "error"
                  ? "Error"
                  : "Not Started"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900/50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {nasaDataLogs.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  Click "Load NASA Data" or start the game to see logs...
                </p>
              ) : (
                <div className="space-y-1">
                  {nasaDataLogs.map((log, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono text-gray-300"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mission Objectives */}
        {currentMission && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <span>Mission Objectives</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  {missionObjectives.filter((obj) => obj.isCompleted).length}/
                  {missionObjectives.length} Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {missionObjectives.map((objective) => (
                  <motion.div
                    key={objective.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      objective.isCompleted
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-gray-800/30 border-gray-700/50"
                    }`}
                    animate={{
                      scale: objective.isCompleted ? [1, 1.02, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      {objective.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />
                      )}
                      <span
                        className={`${
                          objective.isCompleted
                            ? "text-green-300"
                            : "text-gray-300"
                        }`}
                      >
                        {objective.description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={
                          objective.isCompleted
                            ? "text-green-400 border-green-500/50"
                            : "text-gray-400"
                        }
                      >
                        {objective.current}/{objective.target}
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        +{objective.points} pts
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Game Assistant - Simplified */}
      {currentMission && isGameActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <Button
            onClick={() => {
              // Simple AI tips based on current state
              if (airQuality.aqi > 100) {
                alert(
                  "💡 AI Tip: AQI is high! Consider planting trees or removing vehicles to improve air quality."
                );
              } else if (player.health < 50) {
                alert(
                  "⚠️ AI Warning: Your health is low! Move to a cleaner area or take protective actions."
                );
              } else if (player.credits < 20) {
                alert(
                  "💰 AI Advice: Credits are running low! Focus on low-cost actions like removing vehicles."
                );
              } else {
                alert(
                  "🎯 AI Strategy: You're doing well! Keep monitoring objectives and maintain your current approach."
                );
              }
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg pulse-glow"
          >
            <Bot className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Mission Completion Modal */}
      <AnimatePresence>
        {showMissionComplete && missionResults && currentMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full"
            >
              <Card className="glass-morphism glow-border">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-gradient mb-2">
                    Mission Complete!
                  </CardTitle>
                  <p className="text-xl text-cyan-400">
                    {currentMission.title}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mission Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        {missionResults.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Final Score</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        {Math.floor(missionResults.completionTime / 60)}:
                        {(missionResults.completionTime % 60)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-sm text-gray-400">
                        Completion Time
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <div className="text-3xl font-bold text-purple-400 mb-1">
                        {missionResults.objectivesCompleted}/
                        {missionResults.totalObjectives}
                      </div>
                      <div className="text-sm text-gray-400">Objectives</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">
                        +{missionResults.bonusPoints}
                      </div>
                      <div className="text-sm text-gray-400">Bonus Points</div>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">
                      Mission Rewards
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-yellow-400">
                          +{currentMission.rewards.xp}
                        </div>
                        <div className="text-xs text-gray-400">Experience</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <Trophy className="w-6 h-6 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-green-400">
                          +{currentMission.rewards.credits}
                        </div>
                        <div className="text-xs text-gray-400">Credits</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <Award className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-purple-400">
                          {currentMission.rewards.achievements.length}
                        </div>
                        <div className="text-xs text-gray-400">
                          Achievements
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    <Button
                      onClick={handleMissionCompleteClose}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 pulse-glow"
                    >
                      Continue to Next Mission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
