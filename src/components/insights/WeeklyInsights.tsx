import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { WeeklyInsight } from "../../types";

const mockWeeklyInsights: WeeklyInsight[] = [
  {
    id: "1",
    week: "Oct 21-27, 2024",
    region: "Your Region (North America)",
    airQualityTrend: "improved",
    keyFindings: [
      "PM2.5 levels decreased by 15% compared to last week",
      "NO₂ concentrations dropped significantly near major highways",
      "Ozone levels remained stable despite temperature changes",
      "Wind patterns helped disperse pollutants more effectively",
    ],
    suggestedMissions: ["Particle Tracker", "Ozone Guardian"],
    personalizedMessage:
      "Great news! The air quality in your region improved this week. Your contributions to the Atmospheric Detective mission helped identify key pollution sources that are now being addressed by local authorities.",
  },
  {
    id: "2",
    week: "Oct 14-20, 2024",
    region: "Your Region (North America)",
    airQualityTrend: "worsened",
    keyFindings: [
      "PM2.5 levels increased by 8% due to wildfire smoke",
      "Formaldehyde concentrations spiked in industrial areas",
      "Temperature inversion trapped pollutants near ground level",
      "Weekend showed better air quality than weekdays",
    ],
    suggestedMissions: ["Climate Commander", "Pollution Pattern Predictor"],
    personalizedMessage:
      "This week showed some challenges with air quality due to external factors like wildfires. Your data analysis skills could help predict and mitigate similar events in the future.",
  },
  {
    id: "3",
    week: "Oct 7-13, 2024",
    region: "Your Region (North America)",
    airQualityTrend: "stable",
    keyFindings: [
      "Air quality remained consistent throughout the week",
      "Seasonal patterns are becoming more apparent",
      "Urban vs rural differences are clearly visible in data",
      "Weather conditions were favorable for air quality",
    ],
    suggestedMissions: ["Global Air Quality Simulator"],
    personalizedMessage:
      "Steady progress! This stable week provides excellent baseline data for understanding normal air quality patterns in your region.",
  },
];

interface WeeklyInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeeklyInsights({ isOpen, onClose }: WeeklyInsightsProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const currentInsight = mockWeeklyInsights[currentInsightIndex];

  const getTrendIcon = (trend: WeeklyInsight["airQualityTrend"]) => {
    switch (trend) {
      case "improved":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "worsened":
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case "stable":
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: WeeklyInsight["airQualityTrend"]) => {
    switch (trend) {
      case "improved":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "worsened":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      case "stable":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    }
  };

  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev + 1) % mockWeeklyInsights.length);
  };

  const prevInsight = () => {
    setCurrentInsightIndex(
      (prev) =>
        (prev - 1 + mockWeeklyInsights.length) % mockWeeklyInsights.length
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Insights Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
          >
            <Card className="bg-gray-900/95 border-gray-700 shadow-2xl">
              {/* Header */}
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Weekly Climate Insights
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        Personalized air quality analysis
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevInsight}
                    disabled={currentInsightIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {mockWeeklyInsights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentInsightIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentInsightIndex
                            ? "bg-cyan-400"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextInsight}
                    disabled={
                      currentInsightIndex === mockWeeklyInsights.length - 1
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInsightIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Week Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {currentInsight.week}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {currentInsight.region}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getTrendColor(
                          currentInsight.airQualityTrend
                        )}`}
                      >
                        {getTrendIcon(currentInsight.airQualityTrend)}
                        <span className="font-medium capitalize">
                          {currentInsight.airQualityTrend}
                        </span>
                      </div>
                    </div>

                    {/* Personalized Message */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 leading-relaxed">
                          {currentInsight.personalizedMessage}
                        </p>
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Key Findings</h4>
                      <div className="space-y-2">
                        {currentInsight.keyFindings.map((finding, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300 text-sm">{finding}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Missions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center space-x-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span>Suggested Missions</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentInsight.suggestedMissions.map(
                          (mission, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 cursor-pointer transition-colors"
                            >
                              {mission}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-700">
                      <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400">
                        Start Suggested Mission
                      </Button>
                      <Button variant="outline" className="flex-1">
                        View Detailed Report
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
