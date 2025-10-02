import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MissionGameplay } from './MissionGameplay';
import { 
  Zap, 
  Shield, 
  Target, 
  Lock, 
  CheckCircle, 
  Play,
  Trophy,
  Star,
  Award,
  Crown,
  Sword,
  Users,
  Cpu,
  Satellite,
  Heart,
  Search,
  Compass,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { aiMissions, achievements, playerStats } from '../data/mockData';
import { getStatusColor, formatNumber } from '../lib/utils';

interface MissionCardProps {
  mission: typeof aiMissions[0];
  index: number;
  onMissionSelect: (mission: typeof aiMissions[0]) => void;
}

function MissionCard({ mission, index, onMissionSelect }: MissionCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'investigation': return Target;
      case 'defense': return Shield;
      case 'strategy': return Zap;
      default: return Target;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Play;
      case 'locked': return Lock;
      default: return Play;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'warning';
      case 'Expert': return 'destructive';
      default: return 'default';
    }
  };

  const TypeIcon = getTypeIcon(mission.type);
  const StatusIcon = getStatusIcon(mission.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card 
        className={`h-full relative overflow-hidden group transition-all duration-300 ${
          mission.status === 'active' ? 'glow-border hologram-flicker' :
          mission.status === 'completed' ? 'border-green-500/50 bg-green-500/5' :
          'border-gray-600 opacity-60'
        }`}
      >
        {/* Holographic overlay */}
        {mission.status === 'active' && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        )}
        
        {/* Status indicator */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`p-2 rounded-full ${getStatusColor(mission.status)} bg-current/10 border border-current/30`}>
            <StatusIcon className="w-4 h-4" />
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start space-x-3">
            <div className={`p-3 rounded-lg ${
              mission.type === 'investigation' ? 'bg-cyan-500/20 text-cyan-400' :
              mission.type === 'defense' ? 'bg-green-500/20 text-green-400' :
              'bg-purple-500/20 text-purple-400'
            } transition-colors group-hover:scale-110 duration-300`}>
              <TypeIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 line-clamp-2">
                {mission.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={getDifficultyColor(mission.difficulty)} className="text-xs">
                  {mission.difficulty}
                </Badge>
                <span className="text-cyan-400 text-sm font-medium">+{formatNumber(mission.xp)} XP</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {mission.description}
          </p>

          {/* Progress bar for active missions */}
          {mission.status === 'active' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-cyan-400 font-medium">{mission.progress}%</span>
              </div>
              <div className="progress-bar h-2" style={{ '--progress': `${mission.progress}%` } as React.CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full data-flow opacity-30"></div>
              </div>
            </div>
          )}

          {/* Reward */}
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center space-x-2 text-sm">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{mission.reward}</span>
            </div>
          </div>

          {/* Action button */}
          <Button
            className="w-full"
            variant={
              mission.status === 'completed' ? 'success' :
              mission.status === 'locked' ? 'outline' :
              'default'
            }
            disabled={mission.status === 'locked'}
            onClick={() => {
              if (mission.status === 'active') {
                onMissionSelect(mission);
              }
            }}
          >
            {mission.status === 'completed' ? 'Completed' :
             mission.status === 'locked' ? 'Locked' :
             'Continue Mission'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AchievementBadge({ achievement, index }: { achievement: typeof achievements[0], index: number }) {
  const getIcon = (iconName: string) => {
    const icons = {
      Shield, Search, Heart, Compass, Zap, Users, Cpu, Trophy, Sword, Satellite, Crown, Star
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  const Icon = getIcon(achievement.icon);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
        achievement.earned 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 glow-border' 
          : 'bg-gray-800/30 border-gray-700 opacity-50'
      }`}>
        <div className="text-center space-y-2">
          <div className={`inline-flex p-3 rounded-full ${
            achievement.earned ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700/50 text-gray-500'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className={`font-medium text-sm ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
              {achievement.name}
            </h4>
            <p className={`text-xs ${achievement.earned ? 'text-gray-300' : 'text-gray-600'}`}>
              {achievement.description}
            </p>
          </div>
        </div>
        
        {achievement.earned && (
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AIQuestMissions() {
  const [activeTab, setActiveTab] = useState<'missions' | 'progress' | 'vault'>('missions');
  const [activeMission, setActiveMission] = useState<typeof aiMissions[0] | null>(null);

  const tabs = [
    { id: 'missions' as const, name: 'Missions', icon: Target },
    { id: 'progress' as const, name: 'Progress', icon: Trophy },
    { id: 'vault' as const, name: 'Vault', icon: Award }
  ];

  if (activeMission) {
    return (
      <MissionGameplay 
        mission={{
          ...activeMission,
          objective: activeMission.title === "Atmospheric Detective" 
            ? "Detect PM2.5 hotspots in South Asia using TEMPO & IMERG rainfall data"
            : activeMission.title === "Particle Tracker"
            ? "Track PM2.5 particles across continents using satellite imagery"
            : "Complete your assigned atmospheric analysis mission"
        }}
        onExit={() => setActiveMission(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient"
        >
          AI Quest Missions
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Embark on AI-powered missions to explore atmospheric data
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl border border-gray-700/50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 py-2"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-cyan-500/20 rounded-lg border border-cyan-500/50 -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'missions' && (
          <motion.div
            key="missions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiMissions.map((mission, index) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  index={index} 
                  onMissionSelect={setActiveMission}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Commander Stats */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-purple-400" />
                  <span>Commander Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">{formatNumber(playerStats.totalXP)}</div>
                    <div className="text-sm text-gray-400">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{playerStats.missionsCompleted}</div>
                    <div className="text-sm text-gray-400">Missions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{playerStats.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">#{playerStats.globalRank}</div>
                    <div className="text-sm text-gray-400">Global Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Atmosphere Guardian', 'Data Detective', 'Climate Hero'].map((achievement, index) => (
                    <div key={achievement} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{achievement}</span>
                        <span className="text-cyan-400">{85 - index * 25}%</span>
                      </div>
                      <div className="progress-bar h-2" style={{ '--progress': `${85 - index * 25}%` } as React.CSSProperties}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'vault' && (
          <motion.div
            key="vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span>Sky Vault Badge Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}