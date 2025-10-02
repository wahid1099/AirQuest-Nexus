// Core types for the AI Quest Missions System

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  level: number;
  totalXP: number;
  globalRank: number;
  joinDate: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "dark" | "light";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    weeklyInsights: boolean;
    missionReminders: boolean;
  };
  apiConnections: {
    nasa: boolean;
    gemini: boolean;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  type: "investigation" | "defense" | "strategy" | "simulation";
  xp: number;
  badges: string[];
  progress: number;
  status: "locked" | "available" | "in_progress" | "completed";
  prerequisites?: string[];
  estimatedTime: number; // in minutes
  objectives: string[];
  interactiveElements: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: "drag_drop" | "quiz" | "simulation" | "data_analysis";
  title: string;
  description: string;
  data?: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
}

export interface Notification {
  id: string;
  type:
    | "mission_complete"
    | "badge_earned"
    | "level_up"
    | "weekly_insight"
    | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: {
    missionId?: string;
    datasetId?: string;
    type?: "mission_help" | "data_guidance" | "quiz" | "storytelling";
  };
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  totalXP: number;
  level: number;
  badgeCount: number;
}

export interface WeeklyInsight {
  id: string;
  week: string;
  region: string;
  airQualityTrend: "improved" | "worsened" | "stable";
  keyFindings: string[];
  suggestedMissions: string[];
  personalizedMessage: string;
}

// CleanSpace Game Types
export interface GameLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  regionSize: number; // km
  city: string;
  country: string;
}

export interface AirQualityData {
  aqi: number;
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // ppb
  o3: number; // ppb
  co: number; // ppm
  so2: number; // ppb
  timestamp: Date;
  source: "nasa_power" | "merra2" | "modis" | "simulated";
  uncertainty?: number;
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  windDirection: number; // degrees
  pressure: number; // hPa
  precipitation: number; // mm
  visibility: number; // km
  timestamp: Date;
  source: "nasa_power";
}

export interface PlayerState {
  id: string;
  health: number; // 0-100
  energy: number; // 0-100
  credits: number;
  disguise: "asthma_patient" | "allergy_patient";
  location: GameLocation;
  safeTimeRemaining: number; // seconds
  isInSafeZone: boolean;
  inventory: PlayerInventory;
}

export interface PlayerInventory {
  saplings: number;
  credits: number;
  tools: string[];
  upgrades: string[];
}

export interface GameAction {
  id: string;
  type:
    | "plant_tree"
    | "plant_rooftop_garden"
    | "remove_vehicle"
    | "shutdown_factory"
    | "retrofit_factory"
    | "remove_construction"
    | "relocate";
  location: {
    latitude: number;
    longitude: number;
    area: number; // m²
  };
  cost: number;
  cooldown: number; // seconds
  effect: ActionEffect;
  timestamp: Date;
  status: "pending" | "active" | "completed" | "failed";
}

export interface ActionEffect {
  pm25Change: number; // µg/m³
  no2Change: number; // ppb
  o3Change: number; // ppb
  areaOfEffect: number; // m radius
  duration: number; // hours
  description: string;
}

export interface LandParcel {
  id: string;
  type: "empty_lot" | "rooftop" | "building" | "road" | "park" | "industrial";
  area: number; // m²
  coordinates: {
    latitude: number;
    longitude: number;
  };
  owner?: string;
  canPlant: boolean;
  canDemolish: boolean;
  currentUse: string;
}

export interface SimulationState {
  currentAQI: number;
  baselineAQI: number;
  targetAQI: number;
  timeRemaining: number; // seconds
  actionsApplied: GameAction[];
  predictedTrajectory: AirQualityData[];
  healthImpact: {
    currentExposure: number;
    safeThreshold: number;
    recoveryRate: number;
  };
}

export interface NASADataResponse {
  power: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    precipitation: number;
    timestamp: Date;
  };
  merra2: {
    pm25: number;
    no2: number;
    o3: number;
    timestamp: Date;
  };
  modis: {
    aod: number;
    timestamp: Date;
  };
}

export interface GameSession {
  id: string;
  playerId: string;
  location: GameLocation;
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "failed" | "paused";
  score: number;
  achievements: string[];
  finalAQI: number;
  actionsCompleted: number;
}

export interface HealthPrecaution {
  level:
    | "good"
    | "moderate"
    | "unhealthy_sensitive"
    | "unhealthy"
    | "very_unhealthy"
    | "hazardous";
  message: string;
  recommendations: string[];
  maskRequired: boolean;
  avoidOutdoorActivity: boolean;
}

export interface GameConfig {
  safeAQIThreshold: number;
  healthDrainRate: number; // per minute
  recoveryRate: number; // per minute in safe zone
  missionTimeLimit: number; // seconds
  actionCooldowns: Record<string, number>;
  actionCosts: Record<string, number>;
  simulationParameters: {
    treeEffectRadius: number;
    vehicleEffectRadius: number;
    factoryEffectRadius: number;
    mixingVolume: number;
    exposureFactor: number;
  };
}
