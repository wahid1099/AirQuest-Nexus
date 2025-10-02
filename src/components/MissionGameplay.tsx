import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Award, 
  MapPin, 
  Wind, 
  Cloud, 
  Droplets,
  Thermometer,
  Eye,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Bot,
  Globe,
  Layers,
  Timer,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MissionGameplayProps {
  mission: {
    id: number;
    title: string;
    description: string;
    objective: string;
    progress: number;
    xp: number;
  };
  onExit: () => void;
}

interface ScenarioControl {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

interface LayerToggle {
  id: string;
  name: string;
  active: boolean;
  color: string;
  icon: React.ElementType;
}

export function MissionGameplay({ mission, onExit }: MissionGameplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [missionProgress, setMissionProgress] = useState(mission.progress);
  const [earnedXP, setEarnedXP] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [aiMessage, setAiMessage] = useState("Welcome, Commander! Let's analyze atmospheric data to complete your mission.");
  const [showReward, setShowReward] = useState(false);

  const [scenarioControls, setScenarioControls] = useState<ScenarioControl[]>([
    { id: 'traffic', name: 'Traffic Density', value: 75, min: 0, max: 100, unit: '%', icon: Target, color: 'red' },
    { id: 'wildfire', name: 'Wildfire Intensity', value: 30, min: 0, max: 100, unit: '%', icon: Zap, color: 'orange' },
    { id: 'forest', name: 'Forest Cover', value: 60, min: 0, max: 100, unit: '%', icon: Globe, color: 'green' },
    { id: 'rainfall', name: 'Rainfall Rate', value: 45, min: 0, max: 100, unit: 'mm/h', icon: Droplets, color: 'blue' }
  ]);

  const [layers, setLayers] = useState<LayerToggle[]>([
    { id: 'no2', name: 'NO₂', active: true, color: '#ef4444', icon: Wind },
    { id: 'pm25', name: 'PM2.5', active: true, color: '#f59e0b', icon: Cloud },
    { id: 'aerosol', name: 'Aerosol', active: false, color: '#00d9ff', icon: Eye },
    { id: 'rainfall', name: 'Rainfall', active: false, color: '#10b981', icon: Droplets },
    { id: 'sensors', name: 'Ground Sensors', active: true, color: '#8b5cf6', icon: MapPin }
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleControlChange = (id: string, value: number) => {
    setScenarioControls(prev => 
      prev.map(control => 
        control.id === id ? { ...control, value } : control
      )
    );

    // Simulate AI feedback based on changes
    if (id === 'traffic' && value < 50) {
      setAiMessage("Excellent! Reducing traffic by " + (75 - value) + "% will lower NO₂ concentrations by approximately " + Math.round((75 - value) * 0.3) + "%.");
      setEarnedXP(prev => prev + 50);
    } else if (id === 'wildfire' && value > 70) {
      setAiMessage("⚠️ Warning: High wildfire intensity is increasing aerosol index over 3 neighboring cities!");
    } else if (id === 'forest' && value > 80) {
      setAiMessage("🌲 Great strategy! Increased forest cover will absorb more CO₂ and improve air quality.");
      setEarnedXP(prev => prev + 75);
    }

    // Update mission progress
    setMissionProgress(prev => Math.min(100, prev + 2));
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, active: !layer.active } : layer
      )
    );
  };

