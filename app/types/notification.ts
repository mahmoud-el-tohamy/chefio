import { User } from './user';

export type NotificationType = 'follow' | 'like' | 'comment';

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'like' | 'comment' | 'follow' | 'mention';
  userId: string;
  users: User[];
  recipeImage?: string;
}

export interface GroupedNotifications {
  new: Notification[];
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
} 