import React, { useMemo } from 'react';
import Image from 'next/image';
import { Notification } from '@/types/notification';
import styles from '@/styles/notifications/NotificationCard.module.css';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';
import { User } from '@/types/user';

const DEFAULT_AVATAR = '/Images/anonymous.png';

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { message, namesDisplay } = useMemo(() => {
    const userNames = notification.users.map((user: User) => user.name).join(' and ');
    const otherCount = notification.users.length > 2 ? notification.users.length - 2 : 0;
    const names = otherCount > 0 
      ? `${notification.users[0].name}, ${notification.users[1].name} and ${otherCount} others`
      : userNames;

    let msg = '';
    switch (notification.type) {
      case 'follow':
        msg = `${names} ${notification.users.length > 1 ? 'are' : 'is'} now following you`;
        break;
      case 'like':
        msg = `${names} liked your recipe`;
        break;
      case 'comment':
        msg = `${names} commented on your recipe`;
        break;
    }

    return { message: msg, namesDisplay: names };
  }, [notification.users, notification.type]);

  const timeAgo = useMemo(() => 
    formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true }),
    [notification.timestamp]
  );

  return (
    <div className={styles.card}>
      <div className={styles.userImages}>
        {notification.users.slice(0, 2).map((user, index) => (
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

      {notification.recipeImage && (
        <div className={styles.recipeImage}>
          <Image
            src={notification.recipeImage}
            alt="Recipe"
            width={60}
            height={60}
            className={styles.thumbnail}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(NotificationCard); 