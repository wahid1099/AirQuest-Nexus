import {
  GameLocation,
  AirQualityData,
  WeatherData,
  PlayerState,
  SimulationState,
  GameAction,
} from "../types";

// Gemini AI Configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "DEMO_KEY";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface AIRecommendation {
  type: "action" | "strategy" | "warning" | "encouragement";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  suggestedActions?: string[];
  reasoning: string;
}

export interface AIGameAnalysis {
  currentSituation: string;
  riskAssessment: string;
  recommendedStrategy: string;
  nextSteps: string[];
  motivationalMessage: string;
  environmentalImpact: string;
}

export class GeminiAiService {
  private cache: Map<string, unknown> = new Map();

  /**
   * Get AI recommendations based on current game state
   */
  async getGameRecommendations(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData,
    player: PlayerState,
    simulationState: SimulationState,
    recentActions: GameAction[]
  ): Promise<AIRecommendation[]> {
    const cacheKey = `recommendations_${location.id}_${airQuality.aqi}_${player.health}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as AIRecommendation[];
    }

    try {
      const prompt = this.buildRecommendationPrompt(
        location,
        airQuality,
        weather,
        player,
        simulationState,
        recentActions
      );

      const response = await this.callGeminiAPI(prompt);
      const recommendations = this.parseRecommendations(response);

      this.cache.set(cacheKey, recommendations);
      return recommendations;
    } catch {
      console.error("Error getting AI recommendations");
      return this.getFallbackRecommendations(airQuality, player);
    }
  }

  /**
   * Get comprehensive game analysis
   */
  async getGameAnalysis(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData,
    player: PlayerState,
    simulationState: SimulationState
  ): Promise<AIGameAnalysis> {
    const cacheKey = `analysis_${location.id}_${airQuality.aqi}_${simulationState.timeRemaining}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as AIGameAnalysis;
    }

    try {
      const prompt = this.buildAnalysisPrompt(
        location,
        airQuality,
        weather,
        player,
        simulationState
      );

      const response = await this.callGeminiAPI(prompt);
      const analysis = this.parseAnalysis(response);

      this.cache.set(cacheKey, analysis);
      return analysis;
    } catch {
      console.error("Error getting AI analysis");
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Get personalized tips for air quality improvement
   */
  async getAirQualityTips(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData
  ): Promise<string[]> {
    const cacheKey = `tips_${location.id}_${airQuality.aqi}_${weather.windSpeed}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as string[];
    }

    try {
      const prompt = this.buildTipsPrompt(location, airQuality, weather);
      const response = await this.callGeminiAPI(prompt);
      const tips = this.parseTips(response);

      this.cache.set(cacheKey, tips);
      return tips;
    } catch {
      console.error("Error getting AI tips");
      return this.getFallbackTips();
    }
  }

  /**
   * Get environmental education content
   */
  async getEnvironmentalEducation(
    topic: string,
    location: GameLocation,
    airQuality: AirQualityData
  ): Promise<{ title: string; content: string; keyPoints: string[] }> {
    const cacheKey = `education_${topic}_${location.id}_${airQuality.aqi}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as {
        title: string;
        content: string;
        keyPoints: string[];
      };
    }

    try {
      const prompt = this.buildEducationPrompt(topic, location, airQuality);
      const response = await this.callGeminiAPI(prompt);
      const education = this.parseEducation(response);

      this.cache.set(cacheKey, education);
      return education;
    } catch {
      console.error("Error getting AI education");
      return this.getFallbackEducation(topic);
    }
  }

  /**
   * Build recommendation prompt for Gemini
   */
  private buildRecommendationPrompt(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData,
    player: PlayerState,
    simulationState: SimulationState,
    recentActions: GameAction[]
  ): string {
    return `
You are an AI assistant for CleanSpace, a serious game about improving air quality using real NASA data. 

Current Game State:
- Location: ${location.name}, ${location.city}, ${location.country}
- Air Quality Index (AQI): ${airQuality.aqi} (PM2.5: ${
      airQuality.pm25
    } µg/m³, NO2: ${airQuality.no2} ppb)
- Weather: ${weather.temperature}°C, ${weather.humidity}% humidity, ${
      weather.windSpeed
    } m/s wind
- Player Health: ${player.health}%, Energy: ${player.energy}%, Credits: ${
      player.credits
    }
- Time Remaining: ${Math.floor(simulationState.timeRemaining / 3600)} hours
- Target AQI: ${simulationState.targetAQI}
- Recent Actions: ${recentActions.map((a) => a.type).join(", ")}

Provide 3-5 specific, actionable recommendations for the player. Consider:
1. Current air quality level and health risks
2. Available resources (credits, time)
3. Weather conditions affecting air quality
4. Most effective actions for this location
5. Player's health status and disguise (asthma/allergy patient)

Format as JSON array with: type, priority, title, message, suggestedActions, reasoning
    `.trim();
  }

