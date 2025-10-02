import { GameLocation } from "../types";

export interface MissionObjective {
  id: string;
  type: 'reduce_aqi' | 'plant_trees' | 'remove_pollution' | 'time_limit' | 'budget_limit' | 'satellite_data' | 'community_engagement';
  target: number;
  current: number;
  description: string;
  points: number;
  isCompleted: boolean;
}

export interface MissionLevel {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  description: string;
  location: GameLocation;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'legendary';
  estimatedTime: number; // in minutes
  initialCredits: number;
  objectives: MissionObjective[];
  unlockRequirements: {
    previousLevel?: string;
    totalScore?: number;
    achievementsRequired?: string[];
  };
  rewards: {
    credits: number;
    xp: number;
    achievements: string[];
    unlocksNext: string[];
  };
  nasaDataSources: string[];
  realWorldContext: string;
  scientificFacts: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
  completionTime?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress: {
    current: number;
    target: number;
  };
}

// Mission Level Configurations
export const missionLevels: MissionLevel[] = [
  // BEGINNER LEVELS (1-3)
  {
    id: "mission_001",
    level: 1,
    title: "First Steps to Clean Air",
    subtitle: "New York City Training Mission",
    description: "Learn the basics of air quality management in one of the world's busiest cities. Use NASA satellite data to identify pollution hotspots and take your first actions to improve air quality.",
    location: {
      id: "nyc_training",
      name: "New York City",
      latitude: 40.7128,
      longitude: -74.006,
      regionSize: 3,
      city: "New York",
      country: "USA",
    },
    difficulty: "beginner",
    estimatedTime: 15,
    initialCredits: 500,
    objectives: [
      {
        id: "obj_001_1",
        type: "reduce_aqi",
        target: 80,
        current: 0,
        description: "Reduce AQI from 120 to 80 or below",
        points: 100,
        isCompleted: false,
      },
      {
        id: "obj_001_2",
        type: "plant_trees",
        target: 5,
        current: 0,
        description: "Plant 5 trees in the city",
        points: 50,
        isCompleted: false,
      },
    ],
    unlockRequirements: {},
    rewards: {
      credits: 200,
      xp: 100,
      achievements: ["first_mission", "tree_planter"],
      unlocksNext: ["mission_002"],
    },
    nasaDataSources: ["MODIS", "OMI"],
    realWorldContext: "New York City faces significant air quality challenges due to traffic, industry, and population density. NASA's satellite data helps monitor NO2 and particulate matter levels.",
    scientificFacts: [
      "NASA's OMI instrument can detect NO2 pollution from space with 13x24 km resolution",
      "Trees can reduce particulate matter by up to 27% in urban areas",
      "Air pollution causes over 200,000 premature deaths annually in the US"
    ],
    isUnlocked: true,
    isCompleted: false,
  },
  {
    id: "mission_002",
    level: 2,
    title: "Smog City Challenge",
    subtitle: "Los Angeles Air Quality Crisis",
    description: "Tackle the infamous Los Angeles smog using advanced NASA TEMPO data. Learn about photochemical smog formation and implement targeted solutions.",
    location: {
      id: "la_smog",
      name: "Los Angeles",
      latitude: 34.0522,
      longitude: -118.2437,
      regionSize: 4,
      city: "Los Angeles",
      country: "USA",
    },
    difficulty: "beginner",
    estimatedTime: 20,
    initialCredits: 600,
    objectives: [
      {
        id: "obj_002_1",
        type: "reduce_aqi",
        target: 75,
        current: 0,
        description: "Reduce AQI from 140 to 75 using TEMPO data insights",
        points: 150,
        isCompleted: false,
      },
      {
        id: "obj_002_2",
        type: "remove_pollution",
        target: 3,
        current: 0,
        description: "Remove 3 major pollution sources",
        points: 100,
        isCompleted: false,
      },
      {
        id: "obj_002_3",
        type: "time_limit",
        target: 1200, // 20 minutes
        current: 0,
        description: "Complete mission within 20 minutes",
        points: 75,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_001",
    },
    rewards: {
      credits: 300,
      xp: 150,
      achievements: ["smog_fighter", "tempo_user"],
      unlocksNext: ["mission_003"],
    },
    nasaDataSources: ["TEMPO", "MODIS", "VIIRS"],
    realWorldContext: "Los Angeles pioneered air quality monitoring and has reduced pollution by 80% since the 1980s despite population growth, thanks to regulations and technology.",
    scientificFacts: [
      "NASA's TEMPO provides hourly pollution measurements over North America",
      "Ozone forms when NOx and VOCs react in sunlight - peak levels occur in afternoon",
      "LA's geography traps pollution in a basin surrounded by mountains"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "mission_003",
    level: 3,
    title: "Wildfire Smoke Response",
    subtitle: "California Emergency Management",
    description: "Respond to a wildfire emergency using NASA MODIS fire detection data. Coordinate air quality protection measures for affected communities.",
    location: {
      id: "california_fires",
      name: "Northern California",
      latitude: 38.5816,
      longitude: -121.4944,
      regionSize: 6,
      city: "Sacramento",
      country: "USA",
    },
    difficulty: "intermediate",
    estimatedTime: 25,
    initialCredits: 800,
    objectives: [
      {
        id: "obj_003_1",
        type: "satellite_data",
        target: 5,
        current: 0,
        description: "Analyze 5 MODIS fire detection points",
        points: 100,
        isCompleted: false,
      },
      {
        id: "obj_003_2",
        type: "community_engagement",
        target: 1000,
        current: 0,
        description: "Protect 1000+ residents from smoke exposure",
        points: 200,
        isCompleted: false,
      },
      {
        id: "obj_003_3",
        type: "reduce_aqi",
        target: 100,
        current: 0,
        description: "Maintain AQI below 100 in safe zones",
        points: 150,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_002",
    },
    rewards: {
      credits: 400,
      xp: 200,
      achievements: ["fire_responder", "community_protector"],
      unlocksNext: ["mission_004"],
    },
    nasaDataSources: ["MODIS", "VIIRS", "GOES-16"],
    realWorldContext: "Wildfires are increasing in frequency and intensity due to climate change. NASA satellites provide critical real-time data for emergency response.",
    scientificFacts: [
      "MODIS detects fires as small as 1000m² under ideal conditions",
      "Wildfire smoke can travel thousands of miles and affect air quality globally",
      "PM2.5 from wildfires is particularly harmful to human health"
    ],
    isUnlocked: false,
    isCompleted: false,
  },

  // INTERMEDIATE LEVELS (4-6)
  {
    id: "mission_004",
    level: 4,
    title: "Global Pollution Detective",
    subtitle: "Delhi Air Quality Crisis",
    description: "Investigate the complex air pollution sources in Delhi using multiple NASA instruments. Address seasonal pollution patterns and agricultural burning.",
    location: {
      id: "delhi_crisis",
      name: "Delhi",
      latitude: 28.6139,
      longitude: 77.209,
      regionSize: 5,
      city: "Delhi",
      country: "India",
    },
    difficulty: "intermediate",
    estimatedTime: 30,
    initialCredits: 1000,
    objectives: [
      {
        id: "obj_004_1",
        type: "reduce_aqi",
        target: 150,
        current: 0,
        description: "Reduce AQI from 300+ to 150 (Unhealthy to Moderate)",
        points: 250,
        isCompleted: false,
      },
      {
        id: "obj_004_2",
        type: "satellite_data",
        target: 10,
        current: 0,
        description: "Analyze crop burning hotspots using MODIS data",
        points: 150,
        isCompleted: false,
      },
      {
        id: "obj_004_3",
        type: "budget_limit",
        target: 1200,
        current: 0,
        description: "Complete mission within budget of 1200 credits",
        points: 100,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_003",
      totalScore: 500,
    },
    rewards: {
      credits: 500,
      xp: 300,
      achievements: ["global_guardian", "budget_master"],
      unlocksNext: ["mission_005"],
    },
    nasaDataSources: ["MODIS", "OMI", "AIRS", "CALIPSO"],
    realWorldContext: "Delhi experiences some of the world's worst air pollution, especially during winter when crop burning combines with local emissions and meteorological conditions.",
    scientificFacts: [
      "Delhi's PM2.5 levels can exceed WHO guidelines by 10-15 times during winter",
      "Agricultural burning in Punjab and Haryana contributes 20-40% of Delhi's pollution",
      "NASA's CALIPSO lidar can track pollution plumes in 3D"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "mission_005",
    level: 5,
    title: "Industrial Transformation",
    subtitle: "Beijing Manufacturing District",
    description: "Transform a heavy industrial area in Beijing using NASA's multi-spectral analysis. Balance economic needs with environmental protection.",
    location: {
      id: "beijing_industrial",
      name: "Beijing Industrial Zone",
      latitude: 39.9042,
      longitude: 116.4074,
      regionSize: 4,
      city: "Beijing",
      country: "China",
    },
    difficulty: "intermediate",
    estimatedTime: 35,
    initialCredits: 1200,
    objectives: [
      {
        id: "obj_005_1",
        type: "reduce_aqi",
        target: 100,
        current: 0,
        description: "Achieve 'Moderate' AQI (≤100) in industrial zone",
        points: 300,
        isCompleted: false,
      },
      {
        id: "obj_005_2",
        type: "remove_pollution",
        target: 8,
        current: 0,
        description: "Retrofit or shutdown 8 polluting facilities",
        points: 200,
        isCompleted: false,
      },
      {
        id: "obj_005_3",
        type: "satellite_data",
        target: 15,
        current: 0,
        description: "Use 15 different satellite measurements for analysis",
        points: 150,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_004",
      achievementsRequired: ["global_guardian"],
    },
    rewards: {
      credits: 600,
      xp: 400,
      achievements: ["industrial_reformer", "satellite_expert"],
      unlocksNext: ["mission_006"],
    },
    nasaDataSources: ["MODIS", "OMI", "TROPOMI", "AIRS", "MISR"],
    realWorldContext: "China has made significant investments in clean technology and pollution control, reducing PM2.5 levels by over 40% in major cities since 2013.",
    scientificFacts: [
      "NASA's TROPOMI instrument provides the highest resolution NO2 measurements from space",
      "Industrial emissions can be tracked and verified using satellite data",
      "Beijing's air quality has improved dramatically due to policy interventions"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "mission_006",
    level: 6,
    title: "Saharan Dust Storm",
    subtitle: "Trans-Atlantic Pollution Transport",
    description: "Track and mitigate the effects of a massive Saharan dust storm affecting air quality from Africa to the Americas using NASA's global monitoring network.",
    location: {
      id: "saharan_dust",
      name: "Atlantic Dust Corridor",
      latitude: 15.0,
      longitude: -25.0,
      regionSize: 10,
      city: "Cape Verde",
      country: "Atlantic Ocean",
    },
    difficulty: "advanced",
    estimatedTime: 40,
    initialCredits: 1500,
    objectives: [
      {
        id: "obj_006_1",
        type: "satellite_data",
        target: 20,
        current: 0,
        description: "Track dust storm across 20 satellite observation points",
        points: 250,
        isCompleted: false,
      },
      {
        id: "obj_006_2",
        type: "community_engagement",
        target: 5000,
        current: 0,
        description: "Issue health advisories to 5000+ affected residents",
        points: 200,
        isCompleted: false,
      },
      {
        id: "obj_006_3",
        type: "reduce_aqi",
        target: 120,
        current: 0,
        description: "Minimize AQI impact in affected coastal cities",
        points: 300,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_005",
      totalScore: 1000,
    },
    rewards: {
      credits: 800,
      xp: 500,
      achievements: ["dust_tracker", "global_coordinator"],
      unlocksNext: ["mission_007"],
    },
    nasaDataSources: ["MODIS", "CALIPSO", "MISR", "GOES-16", "Suomi NPP"],
    realWorldContext: "Saharan dust storms transport billions of tons of dust across the Atlantic, affecting air quality and providing nutrients to Amazon rainforests.",
    scientificFacts: [
      "Saharan dust can travel over 5000 miles across the Atlantic Ocean",
      "NASA's CALIPSO uses lidar to create 3D maps of dust plumes",
      "Dust storms can both harm air quality and fertilize ocean ecosystems"
    ],
    isUnlocked: false,
    isCompleted: false,
  },

  // ADVANCED LEVELS (7-9)
  {
    id: "mission_007",
    level: 7,
    title: "Arctic Pollution Paradox",
    subtitle: "Remote Arctic Air Quality",
    description: "Investigate unexpected pollution in the pristine Arctic using NASA's polar-orbiting satellites. Discover long-range transport effects and climate connections.",
    location: {
      id: "arctic_pollution",
      name: "Arctic Research Station",
      latitude: 71.0,
      longitude: -8.0,
      regionSize: 8,
      city: "Svalbard",
      country: "Norway",
    },
    difficulty: "advanced",
    estimatedTime: 45,
    initialCredits: 2000,
    objectives: [
      {
        id: "obj_007_1",
        type: "satellite_data",
        target: 25,
        current: 0,
        description: "Analyze Arctic haze using polar satellite data",
        points: 300,
        isCompleted: false,
      },
      {
        id: "obj_007_2",
        type: "reduce_aqi",
        target: 50,
        current: 0,
        description: "Maintain pristine Arctic air quality (AQI ≤50)",
        points: 400,
        isCompleted: false,
      },
      {
        id: "obj_007_3",
        type: "time_limit",
        target: 2700, // 45 minutes
        current: 0,
        description: "Complete complex analysis within time limit",
        points: 200,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_006",
      achievementsRequired: ["dust_tracker", "satellite_expert"],
    },
    rewards: {
      credits: 1000,
      xp: 600,
      achievements: ["arctic_guardian", "climate_detective"],
      unlocksNext: ["mission_008"],
    },
    nasaDataSources: ["MODIS", "OMI", "CALIPSO", "ICESat-2", "GOME-2"],
    realWorldContext: "The Arctic experiences 'Arctic haze' - pollution transported from lower latitudes that becomes trapped in the polar atmosphere during winter.",
    scientificFacts: [
      "Pollution can travel to the Arctic from sources thousands of miles away",
      "Arctic haze contains black carbon that accelerates ice melting",
      "NASA satellites provide crucial data for remote polar regions"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "mission_008",
    level: 8,
    title: "Volcanic Ash Crisis",
    subtitle: "Global Aviation Emergency",
    description: "Manage a major volcanic eruption's impact on global air quality and aviation using NASA's volcanic ash tracking systems.",
    location: {
      id: "volcanic_ash",
      name: "Eyjafjallajökull Region",
      latitude: 63.63,
      longitude: -19.62,
      regionSize: 12,
      city: "Reykjavik",
      country: "Iceland",
    },
    difficulty: "advanced",
    estimatedTime: 50,
    initialCredits: 2500,
    objectives: [
      {
        id: "obj_008_1",
        type: "satellite_data",
        target: 30,
        current: 0,
        description: "Track volcanic ash plume across 30 monitoring points",
        points: 350,
        isCompleted: false,
      },
      {
        id: "obj_008_2",
        type: "community_engagement",
        target: 10000,
        current: 0,
        description: "Coordinate protection for 10,000+ affected people",
        points: 300,
        isCompleted: false,
      },
      {
        id: "obj_008_3",
        type: "reduce_aqi",
        target: 80,
        current: 0,
        description: "Minimize health impact in affected regions",
        points: 350,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_007",
      totalScore: 1500,
    },
    rewards: {
      credits: 1200,
      xp: 700,
      achievements: ["volcano_responder", "aviation_protector"],
      unlocksNext: ["mission_009"],
    },
    nasaDataSources: ["MODIS", "OMI", "CALIPSO", "GOES-16", "Suomi NPP", "AIRS"],
    realWorldContext: "Volcanic eruptions can disrupt global aviation and affect air quality worldwide. The 2010 Eyjafjallajökull eruption grounded flights across Europe.",
    scientificFacts: [
      "Volcanic ash can damage aircraft engines and pose serious aviation risks",
      "NASA satellites can detect and track volcanic ash plumes in real-time",
      "Volcanic eruptions inject sulfur dioxide high into the atmosphere"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "mission_009",
    level: 9,
    title: "Megacity Transformation",
    subtitle: "São Paulo Urban Revolution",
    description: "Lead a comprehensive urban air quality transformation in one of the world's largest megacities using integrated NASA Earth system data.",
    location: {
      id: "sao_paulo_mega",
      name: "São Paulo Metropolitan Area",
      latitude: -23.5505,
      longitude: -46.6333,
      regionSize: 15,
      city: "São Paulo",
      country: "Brazil",
    },
    difficulty: "expert",
    estimatedTime: 60,
    initialCredits: 3000,
    objectives: [
      {
        id: "obj_009_1",
        type: "reduce_aqi",
        target: 75,
        current: 0,
        description: "Transform megacity AQI from 180 to 75",
        points: 500,
        isCompleted: false,
      },
      {
        id: "obj_009_2",
        type: "plant_trees",
        target: 50,
        current: 0,
        description: "Implement massive urban reforestation (50 tree zones)",
        points: 300,
        isCompleted: false,
      },
      {
        id: "obj_009_3",
        type: "satellite_data",
        target: 40,
        current: 0,
        description: "Integrate 40 different satellite datasets",
        points: 400,
        isCompleted: false,
      },
      {
        id: "obj_009_4",
        type: "community_engagement",
        target: 20000,
        current: 0,
        description: "Engage 20,000+ citizens in air quality improvement",
        points: 300,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_008",
      achievementsRequired: ["volcano_responder", "climate_detective"],
    },
    rewards: {
      credits: 1500,
      xp: 1000,
      achievements: ["megacity_master", "urban_transformer"],
      unlocksNext: ["mission_010"],
    },
    nasaDataSources: ["MODIS", "OMI", "TROPOMI", "AIRS", "MISR", "Landsat", "SRTM"],
    realWorldContext: "São Paulo is home to over 22 million people and faces complex air quality challenges from traffic, industry, and urban heat islands.",
    scientificFacts: [
      "Megacities house over 10 million people and face unique pollution challenges",
      "Urban heat islands can increase pollution formation and health impacts",
      "Integrated satellite data helps understand complex urban air quality patterns"
    ],
    isUnlocked: false,
    isCompleted: false,
  },

  // LEGENDARY LEVEL (10)
  {
    id: "mission_010",
    level: 10,
    title: "Global Climate Guardian",
    subtitle: "Planetary Air Quality Mission",
    description: "The ultimate challenge: coordinate a global air quality improvement initiative using the full suite of NASA's Earth observing systems. Save the planet's atmosphere.",
    location: {
      id: "global_mission",
      name: "Planet Earth",
      latitude: 0,
      longitude: 0,
      regionSize: 50,
      city: "Global",
      country: "Earth",
    },
    difficulty: "legendary",
    estimatedTime: 90,
    initialCredits: 5000,
    objectives: [
      {
        id: "obj_010_1",
        type: "reduce_aqi",
        target: 50,
        current: 0,
        description: "Achieve global average AQI of 50 (Good)",
        points: 1000,
        isCompleted: false,
      },
      {
        id: "obj_010_2",
        type: "satellite_data",
        target: 100,
        current: 0,
        description: "Utilize 100 satellite observation points globally",
        points: 500,
        isCompleted: false,
      },
      {
        id: "obj_010_3",
        type: "community_engagement",
        target: 100000,
        current: 0,
        description: "Coordinate protection for 100,000+ people worldwide",
        points: 500,
        isCompleted: false,
      },
      {
        id: "obj_010_4",
        type: "plant_trees",
        target: 100,
        current: 0,
        description: "Implement global reforestation (100 forest zones)",
        points: 400,
        isCompleted: false,
      },
      {
        id: "obj_010_5",
        type: "time_limit",
        target: 5400, // 90 minutes
        current: 0,
        description: "Save the planet within 90 minutes",
        points: 600,
        isCompleted: false,
      },
    ],
    unlockRequirements: {
      previousLevel: "mission_009",
      totalScore: 3000,
      achievementsRequired: ["megacity_master", "urban_transformer", "arctic_guardian"],
    },
    rewards: {
      credits: 5000,
      xp: 2000,
      achievements: ["planetary_guardian", "nasa_champion", "climate_hero"],
      unlocksNext: [],
    },
    nasaDataSources: ["All NASA Earth Observing Satellites", "International Space Station", "Ground Networks"],
    realWorldContext: "Global air quality affects climate, human health, and ecosystems. NASA's Earth observing system provides unprecedented insights into our planet's atmosphere.",
    scientificFacts: [
      "NASA operates over 20 Earth observing satellites monitoring air quality",
      "Air pollution causes 7 million premature deaths globally each year",
      "Coordinated global action is essential to address atmospheric challenges"
    ],
    isUnlocked: false,
    isCompleted: false,
  },
];

// Achievement definitions
export const achievements: Achievement[] = [
  {
    id: "first_mission",
    title: "First Steps",
    description: "Complete your first CleanSpace mission",
    icon: "🚀",
    rarity: "common",
    points: 50,
    progress: { current: 0, target: 1 },
  },
  {
    id: "tree_planter",
    title: "Tree Planter",
    description: "Plant your first tree",
    icon: "🌳",
    rarity: "common",
    points: 25,
    progress: { current: 0, target: 1 },
  },
  {
    id: "smog_fighter",
    title: "Smog Fighter",
    description: "Successfully reduce smog in Los Angeles",
    icon: "💨",
    rarity: "rare",
    points: 100,
    progress: { current: 0, target: 1 },
  },
  {
    id: "tempo_user",
    title: "TEMPO Expert",
    description: "Use NASA TEMPO data effectively",
    icon: "🛰️",
    rarity: "rare",
    points: 75,
    progress: { current: 0, target: 1 },
  },
  {
    id: "fire_responder",
    title: "Fire Responder",
    description: "Successfully manage wildfire air quality crisis",
    icon: "🔥",
    rarity: "epic",
    points: 150,
    progress: { current: 0, target: 1 },
  },
  {
    id: "community_protector",
    title: "Community Protector",
    description: "Protect 1000+ people from air pollution",
    icon: "🛡️",
    rarity: "epic",
    points: 200,
    progress: { current: 0, target: 1000 },
  },
  {
    id: "global_guardian",
    title: "Global Guardian",
    description: "Address international air quality challenges",
    icon: "🌍",
    rarity: "epic",
    points: 250,
    progress: { current: 0, target: 1 },
  },
  {
    id: "budget_master",
    title: "Budget Master",
    description: "Complete mission within tight budget constraints",
    icon: "💰",
    rarity: "rare",
    points: 100,
    progress: { current: 0, target: 1 },
  },
  {
    id: "satellite_expert",
    title: "Satellite Expert",
    description: "Master multiple NASA satellite datasets",
    icon: "📡",
    rarity: "epic",
    points: 200,
    progress: { current: 0, target: 15 },
  },
  {
    id: "industrial_reformer",
    title: "Industrial Reformer",
    description: "Transform polluting industrial areas",
    icon: "🏭",
    rarity: "epic",
    points: 300,
    progress: { current: 0, target: 1 },
  },
  {
    id: "dust_tracker",
    title: "Dust Storm Tracker",
    description: "Successfully track trans-Atlantic dust storms",
    icon: "🌪️",
    rarity: "legendary",
    points: 400,
    progress: { current: 0, target: 1 },
  },
  {
    id: "global_coordinator",
    title: "Global Coordinator",
    description: "Coordinate international air quality response",
    icon: "🌐",
    rarity: "legendary",
    points: 500,
    progress: { current: 0, target: 1 },
  },
  {
    id: "arctic_guardian",
    title: "Arctic Guardian",
    description: "Protect pristine Arctic air quality",
    icon: "🧊",
    rarity: "legendary",
    points: 600,
    progress: { current: 0, target: 1 },
  },
  {
    id: "climate_detective",
    title: "Climate Detective",
    description: "Uncover complex atmospheric connections",
    icon: "🔍",
    rarity: "legendary",
    points: 500,
    progress: { current: 0, target: 1 },
  },
  {
    id: "volcano_responder",
    title: "Volcano Responder",
    description: "Manage volcanic ash crisis effectively",
    icon: "🌋",
    rarity: "legendary",
    points: 700,
    progress: { current: 0, target: 1 },
  },
  {
    id: "aviation_protector",
    title: "Aviation Protector",
    description: "Protect aviation from atmospheric hazards",
    icon: "✈️",
    rarity: "legendary",
    points: 600,
    progress: { current: 0, target: 1 },
  },
  {
    id: "megacity_master",
    title: "Megacity Master",
    description: "Transform air quality in megacities",
    icon: "🏙️",
    rarity: "legendary",
    points: 1000,
    progress: { current: 0, target: 1 },
  },
  {
    id: "urban_transformer",
    title: "Urban Transformer",
    description: "Lead comprehensive urban air quality transformation",
    icon: "🔄",
    rarity: "legendary",
    points: 800,
    progress: { current: 0, target: 1 },
  },
  {
    id: "planetary_guardian",
    title: "Planetary Guardian",
    description: "Complete the ultimate global air quality mission",
    icon: "🌎",
    rarity: "legendary",
    points: 2000,
    progress: { current: 0, target: 1 },
  },
  {
    id: "nasa_champion",
    title: "NASA Champion",
    description: "Master all NASA Earth observing systems",
    icon: "🏆",
    rarity: "legendary",
    points: 1500,
    progress: { current: 0, target: 1 },
  },
  {
    id: "climate_hero",
    title: "Climate Hero",
    description: "Save the planet's atmosphere",
    icon: "🦸",
    rarity: "legendary",
    points: 2500,
    progress: { current: 0, target: 1 },
  },
];
