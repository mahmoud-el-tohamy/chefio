import React from 'react';
import Image from 'next/image';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

const DEFAULT_AVATAR = '/images/anonymous.png';

export default function UserAvatar({ 
  src, 
  alt = 'User avatar', 
  size = 40,
  className = ''
}: UserAvatarProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  return (
    <div 
      className={`${styles.avatar} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src || DEFAULT_AVATAR}
        alt={alt}
        width={size}
        height={size}
        className={styles.image}
        onError={handleError}
      />
    </div>
  );
} 