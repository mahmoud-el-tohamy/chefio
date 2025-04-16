'use client';

import React, { useEffect, useState } from 'react';
import { GroupedNotifications } from '../types/notification';
import NotificationCard from '../components/notifications/NotificationCard';
import styles from '@/styles/notifications/NotificationsPage.module.css';

const NotificationsPage = () => {
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications>({
    new: [],
    today: [],
    yesterday: [],
    older: []
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // This is a mock API call - replace with your actual API endpoint
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setGroupedNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const renderSection = (title: string, notifications: any[]) => {
    if (notifications.length === 0) return null;

    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Notifications</h1>
      
      {renderSection('New', groupedNotifications.new)}
      {renderSection('Today', groupedNotifications.today)}
      {renderSection('Yesterday', groupedNotifications.yesterday)}
      {renderSection('Older', groupedNotifications.older)}
      
      {Object.values(groupedNotifications).every(arr => arr.length === 0) && (
        <div className={styles.emptyState}>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 