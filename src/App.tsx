import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./components/Navigation";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { NotificationSystem } from "./components/notifications/NotificationSystem";
import { ChatbotInterface } from "./components/chatbot/ChatbotInterface";
import { AirQualityDashboard } from "./components/dashboard/AirQualityDashboard";
// Import fallback components for missing ones
import {
  Globe3D,
  AIQuestMissions,
  MissionSystem,
  CommunityHub,
  ParticleSystem,
  UserProfile,
  LoginModal,
  SettingsPanel,
} from "./components/fallback/MissingComponents";
import { CleanSpaceGame } from "./components/cleanspace/CleanSpaceGame";
import { InteractiveAtmosphere } from "./components/atmosphere/InteractiveAtmosphere";
import { GlobalExplorer } from "./components/explorer/GlobalExplorer";
import { NASADashboard } from "./components/nasa/NASADashboard";
import { LocationSelector } from "./components/location/LocationSelector";
import { AuthProvider, useAuth } from "./contexts/AuthContextSimple";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 glass-morphism rounded-2xl max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">
            Login Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please login to access CleanSpace missions and track your progress.
          </p>
          <LoginModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
          />
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const [activeSection, setActiveSection] = useState("explorer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  } | null>(null);

  // Get user's current location on app start
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Current Location",
            country: "Auto-detected",
          });
        },
        () => {
          console.log("Location access denied, using default location");
          setCurrentLocation({
            latitude: 40.7128,
            longitude: -74.006,
            city: "New York",
            country: "USA",
          });
        }
      );
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "explorer":
        return (
          <GlobalExplorer
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
          />
        );
      case "atmosphere":
        return <InteractiveAtmosphere currentLocation={currentLocation} />;
      case "nasa-dashboard":
        return <NASADashboard currentLocation={currentLocation} />;
      case "globe":
        return <Globe3D />;
      case "dashboard":
        return <AirQualityDashboard />;
      case "ai-missions":
        return (
          <ProtectedRoute>
            <AIQuestMissions />
          </ProtectedRoute>
        );
      case "missions":
        return (
          <ProtectedRoute>
            <MissionSystem />
          </ProtectedRoute>
        );
      case "cleanspace":
        return (
          <ProtectedRoute>
            <CleanSpaceGame />
          </ProtectedRoute>
        );
      case "community":
        return <CommunityHub />;
      case "profile":
        return (
          <ProtectedRoute>
            <UserProfile onSettingsClick={() => setShowSettings(true)} />
          </ProtectedRoute>
        );
      case "leaderboard":
        return <Leaderboard />;
      case "location":
        return (
          <LocationSelector
            onLocationSelect={setCurrentLocation}
            currentLocation={currentLocation}
          />
        );
      default:
        return (
          <GlobalExplorer
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
          />
        );
    }
  };

  return (
    <div className="min-h-screen cosmic-gradient relative overflow-hidden">
      {/* Particle System */}
      <ParticleSystem />

      {/* Main Container */}
      <div className="relative z-10">
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLoginClick={() => setShowLoginModal(true)}
          onNotificationsClick={() => setShowNotifications(true)}
          currentLocation={currentLocation}
        />

        {/* Content Area */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <ErrorBoundary>{renderContent()}</ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals and Overlays */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <NotificationSystem
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Enhanced Chatbot with NASA Data */}
      <ChatbotInterface
        isOpen={showChatbot}
        onToggle={() => setShowChatbot(!showChatbot)}
      />

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
