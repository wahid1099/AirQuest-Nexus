import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Activity, Layers, Info, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { pollutantLayers, globalStats, cities } from '../data/mockData';
import { formatNumber } from '../lib/utils';

export function Globe3D() {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['no2']);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const toggleLayer = (layerId: string) => {
    setSelectedLayers(prev => 
      prev.includes(layerId)
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const selectedCityData = cities.find(city => city.name === selectedCity);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Globe Visualization */}
      <div className="xl:col-span-3">
        <Card className="h-full relative overflow-hidden group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>Global Air Quality Monitor</span>
                <Badge variant="success" className="pulse-glow">
                  LIVE
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="h-[calc(100%-80px)] relative">
            {/* Globe Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 rounded-xl overflow-hidden">
              {/* Earth representation */}
              <div className="absolute inset-8 bg-gradient-to-br from-green-800/30 to-blue-800/30 rounded-full border-4 border-cyan-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400/50 transition-all duration-500">
                
                {/* Atmosphere glow */}
                <div className="absolute inset-[-10px] bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
                
                {/* Data points for major cities */}
                {cities.map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`absolute w-4 h-4 cursor-pointer rounded-full border-2 ${
                      city.aqi > 150 ? 'bg-red-500/80 border-red-400' :
                      city.aqi > 100 ? 'bg-orange-500/80 border-orange-400' :
                      city.aqi > 50 ? 'bg-yellow-500/80 border-yellow-400' :
                      'bg-green-500/80 border-green-400'
                    } hover:scale-150 transition-all pulse-glow`}
                    style={{
                      left: `${45 + (index % 3) * 15 + Math.cos(index) * 20}%`,
                      top: `${35 + Math.floor(index / 2) * 20 + Math.sin(index) * 15}%`
                    }}
                    onClick={() => setSelectedCity(city.name)}
                    whileHover={{ scale: 1.5 }}
                  >
                    <div className="absolute -inset-2 bg-current opacity-20 rounded-full animate-ping"></div>
                  </motion.div>
                ))}
                
                {/* Data flow particles */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full data-flow"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
                
                {/* Globe text */}
                <div className="text-center text-gray-300 z-10">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-sm font-medium">Interactive Earth</p>
                  <p className="text-xs text-gray-400">Click markers for details</p>
                </div>
              </div>
              
              {/* City info popup */}
              {selectedCityData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600 min-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{selectedCityData.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSelectedCity(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{selectedCityData.country}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">AQI:</span>
                    <Badge 
                      variant={
                        selectedCityData.aqi > 150 ? 'destructive' :
                        selectedCityData.aqi > 100 ? 'warning' :
                        selectedCityData.aqi > 50 ? 'secondary' : 'success'
                      }
                    >
                      {selectedCityData.aqi}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-6">
        {/* Layer Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Pollution Layers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pollutantLayers.map((layer) => (
              <motion.div
                key={layer.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedLayers.includes(layer.id) ? 'default' : 'outline'}
                  onClick={() => toggleLayer(layer.id)}
                  className="w-full justify-between p-3 h-auto"
                  style={{
                    borderColor: selectedLayers.includes(layer.id) ? layer.color : undefined
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div className="text-left">
                      <div className="font-medium">{layer.name}</div>
                      <div className="text-xs text-gray-400">{layer.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {layer.value && (
                      <span className="text-xs">{layer.value}</span>
                    )}
                    {getTrendIcon(layer.trend)}
                  </div>
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Global Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-green-400" />
              <span>Global Network</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-cyan-400">
                  {formatNumber(globalStats.activeSensors)}
                </div>
                <div className="text-sm text-gray-400">Active Sensors</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">
                  {globalStats.dataPoints}
                </div>
                <div className="text-sm text-gray-400">Data Points</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">
                  {formatNumber(globalStats.cities)}
                </div>
                <div className="text-sm text-gray-400">Cities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}