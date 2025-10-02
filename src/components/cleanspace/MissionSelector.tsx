import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Star,
  Clock,
  Target,
  Award,
  MapPin,
  Satellite,
  Users,
  TreePine,
  Zap,
  CheckCircle,
  Play,
  Info,
  Trophy,
  Globe,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { MissionLevel, Achievement, missionLevels, achievements } from "../../data/missionLevels";

interface MissionSelectorProps {
  onMissionSelect: (mission: MissionLevel) => void;
  onBack: () => void;
  userProgress: {
    completedMissions: string[];
    totalScore: number;
    unlockedAchievements: string[];
  };
}

export function MissionSelector({ onMissionSelect, onBack, userProgress }: MissionSelectorProps) {
  const [selectedMission, setSelectedMission] = useState<MissionLevel | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [availableMissions, setAvailableMissions] = useState<MissionLevel[]>([]);

  useEffect(() => {
    // Update mission unlock status based on user progress
    const updatedMissions = missionLevels.map(mission => {
      const isCompleted = userProgress.completedMissions.includes(mission.id);
      let isUnlocked = mission.level === 1; // First mission always unlocked

      if (mission.unlockRequirements.previousLevel) {
        isUnlocked = userProgress.completedMissions.includes(mission.unlockRequirements.previousLevel);
      }

      if (mission.unlockRequirements.totalScore) {
        isUnlocked = isUnlocked && userProgress.totalScore >= mission.unlockRequirements.totalScore;
      }

      if (mission.unlockRequirements.achievementsRequired) {
        isUnlocked = isUnlocked && mission.unlockRequirements.achievementsRequired.every(
          achId => userProgress.unlockedAchievements.includes(achId)
        );
      }

      return { ...mission, isUnlocked, isCompleted };
    });

    setAvailableMissions(updatedMissions);
  }, [userProgress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'intermediate': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'advanced': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
      case 'expert': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'legendary': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <TreePine className="w-4 h-4" />;
      case 'intermediate': return <Target className="w-4 h-4" />;
      case 'advanced': return <Zap className="w-4 h-4" />;
      case 'expert': return <Rocket className="w-4 h-4" />;
      case 'legendary': return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const unlockedAchievements = achievements.filter(ach => 
    userProgress.unlockedAchievements.includes(ach.id)
  );

  const totalPossibleScore = missionLevels.reduce((sum, mission) => 
    sum + mission.objectives.reduce((objSum, obj) => objSum + obj.points, 0), 0
  );

  const progressPercentage = (userProgress.totalScore / totalPossibleScore) * 100;

  return (
    <div className="min-h-screen cosmic-gradient p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">CleanSpace Missions</h1>
            <p className="text-gray-300">Choose your next air quality challenge</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowAchievements(!showAchievements)}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Award className="w-4 h-4 mr-2" />
              Achievements ({unlockedAchievements.length})
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              Back to Game
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-morphism glow-border">
            <CardHeader>
              <CardTitle className="text-gradient flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                Mission Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">
                    {userProgress.completedMissions.length}/{missionLevels.length}
                  </div>
                  <div className="text-sm text-gray-400">Missions Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {userProgress.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {unlockedAchievements.length}/{achievements.length}
                  </div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-400">Overall Progress</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Panel */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="glass-morphism glow-border">
                <CardHeader>
                  <CardTitle className="text-gradient">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => {
                      const isUnlocked = userProgress.unlockedAchievements.includes(achievement.id);
                      return (
                        <motion.div
                          key={achievement.id}
                          className={`p-4 rounded-lg border transition-all ${
                            isUnlocked
                              ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                              : "bg-gray-800/30 border-gray-600/30"
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                                {achievement.title}
                              </h3>
                              <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge className={`${getRarityColor(achievement.rarity)} bg-transparent border`}>
                                  {achievement.rarity}
                                </Badge>
                                <span className={`text-sm font-semibold ${isUnlocked ? 'text-cyan-400' : 'text-gray-500'}`}>
                                  +{achievement.points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative"
            >
              <Card className={`glass-morphism transition-all cursor-pointer ${
                mission.isUnlocked
                  ? "glow-border hover:shadow-lg hover:shadow-cyan-500/20"
                  : "opacity-60 border-gray-600/30"
              } ${mission.isCompleted ? "border-green-500/50" : ""}`}
              onClick={() => mission.isUnlocked && setSelectedMission(mission)}
              >
                {/* Lock Overlay */}
                {!mission.isUnlocked && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Locked</p>
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {mission.isCompleted && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                          Level {mission.level}
                        </Badge>
                        <Badge className={getDifficultyColor(mission.difficulty)}>
                          {getDifficultyIcon(mission.difficulty)}
                          <span className="ml-1 capitalize">{mission.difficulty}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-gray-100 mb-1">
                        {mission.title}
                      </CardTitle>
                      <p className="text-sm text-cyan-400 mb-2">{mission.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {mission.description}
                  </p>

                  {/* Mission Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">{mission.estimatedTime}min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">{mission.location.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Satellite className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">{mission.nasaDataSources.length} datasets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-400">{mission.objectives.length} objectives</span>
                    </div>
                  </div>

                  {/* Objectives Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">Objectives:</h4>
                    {mission.objectives.slice(0, 2).map((objective) => (
                      <div key={objective.id} className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-400 line-clamp-1">{objective.description}</span>
                        <span className="text-cyan-400 font-semibold">+{objective.points}</span>
                      </div>
                    ))}
                    {mission.objectives.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{mission.objectives.length - 2} more objectives
                      </div>
                    )}
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-yellow-400">+{mission.rewards.xp} XP</span>
                      <span className="text-green-400">+{mission.rewards.credits} credits</span>
                    </div>
                    {mission.isUnlocked && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMissionSelect(mission);
                        }}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mission Detail Modal */}
        <AnimatePresence>
          {selectedMission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMission(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="glass-morphism glow-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                            Level {selectedMission.level}
                          </Badge>
                          <Badge className={getDifficultyColor(selectedMission.difficulty)}>
                            {getDifficultyIcon(selectedMission.difficulty)}
                            <span className="ml-1 capitalize">{selectedMission.difficulty}</span>
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl text-gradient mb-2">
                          {selectedMission.title}
                        </CardTitle>
                        <p className="text-lg text-cyan-400">{selectedMission.subtitle}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMission(null)}
                        className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Mission Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Mission Brief</h3>
                      <p className="text-gray-300">{selectedMission.description}</p>
                    </div>

                    {/* Location & Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Location</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">{selectedMission.location.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">
                              {selectedMission.location.city}, {selectedMission.location.country}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">
                              Region: {selectedMission.location.regionSize}km radius
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Mission Stats</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">Est. Time: {selectedMission.estimatedTime} minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300">Starting Credits: {selectedMission.initialCredits}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Satellite className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">NASA Datasets: {selectedMission.nasaDataSources.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">Mission Objectives</h3>
                      <div className="space-y-3">
                        {selectedMission.objectives.map((objective, index) => (
                          <div key={objective.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                            <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs text-cyan-400 font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-300">{objective.description}</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              +{objective.points} pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* NASA Data Sources */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">NASA Data Sources</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMission.nasaDataSources.map((source) => (
                          <Badge key={source} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            <Satellite className="w-3 h-3 mr-1" />
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Real World Context */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Real World Context</h3>
                      <p className="text-gray-300 bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                        <Info className="w-4 h-4 inline mr-2 text-blue-400" />
                        {selectedMission.realWorldContext}
                      </p>
                    </div>

                    {/* Scientific Facts */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Scientific Facts</h3>
                      <div className="space-y-2">
                        {selectedMission.scientificFacts.map((fact, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Mission Rewards</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                          <div className="text-xl font-bold text-yellow-400">+{selectedMission.rewards.xp}</div>
                          <div className="text-sm text-gray-400">Experience</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <div className="text-xl font-bold text-green-400">+{selectedMission.rewards.credits}</div>
                          <div className="text-sm text-gray-400">Credits</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                          <div className="text-xl font-bold text-purple-400">{selectedMission.rewards.achievements.length}</div>
                          <div className="text-sm text-gray-400">Achievements</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                          <div className="text-xl font-bold text-cyan-400">{selectedMission.rewards.unlocksNext.length}</div>
                          <div className="text-sm text-gray-400">Unlocks</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedMission(null)}
                        className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        Back to Missions
                      </Button>
                      <Button
                        onClick={() => onMissionSelect(selectedMission)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 pulse-glow"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Mission
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
