import React, { useEffect, useRef } from 'react';
import { GroupedNotifications, Notification } from '@/types/notification';
import NotificationCard from './NotificationCard';
import styles from '@/styles/notifications/NotificationsDropdown.module.css';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: GroupedNotifications;
  onMarkAllAsRead?: () => void;
  onNotificationActionComplete?: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationActionComplete
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderSection = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;

    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.notificationsList}>
          {items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onCloseDropdown={onClose}
              onNotificationActionComplete={onNotificationActionComplete}
            />
          ))}
        </div>
      </div>
    );
  };

  const hasUnreadNotifications = notifications.new.length > 0;

  return (
    <div className={styles.dropdownOverlay}>
      <div ref={dropdownRef} className={styles.dropdown}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          {hasUnreadNotifications && onMarkAllAsRead && (
            <button
              className={styles.markAllReadButton}
              onClick={() => {
                onMarkAllAsRead();
                onClose();
                if (onNotificationActionComplete) {
                  onNotificationActionComplete();
                }
              }}
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className={styles.content}>
          {renderSection('New', notifications.new)}
          {renderSection('Today', notifications.today)}
          {renderSection('Yesterday', notifications.yesterday)}
          {renderSection('Older', notifications.older)}
          
          {Object.values(notifications).every(arr => (arr as Notification[]).length === 0) && (
            <div className={styles.emptyState}>
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown; 