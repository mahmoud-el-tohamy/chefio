export type NotificationType = 'follow' | 'like' | 'comment';

export interface User {
  id: string;
  name: string;
  image: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'like' | 'comment' | 'follow' | 'mention';
  userId: string;
}

export interface GroupedNotifications {
  new: Notification[];
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
} 