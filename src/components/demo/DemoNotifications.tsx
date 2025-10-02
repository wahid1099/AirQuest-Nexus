import React, { useState, useEffect } from "react";
import { NotificationToast } from "../notifications/NotificationSystem";
import { Notification } from "../../types";

export function DemoNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Demo notifications that appear automatically
    const demoNotifications: Notification[] = [
      {
        id: "1",
        type: "mission_complete",
        title: "Mission Completed!",
        message: "Atmospheric Detective completed. You earned 2,500 XP!",
        timestamp: new Date(),
        read: false,
      },
      {
        id: "2",
        type: "badge_earned",
        title: "New Badge Earned!",
        message: 'You unlocked the "Data Detective" badge!',
        timestamp: new Date(),
        read: false,
      },
      {
        id: "3",
        type: "level_up",
        title: "Level Up!",
        message: "Congratulations! You reached Level 16.",
        timestamp: new Date(),
        read: false,
      },
    ];

    // Show notifications with delays
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        setNotifications((prev) => [...prev, notification]);
      }, (index + 1) * 3000);
    });
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
