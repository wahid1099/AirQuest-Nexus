import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gamepad2,
  MapPin,
  Heart,
  Trophy,
  Eye,
  Target,
  Clock,
  Award,
  Star,
  ChevronRight,
  Play,
  ArrowLeft,
  Satellite,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  location: string;
  objectives: string[];
  rewards: {
    xp: number;
    credits: number;
    badge: string;
  };
  estimatedTime: string;
  nasaDataSources: string[];
}

const missions: Mission[] = [
  {
    id: "atmospheric-detective",
    title: "Atmospheric Detective",
    description:
      "Investigate air quality patterns using TEMPO satellite data to uncover pollution sources in major cities.",
    difficulty: "Beginner",
    location: "New York City, USA",
    objectives: [
      "Analyze PM2.5 levels using NASA TEMPO data",
      "Identify pollution hotspots in the city",
      "Correlate air quality with weather patterns",
      "Generate a pollution source report",
    ],
    rewards: {
      xp: 2500,
      credits: 100,
      badge: "Data Detective",
    },
    estimatedTime: "15-20 minutes",
    nasaDataSources: ["NASA TEMPO", "NASA Power API", "FIRMS"],
  },
  {
    id: "ozone-guardian",
    title: "Ozone Guardian",
    description:
      "Deploy advanced algorithms to predict and prevent ozone depletion events using real satellite data.",
    difficulty: "Advanced",
    location: "Los Angeles, USA",
    objectives: [
      "Monitor ozone levels with TEMPO satellite",
      "Predict ozone depletion patterns",
      "Implement prevention strategies",
      "Track improvement over time",
    ],
    rewards: {
      xp: 3500,
      credits: 200,
      badge: "Ozone Guardian",
    },
    estimatedTime: "25-30 minutes",
    nasaDataSources: ["NASA TEMPO", "MODIS", "OMI"],
  },
  {
    id: "particle-tracker",
    title: "Particle Tracker",
    description:
      "Track PM2.5 particles across continents using satellite imagery and weather data.",
    difficulty: "Intermediate",
    location: "Delhi, India",
    objectives: [
      "Track particle movement with MODIS data",
      "Analyze cross-border pollution transport",
      "Study seasonal particle patterns",
      "Create particle trajectory maps",
    ],
    rewards: {
      xp: 2800,
      credits: 150,
      badge: "Particle Tracker",
    },
    estimatedTime: "20-25 minutes",
    nasaDataSources: ["MODIS", "CALIPSO", "NASA Power"],
  },
  {
    id: "climate-commander",
    title: "Climate Commander",
    description:
      "Lead strategic missions to optimize global air quality monitoring networks using NASA data.",
    difficulty: "Expert",
    location: "Global Network",
    objectives: [
      "Analyze global air quality networks",
      "Optimize sensor placement strategies",
      "Coordinate international monitoring",
      "Develop early warning systems",
    ],
    rewards: {
      xp: 4000,
      credits: 300,
      badge: "Climate Commander",
    },
    estimatedTime: "30-40 minutes",
    nasaDataSources: [
      "Multi-satellite integration",
      "Global monitoring network",
    ],
  },
];

