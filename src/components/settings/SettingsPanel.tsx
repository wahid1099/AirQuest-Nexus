import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Moon,
  Sun,
  Globe,
  Bell,
  Mail,
  Smartphone,
  Satellite,
  Bot,
  Save,
  User,
  Shield,
  Database,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "api" | "privacy"
  >("profile");
  const [settings, setSettings] = useState({
    theme: user?.preferences.theme || "dark",
    language: user?.preferences.language || "en",
    notifications: user?.preferences.notifications || {
      email: true,
      push: true,
      weeklyInsights: true,
      missionReminders: true,
    },
    apiConnections: user?.preferences.apiConnections || {
      nasa: true,
      gemini: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (user) {
      await updateProfile({
        preferences: {
          ...user.preferences,
          ...settings,
        },
      });
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: "profile" as const, name: "Profile", icon: User },
    { id: "notifications" as const, name: "Notifications", icon: Bell },
    { id: "api" as const, name: "API Connections", icon: Database },
    { id: "privacy" as const, name: "Privacy", icon: Shield },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          >
            <Card className="bg-gray-900 border-gray-700 shadow-2xl">
              {/* Header */}
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gradient">
                    Settings
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {hasChanges && (
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                    <Button variant="ghost" onClick={onClose}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-4">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative px-4 py-2"
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Theme Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Appearance</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="font-medium">Theme</label>
                              <p className="text-sm text-gray-400">
                                Choose your preferred theme
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant={
                                  settings.theme === "dark"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => {
                                  handleSettingChange("", "theme", "dark");
                                }}
                                className="px-3 py-2"
                              >
                                <Moon className="w-4 h-4 mr-2" />
                                Dark
                              </Button>
                              <Button
                                variant={
                                  settings.theme === "light"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => {
                                  handleSettingChange("", "theme", "light");
                                }}
                                className="px-3 py-2"
                              >
                                <Sun className="w-4 h-4 mr-2" />
                                Light
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Language Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Language</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {languages.map((lang) => (
                            <Button
                              key={lang.code}
                              variant={
                                settings.language === lang.code
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => {
                                handleSettingChange("", "language", lang.code);
                              }}
                              className="justify-start"
                            >
                              <span className="mr-2">{lang.flag}</span>
                              {lang.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "notifications" && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">
                        Notification Preferences
                      </h3>

                      <div className="space-y-4">
                        {[
                          {
                            key: "email",
                            icon: Mail,
                            title: "Email Notifications",
                            description: "Receive notifications via email",
                          },
                          {
                            key: "push",
                            icon: Smartphone,
                            title: "Push Notifications",
                            description:
                              "Receive push notifications in browser",
                          },
                          {
                            key: "weeklyInsights",
                            icon: Globe,
                            title: "Weekly Climate Insights",
                            description:
                              "Get personalized weekly climate reports",
                          },
                          {
                            key: "missionReminders",
                            icon: Bell,
                            title: "Mission Reminders",
                            description: "Reminders for incomplete missions",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="w-5 h-5 text-cyan-400" />
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant={
                                settings.notifications[
                                  item.key as keyof typeof settings.notifications
                                ]
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => {
                                handleSettingChange(
                                  "notifications",
                                  item.key,
                                  !settings.notifications[
                                    item.key as keyof typeof settings.notifications
                                  ]
                                );
                              }}
                              className="px-4"
                            >
                              {settings.notifications[
                                item.key as keyof typeof settings.notifications
                              ]
                                ? "On"
                                : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "api" && (
                    <motion.div
                      key="api"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">API Connections</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Satellite className="w-5 h-5 text-blue-400" />
                            <div>
                              <h4 className="font-medium">NASA APIs</h4>
                              <p className="text-sm text-gray-400">
                                Access TEMPO, MODIS, and other NASA datasets
                              </p>
                              <Badge
                                variant={
                                  settings.apiConnections.nasa
                                    ? "success"
                                    : "secondary"
                                }
                                className="mt-1"
                              >
                                {settings.apiConnections.nasa
                                  ? "Connected"
                                  : "Disconnected"}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={
                              settings.apiConnections.nasa
                                ? "destructive"
                                : "default"
                            }
                            onClick={() => {
                              handleSettingChange(
                                "apiConnections",
                                "nasa",
                                !settings.apiConnections.nasa
                              );
                            }}
                          >
                            {settings.apiConnections.nasa
                              ? "Disconnect"
                              : "Connect"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Bot className="w-5 h-5 text-purple-400" />
                            <div>
                              <h4 className="font-medium">Gemini AI Chatbot</h4>
                              <p className="text-sm text-gray-400">
                                AI-powered mission mentor and data guidance
                              </p>
                              <Badge
                                variant={
                                  settings.apiConnections.gemini
                                    ? "success"
                                    : "secondary"
                                }
                                className="mt-1"
                              >
                                {settings.apiConnections.gemini
                                  ? "Connected"
                                  : "Disconnected"}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={
                              settings.apiConnections.gemini
                                ? "destructive"
                                : "default"
                            }
                            onClick={() => {
                              handleSettingChange(
                                "apiConnections",
                                "gemini",
                                !settings.apiConnections.gemini
                              );
                            }}
                          >
                            {settings.apiConnections.gemini
                              ? "Disconnect"
                              : "Connect"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "privacy" && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">Privacy & Data</h3>

                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <h4 className="font-medium mb-2">Data Collection</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            We collect mission progress, achievements, and usage
                            analytics to improve your experience.
                          </p>
                          <Button variant="outline">
                            Manage Data Preferences
                          </Button>
                        </div>

                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <h4 className="font-medium mb-2">Account Data</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Download or delete your account data at any time.
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline">Download Data</Button>
                            <Button variant="destructive">
                              Delete Account
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <h4 className="font-medium mb-2">Privacy Policy</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Learn how we protect and use your data.
                          </p>
                          <Button variant="outline">View Privacy Policy</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
