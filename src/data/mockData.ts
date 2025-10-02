export interface Mission {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  reward: string;
  progress: number;
  status: "active" | "completed" | "locked";
  type: "investigation" | "defense" | "strategy";
  xp: number;
}

export interface PollutantLayer {
  id: string;
  name: string;
  color: string;
  description: string;
  value?: string;
  trend?: "up" | "down" | "stable";
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface CommunityStats {
  activeMembers: number;
  dataPoints: string;
  cities: number;
}

export const pollutantLayers: PollutantLayer[] = [
  {
    id: "no2",
    name: "NO₂",
    color: "#ef4444",
    description: "Nitrogen Dioxide",
    value: "28.7 ppb",
    trend: "down",
  },
  {
    id: "pm25",
    name: "PM2.5",
    color: "#f59e0b",
    description: "Fine Particles",
    value: "18.2 μg/m³",
    trend: "stable",
  },
  {
    id: "o3",
    name: "O₃",
    color: "#8b5cf6",
    description: "Ozone",
    value: "45.1 ppb",
    trend: "up",
  },
  {
    id: "hcho",
    name: "HCHO",
    color: "#10b981",
    description: "Formaldehyde",
    value: "2.1 ppb",
    trend: "down",
  },
  {
    id: "aerosol",
    name: "Aerosol",
    color: "#00d9ff",
    description: "Aerosol Index",
    value: "0.8",
    trend: "stable",
  },
];

export const aiMissions: Mission[] = [
  {
    id: 1,
    title: "Atmospheric Detective",
    description:
      "Investigate air quality patterns using TEMPO satellite data to uncover pollution sources",
    difficulty: "Intermediate",
    reward: "2,500 XP + Data Detective Badge",
    progress: 75,
    status: "active",
    type: "investigation",
    xp: 2500,
  },
  {
    id: 2,
    title: "Ozone Guardian",
    description:
      "Deploy advanced algorithms to predict and prevent ozone depletion events",
    difficulty: "Expert",
    reward: "3,000 XP + Ozone Guardian Shield",
    progress: 0,
    status: "locked",
    type: "defense",
    xp: 3000,
  },
  {
    id: 3,
    title: "Climate Commander",
    description:
      "Lead strategic missions to optimize global air quality monitoring networks",
    difficulty: "Advanced",
    reward: "1,800 XP + Command Badge",
    progress: 100,
    status: "completed",
    type: "strategy",
    xp: 1800,
  },
  {
    id: 4,
    title: "Particle Tracker",
    description:
      "Track PM2.5 particles across continents using satellite imagery",
    difficulty: "Beginner",
    reward: "1,200 XP + Tracker Badge",
    progress: 45,
    status: "active",
    type: "investigation",
    xp: 1200,
  },
  {
    id: 5,
    title: "Pollution Pattern Predictor",
    description:
      "Use machine learning to predict air pollution patterns in major cities",
    difficulty: "Advanced",
    reward: "2,800 XP + AI Predictor Badge",
    progress: 0,
    status: "locked",
    type: "strategy",
    xp: 2800,
  },
  {
    id: 6,
    title: "Global Air Quality Simulator",
    description:
      "Run simulations to understand how weather affects air quality worldwide",
    difficulty: "Expert",
    reward: "3,500 XP + Simulation Master Badge",
    progress: 0,
    status: "locked",
    type: "simulation",
    xp: 3500,
  },
];

export const classicMissions: Mission[] = [
  {
    id: 1,
    title: "Data Collection Pioneer",
    description:
      "Collect atmospheric data from 50 different locations worldwide",
    difficulty: "Beginner",
    reward: "Pioneer Badge",
    progress: 80,
    status: "active",
    type: "investigation",
    xp: 1000,
  },
  {
    id: 2,
    title: "Analysis Expert",
    description: "Complete advanced analysis of air quality trends",
    difficulty: "Intermediate",
    reward: "Expert Badge",
    progress: 100,
    status: "completed",
    type: "strategy",
    xp: 1500,
  },
];

export const achievements: Achievement[] = [
  {
    id: 1,
    name: "Atmosphere Guardian",
    description: "Completed 10 atmospheric missions",
    icon: "Shield",
    earned: true,
  },
  {
    id: 2,
    name: "Data Detective",
    description: "Analyzed 1000+ data points",
    icon: "Search",
    earned: true,
  },
  {
    id: 3,
    name: "Climate Hero",
    description: "Helped reduce emissions by 5%",
    icon: "Heart",
    earned: false,
  },
  {
    id: 4,
    name: "Sky Explorer",
    description: "Visited 50+ locations",
    icon: "Compass",
    earned: true,
  },
  {
    id: 5,
    name: "Ozone Protector",
    description: "Prevented ozone depletion",
    icon: "Zap",
    earned: false,
  },
  {
    id: 6,
    name: "Global Citizen",
    description: "Connected with 100+ users",
    icon: "Users",
    earned: true,
  },
  {
    id: 7,
    name: "Tech Pioneer",
    description: "Used advanced AI tools",
    icon: "Cpu",
    earned: false,
  },
  {
    id: 8,
    name: "Earth Champion",
    description: "Top 1% contributor",
    icon: "Trophy",
    earned: false,
  },
  {
    id: 9,
    name: "Pollution Fighter",
    description: "Reduced local pollution",
    icon: "Sword",
    earned: true,
  },
  {
    id: 10,
    name: "Satellite Master",
    description: "Mastered TEMPO data",
    icon: "Satellite",
    earned: false,
  },
  {
    id: 11,
    name: "Community Leader",
    description: "Led community projects",
    icon: "Crown",
    earned: false,
  },
  {
    id: 12,
    name: "Innovation Star",
    description: "Created new solutions",
    icon: "Star",
    earned: true,
  },
];

export const communityStats: CommunityStats = {
  activeMembers: 24567,
  dataPoints: "1.2M",
  cities: 834,
};

export const globalStats = {
  activeSensors: 12847,
  dataPoints: "2.1M",
  cities: 634,
};

export const playerStats = {
  totalXP: 15420,
  missionsCompleted: 8,
  level: 15,
  globalRank: 247,
};

export const cities = [
  { name: "New York", country: "USA", aqi: 72, lat: 40.7128, lng: -74.006 },
  { name: "Beijing", country: "China", aqi: 156, lat: 39.9042, lng: 116.4074 },
  { name: "Delhi", country: "India", aqi: 201, lat: 28.7041, lng: 77.1025 },
  { name: "London", country: "UK", aqi: 45, lat: 51.5074, lng: -0.1278 },
  { name: "Tokyo", country: "Japan", aqi: 38, lat: 35.6762, lng: 139.6503 },
  {
    name: "Los Angeles",
    country: "USA",
    aqi: 89,
    lat: 34.0522,
    lng: -118.2437,
  },
];
