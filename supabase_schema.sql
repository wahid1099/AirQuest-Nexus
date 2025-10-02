-- CleanSpace Database Schema for Supabase
-- This file contains all the SQL commands to set up the database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE mission_status AS ENUM ('not_started', 'in_progress', 'completed', 'failed');
CREATE TYPE session_type AS ENUM ('cleanspace', 'mission', 'exploration');
CREATE TYPE content_type AS ENUM ('mission_result', 'achievement', 'air_quality_report', 'custom');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    level INTEGER DEFAULT 1 NOT NULL,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    global_rank INTEGER,
    preferences JSONB DEFAULT '{}',
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{
        "profileVisibility": "public",
        "showAchievements": true,
        "showProgress": true,
        "allowMessages": true
    }'
);

-- Achievements table
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    achievement_data JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    mission_id TEXT,
    points_earned INTEGER DEFAULT 0 NOT NULL,
    badge_icon TEXT,
    badge_name TEXT NOT NULL,
    badge_description TEXT NOT NULL,
    rarity achievement_rarity DEFAULT 'common' NOT NULL
);

-- Mission progress table
CREATE TABLE mission_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    mission_id TEXT NOT NULL,
    status mission_status DEFAULT 'not_started' NOT NULL,
    progress_percentage INTEGER DEFAULT 0 NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_step INTEGER DEFAULT 0 NOT NULL,
    total_steps INTEGER DEFAULT 1 NOT NULL,
    data JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    score INTEGER,
    time_spent INTEGER DEFAULT 0 NOT NULL, -- in seconds
    actions_completed JSONB DEFAULT '[]'
);

-- Game sessions table
CREATE TABLE game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    session_type session_type NOT NULL,
    location_data JSONB DEFAULT '{}',
    air_quality_data JSONB DEFAULT '{}',
    actions_taken JSONB DEFAULT '[]',
    score INTEGER DEFAULT 0 NOT NULL,
    duration INTEGER DEFAULT 0 NOT NULL, -- in seconds
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    achievements_earned JSONB DEFAULT '[]'
);

-- Telemetry table for analytics
CREATE TABLE telemetry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_agent TEXT,
    ip_address INET,
    location JSONB
);

-- Shared content table for social features
CREATE TABLE shared_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content_type content_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_data JSONB DEFAULT '{}',
    media_urls JSONB,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    shares_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    tags JSONB DEFAULT '[]'
);

-- NASA data cache table
CREATE TABLE nasa_data_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    data_type TEXT NOT NULL,
    location_key TEXT NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    UNIQUE(data_type, location_key)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX idx_profiles_global_rank ON profiles(global_rank);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_earned_at ON achievements(earned_at DESC);
CREATE INDEX idx_achievements_achievement_type ON achievements(achievement_type);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

CREATE INDEX idx_mission_progress_user_id ON mission_progress(user_id);
CREATE INDEX idx_mission_progress_mission_id ON mission_progress(mission_id);
CREATE INDEX idx_mission_progress_status ON mission_progress(status);
CREATE INDEX idx_mission_progress_updated_at ON mission_progress(updated_at DESC);

CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_session_type ON game_sessions(session_type);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX idx_game_sessions_completed ON game_sessions(completed);

CREATE INDEX idx_telemetry_user_id ON telemetry(user_id);
CREATE INDEX idx_telemetry_event_type ON telemetry(event_type);
CREATE INDEX idx_telemetry_timestamp ON telemetry(timestamp DESC);
CREATE INDEX idx_telemetry_session_id ON telemetry(session_id);

CREATE INDEX idx_shared_content_user_id ON shared_content(user_id);
CREATE INDEX idx_shared_content_content_type ON shared_content(content_type);
CREATE INDEX idx_shared_content_is_public ON shared_content(is_public);
CREATE INDEX idx_shared_content_created_at ON shared_content(created_at DESC);

CREATE INDEX idx_nasa_data_cache_data_type_location ON nasa_data_cache(data_type, location_key);
CREATE INDEX idx_nasa_data_cache_expires_at ON nasa_data_cache(expires_at);

-- Create leaderboard view
CREATE VIEW leaderboard AS
SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.total_xp,
    p.level,
    p.global_rank,
    COUNT(a.id) as achievements_count,
    COUNT(CASE WHEN mp.status = 'completed' THEN 1 END) as missions_completed
