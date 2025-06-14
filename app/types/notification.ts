import { User } from './user';

export type NotificationType = 'follow' | 'like' | 'comment' | 'new_recipe';

export interface Notification {
  id: string;
  receiver: string;
  sender: { // This will be mapped to the `users` array in the service
    _id: string;
    username: string;
  };
  type: NotificationType | 'mention';
  recipeId?: string | null;
  recipePicture?: string | null;
  isFollowed?: boolean;
  isRead: boolean;
  createdAt: string; // This will be mapped to `timestamp` in the service
  __v?: number;
  // These properties are for frontend internal use after mapping
  message?: string;
  timestamp?: string;
  userId?: string;
  users?: User[];
}

export interface NotificationResponse {
  success: boolean;
  notifications: {
    totalNotifications: number;
    totalPages: number;
    currentPage: number;
    notifications: Notification[]; // Change this from BackendNotification[]
  };
}

// Define a type that directly reflects the backend's notification structure
export interface BackendNotification {
  _id: string;
  receiver: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  type: NotificationType | 'mention';
  recipeId: string | null;
  recipePicture: string | null;
  isFollowed: boolean;
  isRead: boolean;
  createdAt: string;
  __v: number;
}

export interface GroupedNotifications {
  new: Notification[];
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
} 