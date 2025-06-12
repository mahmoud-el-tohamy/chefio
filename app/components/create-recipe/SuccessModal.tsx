import React from 'react';
import styles from '@/styles/CreateRecipe.module.css';

interface SuccessModalProps {
  onClose: () => void;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, message = "Recipe uploaded successfully!" }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.emoji} role="img" aria-label="party">🥳</div>
        <h2>Success!</h2>
        <p>{message}</p>
        <button onClick={onClose}>Back to Recipe</button>
      </div>
    </div>
  );
};

export default SuccessModal; 