import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

// Fallback component for missing components
export function ComponentFallback({
  componentName,
  description,
}: {
  componentName: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="glass-morphism glow-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-gradient">{componentName}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Component Under Development</span>
            </div>
            <p className="text-gray-300">
              {description ||
                `The ${componentName} component is currently being developed and will be available soon.`}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Available features:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Global Explorer - ✅ Ready</li>
                <li>• 3D Atmosphere - ✅ Ready</li>
                <li>• NASA Dashboard - ✅ Ready</li>
                <li>• Location Finder - ✅ Ready</li>
                <li>• CleanSpace Missions - ✅ Ready</li>
              </ul>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Refresh Application
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Specific fallback components
export function Globe3D() {
  return (
    <ComponentFallback
      componentName="3D Globe Explorer"
      description="Interactive 3D Earth visualization with real-time data layers."
    />
  );
}

// AirQualityDashboard is now implemented in src/components/dashboard/AirQualityDashboard.tsx

export function AIQuestMissions() {
  return (
    <ComponentFallback
      componentName="AI Quest Missions"
      description="AI-powered gamified missions for environmental challenges."
    />
  );
}

export function MissionSystem() {
  return (
    <ComponentFallback
      componentName="Classic Mission System"
      description="Traditional mission-based gameplay with structured objectives."
    />
  );
}

export function CommunityHub() {
  return (
    <ComponentFallback
      componentName="Community Hub"
      description="Connect with the global network of environmental enthusiasts."
    />
  );
}

export function ParticleSystem() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Simple animated background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export function UserProfile({
  onSettingsClick,
}: {
  onSettingsClick: () => void;
}) {
  return (
    <ComponentFallback
      componentName="User Profile"
      description="View your achievements, progress, and customize your experience."
    />
  );
}

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="glass-morphism glow-border">
          <CardHeader>
            <CardTitle className="text-gradient text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center">
              Authentication system is being integrated. For now, you can
              explore the public features.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function SettingsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="glass-morphism glow-border">
          <CardHeader>
            <CardTitle className="text-gradient text-center">
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center">
              Settings panel is under development. Current features work with
              default configurations.
            </p>
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
