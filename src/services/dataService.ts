import { supabase } from "../lib/supabase";
import { Database } from "../types/database";
import { authService } from "./authService";

type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
type AchievementInsert = Database["public"]["Tables"]["achievements"]["Insert"];
type MissionProgress = Database["public"]["Tables"]["mission_progress"]["Row"];
type MissionProgressInsert =
  Database["public"]["Tables"]["mission_progress"]["Insert"];
type MissionProgressUpdate =
  Database["public"]["Tables"]["mission_progress"]["Update"];
type GameSession = Database["public"]["Tables"]["game_sessions"]["Row"];
type GameSessionInsert =
  Database["public"]["Tables"]["game_sessions"]["Insert"];
type TelemetryInsert = Database["public"]["Tables"]["telemetry"]["Insert"];
type SharedContent = Database["public"]["Tables"]["shared_content"]["Row"];
type SharedContentInsert =
  Database["public"]["Tables"]["shared_content"]["Insert"];
type NASADataCache = Database["public"]["Tables"]["nasa_data_cache"]["Row"];
type NASADataCacheInsert =
  Database["public"]["Tables"]["nasa_data_cache"]["Insert"];

class DataService {
  // Achievement Management
  async createAchievement(achievement: Omit<AchievementInsert, "user_id">) {
    try {
      const user = authService.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("achievements")
        .insert({
          ...achievement,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user XP
      await this.updateUserXP(achievement.points_earned || 0);

      return { data, error: null };
    } catch (error) {
      console.error("Create achievement error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create achievement"),
      };
    }
  }

  async getUserAchievements(userId?: string) {
    try {
      const targetUserId = userId || authService.user?.id;
      if (!targetUserId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", targetUserId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get achievements error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get achievements"),
      };
    }
  }

  // Mission Progress Management
  async createMissionProgress(
    progress: Omit<MissionProgressInsert, "user_id">
  ) {
    try {
      const user = authService.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("mission_progress")
        .insert({
          ...progress,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Create mission progress error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create mission progress"),
      };
    }
  }

  async updateMissionProgress(
    missionId: string,
    updates: Omit<MissionProgressUpdate, "user_id" | "mission_id">
  ) {
    try {
      const user = authService.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("mission_progress")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("mission_id", missionId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Update mission progress error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to update mission progress"),
      };
    }
  }

  async getUserMissionProgress(userId?: string) {
    try {
      const targetUserId = userId || authService.user?.id;
      if (!targetUserId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("mission_progress")
        .select("*")
        .eq("user_id", targetUserId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get mission progress error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get mission progress"),
      };
    }
  }

  // Game Session Management
  async createGameSession(session: Omit<GameSessionInsert, "user_id">) {
    try {
      const user = authService.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("game_sessions")
        .insert({
          ...session,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Create game session error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create game session"),
      };
    }
  }

  async updateGameSession(sessionId: string, updates: Partial<GameSession>) {
    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Update game session error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to update game session"),
      };
    }
  }

  async getUserGameSessions(userId?: string, limit: number = 50) {
    try {
      const targetUserId = userId || authService.user?.id;
      if (!targetUserId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get game sessions error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get game sessions"),
      };
    }
  }

  // Telemetry and Analytics
  async logTelemetry(
    telemetry: Omit<TelemetryInsert, "user_id" | "timestamp">
  ) {
    try {
      const user = authService.user;

      const { error } = await supabase.from("telemetry").insert({
        ...telemetry,
        user_id: user?.id || null,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Log telemetry error:", error);
      return {
        error:
          error instanceof Error ? error : new Error("Failed to log telemetry"),
      };
    }
  }

  async getUserStats(userId?: string) {
    try {
      const targetUserId = userId || authService.user?.id;
      if (!targetUserId) throw new Error("User ID required");

      const { data, error } = await supabase.rpc("get_user_stats", {
        user_id: targetUserId,
      });

      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error("Get user stats error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get user stats"),
      };
    }
  }

  // Sharing and Social Features
  async createSharedContent(content: Omit<SharedContentInsert, "user_id">) {
    try {
      const user = authService.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("shared_content")
        .insert({
          ...content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Create shared content error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create shared content"),
      };
    }
  }

  async getPublicSharedContent(limit: number = 20, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from("shared_content")
        .select(
          `
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get public shared content error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get shared content"),
      };
    }
  }

  async likeSharedContent(contentId: string) {
    try {
      const { data, error } = await supabase
        .from("shared_content")
        .update({
          likes_count: supabase.sql`likes_count + 1`,
        })
        .eq("id", contentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Like shared content error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Failed to like content"),
      };
    }
  }

  // NASA Data Caching
  async cacheNASAData(cache: NASADataCacheInsert) {
    try {
      const { data, error } = await supabase
        .from("nasa_data_cache")
        .upsert(cache, {
          onConflict: "data_type,location_key",
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Cache NASA data error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to cache NASA data"),
      };
    }
  }

  async getCachedNASAData(dataType: string, locationKey: string) {
    try {
      const { data, error } = await supabase
        .from("nasa_data_cache")
        .select("*")
        .eq("data_type", dataType)
        .eq("location_key", locationKey)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get cached NASA data error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get cached NASA data"),
      };
    }
  }

  // Leaderboard
  async getLeaderboard(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("global_rank", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get leaderboard error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get leaderboard"),
      };
    }
  }

  // Helper Methods
  private async updateUserXP(xpGained: number) {
    try {
      const user = authService.user;
      if (!user?.profile) return;

      const newTotalXP = (user.profile.total_xp || 0) + xpGained;
      const newLevel = Math.floor(newTotalXP / 1000) + 1; // 1000 XP per level

      await authService.updateProfile({
        total_xp: newTotalXP,
        level: newLevel,
      });
    } catch (error) {
      console.error("Update user XP error:", error);
    }
  }

  // Real-time subscriptions
  subscribeToUserAchievements(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`achievements:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "achievements",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  subscribeToLeaderboard(callback: (payload: any) => void) {
    return supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        callback
      )
      .subscribe();
  }

  subscribeToSharedContent(callback: (payload: any) => void) {
    return supabase
      .channel("shared_content")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shared_content",
          filter: "is_public=eq.true",
        },
        callback
      )
      .subscribe();
  }
}

export const dataService = new DataService();
export default dataService;