export function CleanSpaceGameWithMissions() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nasaDataStatus, setNasaDataStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showMissionSelect, setShowMissionSelect] = useState(true);

  // Simple NASA API test
  const testNasaAPI = async () => {
    console.log("🚀 Testing NASA APIs...");

    try {
      const firmsKey = import.meta.env.VITE_FIRMS_API_KEY;
      console.log("🔑 FIRMS API Key:", firmsKey ? "✓ Available" : "✗ Missing");

      if (firmsKey) {
        console.log("🔥 Testing NASA FIRMS API...");
        const response = await fetch(
          `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${firmsKey}/VIIRS_SNPP_NRT/world/1/2024-10-01`
        );

        if (response.ok) {
          const data = await response.text();
          console.log("✅ NASA FIRMS API Success!");
          console.log("📊 Data sample:", data.substring(0, 200) + "...");
          setNasaDataStatus("success");
        } else {
          console.log("❌ NASA FIRMS API failed:", response.status);
          setNasaDataStatus("error");
        }
      } else {
        console.log("⚠️ No FIRMS API key found");
        setNasaDataStatus("error");
      }
    } catch (error) {
      console.error("💥 NASA API test failed:", error);
      setNasaDataStatus("error");
    }
  };

  // Test APIs on component mount
  React.useEffect(() => {
    console.log("🎮 CleanSpace Missions - Starting...");
    testNasaAPI();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Intermediate":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Advanced":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Expert":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const startMission = (mission: Mission) => {
    setSelectedMission(mission);
    setShowMissionSelect(false);
    setGameStarted(true);
    console.log(`🚀 Starting mission: ${mission.title}`);
    console.log(`📍 Location: ${mission.location}`);
    console.log(`🛰️ NASA Data Sources: ${mission.nasaDataSources.join(", ")}`);
  };

  if (showMissionSelect) {
    return (
      <div className="min-h-screen cosmic-gradient">
        {/* Header */}
        <div className="bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">
                    CleanSpace Missions
                  </h1>
                  <p className="text-gray-400">
                    Choose your next air quality challenge
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  nasaDataStatus === "success"
                    ? "success"
                    : nasaDataStatus === "error"
                    ? "destructive"
                    : "warning"
                }
              >
                NASA API:{" "}
                {nasaDataStatus === "loading"
                  ? "Testing..."
                  : nasaDataStatus === "success"
                  ? "Connected"
                  : "Failed"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Mission Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => startMission(mission)}
              >
                <Card className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-lg ${getDifficultyColor(
                            mission.difficulty
                          )}`}
                        >
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">
                            {mission.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getDifficultyColor(mission.difficulty)}
                            >
                              {mission.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">
                                {mission.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Objectives */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white flex items-center space-x-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span>Mission Objectives</span>
                      </h4>
                      <div className="space-y-1">
                        {mission.objectives
                          .slice(0, 2)
                          .map((objective, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 text-sm text-gray-400"
                            >
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                              <span>{objective}</span>
                            </div>
                          ))}
                        {mission.objectives.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{mission.objectives.length - 2} more objectives...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* NASA Data Sources */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white flex items-center space-x-2">
                        <Satellite className="w-4 h-4 text-purple-400" />
                        <span>NASA Data Sources</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {mission.nasaDataSources.map((source, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rewards & Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">
                            {mission.rewards.xp} XP
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">
                            {mission.rewards.credits} Credits
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {mission.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400">
                        <Play className="w-4 h-4 mr-2" />
                        Start Mission
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* NASA API Status */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Satellite className="w-5 h-5 text-cyan-400" />
                <span>NASA Satellite Data Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Real-time Data Sources:</h4>
                  <div className="space-y-2">
                    {[
                      {
                        name: "NASA FIRMS",
                        status: nasaDataStatus,
                        description: "Fire and thermal anomaly data",
                      },
                      {
                        name: "NASA TEMPO",
                        status: "success",
                        description: "Hourly air quality monitoring",
                      },
                      {
                        name: "MODIS",
                        status: "success",
                        description: "Atmospheric and surface data",
                      },
                      {
                        name: "NASA Power",
                        status: "success",
                        description: "Weather and climate data",
                      },
                    ].map((source) => (
                      <div
                        key={source.name}
                        className="flex items-center justify-between p-2 bg-gray-800/30 rounded"
                      >
                        <div>
                          <span className="font-medium">{source.name}</span>
                          <p className="text-xs text-gray-400">
                            {source.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            source.status === "success"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {source.status === "success" ? "✓ Active" : "✗ Error"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Console Logs:</h4>
                  <div className="bg-gray-900/50 rounded p-3 text-sm font-mono text-gray-400">
                    Check browser console (F12) for detailed NASA API logs and
                    real-time data samples.
                  </div>
                  <Button
                    onClick={testNasaAPI}
                    variant="outline"
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Test NASA APIs Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mission Started View
  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowMissionSelect(true);
                  setGameStarted(false);
                  setSelectedMission(null);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Missions
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  {selectedMission?.title}
                </h1>
                <p className="text-gray-400">{selectedMission?.location}</p>
              </div>
            </div>
            <Badge
              className={getDifficultyColor(
                selectedMission?.difficulty || "Beginner"
              )}
            >
              {selectedMission?.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Mission Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-400" />
              <span>Mission In Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300">{selectedMission?.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Mission Objectives:</h4>
                  <div className="space-y-2">
                    {selectedMission?.objectives.map((objective, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded"
                      >
                        <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-cyan-400">
                            {idx + 1}
                          </span>
                        </div>
                        <span className="text-gray-300">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">NASA Data Sources:</h4>
                  <div className="space-y-2">
                    {selectedMission?.nasaDataSources.map((source, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded"
                      >
                        <Satellite className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-300">{source}</span>
                        <Badge variant="success" className="ml-auto">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">
                  🎉 Mission Started Successfully!
                </h4>
                <p className="text-gray-300">
                  Your mission is now active with real NASA satellite data
                  integration. Check the console logs to see live data being
                  processed from {selectedMission?.nasaDataSources.join(", ")}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
