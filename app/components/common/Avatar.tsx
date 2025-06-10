import React from 'react';
import styles from '@/styles/common/Avatar.module.css';
import Image from 'next/image';

const DEFAULT_AVATAR = '/images/default-avatar.png';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
}

export default function Avatar({ 
  src, 
  alt = 'User avatar', 
  size = 'md',
  className = ''
}: AvatarProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  const dimension = sizeMap[size];

  return (
    <div 
      className={`${styles.avatar} ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src={src || DEFAULT_AVATAR}
        alt={alt}
        width={dimension}
        height={dimension}
        className={styles.image}
        onError={handleError}
      />
    </div>
  );
} 