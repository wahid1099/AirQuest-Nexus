import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or API key not found in environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper functions for common operations
export const supabaseHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return supabase.auth
      .getSession()
      .then(({ data: { session } }) => !!session);
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Sign out
  signOut: () => {
    return supabase.auth.signOut();
  },

  // Upload file to storage
  uploadFile: async (bucket: string, path: string, file: File) => {
    return supabase.storage.from(bucket).upload(path, file);
  },

  // Get public URL for file
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
};

export default supabase;
