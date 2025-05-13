"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import { GroupedNotifications } from "@/types/notification";
import { currentUser } from '@/constants/currentUser';
import { usePathname } from "next/navigation";
import HomeIcon from "@/components/icons/HomeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";

function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<GroupedNotifications>({
    new: [],
    today: [],
    yesterday: [],
    older: []
  });
  const pathname = usePathname();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications();

    // Set up periodic refresh every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationsToggle = () => {
    const newIsOpen = !isNotificationsOpen;
    setIsNotificationsOpen(newIsOpen);

    // If opening notifications and there are unread notifications, mark them as read
    if (newIsOpen && notifications.new.length > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/home">
          <div className={styles.logoContainer}>
            <Image
              src="/images/chefio-logo.png"
              alt="Chefio Logo"
              width={42}
              height={60}
              priority />
          </div>
        </Link>
      </div>

      <div className={styles.navIcons}>
        <Link
          href="/home"
          className={styles.navLink}
        >
          <HomeIcon className={pathname === "/home" ? styles.active : undefined} />
        </Link>
        <Link
          href="/create-recipe"
          className={styles.navLink}
        >
          <Image
            src="/icons/edit.svg"
            alt="Create Recipe"
            width={24}
            height={24} />
        </Link>
        <Link
          href={`/profile/${currentUser.username}`}
          className={styles.navLink}
        >
          <ProfileIcon className={pathname.startsWith("/profile") ? styles.active : undefined} />
        </Link>
        <button
          className={styles.notificationButton}
          onClick={handleNotificationsToggle}
          aria-label={`Notifications ${notifications.new.length > 0 ? `(${notifications.new.length} new)` : ''}`}
        >
          <Image
            src="/icons/notification.svg"
            alt="Notifications"
            width={24}
            height={24} />
          {notifications.new.length > 0 && (
            <span className={styles.notificationBadge}>
              {notifications.new.length}
            </span>
          )}
        </button>
      </div>

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications} />
    </nav>
  );
}

export default Navbar; 