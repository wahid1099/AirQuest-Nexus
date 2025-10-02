export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          level: number;
          total_xp: number;
          global_rank: number | null;
          preferences: Json | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          social_links: Json | null;
          privacy_settings: Json | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          level?: number;
          total_xp?: number;
          global_rank?: number | null;
          preferences?: Json | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Json | null;
          privacy_settings?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          level?: number;
          total_xp?: number;
          global_rank?: number | null;
          preferences?: Json | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Json | null;
          privacy_settings?: Json | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          achievement_type: string;
          achievement_data: Json;
          earned_at: string;
          mission_id: string | null;
          points_earned: number;
          badge_icon: string | null;
          badge_name: string;
          badge_description: string;
          rarity: "common" | "rare" | "epic" | "legendary";
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          achievement_type: string;
          achievement_data?: Json;
          earned_at?: string;
          mission_id?: string | null;
          points_earned?: number;
          badge_icon?: string | null;
          badge_name: string;
          badge_description: string;
          rarity?: "common" | "rare" | "epic" | "legendary";
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          achievement_type?: string;
          achievement_data?: Json;
          earned_at?: string;
          mission_id?: string | null;
          points_earned?: number;
          badge_icon?: string | null;
          badge_name?: string;
          badge_description?: string;
          rarity?: "common" | "rare" | "epic" | "legendary";
        };
      };
      mission_progress: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          mission_id: string;
          status: "not_started" | "in_progress" | "completed" | "failed";
          progress_percentage: number;
          current_step: number;
          total_steps: number;
          data: Json;
          started_at: string | null;
          completed_at: string | null;
          score: number | null;
          time_spent: number;
          actions_completed: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          mission_id: string;
          status?: "not_started" | "in_progress" | "completed" | "failed";
          progress_percentage?: number;
          current_step?: number;
          total_steps?: number;
          data?: Json;
          started_at?: string | null;
          completed_at?: string | null;
          score?: number | null;
          time_spent?: number;
          actions_completed?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          mission_id?: string;
          status?: "not_started" | "in_progress" | "completed" | "failed";
          progress_percentage?: number;
          current_step?: number;
          total_steps?: number;
          data?: Json;
          started_at?: string | null;
          completed_at?: string | null;
          score?: number | null;
          time_spent?: number;
          actions_completed?: Json;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          session_type: "cleanspace" | "mission" | "exploration";
          location_data: Json;
          air_quality_data: Json;
          actions_taken: Json;
          score: number;
          duration: number;
          completed: boolean;
          achievements_earned: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          session_type: "cleanspace" | "mission" | "exploration";
          location_data?: Json;
          air_quality_data?: Json;
          actions_taken?: Json;
          score?: number;
          duration?: number;
          completed?: boolean;
          achievements_earned?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          session_type?: "cleanspace" | "mission" | "exploration";
          location_data?: Json;
          air_quality_data?: Json;
          actions_taken?: Json;
          score?: number;
          duration?: number;
          completed?: boolean;
          achievements_earned?: Json;
        };
      };
      telemetry: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          session_id: string | null;
          event_type: string;
          event_data: Json;
          timestamp: string;
          user_agent: string | null;
          ip_address: string | null;
          location: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          session_id?: string | null;
          event_type: string;
          event_data?: Json;
          timestamp?: string;
          user_agent?: string | null;
          ip_address?: string | null;
          location?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          session_id?: string | null;
          event_type?: string;
          event_data?: Json;
          timestamp?: string;
          user_agent?: string | null;
          ip_address?: string | null;
          location?: Json | null;
        };
      };
      shared_content: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          content_type:
            | "mission_result"
            | "achievement"
            | "air_quality_report"
            | "custom";
          title: string;
          description: string | null;
          content_data: Json;
          media_urls: Json | null;
          is_public: boolean;
          likes_count: number;
          shares_count: number;
          comments_count: number;
          tags: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          content_type:
            | "mission_result"
            | "achievement"
            | "air_quality_report"
            | "custom";
          title: string;
          description?: string | null;
          content_data?: Json;
          media_urls?: Json | null;
          is_public?: boolean;
          likes_count?: number;
          shares_count?: number;
          comments_count?: number;
          tags?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          content_type?:
            | "mission_result"
            | "achievement"
            | "air_quality_report"
            | "custom";
          title?: string;
          description?: string | null;
          content_data?: Json;
          media_urls?: Json | null;
          is_public?: boolean;
          likes_count?: number;
          shares_count?: number;
          comments_count?: number;
          tags?: Json | null;
        };
      };
      nasa_data_cache: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          data_type: string;
          location_key: string;
          data: Json;
          expires_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          data_type: string;
          location_key: string;
          data: Json;
          expires_at: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          data_type?: string;
          location_key?: string;
          data?: Json;
          expires_at?: string;
          metadata?: Json | null;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          total_xp: number;
          level: number;
          global_rank: number;
          achievements_count: number;
          missions_completed: number;
        };
      };
    };
    Functions: {
      update_user_rank: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_user_stats: {
        Args: {
          user_id: string;
        };
        Returns: {
          total_missions: number;
          completed_missions: number;
          total_achievements: number;
          total_score: number;
          avg_session_duration: number;
        }[];
      };
    };
    Enums: {
      achievement_rarity: "common" | "rare" | "epic" | "legendary";
      mission_status: "not_started" | "in_progress" | "completed" | "failed";
      session_type: "cleanspace" | "mission" | "exploration";
      content_type:
        | "mission_result"
        | "achievement"
        | "air_quality_report"
        | "custom";
    };
  };
}