  /**
   * Build analysis prompt for Gemini
   */
  private buildAnalysisPrompt(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData,
    player: PlayerState,
    simulationState: SimulationState
  ): string {
    return `
You are analyzing the current state of a CleanSpace air quality improvement mission.

Game Context:
- Location: ${location.name}, ${location.city}, ${location.country}
- Current AQI: ${airQuality.aqi} (Target: ${simulationState.targetAQI})
- Air Quality: PM2.5 ${airQuality.pm25} µg/m³, NO2 ${airQuality.no2} ppb, O3 ${
      airQuality.o3
    } ppb
- Weather: ${weather.temperature}°C, ${weather.humidity}% humidity, ${
      weather.windSpeed
    } m/s wind
- Player: ${player.health}% health, ${player.energy}% energy, ${
      player.credits
    } credits
- Time Left: ${Math.floor(simulationState.timeRemaining / 3600)} hours
- Actions Taken: ${simulationState.actionsApplied.length}

Provide a comprehensive analysis including:
1. Current situation assessment
2. Risk assessment for the player
3. Recommended strategy
4. Next steps
5. Motivational message
6. Environmental impact explanation

Format as JSON with: currentSituation, riskAssessment, recommendedStrategy, nextSteps, motivationalMessage, environmentalImpact
    `.trim();
  }

  /**
   * Build tips prompt for Gemini
   */
  private buildTipsPrompt(
    location: GameLocation,
    airQuality: AirQualityData,
    weather: WeatherData
  ): string {
    return `
Provide 5 practical tips for improving air quality in ${location.name}, ${location.city}.

Current conditions:
- AQI: ${airQuality.aqi} (PM2.5: ${airQuality.pm25} µg/m³)
- Weather: ${weather.temperature}°C, ${weather.humidity}% humidity, ${weather.windSpeed} m/s wind

Focus on actionable, science-based recommendations that players can implement in the game.
Return as a JSON array of strings.
    `.trim();
  }

  /**
   * Build education prompt for Gemini
   */
  private buildEducationPrompt(
    topic: string,
    location: GameLocation,
    airQuality: AirQualityData
  ): string {
    return `
Create educational content about "${topic}" in the context of air quality improvement.

Context:
- Location: ${location.name}, ${location.city}
- Current AQI: ${airQuality.aqi}
- Target audience: Players learning about environmental science

Provide:
1. A clear, engaging title
2. Educational content (2-3 paragraphs)
3. 3-5 key points to remember

Format as JSON with: title, content, keyPoints
    `.trim();
  }

  /**
   * Call Gemini API
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (GEMINI_API_KEY === "DEMO_KEY") {
      // Return mock response for development
      return this.getMockResponse(prompt);
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Parse recommendations from AI response
   */
  private parseRecommendations(response: string): AIRecommendation[] {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If JSON parsing fails, try to extract recommendations from text
      console.warn("Failed to parse recommendations as JSON, using fallback");
    }

