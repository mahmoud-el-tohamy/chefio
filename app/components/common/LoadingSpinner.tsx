import React from 'react';
import styles from '@/styles/LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = 'var(--primary-color)',
  className = '',
  text = 'Loading...'
}) => {
  return (
    <div 
      className={`${styles.spinner} ${styles[size]} ${className}`}
      style={{ borderColor: color }}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.visuallyHidden}>{text}</span>
    </div>
  );
};

export default LoadingSpinner; 