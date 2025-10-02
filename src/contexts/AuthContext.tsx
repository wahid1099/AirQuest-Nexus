import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService, AuthUser } from "../services/authService";
import { dataService } from "../services/dataService";

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const currentAuthUser = authService.user;
        if (currentAuthUser) {
          setAuthUser(currentAuthUser);
          await convertAuthUserToUser(currentAuthUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = () => {
      // This would be replaced with actual Supabase auth state listener
      // For now, we'll check periodically
      const interval = setInterval(() => {
        const currentAuthUser = authService.user;
        if (currentAuthUser !== authUser) {
          setAuthUser(currentAuthUser);
          if (currentAuthUser) {
            convertAuthUserToUser(currentAuthUser);
          } else {
            setUser(null);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    const cleanup = unsubscribe();
    return cleanup;
  }, [authUser]);

  const convertAuthUserToUser = async (authUser: AuthUser): Promise<void> => {
    try {
      const profile = authUser.profile;
      if (profile) {
        const user: User = {
          id: authUser.id,
          username: profile.username || "Unknown",
          email: authUser.email || "",
          level: profile.level || 1,
          totalXP: profile.total_xp || 0,
          globalRank: profile.global_rank || 999999,
          joinDate: new Date(profile.created_at),
          preferences: (profile.preferences as any) || {
            theme: "dark",
            language: "en",
            notifications: {
              email: true,
              push: true,
              weeklyInsights: true,
              missionReminders: true,
            },
            apiConnections: {
              nasa: true,
              gemini: true,
            },
          },
          avatar: profile.avatar_url || undefined,
          bio: profile.bio || undefined,
          location: profile.location || undefined,
          website: profile.website || undefined,
        };
        setUser(user);

        // Log telemetry for user session
        await dataService.logTelemetry({
          event_type: "user_session_start",
          event_data: {
            user_id: user.id,
            level: user.level,
            total_xp: user.totalXP,
          },
        });
      }
    } catch (error) {
      console.error("Error converting auth user to user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signIn({ email, password });
      if (error) throw error;

      // Auth state will be updated by the listener
      await dataService.logTelemetry({
        event_type: "user_login",
        event_data: { email, method: "email" },
      });
    } catch (error) {
      await dataService.logTelemetry({
        event_type: "user_login_failed",
        event_data: {
          email,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signUp({
        email,
        password,
        username,
        fullName,
      });
      if (error) throw error;

      await dataService.logTelemetry({
        event_type: "user_registration",
        event_data: { email, username, method: "email" },
      });
    } catch (error) {
      await dataService.logTelemetry({
        event_type: "user_registration_failed",
        event_data: {
          email,
          username,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await dataService.logTelemetry({
        event_type: "user_logout",
        event_data: { user_id: user?.id },
      });

      await authService.signOut();
      setUser(null);
      setAuthUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authUser) return;

    try {
      // Convert User updates to profile updates
      const profileUpdates: any = {};
      if (updates.username) profileUpdates.username = updates.username;
      if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
      if (updates.bio) profileUpdates.bio = updates.bio;
      if (updates.location) profileUpdates.location = updates.location;
      if (updates.website) profileUpdates.website = updates.website;
      if (updates.preferences) profileUpdates.preferences = updates.preferences;

      const { error } = await authService.updateProfile(profileUpdates);
      if (error) throw error;

      // Update local user state
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      }

      await dataService.logTelemetry({
        event_type: "user_profile_updated",
        event_data: { user_id: authUser.id, updates: Object.keys(updates) },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const value = {
    user,
    authUser,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!authUser && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
