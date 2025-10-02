import { supabase } from "../lib/supabase";
import { Database } from "../types/database";
import { User, Session } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type Json = Database["public"]["Tables"]["profiles"]["Row"]["preferences"];

// Temporary workaround for Supabase type issues

export interface AuthUser extends User {
  profile?: Profile;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  full_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  preferences?: Json;
  privacy_settings?: Json;
  social_links?: Json;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: Session | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    this.currentSession = session;

    if (session?.user) {
      await this.loadUserProfile(session.user);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentSession = session;

      if (event === "SIGNED_IN" && session?.user) {
        await this.loadUserProfile(session.user);
        // Check if user needs profile creation (for email confirmation flow)
        await this.ensureUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        this.currentUser = null;
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        await this.loadUserProfile(session.user);
      }
    });
  }

  private async loadUserProfile(user: User): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading user profile:", error);
        return;
      }

      this.currentUser = {
        ...user,
        profile: profile || undefined,
      };
    } catch (error) {
      console.error("Error loading user profile:", error);
      this.currentUser = user as AuthUser;
    }
  }

  private async ensureUserProfile(user: User): Promise<void> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        return; // Profile already exists
      }

      // Create profile from user metadata if it doesn't exist
      const metadata = user.user_metadata || {};
      await this.createUserProfile({
        id: user.id,
        email: user.email,
        username: metadata.username || `user_${user.id.slice(0, 8)}`,
        full_name: metadata.full_name || metadata.name || "Anonymous User",
        level: 1,
        total_xp: 0,
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
        privacy_settings: {
          profileVisibility: "public",
          showAchievements: true,
          showProgress: true,
          allowMessages: true,
        },
      });

      // Reload the profile after creation
      await this.loadUserProfile(user);
    } catch (error) {
      console.error("Error ensuring user profile:", error);
    }
  }

  async signUp({ email, password, username, fullName }: SignUpData) {
    try {
      // Sign up the user first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create profile if user was created and confirmed
      if (data.user && data.session) {
        // User is automatically signed in, so we can create the profile
        await this.createUserProfile({
          id: data.user.id,
          email: data.user.email,
          username,
          full_name: fullName,
          level: 1,
          total_xp: 0,
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
          privacy_settings: {
            profileVisibility: "public",
            showAchievements: true,
            showProgress: true,
            allowMessages: true,
          },
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Sign up failed"),
      };
    }
  }

  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Sign in failed"),
      };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.currentUser = null;
      this.currentSession = null;

      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return {
        error: error instanceof Error ? error : new Error("Sign out failed"),
      };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        error:
          error instanceof Error ? error : new Error("Reset password failed"),
      };
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        error:
          error instanceof Error ? error : new Error("Update password failed"),
      };
    }
  }

  async updateProfile(updates: UpdateProfileData) {
    try {
      if (!this.currentUser) {
        throw new Error("No authenticated user");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("profiles")
        .update({
          username: updates.username,
          full_name: updates.full_name,
          bio: updates.bio,
          location: updates.location,
          website: updates.website,
          avatar_url: updates.avatar_url,
          preferences: updates.preferences,
          privacy_settings: updates.privacy_settings,
          social_links: updates.social_links,
          updated_at: new Date().toISOString(),
        })
        .eq("id", this.currentUser.id)
        .select()
        .single();

      if (error) throw error;

      // Update local user data
      if (this.currentUser) {
        this.currentUser.profile = data;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Update profile failed"),
      };
    }
  }

  async uploadAvatar(file: File) {
    try {
      if (!this.currentUser) {
        throw new Error("No authenticated user");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${this.currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateProfile({ avatar_url: publicUrl });

      return { data: { url: publicUrl }, error: null };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Upload avatar failed"),
      };
    }
  }

  private async createUserProfile(profileData: ProfileInsert) {
    try {
      // Check if username is already taken (now that user is authenticated)
      if (profileData.username) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", profileData.username)
          .single();

        if (existingUser) {
          throw new Error("Username is already taken");
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("profiles").insert({
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        full_name: profileData.full_name,
        level: profileData.level,
        total_xp: profileData.total_xp,
        preferences: profileData.preferences,
        privacy_settings: profileData.privacy_settings,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Create profile error:", error);
      throw error;
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      if (!this.isAuthenticated) {
        throw new Error(
          "User must be authenticated to check username availability"
        );
      }

      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      return !existingUser;
    } catch (error) {
      // If error is "no rows returned", username is available
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "PGRST116"
      ) {
        return true;
      }
      console.error("Error checking username availability:", error);
      throw error;
    }
  }

  // Getters
  get user(): AuthUser | null {
    return this.currentUser;
  }

  get session(): Session | null {
    return this.currentSession;
  }

  get isAuthenticated(): boolean {
    return !!this.currentSession && !!this.currentUser;
  }

  // Social auth methods
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Google sign in error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Google sign in failed"),
      };
    }
  }

  async signInWithGitHub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("GitHub sign in error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("GitHub sign in failed"),
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
