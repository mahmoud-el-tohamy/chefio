import { api } from './auth';
import { GroupedNotifications, NotificationResponse, Notification, BackendNotification, NotificationType } from '@/types/notification';
import { User } from '@/types/user';

export const notificationService = {
  // Helper function to transform BackendNotification to Notification
  _transformNotification(backendNotification: BackendNotification): Notification {
    const user: User = {
      id: backendNotification.sender._id,
      name: backendNotification.sender.username,
      image: backendNotification.sender.profilePicture, // Map profilePicture to image
    };

    let message = '';
    const names = user.name; // For single sender for now

    switch (backendNotification.type) {
      case 'follow':
        message = `${names} is now following you`;
        break;
      case 'like':
        message = `${names} liked your recipe`;
        break;
      case 'comment':
        message = `${names} commented on your recipe`;
        break;
      case 'new_recipe':
        message = `${names} published a new recipe`;
        break;
      case 'mention': // Assuming 'mention' might also use sender name
        message = `${names} mentioned you`;
        break;
      default:
        message = 'New notification'; // Generic message if type is unknown
    }

    return {
      id: backendNotification._id,
      receiver: backendNotification.receiver,
      sender: backendNotification.sender, // Keep original sender for reference if needed
      type: backendNotification.type,
      recipeId: backendNotification.recipeId,
      recipePicture: backendNotification.recipePicture,
      isFollowed: backendNotification.isFollowed,
      isRead: backendNotification.isRead,
      createdAt: backendNotification.createdAt,
      __v: backendNotification.__v,
      // Frontend specific mapped properties
      message: message,
      timestamp: backendNotification.createdAt,
      userId: backendNotification.receiver, // Assuming receiver is the current user's ID
      users: [user], // Wrap the sender in an array as expected by NotificationCard
    };
  },

  // Register FCM token with the backend
  async registerFCMToken(fcmToken: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/device-tokens/register', { token: fcmToken, device: "web" });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to register FCM token');
    }
  },

  // Get all notifications
  async getNotifications(page: number = 1): Promise<NotificationResponse> {
    try {
      const response = await api.get(`/notification?page=${page}`);
      const backendNotifications: BackendNotification[] = response.data.notifications.notifications;
      const transformedNotifications: Notification[] = backendNotifications.map(this._transformNotification);

      // Reconstruct the response with transformed notifications
      return {
        ...response.data,
        notifications: {
          ...response.data.notifications,
          notifications: transformedNotifications,
        },
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    }
  },

  // Mark notifications as read
  async markNotificationsAsRead(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/notification/mark-all-as-read');
      return response.data; // Return the simple success/message response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to mark notifications as read');
    }
  },

  // Mark a specific notification as read
  async markSpecificNotificationAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch(`/notification/mark-as-read/${notificationId}`);
      return response.data; // Return the simple success/message response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || `Failed to mark notification ${notificationId} as read`);
    }
  },

  // Helper function to group notifications by time
  groupNotificationsByTime(notifications: Notification[]): GroupedNotifications {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return notifications.reduce((groups, notification) => {
      // Ensure timestamp exists and is a valid date string
      const notificationDate = notification.timestamp ? new Date(notification.timestamp) : new Date();
      
      if (notificationDate >= today) {
        groups.new.push(notification);
      } else if (notificationDate >= yesterday) {
        groups.today.push(notification);
      } else if (notificationDate >= new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)) {
        groups.yesterday.push(notification);
      } else {
        groups.older.push(notification);
      }
      
      return groups;
    }, {
      new: [] as Notification[],
      today: [] as Notification[],
      yesterday: [] as Notification[],
      older: [] as Notification[]
    });
  }
}; 