FROM profiles p
LEFT JOIN achievements a ON p.id = a.user_id
LEFT JOIN mission_progress mp ON p.id = mp.user_id
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.total_xp, p.level, p.global_rank
ORDER BY p.total_xp DESC, p.level DESC;

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mission_progress_updated_at BEFORE UPDATE ON mission_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shared_content_updated_at BEFORE UPDATE ON shared_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nasa_data_cache_updated_at BEFORE UPDATE ON nasa_data_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user rank
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS VOID AS $$
BEGIN
    WITH ranked_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY total_xp DESC, level DESC) as rank
        FROM profiles
        WHERE total_xp > 0
    )
    UPDATE profiles 
    SET global_rank = ranked_users.rank
    FROM ranked_users
    WHERE profiles.id = ranked_users.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(
    total_missions BIGINT,
    completed_missions BIGINT,
    total_achievements BIGINT,
    total_score BIGINT,
    avg_session_duration NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(mp.id) as total_missions,
        COUNT(CASE WHEN mp.status = 'completed' THEN 1 END) as completed_missions,
        COUNT(a.id) as total_achievements,
        COALESCE(SUM(gs.score), 0) as total_score,
        COALESCE(AVG(gs.duration), 0) as avg_session_duration
    FROM profiles p
    LEFT JOIN mission_progress mp ON p.id = mp.user_id
    LEFT JOIN achievements a ON p.id = a.user_id
    LEFT JOIN game_sessions gs ON p.id = gs.user_id
    WHERE p.id = user_id
    GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE nasa_data_cache ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own achievements" ON achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mission progress policies
CREATE POLICY "Users can view their own mission progress" ON mission_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mission progress" ON mission_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mission progress" ON mission_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Game sessions policies
CREATE POLICY "Users can view their own game sessions" ON game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Telemetry policies
CREATE POLICY "Users can insert telemetry data" ON telemetry
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Shared content policies
CREATE POLICY "Public shared content is viewable by everyone" ON shared_content
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own shared content" ON shared_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shared content" ON shared_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared content" ON shared_content
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared content" ON shared_content
    FOR DELETE USING (auth.uid() = user_id);

-- NASA data cache policies (public read, service role write)
CREATE POLICY "NASA data cache is readable by everyone" ON nasa_data_cache
    FOR SELECT USING (true);

-- Storage bucket for avatars and media
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('shared-media', 'shared-media', true);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Shared media is publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'shared-media');

CREATE POLICY "Authenticated users can upload shared media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'shared-media' AND auth.role() = 'authenticated');

-- Create initial data
INSERT INTO profiles (id, username, full_name, email, level, total_xp, global_rank)
SELECT 
    id,
    'demo_user',
    'Demo User',
    email,
    1,
    0,
    1
FROM auth.users
WHERE email = 'demo@cleanspace.app'
ON CONFLICT (id) DO NOTHING;

-- Sample achievements data
INSERT INTO achievements (user_id, achievement_type, badge_name, badge_description, rarity, points_earned)
SELECT 
    id,
    'first_mission',
    'First Steps',
    'Completed your first CleanSpace mission',
    'common',
    100
FROM profiles
WHERE username = 'demo_user'
ON CONFLICT DO NOTHING;

-- Create scheduled function to update ranks daily
SELECT cron.schedule(
    'update-user-ranks',
    '0 2 * * *', -- Run at 2 AM daily
    'SELECT update_user_rank();'
);

-- Create function to clean up old telemetry data
CREATE OR REPLACE FUNCTION cleanup_old_telemetry()
RETURNS VOID AS $$
BEGIN
    DELETE FROM telemetry 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule telemetry cleanup weekly
SELECT cron.schedule(
    'cleanup-telemetry',
    '0 3 * * 0', -- Run at 3 AM every Sunday
    'SELECT cleanup_old_telemetry();'
);

-- Create function to clean up expired NASA data cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS VOID AS $$
BEGIN
    DELETE FROM nasa_data_cache 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cache cleanup every hour
SELECT cron.schedule(
    'cleanup-cache',
    '0 * * * *', -- Run every hour
    'SELECT cleanup_expired_cache();'
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE achievements IS 'User achievements and badges';
COMMENT ON TABLE mission_progress IS 'Progress tracking for game missions';
COMMENT ON TABLE game_sessions IS 'Individual game session data';
COMMENT ON TABLE telemetry IS 'Analytics and telemetry data';
COMMENT ON TABLE shared_content IS 'User-generated content for sharing';
COMMENT ON TABLE nasa_data_cache IS 'Cached NASA API responses';

COMMENT ON FUNCTION update_user_rank() IS 'Updates global ranking for all users based on XP';
COMMENT ON FUNCTION get_user_stats(UUID) IS 'Returns comprehensive statistics for a user';
COMMENT ON FUNCTION cleanup_old_telemetry() IS 'Removes telemetry data older than 90 days';
COMMENT ON FUNCTION cleanup_expired_cache() IS 'Removes expired NASA data cache entries';

