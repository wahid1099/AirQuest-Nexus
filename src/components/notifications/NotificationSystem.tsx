import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  X,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Notification } from "../../types";

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mission_complete",
    title: "Mission Completed!",
    message:
      "Atmospheric Detective completed. You earned 2,500 XP and the Data Detective badge!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "badge_earned",
    title: "New Badge Earned!",
    message: 'Congratulations! You unlocked the "Ozone Guardian" badge.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "level_up",
    title: "Level Up!",
    message: "Amazing! You reached Level 16. New missions are now available.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "weekly_insight",
    title: "Weekly Climate Insight",
    message:
      "Air quality in your region improved by 12% this week. Great job contributing to the data!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: "5",
    type: "reminder",
    title: "Mission Reminder",
    message: "Don't forget to complete \"Particle Tracker\" - you're 75% done!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
];

export function NotificationSystem({
  isOpen,
  onClose,
}: NotificationSystemProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "mission_complete":
        return CheckCircle;
      case "badge_earned":
        return Star;
      case "level_up":
        return TrendingUp;
      case "weekly_insight":
        return Info;
      case "reminder":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "mission_complete":
        return "text-green-400 bg-green-500/20";
      case "badge_earned":
        return "text-yellow-400 bg-yellow-500/20";
      case "level_up":
        return "text-purple-400 bg-purple-500/20";
      case "weekly_insight":
        return "text-blue-400 bg-blue-500/20";
      case "reminder":
        return "text-orange-400 bg-orange-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || !notif.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 300, y: -20 }}
            className="relative w-full max-w-md"
          >
            <Card className="bg-gray-900/95 border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1">
                  <Button
                    variant={filter === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="text-xs"
                  >
                    All ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                    className="text-xs"
                  >
                    Unread ({unreadCount})
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs ml-auto"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(
                        notification.type
                      );

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            !notification.read
                              ? "bg-cyan-500/5 border-l-4 border-l-cyan-500"
                              : ""
                          }`}
                          onClick={() =>
                            !notification.read && markAsRead(notification.id)
                          }
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-full ${colorClass} flex-shrink-0`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4
                                  className={`font-medium text-sm ${
                                    !notification.read
                                      ? "text-white"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2 ml-2">
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p
                                className={`text-sm mt-1 ${
                                  !notification.read
                                    ? "text-gray-300"
                                    : "text-gray-400"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Notification Toast Component
export function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className="fixed top-20 right-4 z-50 w-80"
    >
      <Card className="bg-gray-900/95 border-gray-700 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-white mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-300">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "mission_complete":
      return CheckCircle;
    case "badge_earned":
      return Star;
    case "level_up":
      return TrendingUp;
    case "weekly_insight":
      return Info;
    case "reminder":
      return AlertCircle;
    default:
      return Bell;
  }
}

function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "mission_complete":
      return "text-green-400 bg-green-500/20";
    case "badge_earned":
      return "text-yellow-400 bg-yellow-500/20";
    case "level_up":
      return "text-purple-400 bg-purple-500/20";
    case "weekly_insight":
      return "text-blue-400 bg-blue-500/20";
    case "reminder":
      return "text-orange-400 bg-orange-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
}
