import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./components/Navigation";
import { Globe3D } from "./components/Globe3D";
import { AirQualityDashboard } from "./components/AirQualityDashboard";
import { AIQuestMissions } from "./components/AIQuestMissions";
import { MissionSystem } from "./components/MissionSystem";
import { CommunityHub } from "./components/CommunityHub";
import { ParticleSystem } from "./components/ParticleSystem";
import { UserProfile } from "./components/profile/UserProfile";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { LoginModal } from "./components/auth/LoginModal";
import { NotificationSystem } from "./components/notifications/NotificationSystem";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { ChatbotInterface } from "./components/chatbot/ChatbotInterface";
import { CleanSpaceGame } from "./components/cleanspace/CleanSpaceGame";
import { AuthProvider } from "./contexts/AuthContextSimple";
import { DemoNotifications } from "./components/demo/DemoNotifications";

function App() {
  const [activeSection, setActiveSection] = useState("ai-missions");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "globe":
        return <Globe3D />;
      case "dashboard":
        return <AirQualityDashboard />;
      case "ai-missions":
        return <AIQuestMissions />;
      case "missions":
        return <MissionSystem />;
      case "community":
        return <CommunityHub />;
      case "profile":
        return <UserProfile onSettingsClick={() => setShowSettings(true)} />;
      case "leaderboard":
        return <Leaderboard />;
      case "cleanspace":
        return <CleanSpaceGame />;
      default:
        return <AIQuestMissions />;
    }
  };

  return (
    <AuthProvider>
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
                {renderContent()}
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

        {/* Chatbot */}
        <ChatbotInterface
          isOpen={showChatbot}
          onToggle={() => setShowChatbot(!showChatbot)}
        />

        {/* Demo Notifications - Disabled to prevent duplicate key warnings */}
        {/* <DemoNotifications /> */}

        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
