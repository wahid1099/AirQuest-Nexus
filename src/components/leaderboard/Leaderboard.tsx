import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Users,
  Globe,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LeaderboardEntry } from "../../types";
import { formatNumber } from "../../lib/utils";

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: "1",
      username: "AtmosphereExplorer",
      profilePicture: undefined,
    },
    totalXP: 45230,
    level: 28,
    badgeCount: 15,
  },
  {
    rank: 2,
    user: { id: "2", username: "ClimateGuardian", profilePicture: undefined },
    totalXP: 42150,
    level: 26,
    badgeCount: 13,
  },
  {
    rank: 3,
    user: { id: "3", username: "DataDetective", profilePicture: undefined },
    totalXP: 38900,
    level: 24,
    badgeCount: 12,
  },
  {
    rank: 4,
    user: { id: "4", username: "OzoneProtector", profilePicture: undefined },
    totalXP: 35600,
    level: 22,
    badgeCount: 11,
  },
  {
    rank: 5,
    user: { id: "5", username: "SkyWatcher", profilePicture: undefined },
    totalXP: 32400,
    level: 20,
    badgeCount: 10,
  },
  {
    rank: 6,
    user: { id: "6", username: "PollutionFighter", profilePicture: undefined },
    totalXP: 29800,
    level: 19,
    badgeCount: 9,
  },
  {
    rank: 7,
    user: { id: "7", username: "EarthChampion", profilePicture: undefined },
    totalXP: 27200,
    level: 18,
    badgeCount: 8,
  },
  {
    rank: 8,
    user: { id: "8", username: "AirQualityHero", profilePicture: undefined },
    totalXP: 24600,
    level: 16,
    badgeCount: 7,
  },
  {
    rank: 9,
    user: { id: "9", username: "TempoMaster", profilePicture: undefined },
    totalXP: 22100,
    level: 15,
    badgeCount: 6,
  },
  {
    rank: 10,
    user: { id: "10", username: "SatelliteScout", profilePicture: undefined },
    totalXP: 19500,
    level: 14,
    badgeCount: 5,
  },
];

interface LeaderboardProps {
  currentUserId?: string;
}

export function Leaderboard({ currentUserId = "9" }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"all-time" | "monthly" | "weekly">(
    "all-time"
  );
  const [category, setCategory] = useState<"global" | "friends">("global");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/50";
      case 2:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/50";
      case 3:
        return "from-amber-600/20 to-amber-700/20 border-amber-600/50";
      default:
        return "from-gray-800/50 to-gray-900/50 border-gray-700/50";
    }
  };

  const currentUserEntry = mockLeaderboardData.find(
    (entry) => entry.user.id === currentUserId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient"
        >
          Global Leaderboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Compete with atmospheric explorers worldwide
        </motion.p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl border border-gray-700/50">
          {[
            { id: "global" as const, name: "Global", icon: Globe },
            { id: "friends" as const, name: "Friends", icon: Users },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "ghost"}
              onClick={() => setCategory(cat.id)}
              className="px-4 py-2"
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl border border-gray-700/50">
          {[
            { id: "all-time" as const, name: "All Time", icon: Trophy },
            { id: "monthly" as const, name: "Monthly", icon: Calendar },
            { id: "weekly" as const, name: "Weekly", icon: TrendingUp },
          ].map((time) => (
            <Button
              key={time.id}
              variant={timeframe === time.id ? "default" : "ghost"}
              onClick={() => setTimeframe(time.id)}
              className="px-4 py-2"
            >
              <time.icon className="w-4 h-4 mr-2" />
              {time.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Current User Position (if not in top 10) */}
      {currentUserEntry && currentUserEntry.rank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-cyan-400">
                    #{currentUserEntry.rank}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {currentUserEntry.user.username.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {currentUserEntry.user.username} (You)
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {currentUserEntry.level}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-cyan-400">
                    {formatNumber(currentUserEntry.totalXP)} XP
                  </div>
                  <div className="text-sm text-gray-400">
                    {currentUserEntry.badgeCount} badges
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mockLeaderboardData.slice(0, 3).map((entry, index) => {
          const positions = [1, 0, 2]; // Second place in middle for podium effect
          const actualIndex = positions[index];
          const actualEntry = mockLeaderboardData[actualIndex];

          return (
            <motion.div
              key={actualEntry.user.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${index === 1 ? "md:order-first" : ""}`}
            >
              <Card
                className={`bg-gradient-to-br ${getRankColor(
                  actualEntry.rank
                )} relative overflow-hidden`}
              >
                <CardContent className="p-6 text-center">
                  {/* Rank Icon */}
                  <div className="mb-4">{getRankIcon(actualEntry.rank)}</div>

                  {/* Profile */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-2">
                      {actualEntry.user.username.charAt(0)}
                    </div>
                    <h3 className="font-bold text-white mb-1">
                      {actualEntry.user.username}
                      {actualEntry.user.id === currentUserId && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Level {actualEntry.level}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-cyan-400">
                      {formatNumber(actualEntry.totalXP)}
                    </div>
                    <div className="text-sm text-gray-400">XP</div>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{actualEntry.badgeCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Podium Effect */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      actualEntry.rank === 1
                        ? "h-4 bg-yellow-500/20"
                        : actualEntry.rank === 2
                        ? "h-3 bg-gray-400/20"
                        : "h-2 bg-amber-600/20"
                    }`}
                  ></div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Top Atmospheric Explorers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {mockLeaderboardData.map((entry, index) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${
                  entry.user.id === currentUserId
                    ? "bg-cyan-500/5 border-l-4 border-l-cyan-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.user.username.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center space-x-2">
                          <span>{entry.user.username}</span>
                          {entry.user.id === currentUserId && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Level {entry.level}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="font-bold text-cyan-400">
                        {formatNumber(entry.totalXP)}
                      </div>
                      <div className="text-xs text-gray-400">XP</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">{entry.badgeCount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {formatNumber(mockLeaderboardData.length * 1000)}
            </div>
            <div className="text-sm text-gray-400">Total Explorers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {formatNumber(
                mockLeaderboardData.reduce(
                  (sum, entry) => sum + entry.totalXP,
                  0
                )
              )}
            </div>
            <div className="text-sm text-gray-400">Total XP Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatNumber(
                mockLeaderboardData.reduce(
                  (sum, entry) => sum + entry.badgeCount,
                  0
                )
              )}
            </div>
            <div className="text-sm text-gray-400">Badges Earned</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
