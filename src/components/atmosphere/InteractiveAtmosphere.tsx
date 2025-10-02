import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Settings,
  Info,
  Satellite,
  Wind,
  Thermometer,
  CloudRain,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface InteractiveAtmosphereProps {
  currentLocation: Location | null;
}

interface AtmosphereLayer {
  id: string;
  name: string;
  altitude: number;
  color: string;
  opacity: number;
  visible: boolean;
  description: string;
}

interface PollutionData {
  pm25: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  timestamp: string;
}

export function InteractiveAtmosphere({
  currentLocation,
}: InteractiveAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [isPlaying, setIsPlaying] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(
    null
  );
  const [atmosphereLayers, setAtmosphereLayers] = useState<AtmosphereLayer[]>([
    {
      id: "troposphere",
      name: "Troposphere",
      altitude: 12,
      color: "#3B82F6",
      opacity: 0.7,
      visible: true,
      description:
        "Where weather occurs and most air pollution is found (0-12km)",
    },
    {
      id: "stratosphere",
      name: "Stratosphere",
      altitude: 50,
      color: "#8B5CF6",
      opacity: 0.5,
      visible: true,
      description:
        "Contains the ozone layer that protects us from UV radiation (12-50km)",
    },
    {
      id: "mesosphere",
      name: "Mesosphere",
      altitude: 85,
      color: "#EC4899",
      opacity: 0.3,
      visible: false,
      description: "Where meteors burn up (50-85km)",
    },
    {
      id: "thermosphere",
      name: "Thermosphere",
      altitude: 600,
      color: "#F59E0B",
      opacity: 0.2,
      visible: false,
      description: "Where auroras occur and satellites orbit (85-600km)",
    },
  ]);

  useEffect(() => {
    if (currentLocation) {
      loadPollutionData(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (isPlaying) {
        setRotation((prev) => (prev + 0.5) % 360);
      }
      drawAtmosphere(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, zoom, rotation, atmosphereLayers, timeOfDay, pollutionData]);

  const loadPollutionData = async (location: Location) => {
    // Simulate loading pollution data
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPollutionData({
      pm25: Math.floor(Math.random() * 50) + 10,
      no2: Math.floor(Math.random() * 40) + 15,
      o3: Math.floor(Math.random() * 60) + 30,
      co: Math.floor(Math.random() * 20) + 5,
      so2: Math.floor(Math.random() * 15) + 2,
      timestamp: new Date().toISOString(),
    });
  };

  const drawAtmosphere = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.15 * zoom;

    // Draw Earth
    const earthGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius
    );
    if (timeOfDay === "day") {
      earthGradient.addColorStop(0, "#4ADE80");
      earthGradient.addColorStop(0.7, "#22C55E");
      earthGradient.addColorStop(1, "#15803D");
    } else {
      earthGradient.addColorStop(0, "#1F2937");
      earthGradient.addColorStop(0.7, "#111827");
      earthGradient.addColorStop(1, "#000000");
    }

    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw atmosphere layers
    atmosphereLayers
      .filter((layer) => layer.visible)
      .forEach((layer, index) => {
        const layerRadius = baseRadius + layer.altitude * 2 * zoom;

        // Create gradient for layer
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          baseRadius + index * 20 * zoom,
          centerX,
          centerY,
          layerRadius
        );

        const color = layer.color;
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(
          0.5,
          `${color}${Math.floor(layer.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`
        );
        gradient.addColorStop(1, `${color}20`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, layerRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Add pollution visualization if in troposphere
        if (layer.id === "troposphere" && pollutionData) {
          drawPollutionClouds(ctx, centerX, centerY, baseRadius, layerRadius);
        }
      });

    // Draw rotation effect
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw wind patterns
    drawWindPatterns(ctx, baseRadius * 1.5);

    ctx.restore();

    // Draw location marker if available
    if (currentLocation) {
      drawLocationMarker(ctx, centerX, centerY, baseRadius);
    }
  };

  const drawPollutionClouds = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    if (!pollutionData) return;

    const pollutionIntensity = (pollutionData.pm25 + pollutionData.no2) / 100;
    const cloudRadius = (outerRadius - innerRadius) * 0.3;

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + (rotation * Math.PI) / 180;
      const distance = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, cloudRadius);
      gradient.addColorStop(
        0,
        `rgba(139, 69, 19, ${pollutionIntensity * 0.6})`
      );
      gradient.addColorStop(1, "rgba(139, 69, 19, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, cloudRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawWindPatterns = (ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const startRadius = radius * 0.8;
      const endRadius = radius * 1.2;

      ctx.beginPath();
      ctx.arc(0, 0, startRadius + i * 10, angle, angle + Math.PI / 3);
      ctx.stroke();
    }
  };

  const drawLocationMarker = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    if (!currentLocation) return;

    // Convert lat/lng to canvas coordinates (simplified)
    const lat = (currentLocation.latitude * Math.PI) / 180;
    const lng = (currentLocation.longitude * Math.PI) / 180;

    const x = centerX + radius * Math.cos(lat) * Math.cos(lng);
    const y = centerY + radius * Math.sin(lat);

    // Draw marker
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pulse effect
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8 + Math.sin(Date.now() / 200) * 3, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const toggleLayer = (layerId: string) => {
    setAtmosphereLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setAtmosphereLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, opacity: opacity / 100 } : layer
      )
    );
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">
          🌍 Interactive Atmosphere Visualizer
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Explore Earth's atmospheric layers and pollution patterns in real-time
        </p>

        {currentLocation && (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
            📍 {currentLocation.city}, {currentLocation.country}
          </Badge>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Playback Controls */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <span>Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={
                    isPlaying
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRotation(0)}
                  className="border-gray-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Zoom: {zoom.toFixed(1)}x
                </label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={timeOfDay === "day" ? "default" : "outline"}
                  onClick={() => setTimeOfDay("day")}
                  className="flex-1"
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Day
                </Button>
                <Button
                  size="sm"
                  variant={timeOfDay === "night" ? "default" : "outline"}
                  onClick={() => setTimeOfDay("night")}
                  className="flex-1"
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Night
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Atmosphere Layers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {atmosphereLayers.map((layer) => (
                <div key={layer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLayer(layer.id)}
                        className="p-1"
                      >
                        {layer.visible ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <span
                        className="text-sm font-medium"
                        style={{ color: layer.color }}
                      >
                        {layer.name}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setSelectedLayer(
                          selectedLayer === layer.id ? null : layer.id
                        )
                      }
                      className="p-1"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>

                  {layer.visible && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">
                        Opacity: {Math.round(layer.opacity * 100)}%
                      </label>
                      <Slider
                        value={[layer.opacity * 100]}
                        onValueChange={(value) =>
                          updateLayerOpacity(layer.id, value[0])
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}

                  <AnimatePresence>
                    {selectedLayer === layer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded"
                      >
                        {layer.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pollution Data */}
          {pollutionData && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-orange-400" />
                  <span>Pollution Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">PM2.5:</span>
                    <span className="text-orange-400">
                      {pollutionData.pm25} μg/m³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NO₂:</span>
                    <span className="text-red-400">
                      {pollutionData.no2} ppb
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">O₃:</span>
                    <span className="text-purple-400">
                      {pollutionData.o3} ppb
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CO:</span>
                    <span className="text-yellow-400">
                      {pollutionData.co} ppm
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Updated:{" "}
                  {new Date(pollutionData.timestamp).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Visualization */}
        <div className="lg:col-span-3">
          <Card className="glass-morphism glow-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Atmosphere Visualization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    <Satellite className="w-3 h-3 mr-1" />
                    NASA Data
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowInfo(!showInfo)}
                    className="border-gray-600"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto bg-gradient-to-b from-black via-gray-900 to-blue-900 rounded-lg"
                />

                {/* Info Overlay */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center"
                    >
                      <div className="text-center text-white p-6 max-w-md">
                        <h3 className="text-xl font-bold mb-4">How to Use</h3>
                        <div className="space-y-2 text-sm text-left">
                          <p>
                            • Toggle atmosphere layers on/off using the eye
                            icons
                          </p>
                          <p>• Adjust layer opacity with the sliders</p>
                          <p>• Use zoom controls to get closer to Earth</p>
                          <p>• Switch between day/night modes</p>
                          <p>• Red marker shows your current location</p>
                          <p>
                            • Brown clouds represent pollution concentration
                          </p>
                        </div>
                        <Button
                          className="mt-4"
                          onClick={() => setShowInfo(false)}
                        >
                          Got it!
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
