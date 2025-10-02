import {
  GameLocation,
  AirQualityData,
  WeatherData,
  GameSession,
} from "../types";
import { dataService } from "./dataService";

interface OfflineData {
  airQuality: AirQualityData[];
  weather: WeatherData[];
  gameSession: GameSession | null;
  lastSync: Date;
  location: GameLocation | null;
}

interface QueuedAction {
  id: string;
  type: "telemetry" | "achievement" | "game_session" | "mission_progress";
  data: any;
  timestamp: Date;
  retries: number;
}

class OfflineService {
  private isOnline: boolean = navigator.onLine;
  private offlineData: OfflineData;
  private actionQueue: QueuedAction[] = [];
  private syncInProgress: boolean = false;
  private readonly STORAGE_KEY = "cleanspace_offline_data";
  private readonly QUEUE_KEY = "cleanspace_action_queue";
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.offlineData = this.loadOfflineData();
    this.loadActionQueue();
    this.setupEventListeners();
    this.startPeriodicSync();
  }

  private setupEventListeners() {
    window.addEventListener("online", () => {
      console.log("App is online");
      this.isOnline = true;
      this.syncQueuedActions();
    });

    window.addEventListener("offline", () => {
      console.log("App is offline");
      this.isOnline = false;
    });

    // Listen for beforeunload to save data
    window.addEventListener("beforeunload", () => {
      this.saveOfflineData();
      this.saveActionQueue();
    });

    // Listen for visibility change to sync when app becomes visible
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isOnline) {
        this.syncQueuedActions();
      }
    });
  }

  private startPeriodicSync() {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncQueuedActions();
      }
    }, 30000);
  }

  private loadOfflineData(): OfflineData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...data,
          lastSync: new Date(data.lastSync),
          airQuality:
            data.airQuality?.map((aq: any) => ({
              ...aq,
              timestamp: new Date(aq.timestamp),
            })) || [],
          weather:
            data.weather?.map((w: any) => ({
              ...w,
              timestamp: new Date(w.timestamp),
            })) || [],
        };
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    }

    return {
      airQuality: [],
      weather: [],
      gameSession: null,
      lastSync: new Date(),
      location: null,
    };
  }

  private saveOfflineData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.offlineData));
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  }

  private loadActionQueue() {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.actionQueue = JSON.parse(stored).map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp),
        }));
      }
    } catch (error) {
      console.error("Error loading action queue:", error);
    }
  }

  private saveActionQueue() {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.actionQueue));
    } catch (error) {
      console.error("Error saving action queue:", error);
    }
  }

  // Public API
  get isOffline(): boolean {
    return !this.isOnline;
  }

  get hasOfflineData(): boolean {
    return (
      this.offlineData.airQuality.length > 0 ||
      this.offlineData.weather.length > 0 ||
      this.offlineData.gameSession !== null
    );
  }

  get queuedActionsCount(): number {
    return this.actionQueue.length;
  }

  // Cache data for offline use
  cacheAirQualityData(data: AirQualityData[], location: GameLocation) {
    this.offlineData.airQuality = data;
    this.offlineData.location = location;
    this.offlineData.lastSync = new Date();
    this.saveOfflineData();
  }

  cacheWeatherData(data: WeatherData[], location: GameLocation) {
    this.offlineData.weather = data;
    this.offlineData.location = location;
    this.offlineData.lastSync = new Date();
    this.saveOfflineData();
  }

  cacheGameSession(session: GameSession) {
    this.offlineData.gameSession = session;
    this.saveOfflineData();
  }

  // Get cached data
  getCachedAirQuality(): AirQualityData[] {
    return this.offlineData.airQuality;
  }

  getCachedWeather(): WeatherData[] {
    return this.offlineData.weather;
  }

  getCachedGameSession(): GameSession | null {
    return this.offlineData.gameSession;
  }

  getCachedLocation(): GameLocation | null {
    return this.offlineData.location;
  }

  getLastSyncTime(): Date {
    return this.offlineData.lastSync;
  }

  // Queue actions for later sync
  queueAction(type: QueuedAction["type"], data: any) {
    const action: QueuedAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retries: 0,
    };

    this.actionQueue.push(action);
    this.saveActionQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncQueuedActions();
    }
  }

  // Sync queued actions when online
  private async syncQueuedActions() {
    if (
      this.syncInProgress ||
      this.actionQueue.length === 0 ||
      !this.isOnline
    ) {
      return;
    }

    this.syncInProgress = true;
    const actionsToSync = [...this.actionQueue];
    const successfulActions: string[] = [];

    try {
      for (const action of actionsToSync) {
        try {
          await this.syncAction(action);
          successfulActions.push(action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);

          // Increment retry count
          action.retries++;

          // Remove action if max retries exceeded
          if (action.retries >= this.MAX_RETRIES) {
            console.warn(
              `Removing action ${action.id} after ${this.MAX_RETRIES} failed attempts`
            );
            successfulActions.push(action.id);
          }
        }
      }

      // Remove successfully synced actions
      this.actionQueue = this.actionQueue.filter(
        (action) => !successfulActions.includes(action.id)
      );

      this.saveActionQueue();
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncAction(action: QueuedAction) {
    switch (action.type) {
      case "telemetry":
        await dataService.logTelemetry(action.data);
        break;

      case "achievement":
        await dataService.createAchievement(action.data);
        break;

      case "game_session":
        if (action.data.id) {
          await dataService.updateGameSession(action.data.id, action.data);
        } else {
          await dataService.createGameSession(action.data);
        }
        break;

      case "mission_progress":
        if (action.data.mission_id) {
          await dataService.updateMissionProgress(
            action.data.mission_id,
            action.data
          );
        } else {
          await dataService.createMissionProgress(action.data);
        }
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Clear offline data
  clearOfflineData() {
    this.offlineData = {
      airQuality: [],
      weather: [],
      gameSession: null,
      lastSync: new Date(),
      location: null,
    };
    this.saveOfflineData();
  }

  clearActionQueue() {
    this.actionQueue = [];
    this.saveActionQueue();
  }

  // Get offline status info
  getOfflineStatus() {
    return {
      isOffline: this.isOffline,
      hasOfflineData: this.hasOfflineData,
      queuedActions: this.queuedActionsCount,
      lastSync: this.getLastSyncTime(),
      location: this.getCachedLocation(),
      dataAge: Date.now() - this.getLastSyncTime().getTime(),
    };
  }

  // Force sync (useful for manual sync buttons)
  async forcSync() {
    if (!this.isOnline) {
      throw new Error("Cannot sync while offline");
    }

    await this.syncQueuedActions();
  }

  // Check if data is stale (older than 1 hour)
  isDataStale(): boolean {
    const oneHour = 60 * 60 * 1000;
    return Date.now() - this.offlineData.lastSync.getTime() > oneHour;
  }

  // Generate offline notification message
  getOfflineMessage(): string {
    if (!this.isOffline) return "";

    const queuedCount = this.queuedActionsCount;
    const hasData = this.hasOfflineData;

    if (queuedCount > 0 && hasData) {
      return `You're offline. Using cached data and ${queuedCount} actions will sync when online.`;
    } else if (queuedCount > 0) {
      return `You're offline. ${queuedCount} actions will sync when online.`;
    } else if (hasData) {
      return `You're offline. Using cached data from ${this.getLastSyncTime().toLocaleTimeString()}.`;
    } else {
      return `You're offline. Limited functionality available.`;
    }
  }
}

export const offlineService = new OfflineService();
export default offlineService;
