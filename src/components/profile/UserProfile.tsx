import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Trophy,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Settings,
  Camera,
  Edit3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContextSimple";
import { formatNumber } from "../../lib/utils";

interface UserProfileProps {
  onSettingsClick: () => void;
}

export function UserProfile({ onSettingsClick }: UserProfileProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const levelProgress = ((user.totalXP % 1000) / 1000) * 100;
  const nextLevelXP = Math.ceil(user.totalXP / 1000) * 1000;

  const achievements = [
    {
      name: "Atmosphere Guardian",
      icon: "Shield",
      earned: true,
      rarity: "epic",
    },
    { name: "Data Detective", icon: "Search", earned: true, rarity: "rare" },
    { name: "Climate Hero", icon: "Heart", earned: false, rarity: "legendary" },
    { name: "Sky Explorer", icon: "Compass", earned: true, rarity: "common" },
    { name: "Ozone Protector", icon: "Zap", earned: false, rarity: "epic" },
    { name: "Global Citizen", icon: "Users", earned: true, rarity: "rare" },
  ];

  const missionHistory = [
    { name: "Atmospheric Detective", completed: "2 days ago", xp: 2500 },
    { name: "Climate Commander", completed: "1 week ago", xp: 1800 },
    { name: "Particle Tracker", completed: "2 weeks ago", xp: 1200 },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {user.username}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-gray-300 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {user.joinDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">
                    Rank #{formatNumber(user.globalRank)}
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Level {user.level}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatNumber(user.totalXP)} / {formatNumber(nextLevelXP)}{" "}
                    XP
                  </span>
                </div>
                <div
                  className="progress-bar h-3"
                  style={
                    { "--progress": `${levelProgress}%` } as React.CSSProperties
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Settings Button */}
            <Button variant="outline" onClick={onSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {formatNumber(user.totalXP)}
                </div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {user.level}
                </div>
                <div className="text-sm text-gray-400">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">8</div>
                <div className="text-sm text-gray-400">Missions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">4</div>
                <div className="text-sm text-gray-400">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span>Recent Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements
                .filter((a) => a.earned)
                .slice(0, 3)
                .map((achievement, index) => (
                  <div
                    key={achievement.name}
                    className="flex items-center space-x-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.rarity === "legendary"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : achievement.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-400"
                          : achievement.rarity === "rare"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {achievement.rarity}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <span>Recent Missions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {missionHistory.map((mission, index) => (
                <div
                  key={mission.name}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">{mission.name}</div>
                    <div className="text-xs text-gray-400">
                      {mission.completed}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-cyan-400">
                    +{formatNumber(mission.xp)} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>Badge Collection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.earned
                    ? `bg-gradient-to-br ${
                        achievement.rarity === "legendary"
                          ? "from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
                          : achievement.rarity === "epic"
                          ? "from-purple-500/20 to-pink-500/20 border-purple-500/50"
                          : achievement.rarity === "rare"
                          ? "from-blue-500/20 to-cyan-500/20 border-blue-500/50"
                          : "from-gray-500/20 to-gray-600/20 border-gray-500/50"
                      } glow-border`
                    : "bg-gray-800/30 border-gray-700 opacity-50"
                }`}
              >
                <div className="text-center space-y-2">
                  <div
                    className={`inline-flex p-3 rounded-full ${
                      achievement.earned
                        ? achievement.rarity === "legendary"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : achievement.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-400"
                          : achievement.rarity === "rare"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                        : "bg-gray-700/50 text-gray-600"
                    }`}
                  >
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4
                      className={`font-medium text-xs ${
                        achievement.earned ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {achievement.name}
                    </h4>
                    <p
                      className={`text-xs capitalize ${
                        achievement.earned ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {achievement.rarity}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
