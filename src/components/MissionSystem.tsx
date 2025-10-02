import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle, Clock, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { classicMissions } from '../data/mockData';

export function MissionSystem() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient"
        >
          Classic Mission System
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Traditional missions for data collection and analysis
        </motion.p>
      </div>

      {/* Mission Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Data Collection",
            description: "Gather atmospheric data from global sensors",
            missions: classicMissions.filter(m => m.type === 'investigation').length,
            progress: 65,
            icon: Target,
            color: "cyan"
          },
          {
            title: "Data Analysis",
            description: "Process and analyze collected atmospheric data",
            missions: classicMissions.filter(m => m.type === 'strategy').length,
            progress: 80,
            icon: CheckCircle,
            color: "green"
          },
          {
            title: "Community Building",
            description: "Connect with other researchers and share findings",
            missions: 3,
            progress: 45,
            icon: Clock,
            color: "purple"
          }
        ].map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-500/20 text-${category.color}-400`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <p className="text-sm text-gray-400">{category.missions} missions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{category.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className={`text-${category.color}-400 font-medium`}>{category.progress}%</span>
                  </div>
                  <div className="progress-bar h-2" style={{ '--progress': `${category.progress}%` } as React.CSSProperties}></div>
                </div>
                <Button variant="outline" className="w-full">
                  View Missions
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Missions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classicMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{mission.title}</h4>
                      <p className="text-gray-400 text-sm">{mission.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={mission.status === 'completed' ? 'success' : 'secondary'}
                      >
                        {mission.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                      {mission.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Play className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400 font-medium">{mission.progress}%</span>
                    </div>
                    <div className="progress-bar h-2" style={{ '--progress': `${mission.progress}%` } as React.CSSProperties}></div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{mission.difficulty}</Badge>
                      <span className="text-sm text-yellow-400">{mission.reward}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}