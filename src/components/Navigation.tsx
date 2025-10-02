import React from "react";
import { motion } from "motion/react";
import {
  Globe,
  BarChart3,
  Zap,
  Target,
  Users,
  Bell,
  Settings,
  Menu,
  X,
  User,
  Trophy,
  LogIn,
  LogOut,
  Gamepad2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLoginClick: () => void;
  onNotificationsClick: () => void;
}

const navigationItems = [
  {
    id: "globe",
    name: "Globe Explorer",
    icon: Globe,
    description: "Interactive 3D Earth visualization",
  },
  {
    id: "dashboard",
    name: "Air Dashboard",
    icon: BarChart3,
    description: "Real-time air quality metrics",
  },
  {
    id: "ai-missions",
    name: "AI Quest Missions",
    icon: Zap,
    description: "Gamified AI-powered missions",
  },
  {
    id: "cleanspace",
    name: "CleanSpace Game",
    icon: Gamepad2,
    description: "Location-based air quality simulation",
  },
  {
    id: "missions",
    name: "Classic Missions",
    icon: Target,
    description: "Traditional mission system",
  },
  {
    id: "community",
    name: "Community Hub",
    icon: Users,
    description: "Connect with global network",
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    icon: Trophy,
    description: "Global rankings and competition",
  },
  {
    id: "profile",
    name: "Profile",
    icon: User,
    description: "Your achievements and progress",
  },
];

export function Navigation({
  activeSection,
  onSectionChange,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLoginClick,
  onNotificationsClick,
}: NavigationProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden lg:flex items-center justify-between p-6 bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50"
      >
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                AirQuest Nexus
              </h1>
              <p className="text-xs text-gray-400">NASA Data Explorer</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              // Hide profile section if not logged in
              if (item.id === "profile" && !user) return null;

              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => onSectionChange(item.id)}
                  className="relative group"
                  title={item.description}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-cyan-500/20 rounded-lg border border-cyan-500/50 -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Badge variant="secondary" className="px-3 py-1">
                Level {user.level}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onNotificationsClick}
              >
                <Bell className="w-5 h-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="lg:hidden flex items-center justify-between p-4 bg-gray-900/40 backdrop-blur-sm border-b border-gray-700/50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">AirQuest Nexus</h1>
            {user ? (
              <p className="text-xs text-gray-400">Level {user.level}</p>
            ) : (
              <p className="text-xs text-gray-400">NASA Data Explorer</p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 z-50"
        >
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => {
              // Hide profile section if not logged in
              if (item.id === "profile" && !user) return null;

              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onSectionChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <div className="flex flex-col items-start">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-400">
                      {item.description}
                    </span>
                  </div>
                </Button>
              );
            })}

            <div className="pt-4 border-t border-gray-700/50">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.username}</div>
                      <div className="text-xs text-gray-400">
                        Level {user.level}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={onNotificationsClick}
                    >
                      <Bell className="w-5 h-5" />
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
                      >
                        3
                      </Badge>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-gray-400 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
