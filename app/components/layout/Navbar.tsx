"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import { GroupedNotifications, type Notification } from "@/types/notification";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@/components/icons/HomeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import MenuIcon from "@/components/icons/MenuIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { notificationService } from "@/services/notification";

function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<GroupedNotifications>({
    new: [],
    today: [],
    yesterday: [],
    older: []
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  const unreadNotificationsCount = useMemo(() => {
    let count = 0;
    Object.values(notifications).forEach(group => {
      group.forEach((notification: Notification) => {
        if (!notification.isRead) {
          count++;
        }
      });
    });
    return count;
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success && response.notifications.notifications) {
        const groupedNotifications = notificationService.groupNotificationsByTime(
          response.notifications.notifications
        );
        setNotifications(groupedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    // If there are no unread notifications, skip the API call
    if (unreadNotificationsCount === 0) {
      console.log('[markNotificationsAsRead] No unread notifications to mark as read. Skipping API call.');
      // Re-fetch notifications to ensure the state is truly synced if there was a discrepancy
      fetchNotifications();
      return;
    }

    try {
      console.log('[markNotificationsAsRead] Making API call to mark notifications as read.');
      const response = await notificationService.markNotificationsAsRead();
      if (response.success) {
        // Re-fetch notifications to update the UI with the read status
        fetchNotifications();
      }
    } catch (error: any) {
      console.error('[markNotificationsAsRead] Error marking notifications as read:', error);
      // If the error indicates notifications were not found, assume success and re-fetch
      if (error.message && (error.message.includes('404') || error.message.includes('not found notification'))) {
        console.warn('[markNotificationsAsRead] Received "not found notification" or 404 for mark-all-as-read, assuming success and re-fetching notifications.');
        fetchNotifications();
      }
    }
  };

  // Register FCM token when component mounts
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        // Check if the browser supports service workers and notifications
        if ('serviceWorker' in navigator && 'Notification' in window) {
          // Request notification permission
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            // Get FCM token from service worker
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            });
            
            // Register token with backend
            await notificationService.registerFCMToken(JSON.stringify(subscription));
          }
        }
      } catch (error) {
        console.error('Error registering FCM token:', error);
      }
    };

    registerFCMToken();
  }, []);

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications();

    // Set up periodic refresh every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const token = Cookies.get('Authorization');
    if (token) {
      try {
        // Remove 'Bearer ' prefix if it exists
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        const payload = JSON.parse(atob(cleanToken.split('.')[1]));
        setUserId(payload.id || payload._id || payload.userId || payload.user_id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  const handleNotificationsToggle = () => {
    const newIsOpen = !isNotificationsOpen;
    setIsNotificationsOpen(newIsOpen);

    console.log(`[handleNotificationsToggle] newIsOpen: ${newIsOpen}, unreadNotificationsCount: ${unreadNotificationsCount}`);

    // If opening notifications and there are unread notifications, mark them as read
    if (newIsOpen && unreadNotificationsCount > 0) {
      markNotificationsAsRead();
    }
  };

  const handleSignOut = async () => {
    try {
      const token = Cookies.get('Authorization');
      if (token) {
        await fetch('https://chefio-beta.vercel.app/api/v1/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json' // Assuming the endpoint might expect JSON, though body is empty
          },
        });
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Always remove cookie and redirect, even if API call fails client-side
      Cookies.remove('Authorization');
      router.push('/auth/login');
    }
  };

  const isOwnProfile = pathname === `/profile/${userId}`;

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

      <button
        className={styles.hamburger}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        <MenuIcon open={mobileMenuOpen} />
      </button>

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
            height={24}
            className={pathname === "/create-recipe" ? styles.active : undefined}
          />
        </Link>
        <Link
          href={`/profile/${userId}`}
          className={styles.navLink}
        >
          <ProfileIcon className={isOwnProfile ? styles.active : undefined} />
        </Link>
        <button
          className={styles.notificationButton}
          onClick={handleNotificationsToggle}
          aria-label={`Notifications ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} new)` : ''}`}
        >
          <Image
            src="/icons/notification.svg"
            alt="Notifications"
            width={24}
            height={24} />
          {unreadNotificationsCount > 0 && (
            <span className={styles.notificationBadge}>
              {unreadNotificationsCount}
            </span>
          )}
        </button>
        <button
          className={styles.navLink}
          onClick={handleSignOut}
          aria-label="Sign out"
        >
          <SignOutIcon />
        </button>
      </div>

      {/* Mobile Menu */}
      {mounted && mobileMenuOpen && createPortal(
        <div className={styles.mobileMenu} id="mobile-menu" role="menu">
          <Link
            href="/home"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <HomeIcon className={pathname === "/home" ? styles.active : undefined} />
            Home
          </Link>
          <Link
            href="/create-recipe"
            className={styles.mobileNavLink + (pathname === "/create-recipe" ? " " + styles.active : "")}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/icons/edit.svg"
              alt="Create Recipe"
              width={24}
              height={24}
              className={pathname === "/create-recipe" ? styles.active : undefined}
            />
            Create Recipe
          </Link>
          <Link
            href={`/profile/${userId}`}
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ProfileIcon className={pathname.startsWith("/profile") ? styles.active : undefined} />
            Profile
          </Link>
          <button
            className={styles.mobileNotificationButton}
            onClick={() => {
              handleNotificationsToggle();
              setMobileMenuOpen(false);
            }}
            aria-label={`Notifications ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} new)` : ''}`}
          >
            <Image
              src="/icons/notification.svg"
              alt="Notifications"
              width={24}
              height={24} />
            Notifications
            {unreadNotificationsCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <button
            className={styles.mobileNavLink}
            onClick={() => {
              handleSignOut();
              setMobileMenuOpen(false);
            }}
          >
            <SignOutIcon />
            Sign Out
          </button>
        </div>,
        document.body
      )}

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markNotificationsAsRead} />
    </nav>
  );
}

export default Navbar; 