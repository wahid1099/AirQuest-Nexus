import {
  GameAction,
  ActionEffect,
  AirQualityData,
  SimulationState,
  GameLocation,
  PlayerState,
  GameConfig,
} from "../types";

export class SimulationEngine {
  private config: GameConfig;
  private currentState: SimulationState;
  private appliedActions: GameAction[] = [];

  constructor(config: GameConfig) {
    this.config = config;
    this.currentState = {
      currentAQI: 0,
      baselineAQI: 0,
      targetAQI: config.safeAQIThreshold,
      timeRemaining: config.missionTimeLimit,
      actionsApplied: [],
      predictedTrajectory: [],
      healthImpact: {
        currentExposure: 0,
        safeThreshold: config.safeAQIThreshold,
        recoveryRate: config.recoveryRate,
      },
    };
  }

  /**
   * Initialize simulation with baseline air quality data
   */
  initializeSimulation(
    baselineAirQuality: AirQualityData[],
    location: GameLocation
  ): void {
    if (baselineAirQuality.length === 0) return;

    const latestData = baselineAirQuality[baselineAirQuality.length - 1];
    this.currentState.baselineAQI = latestData.aqi;
    this.currentState.currentAQI = latestData.aqi;
    this.currentState.predictedTrajectory = [...baselineAirQuality];
  }

  /**
   * Apply a game action and calculate its effect on air quality
   */
  applyAction(
    action: GameAction,
    currentAirQuality: AirQualityData
  ): AirQualityData {
    const effect = this.calculateActionEffect(action, currentAirQuality);

    // Create new air quality data with applied effect
    const newAirQuality: AirQualityData = {
      ...currentAirQuality,
      pm25: Math.max(0, currentAirQuality.pm25 + effect.pm25Change),
      no2: Math.max(0, currentAirQuality.no2 + effect.no2Change),
      o3: Math.max(0, currentAirQuality.o3 + effect.o3Change),
      aqi: this.calculateAQIFromPM25(
        Math.max(0, currentAirQuality.pm25 + effect.pm25Change)
      ),
      timestamp: new Date(),
      source: "simulated",
    };

    // Add action to applied actions
    this.appliedActions.push({
      ...action,
      status: "completed",
      timestamp: new Date(),
    });

    this.currentState.actionsApplied = [...this.appliedActions];
    this.currentState.currentAQI = newAirQuality.aqi;

    return newAirQuality;
  }

  /**
   * Calculate the effect of a specific action on air quality
   */
  private calculateActionEffect(
    action: GameAction,
    currentAirQuality: AirQualityData
  ): ActionEffect {
    const { simulationParameters } = this.config;

    switch (action.type) {
      case "plant_tree":
        return this.calculateTreeEffect(action, simulationParameters);

      case "plant_rooftop_garden":
        return this.calculateRooftopGardenEffect(action, simulationParameters);

      case "remove_vehicle":
        return this.calculateVehicleRemovalEffect(action, simulationParameters);

      case "shutdown_factory":
        return this.calculateFactoryShutdownEffect(
          action,
          simulationParameters
        );

      case "retrofit_factory":
        return this.calculateFactoryRetrofitEffect(
          action,
          simulationParameters
        );

      case "remove_construction":
        return this.calculateConstructionRemovalEffect(
          action,
          simulationParameters
        );

      default:
        return {
          pm25Change: 0,
          no2Change: 0,
          o3Change: 0,
          areaOfEffect: 0,
          duration: 0,
          description: "No effect",
        };
    }
  }