    return this.getFallbackRecommendations(null, null);
  }

  /**
   * Parse analysis from AI response
   */
  private parseAnalysis(response: string): AIGameAnalysis {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      console.warn("Failed to parse analysis as JSON, using fallback");
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Parse tips from AI response
   */
  private parseTips(response: string): string[] {
    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      console.warn("Failed to parse tips as JSON, using fallback");
    }

    return this.getFallbackTips();
  }

  /**
   * Parse education from AI response
   */
  private parseEducation(response: string): {
    title: string;
    content: string;
    keyPoints: string[];
  } {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      console.warn("Failed to parse education as JSON, using fallback");
      return this.getFallbackEducation("air quality");
    }
  }

  /**
   * Get fallback recommendations
   */
  private getFallbackRecommendations(
    airQuality: AirQualityData | null,
    player: PlayerState | null
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    if (airQuality && airQuality.aqi > 100) {
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "High Air Pollution Detected",
        message:
          "The air quality is unhealthy. Consider relocating to a safer area or taking immediate action to reduce pollution.",
        suggestedActions: ["plant_tree", "remove_vehicle"],
        reasoning:
          "High AQI levels pose health risks to sensitive individuals.",
      });
    }

    if (player && player.health < 50) {
      recommendations.push({
        type: "warning",
        priority: "critical",
        title: "Low Health Warning",
        message:
          "Your health is critically low. Seek clean air immediately to recover.",
        suggestedActions: ["relocate"],
        reasoning: "Health below 50% requires immediate attention.",
      });
    }

    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Focus on High-Impact Actions",
      message:
        "Plant trees and remove vehicles for maximum air quality improvement.",
      suggestedActions: ["plant_tree", "remove_vehicle"],
      reasoning: "These actions provide the best cost-benefit ratio.",
    });

    return recommendations;
  }

  /**
   * Get fallback analysis
   */
  private getFallbackAnalysis(): AIGameAnalysis {
    return {
      currentSituation:
        "You are working to improve air quality in your selected location. The current air quality index indicates moderate pollution levels.",
      riskAssessment:
        "The pollution levels pose moderate health risks, especially for sensitive individuals like asthma patients.",
      recommendedStrategy:
        "Focus on planting trees and reducing vehicle emissions for maximum impact.",
      nextSteps: [
        "Plant trees in available empty lots",
        "Remove polluting vehicles from the area",
        "Monitor your health and relocate if needed",
      ],
      motivationalMessage:
        "Every action you take makes a real difference in improving air quality for everyone!",
      environmentalImpact:
        "Your actions help reduce PM2.5 and NO2 levels, creating a healthier environment for the community.",
    };
  }

  /**
   * Get fallback tips
   */
  private getFallbackTips(): string[] {
    return [
      "Plant trees strategically to create wind barriers and filter pollutants",
      "Remove vehicles from high-traffic areas during peak hours",
      "Install rooftop gardens to increase green space in urban areas",
      "Coordinate with other players for maximum impact",
      "Monitor weather conditions as wind helps disperse pollutants",
    ];
  }

  /**
   * Get fallback education
   */
  private getFallbackEducation(topic: string): {
    title: string;
    content: string;
    keyPoints: string[];
  } {
    return {
      title: `Understanding ${topic}`,
      content: `This topic is important for understanding air quality and environmental health. Learning about these concepts helps you make better decisions in the game and in real life.`,
      keyPoints: [
        "Knowledge is power in environmental protection",
        "Small actions can have big impacts",
        "Science guides effective solutions",
        "Community effort is essential",
        "Every improvement matters",
      ],
    };
  }

  /**
   * Get mock response for development
   */
  private getMockResponse(prompt: string): string {
    if (prompt.includes("recommendations")) {
      return JSON.stringify([
        {
          type: "action",
          priority: "high",
          title: "Plant Trees Now",
          message:
            "Planting trees will immediately improve air quality in your area.",
          suggestedActions: ["plant_tree"],
          reasoning:
            "Trees are highly effective at filtering PM2.5 and other pollutants.",
        },
        {
          type: "strategy",
          priority: "medium",
          title: "Optimize Your Resources",
          message:
            "Focus on high-impact, low-cost actions to maximize your effectiveness.",
          suggestedActions: ["remove_vehicle", "plant_tree"],
          reasoning: "These actions provide the best return on investment.",
        },
      ]);
    }

    if (prompt.includes("analysis")) {
      return JSON.stringify({
        currentSituation:
          "You are making good progress in improving air quality. The current AQI shows moderate pollution levels.",
        riskAssessment:
          "Moderate health risks present. Continue monitoring your health status.",
        recommendedStrategy:
          "Continue with tree planting and vehicle removal for optimal results.",
        nextSteps: [
          "Plant more trees",
          "Remove additional vehicles",
          "Monitor air quality changes",
        ],
        motivationalMessage:
          "Great work! Your efforts are making a real difference.",
        environmentalImpact:
          "Your actions are reducing harmful pollutants and creating a healthier environment.",
      });
    }

    return JSON.stringify(["Mock response for development"]);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const geminiAiService = new GeminiAiService();
