import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Lightbulb,
  AlertTriangle,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  GameLocation,
  AirQualityData,
  WeatherData,
  PlayerState,
  SimulationState,
  GameAction,
} from "../../types";
import {
  geminiAiService,
  AIRecommendation,
  AIGameAnalysis,
} from "../../services/geminiAiService";

interface AIGameAssistantProps {
  location: GameLocation;
  airQuality: AirQualityData;
  weather: WeatherData;
  player: PlayerState;
  simulationState: SimulationState;
  recentActions: GameAction[];
  onRecommendationClick?: (actionType: string) => void;
}

export function AIGameAssistant({
  location,
  airQuality,
  weather,
  player,
  simulationState,
  recentActions,
  onRecommendationClick,
}: AIGameAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    []
  );
  const [analysis, setAnalysis] = useState<AIGameAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "recommendations" | "analysis" | "tips"
  >("recommendations");

  useEffect(() => {
    if (isOpen) {
      loadAIInsights();
    }
  }, [isOpen, airQuality.aqi, player.health, simulationState.timeRemaining]);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      const [recs, anal] = await Promise.all([
        geminiAiService.getGameRecommendations(
          location,
          airQuality,
          weather,
          player,
          simulationState,
          recentActions
        ),
        geminiAiService.getGameAnalysis(
          location,
          airQuality,
          weather,
          player,
          simulationState
        ),
      ]);

      setRecommendations(recs);
      setAnalysis(anal);
    } catch (error) {
      console.error("Error loading AI insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "action":
        return <Target className="w-4 h-4" />;
      case "strategy":
        return <Brain className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "encouragement":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 left-6 z-50 ${
        isExpanded ? "w-96" : "w-80"
      } transition-all duration-300`}
    >
      <Card className="bg-white/95 backdrop-blur-sm border shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Game Assistant</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {[
              { id: "recommendations", label: "Tips", icon: Lightbulb },
              { id: "analysis", label: "Analysis", icon: Brain },
              { id: "tips", label: "Learn", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 rounded-none ${
                    activeTab === tab.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Content */}
          <div className="h-80 overflow-y-auto p-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">AI is thinking...</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "recommendations" && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-start space-x-2 mb-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {getTypeIcon(rec.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-sm">
                                {rec.title}
                              </h4>
                              <Badge
                                className={`text-xs ${getPriorityColor(
                                  rec.priority
                                )}`}
                              >
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {rec.message}
                            </p>
                            {rec.suggestedActions &&
                              rec.suggestedActions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {rec.suggestedActions.map((action, idx) => (
                                    <Button
                                      key={idx}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-6"
                                      onClick={() =>
                                        onRecommendationClick?.(action)
                                      }
                                    >
                                      {action.replace("_", " ")}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            <p className="text-xs text-gray-500 italic">
                              {rec.reasoning}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "analysis" && analysis && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-sm text-blue-800 mb-2">
                        Current Situation
                      </h4>
                      <p className="text-sm text-blue-700">
                        {analysis.currentSituation}
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                        Risk Assessment
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {analysis.riskAssessment}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-sm text-green-800 mb-2">
                        Recommended Strategy
                      </h4>
                      <p className="text-sm text-green-700">
                        {analysis.recommendedStrategy}
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-sm text-purple-800 mb-2">
                        Next Steps
                      </h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {analysis.nextSteps.map((step, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <h4 className="font-semibold text-sm text-pink-800 mb-2">
                        Motivation
                      </h4>
                      <p className="text-sm text-pink-700">
                        {analysis.motivationalMessage}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-sm text-emerald-800 mb-2">
                        Environmental Impact
                      </h4>
                      <p className="text-sm text-emerald-700">
                        {analysis.environmentalImpact}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "tips" && (
                  <motion.div
                    key="tips"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center mb-4">
                      <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-800">
                        Air Quality Tips
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        "Plant trees strategically to create wind barriers and filter pollutants",
                        "Remove vehicles from high-traffic areas during peak hours",
                        "Install rooftop gardens to increase green space in urban areas",
                        "Monitor weather conditions as wind helps disperse pollutants",
                        "Coordinate with other players for maximum impact",
                        "Focus on high-impact, low-cost actions first",
                        "Keep track of your health and relocate when needed",
                        "Use NASA data to understand local pollution patterns",
                      ].map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-600">
                  Powered by Gemini AI
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadAIInsights}
                disabled={isLoading}
                className="text-xs"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
