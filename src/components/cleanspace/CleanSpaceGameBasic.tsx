import React, { useState } from "react";
import { motion } from "motion/react";
import { Gamepad2, MapPin, Heart, Trophy, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function CleanSpaceGameBasic() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nasaDataStatus, setNasaDataStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  // Simple NASA API test
  const testNasaAPI = async () => {
    console.log("🚀 Testing NASA APIs...");

    try {
      // Test NASA FIRMS API
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
    console.log("🎮 CleanSpace Game Basic - Starting...");
    testNasaAPI();
  }, []);

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  CleanSpace Game
                </h1>
                <p className="text-gray-400">
                  NASA Satellite Data Integration Test
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

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">New York City</p>
                  <p className="text-xs text-gray-400">40.7128°N, 74.0060°W</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-semibold text-white">Health: 100%</p>
                  <p className="text-xs text-gray-400">Optimal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-semibold text-white">Credits: 100</p>
                  <p className="text-xs text-gray-400">Available funds</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="font-semibold text-orange-400">AQI: 85</p>
                  <p className="text-xs text-gray-400">Moderate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NASA API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <span>NASA API Integration Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <h3 className="font-semibold">NASA FIRMS API</h3>
                  <p className="text-sm text-gray-400">
                    Fire Information for Resource Management System
                  </p>
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
                  {nasaDataStatus === "loading"
                    ? "Testing..."
                    : nasaDataStatus === "success"
                    ? "Connected"
                    : "Failed"}
                </Badge>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Console Logs:</h4>
                <p className="text-sm text-gray-400 font-mono">
                  Check your browser console (F12) to see detailed NASA API
                  testing logs.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setGameStarted(!gameStarted)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {gameStarted ? "Stop Game" : "Start Game"}
                </Button>
                <Button onClick={testNasaAPI} variant="outline">
                  Test NASA APIs Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "VITE_FIRMS_API_KEY",
                  value: import.meta.env.VITE_FIRMS_API_KEY,
                },
                {
                  name: "VITE_OPENAQ_API_KEY",
                  value: import.meta.env.VITE_OPENAQ_API_KEY,
                },
                {
                  name: "VITE_AIRNOW_API_KEY",
                  value: import.meta.env.VITE_AIRNOW_API_KEY,
                },
                {
                  name: "VITE_GEMINI_API_KEY",
                  value: import.meta.env.VITE_GEMINI_API_KEY,
                },
              ].map((env) => (
                <div
                  key={env.name}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <span className="font-mono text-sm">{env.name}</span>
                  <Badge variant={env.value ? "success" : "destructive"}>
                    {env.value ? "✓ Loaded" : "✗ Missing"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              🎮 Game Started!
            </h2>
            <p className="text-gray-300">
              The CleanSpace Game is now running with NASA satellite data
              integration. Check the console logs to see real-time data loading.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
