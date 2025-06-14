import React, { useMemo } from 'react';
import Image from 'next/image';
import { Notification } from '@/types/notification';
import styles from '@/styles/notifications/NotificationCard.module.css';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { notificationService } from '@/services/notification';

const DEFAULT_AVATAR = '/Images/anonymous.png';

interface NotificationCardProps {
  notification: Notification;
  onCloseDropdown: () => void;
  onNotificationActionComplete?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onCloseDropdown, onNotificationActionComplete }) => {
  const router = useRouter();

  const { message, namesDisplay } = useMemo(() => {
    const users = notification.users || []; // Ensure users is an array
    const userNames = users.map((user: User) => user.name).join(' and ');
    const otherCount = users.length > 2 ? users.length - 2 : 0;
    const names = otherCount > 0 
      ? `${users[0].name}, ${users[1].name} and ${otherCount} others`
      : userNames;

    let msg = '';
    switch (notification.type) {
      case 'follow':
        msg = `${names} ${users.length > 1 ? 'are' : 'is'} now following you`;
        break;
      case 'like':
        msg = `${names} liked your recipe`;
        break;
      case 'comment':
        msg = `${names} commented on your recipe`;
        break;
      case 'new_recipe':
        msg = `${names} published a new recipe`;
        break;
      case 'mention':
        msg = `${names} mentioned you`;
        break;
      default:
        msg = notification.message || 'New notification';
    }

    return { message: msg, namesDisplay: names };
  }, [notification.users, notification.type, notification.message]);

  const timeAgo = useMemo(() => 
    formatDistanceToNow(notification.timestamp ? new Date(notification.timestamp) : new Date(), { addSuffix: true }),
    [notification.timestamp]
  );

  const handleClick = async () => {
    try {
      const response = await notificationService.markSpecificNotificationAsRead(notification.id);
      if (response.success) {
        onCloseDropdown();
        if (onNotificationActionComplete) {
          onNotificationActionComplete();
        }
      }
    } catch (error: any) {
      console.error('Error handling notification click:', error);
      if (error.message && error.message.includes('404')) {
        console.warn(`Received 404 for mark-as-read/${notification.id}, assuming success and re-fetching notifications.`);
        onCloseDropdown();
        if (onNotificationActionComplete) {
          onNotificationActionComplete();
        }
      }
    }

    switch (notification.type) {
      case 'like':
      case 'new_recipe':
        if (notification.recipeId) {
          router.push(`/recipes/${notification.recipeId}`);
        }
        break;
      case 'follow':
        if (notification.sender && notification.sender._id) {
          router.push(`/profile/${notification.sender._id}`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <button className={styles.card} onClick={handleClick} role="button">
      <div className={styles.userImages}>
        {(notification.users || []).slice(0, 2).map((user, index) => (
          <div key={user.id} className={styles.userImageWrapper} style={{ zIndex: 2 - index }}>
            <Avatar
              src={user.image}
              alt={user.name}
              size="md"
              className={styles.userImage}
            />
          </div>
        ))}
      </div>
      
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <span className={styles.time}>{timeAgo}</span>
      </div>

      {notification.recipePicture && (
        <div className={styles.recipeImage}>
          <Image
            src={notification.recipePicture}
            alt="Recipe"
            width={60}
            height={60}
            className={styles.thumbnail}
            loading="lazy"
          />
        </div>
      )}
    </button>
  );
};

export default React.memo(NotificationCard); 