  const deployAction = (action: string) => {
    setEarnedXP(prev => prev + 100);
    setMissionProgress(prev => Math.min(100, prev + 10));
    
    if (action === 'sensor') {
      setAiMessage("🛰️ Sensor deployed! Real-time data streaming from your selected location.");
    } else if (action === 'forecast') {
      setAiMessage("🔮 AI Forecast running... Predicting 72-hour pollution patterns with 94% accuracy.");
    } else if (action === 'history') {
      setAiMessage("📊 Historical comparison complete! Current levels are 23% lower than last year.");
    }

    if (missionProgress >= 90) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Mission Objective Panel - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-20"
      >
        <Card className="w-80 glass-morphism border-cyan-500/50 glow-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Mission Objective</span>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onExit}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold text-white">{mission.title}</h3>
            <p className="text-sm text-gray-300">{mission.objective || mission.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-cyan-400">{missionProgress}%</span>
              </div>
              <div className="progress-bar h-2" style={{ '--progress': `${missionProgress}%` } as React.CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-30 data-flow"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">+{earnedXP} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Central Globe Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-96 h-96 bg-gradient-to-br from-blue-900/30 via-green-800/20 to-blue-800/30 rounded-full border-4 border-cyan-500/30 overflow-hidden group">
          {/* Atmosphere glow */}
          <div className="absolute inset-[-20px] bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Pollution data points */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`absolute w-3 h-3 rounded-full cursor-pointer ${
                i % 4 === 0 ? 'bg-red-500/80 border-red-400' :
                i % 4 === 1 ? 'bg-orange-500/80 border-orange-400' :
                i % 4 === 2 ? 'bg-yellow-500/80 border-yellow-400' :
                'bg-green-500/80 border-green-400'
              } border-2 hover:scale-150 transition-all pulse-glow`}
              style={{
                left: `${20 + (i % 4) * 20 + Math.cos(i) * 15}%`,
                top: `${20 + Math.floor(i / 3) * 20 + Math.sin(i) * 15}%`
              }}
              whileHover={{ scale: 1.5 }}
            >
              <div className="absolute -inset-2 bg-current opacity-20 rounded-full animate-ping"></div>
            </motion.div>
          ))}

          {/* Data flow particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full data-flow"
              style={{
                left: `${10 + i * 10}%`,
                top: `${30 + i * 5}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}

          {/* Globe center info */}
          <div className="absolute inset-0 flex items-center justify-center text-center z-10">
            <div className="space-y-2">
              <Globe className="w-12 h-12 mx-auto text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
              <p className="text-sm font-medium text-white">Live Earth Data</p>
              <p className="text-xs text-gray-400">NASA TEMPO + IMERG</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant Panel - Right Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 right-6 w-80 z-20"
      >
        <Card className="glass-morphism border-purple-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>AI Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <motion.p 
                  key={aiMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-300 leading-relaxed"
                >
                  {aiMessage}
                </motion.p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Controls - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <Card className="w-[800px] glass-morphism border-gray-600/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Scenario Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scenario Sliders */}
            <div className="grid grid-cols-2 gap-4">
              {scenarioControls.map((control) => (
                <div key={control.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <control.icon className={`w-4 h-4 text-${control.color}-400`} />
                      <span className="text-sm text-gray-300">{control.name}</span>
                    </div>
                    <span className="text-sm text-cyan-400">{control.value}{control.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={control.value}
                    onChange={(e) => handleControlChange(control.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 pt-2">
              <Button variant="default" onClick={() => deployAction('sensor')}>
                <MapPin className="w-4 h-4 mr-2" />
                Deploy Sensor
              </Button>
              <Button variant="secondary" onClick={() => deployAction('forecast')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Run Forecast
              </Button>
              <Button variant="outline" onClick={() => deployAction('history')}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Compare History
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mini-Map & Layers - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-6 z-20"
      >
        <Card className="w-64 glass-morphism border-green-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Layers className="w-5 h-5" />
              <span>Data Layers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {layers.map((layer) => (
              <Button
                key={layer.id}
                variant={layer.active ? 'default' : 'outline'}
                onClick={() => toggleLayer(layer.id)}
                className="w-full justify-start text-sm"
                style={{
                  borderColor: layer.active ? layer.color : undefined
                }}
              >
                <layer.icon className="w-4 h-4 mr-2" />
                {layer.name}
                <div 
                  className="w-2 h-2 rounded-full ml-auto"
                  style={{ backgroundColor: layer.active ? layer.color : 'transparent' }}
                />
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 glow-border">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Mission Complete!</h3>
                <p className="text-gray-300">+{mission.xp} XP Earned</p>
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Control */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <Button
          variant={isPlaying ? 'destructive' : 'success'}
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? 'Pause Simulation' : 'Start Simulation'}
        </Button>
      </motion.div>
    </div>
  );
}