  /**
   * Calculate tree planting effect
   */
  private calculateTreeEffect(action: GameAction, params: any): ActionEffect {
    const treeEffect = 0.5; // µg/m³ reduction per tree
    const area = action.location.area;
    const treeCount = Math.floor(area / 25); // 1 tree per 25m²

    return {
      pm25Change: -treeEffect * treeCount,
      no2Change: -0.2 * treeCount, // Trees absorb NO2
      o3Change: 0.1 * treeCount, // Trees can increase O3 slightly
      areaOfEffect: params.treeEffectRadius,
      duration: 24, // 24 hours
      description: `Planted ${treeCount} trees, reducing PM2.5 by ${(
        treeEffect * treeCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate rooftop garden effect (reduced compared to ground trees)
   */
  private calculateRooftopGardenEffect(
    action: GameAction,
    params: any
  ): ActionEffect {
    const rooftopEffect = 0.3; // 60% of ground tree effect
    const area = action.location.area;
    const gardenCount = Math.floor(area / 50); // 1 garden per 50m²

    return {
      pm25Change: -rooftopEffect * gardenCount,
      no2Change: -0.1 * gardenCount,
      o3Change: 0.05 * gardenCount,
      areaOfEffect: params.treeEffectRadius * 0.7,
      duration: 24,
      description: `Installed ${gardenCount} rooftop gardens, reducing PM2.5 by ${(
        rooftopEffect * gardenCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate vehicle removal effect
   */
  private calculateVehicleRemovalEffect(
    action: GameAction,
    params: any
  ): ActionEffect {
    const vehicleEffect = 2.0; // µg/m³ reduction per vehicle
    const vehicleCount = Math.floor(action.location.area / 20); // 1 vehicle per 20m²

    return {
      pm25Change: -vehicleEffect * vehicleCount,
      no2Change: -1.0 * vehicleCount, // Vehicles are major NO2 sources
      o3Change: 0.5 * vehicleCount, // Removing NO2 can increase O3
      areaOfEffect: params.vehicleEffectRadius,
      duration: 12, // 12 hours (temporary removal)
      description: `Removed ${vehicleCount} vehicles, reducing PM2.5 by ${(
        vehicleEffect * vehicleCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate factory shutdown effect
   */
  private calculateFactoryShutdownEffect(
    action: GameAction,
    params: any
  ): ActionEffect {
    const factoryEffect = 5.0; // µg/m³ reduction per factory
    const factoryCount = Math.floor(action.location.area / 1000); // 1 factory per 1000m²

    return {
      pm25Change: -factoryEffect * factoryCount,
      no2Change: -2.0 * factoryCount,
      o3Change: -0.5 * factoryCount,
      areaOfEffect: params.factoryEffectRadius,
      duration: 48, // 48 hours
      description: `Shut down ${factoryCount} factories, reducing PM2.5 by ${(
        factoryEffect * factoryCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate factory retrofit effect (partial reduction)
   */
  private calculateFactoryRetrofitEffect(
    action: GameAction,
    params: any
  ): ActionEffect {
    const retrofitEffect = 2.5; // 50% of shutdown effect
    const factoryCount = Math.floor(action.location.area / 1000);

    return {
      pm25Change: -retrofitEffect * factoryCount,
      no2Change: -1.0 * factoryCount,
      o3Change: -0.25 * factoryCount,
      areaOfEffect: params.factoryEffectRadius,
      duration: 72, // 72 hours (longer lasting)
      description: `Retrofitted ${factoryCount} factories, reducing PM2.5 by ${(
        retrofitEffect * factoryCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate construction removal effect
   */
  private calculateConstructionRemovalEffect(
    action: GameAction,
    params: any
  ): ActionEffect {
    const constructionEffect = 3.0; // µg/m³ reduction
    const constructionCount = Math.floor(action.location.area / 500); // 1 construction per 500m²

    return {
      pm25Change: -constructionEffect * constructionCount,
      no2Change: -1.5 * constructionCount,
      o3Change: 0.2 * constructionCount,
      areaOfEffect: params.treeEffectRadius,
      duration: 36, // 36 hours
      description: `Removed ${constructionCount} construction sites, reducing PM2.5 by ${(
        constructionEffect * constructionCount
      ).toFixed(1)} µg/m³`,
    };
  }

  /**
   * Calculate AQI from PM2.5 concentration
   */
  private calculateAQIFromPM25(pm25: number): number {
    if (pm25 <= 12.0) {
      return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    } else if (pm25 <= 250.4) {
      return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    } else {
      return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
    }
  }

  /**
   * Update player health based on current AQI and time spent
   */
  updatePlayerHealth(player: PlayerState, timeSpent: number): PlayerState {
    const { healthDrainRate, recoveryRate } = this.config;
    const isInSafeZone =
      this.currentState.currentAQI <= this.config.safeAQIThreshold;

    let newHealth = player.health;
    let newEnergy = player.energy;

    if (isInSafeZone) {
      // Recover health in safe zones
      newHealth = Math.min(
        100,
        player.health + (recoveryRate * timeSpent) / 60
      );
      newEnergy = Math.min(
        100,
        player.energy + (recoveryRate * timeSpent) / 60
      );
    } else {
      // Drain health in polluted areas
      const healthDrain =
        (this.currentState.currentAQI / 100) *
        healthDrainRate *
        (timeSpent / 60);
      newHealth = Math.max(0, player.health - healthDrain);
      newEnergy = Math.max(0, player.energy - healthDrain);
    }

    return {
      ...player,
      health: newHealth,
      energy: newEnergy,
      isInSafeZone,
      safeTimeRemaining: isInSafeZone
        ? player.safeTimeRemaining
        : Math.max(0, player.safeTimeRemaining - timeSpent),
    };
  }

  /**
   * Predict future air quality trajectory
   */
  predictTrajectory(
    currentAirQuality: AirQualityData,
    hours: number = 24
  ): AirQualityData[] {
    const trajectory: AirQualityData[] = [];
    const currentTime = new Date(currentAirQuality.timestamp);

    for (let i = 1; i <= hours; i++) {
      const futureTime = new Date(currentTime.getTime() + i * 60 * 60 * 1000);

      // Simple prediction model - effects decay over time
      const decayFactor = Math.exp(-i / 12); // 12-hour half-life
      const appliedEffects = this.appliedActions.reduce((total, action) => {
        const effect = this.calculateActionEffect(action, currentAirQuality);
        return total + effect.pm25Change * decayFactor;
      }, 0);

      const predictedPM25 = Math.max(
        0,
        currentAirQuality.pm25 + appliedEffects
      );

      trajectory.push({
        ...currentAirQuality,
        pm25: predictedPM25,
        aqi: this.calculateAQIFromPM25(predictedPM25),
        timestamp: futureTime,
        source: "simulated",
      });
    }

    return trajectory;
  }

  /**
   * Get current simulation state
   */
  getCurrentState(): SimulationState {
    return { ...this.currentState };
  }

  /**
   * Update simulation time
   */
  updateTime(elapsedSeconds: number): void {
    this.currentState.timeRemaining = Math.max(
      0,
      this.currentState.timeRemaining - elapsedSeconds
    );
  }

  /**
   * Check if mission is completed
   */
  isMissionCompleted(): boolean {
    return this.currentState.currentAQI <= this.currentState.targetAQI;
  }

  /**
   * Check if mission failed
   */
  isMissionFailed(): boolean {
    return this.currentState.timeRemaining <= 0;
  }

  /**
   * Get mission score
   */
  calculateScore(): number {
    const aqiImprovement =
      this.currentState.baselineAQI - this.currentState.currentAQI;
    const timeBonus = this.currentState.timeRemaining / 60; // Bonus for remaining time
    const actionEfficiency =
      this.appliedActions.length > 0
        ? aqiImprovement / this.appliedActions.length
        : 0;

    return Math.max(
      0,
      Math.round(aqiImprovement * 10 + timeBonus + actionEfficiency * 5)
    );
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.appliedActions = [];
    this.currentState = {
      currentAQI: 0,
      baselineAQI: 0,
      targetAQI: this.config.safeAQIThreshold,
      timeRemaining: this.config.missionTimeLimit,
      actionsApplied: [],
      predictedTrajectory: [],
      healthImpact: {
        currentExposure: 0,
        safeThreshold: this.config.safeAQIThreshold,
        recoveryRate: this.config.recoveryRate,
      },
    };
  }
}

// Default game configuration
export const defaultGameConfig: GameConfig = {
  safeAQIThreshold: 50,
  healthDrainRate: 2, // 2 health points per minute in polluted air
  recoveryRate: 3, // 3 health points per minute in safe air
  missionTimeLimit: 24 * 60 * 60, // 24 hours in seconds
  actionCooldowns: {
    plant_tree: 300, // 5 minutes
    plant_rooftop_garden: 600, // 10 minutes
    remove_vehicle: 180, // 3 minutes
    shutdown_factory: 1800, // 30 minutes
    retrofit_factory: 3600, // 1 hour
    remove_construction: 900, // 15 minutes
    relocate: 60, // 1 minute
  },
  actionCosts: {
    plant_tree: 10,
    plant_rooftop_garden: 15,
    remove_vehicle: 5,
    shutdown_factory: 50,
    retrofit_factory: 100,
    remove_construction: 30,
    relocate: 0,
  },
  simulationParameters: {
    treeEffectRadius: 200, // meters
    vehicleEffectRadius: 100, // meters
    factoryEffectRadius: 500, // meters
    mixingVolume: 1000, // m³
    exposureFactor: 1.0,
  },
};
