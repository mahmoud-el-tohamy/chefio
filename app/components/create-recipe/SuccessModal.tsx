import React from 'react';
import styles from '@/styles/CreateRecipe.module.css';

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className={styles.successModalOverlay}>
      <div className={styles.successModal}>
        <div className={styles.emoji} role="img" aria-label="party">🥳</div>
        <h2 className={styles.successTitle}>Upload Success</h2>
        <p className={styles.successText}>Your recipe has been uploaded,<br />you can see it on your profile</p>
        <button className={styles.successBtn} onClick={onClose}>Back to Home</button>
      </div>
    </div>
  );
} 