import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("airquest_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("airquest_user");
      }
    } else {
      // Create a guest user for demo purposes
      const guestUser: User = {
        id: "guest_user",
        username: "Guest Explorer",
        email: "guest@airquest.demo",
        level: 1,
        totalXP: 0,
        achievements: [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: "dark",
          notifications: true,
          units: "metric",
        },
      };
      setUser(guestUser);
      localStorage.setItem("airquest_user", JSON.stringify(guestUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Try Supabase login first, fallback to demo login
      try {
        const { supabase } = await import("../lib/supabase");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            username: data.user.user_metadata?.username || email.split("@")[0],
            email: data.user.email || email,
            level: 1,
            totalXP: 0,
            achievements: [],
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              theme: "dark",
              notifications: true,
              units: "metric",
            },
          };
          setUser(newUser);
          localStorage.setItem("airquest_user", JSON.stringify(newUser));
          return;
        }
      } catch (supabaseError) {
        console.warn("Supabase login failed, using demo mode:", supabaseError);
      }

      // Fallback to demo login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password combination
      const mockUser: User = {
        id: Date.now().toString(),
        username: email.split("@")[0] || "AtmosphereExplorer",
        email,
        level: 15,
        totalXP: 15420,
        globalRank: 247,
        joinDate: new Date("2024-01-15"),
        preferences: {
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
      };

      setUser(mockUser);
      localStorage.setItem("airquest_user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // Try Supabase registration first, fallback to demo registration
      try {
        const { supabase } = await import("../lib/supabase");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            username: username,
            email: email,
            level: 1,
            totalXP: 0,
            achievements: [],
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              theme: "dark",
              notifications: true,
              units: "metric",
            },
          };
          setUser(newUser);
          localStorage.setItem("airquest_user", JSON.stringify(newUser));
          return;
        }
      } catch (supabaseError) {
        console.warn(
          "Supabase registration failed, using demo mode:",
          supabaseError
        );
      }

      // Fallback to demo registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        level: 1,
        totalXP: 0,
        achievements: [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: "dark",
          notifications: true,
          units: "metric",
        },
      };

      setUser(newUser);
      localStorage.setItem("airquest_user", JSON.stringify(newUser));
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try Supabase logout first
      try {
        const { supabase } = await import("../lib/supabase");
        await supabase.auth.signOut();
      } catch (supabaseError) {
        console.warn("Supabase logout failed:", supabaseError);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("airquest_user");
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("airquest_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
