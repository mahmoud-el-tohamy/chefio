import React from 'react';
import styles from '@/styles/auth.module.css';

interface PasswordRequirementsProps {
  validation: {
    hasLowerCase: boolean;
    hasUpperCase: boolean;
    hasDigit: boolean;
    hasSpecialChar: boolean;
    isMinLength: boolean;
    isUsernameValid: boolean;
  };
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validation }) => {
  return (
    <div className={styles.passwordRequirements}>
      <ul>
        <li className={validation.hasLowerCase ? styles.valid : styles.invalid}>
          {validation.hasLowerCase ? "✓" : "✕"} At least one lowercase letter
        </li>
        <li className={validation.hasUpperCase ? styles.valid : styles.invalid}>
          {validation.hasUpperCase ? "✓" : "✕"} At least one uppercase letter
        </li>
        <li className={validation.hasDigit ? styles.valid : styles.invalid}>
          {validation.hasDigit ? "✓" : "✕"} Contains a number
        </li>
        <li className={validation.hasSpecialChar ? styles.valid : styles.invalid}>
          {validation.hasSpecialChar ? "✓" : "✕"} Contains a special character
        </li>
        <li className={validation.isMinLength ? styles.valid : styles.invalid}>
          {validation.isMinLength ? "✓" : "✕"} Minimum length of 8 characters
        </li>
        <li className={validation.isUsernameValid ? styles.valid : styles.invalid}>
          {validation.isUsernameValid ? "✓" : "✕"} Username: only letters, numbers, '_' and '.'
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements; 