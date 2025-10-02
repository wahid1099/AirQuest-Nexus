import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'moderate' | 'poor' | 'hazardous';
  icon: React.ElementType;
}

function MetricCard({ title, value, unit, trend, status, icon: Icon }: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 border-green-500/50';
      case 'moderate': return 'text-yellow-400 border-yellow-500/50';
      case 'poor': return 'text-orange-400 border-orange-500/50';
      case 'hazardous': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const getTrendIcon = () => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-red-400" /> : 
      trend === 'down' ? 
      <TrendingDown className="w-4 h-4 text-green-400" /> : 
      <div className="w-4 h-4" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className={`${getStatusColor(status)} transition-all hover:shadow-lg hover:shadow-current/10`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon className="w-5 h-5 text-current" />
            {getTrendIcon()}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-current">
              {value}
              <span className="text-sm font-normal ml-1">{unit}</span>
            </div>
            <div className="text-sm text-gray-400">{title}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AirQualityDashboard() {
  const [selectedLocation, setSelectedLocation] = useState('New York, NY');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Air Quality Dashboard</h2>
          <p className="text-gray-400">Real-time atmospheric monitoring</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main AQI Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50 glow-border">
          <CardHeader>
            <CardTitle className="text-center text-yellow-100">
              Air Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-2">72</div>
            <Badge variant="warning" className="text-lg px-4 py-1 mb-4">
              Moderate
            </Badge>
            <p className="text-sm text-gray-300">
              Air quality is acceptable for most people. Sensitive groups may experience minor to moderate symptoms.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="PM2.5"
          value="18.2"
          unit="μg/m³"
          trend="stable"
          status="good"
          icon={Droplets}
        />
        <MetricCard
          title="Nitrogen Dioxide"
          value="28.7"
          unit="ppb"
          trend="down"
          status="moderate"
          icon={Wind}
        />
        <MetricCard
          title="Temperature"
          value="22"
          unit="°C"
          trend="up"
          status="good"
          icon={Thermometer}
        />
        <MetricCard
          title="Visibility"
          value="12.5"
          unit="km"
          trend="stable"
          status="good"
          icon={Eye}
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-800/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Simulated chart background */}
              <div className="absolute inset-4 bg-gradient-to-t from-cyan-500/10 to-transparent rounded"></div>
              <div className="text-gray-400 text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-2 text-cyan-400" />
                <p>Air quality improving</p>
                <p className="text-sm">Chart visualization area</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pollutant Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-800/30 rounded-lg flex items-center justify-center relative">
              {/* Simulated donut chart */}
              <div className="w-32 h-32 rounded-full border-8 border-gray-700 border-t-cyan-400 border-r-purple-400 border-b-green-400 border-l-orange-400 animate-spin" style={{ animationDuration: '10s' }}></div>
              <div className="absolute text-center">
                <p className="text-gray-400 text-sm">Pollutant</p>
                <p className="text-gray-400 text-sm">Distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'info', message: 'Air quality has improved by 15% since yesterday', time: '2 hours ago' },
              { type: 'warning', message: 'Sensitive groups should limit outdoor activities', time: '4 hours ago' },
              { type: 'success', message: 'PM2.5 levels are within healthy range', time: '6 hours ago' }
            ].map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'info' ? 'bg-blue-500/10 border-l-4 border-blue-500' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-l-4 border-yellow-500' :
                  'bg-green-500/10 border-l-4 border-green-500'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-100">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}