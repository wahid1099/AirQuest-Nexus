import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  Share2, 
  Globe, 
  Heart,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { communityStats } from '../data/mockData';
import { formatNumber } from '../lib/utils';

export function CommunityHub() {
  const recentActivity = [
    {
      user: "Dr. Sarah Chen",
      action: "discovered unusual NO₂ patterns in Beijing",
      time: "2 hours ago",
      impact: "High",
      type: "discovery"
    },
    {
      user: "Climate_Explorer_42",
      action: "completed Atmospheric Detective mission",
      time: "4 hours ago",
      impact: "Medium",
      type: "mission"
    },
    {
      user: "AirQuality_Guru",
      action: "shared insights on PM2.5 reduction strategies",
      time: "6 hours ago",
      impact: "High",
      type: "insight"
    },
    {
      user: "EcoWarrior_NYC",
      action: "achieved Data Detective badge",
      time: "8 hours ago",
      impact: "Low",
      type: "achievement"
    }
  ];

  const features = [
    {
      title: "Share Findings",
      description: "Contribute your discoveries to the global knowledge base",
      icon: Share2,
      color: "cyan",
      action: "Share Discovery"
    },
    {
      title: "Global Network",
      description: "Connect with researchers and citizens worldwide",
      icon: Globe,
      color: "purple",
      action: "Join Network"
    },
    {
      title: "Citizen Science",
      description: "Participate in collaborative research projects",
      icon: Award,
      color: "green",
      action: "Start Contributing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient"
        >
          Community Hub
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Connect, collaborate, and contribute to global air quality research
        </motion.p>
      </div>

      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span>Global Community</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{formatNumber(communityStats.activeMembers)}</div>
                <div className="text-sm text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{communityStats.dataPoints}</div>
                <div className="text-sm text-gray-400">Data Points Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{formatNumber(communityStats.cities)}</div>
                <div className="text-sm text-gray-400">Cities Connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full group hover:shadow-lg hover:shadow-current/10 transition-all">
              <CardHeader>
                <div className={`p-3 rounded-lg bg-${feature.color}-500/20 text-${feature.color}-400 w-fit group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{feature.description}</p>
                <Button variant="outline" className="w-full">
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'discovery' ? 'bg-yellow-500/20 text-yellow-400' :
                    activity.type === 'mission' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'insight' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {activity.type === 'discovery' && <TrendingUp className="w-4 h-4" />}
                    {activity.type === 'mission' && <Award className="w-4 h-4" />}
                    {activity.type === 'insight' && <Share2 className="w-4 h-4" />}
                    {activity.type === 'achievement' && <Heart className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{activity.user}</span>
                      <Badge 
                        variant={
                          activity.impact === 'High' ? 'success' :
                          activity.impact === 'Medium' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {activity.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>

                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span>Trending Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { topic: "Air Quality in Megacities", posts: 45, trend: "up" },
                { topic: "TEMPO Satellite Data Analysis", posts: 32, trend: "up" },
                { topic: "PM2.5 Reduction Strategies", posts: 28, trend: "stable" },
                { topic: "Ozone Layer Recovery", posts: 19, trend: "down" },
                { topic: "Climate Change Indicators", posts: 15, trend: "up" }
              ].map((item, index) => (
                <motion.div
                  key={item.topic}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="font-medium text-white text-sm">{item.topic}</h4>
                    <p className="text-xs text-gray-400">{item.posts} discussions</p>
                  </div>
                  <div className={`p-1 rounded ${
                    item.trend === 'up' ? 'text-green-400' :
                    item.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}