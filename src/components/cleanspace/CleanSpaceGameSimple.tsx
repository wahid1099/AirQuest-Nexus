import React from "react";
import { motion } from "motion/react";
import { Gamepad2, MapPin, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function CleanSpaceGameSimple() {
  return (
    <div className="min-h-screen cosmic-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              CleanSpace Game
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Location-based air quality simulation powered by NASA data
          </p>
        </motion.div>

        {/* Game Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">New York City</p>
              <p className="text-sm text-gray-400">40.7128°N, 74.0060°W</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-blue-400">
                <Target className="w-5 h-5" />
                <span>Air Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">AQI 85</p>
              <p className="text-sm text-orange-400">Moderate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <Gamepad2 className="w-5 h-5" />
                <span>Mission Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">Ready</p>
              <p className="text-sm text-gray-400">Select a mission to start</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Game Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-400">
                The CleanSpace Game is currently being loaded. This is a
                simplified version.
              </p>
              <p className="text-sm text-gray-500">
                The full game includes NASA satellite data integration,
                real-time air quality monitoring, and interactive missions to
                improve air quality in various global locations.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400">
                  Start Mission
                </Button>
                <Button variant="outline">View Tutorial</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "NASA Data Integration",
              description:
                "Real-time satellite data from TEMPO, MODIS, and other NASA sources",
              icon: "🛰️",
            },
            {
              title: "Location-Based Missions",
              description:
                "Choose from global cities and tackle location-specific air quality challenges",
              icon: "🌍",
            },
            {
              title: "Interactive Gameplay",
              description:
                "Plant trees, reduce emissions, and see real-time impact on air quality",
              icon: "🎮",
            },
            {
              title: "Scientific Accuracy",
              description:
                "Based on real atmospheric science and environmental data",
              icon: "🔬",
            },
            {
              title: "Progress Tracking",
              description:
                "Earn points, unlock achievements, and track your environmental impact",
              icon: "📊",
            },
            {
              title: "Educational Content",
              description:
                "Learn about air pollution, climate science, and environmental solutions",
              icon: "📚",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:bg-gray-800/30 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
