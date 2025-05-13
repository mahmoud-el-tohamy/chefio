'use client';

import React, { useEffect, useState } from 'react';
import { GroupedNotifications } from '../types/notification';
import NotificationCard from '../components/notifications/NotificationCard';
import styles from '@/styles/notifications/NotificationsPage.module.css';
import Head from "next/head";

const NotificationsPage = () => {
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications>({
    new: [],
    today: [],
    yesterday: [],
    older: []
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);
    // Simulate loading and error (for demo, always succeeds after 1s)
    const timer = setTimeout(() => {
      // setHasError(true); // Uncomment to simulate error
      setLoading(false);
    }, 1000);
    fetchNotifications();
    return () => clearTimeout(timer);
  }, []);

  const fetchNotifications = async () => {
    try {
      // This is a mock API call - replace with your actual API endpoint
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setGroupedNotifications(data);
    } catch (error) {
      setHasError(true);
      console.error('Error fetching notifications:', error);
    }
  };

  const renderSection = (title: string, notifications: GroupedNotifications["new"]) => {
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading notifications...</div>
    );
  }

  if (hasError) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>
        Failed to load notifications. Please try again later.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chefio | Notifications</title>
        <meta name="description" content="View your latest notifications on Chefio." />
      </Head>
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
    </>
  );
};

export default NotificationsPage; 