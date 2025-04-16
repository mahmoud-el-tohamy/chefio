import React, { memo } from "react";
import { PasswordRequirements } from "../../types/auth";
import styles from "../../styles/auth.module.css";

interface PasswordRequirementsProps {
  requirements: PasswordRequirements;
  username: string;
}

const PasswordRequirementsList: React.FC<PasswordRequirementsProps> = memo(({
  requirements,
  username,
}) => {
  return (
    <div className={styles.passwordRequirements}>
      <ul>
        <li className={requirements.hasLowerCase ? styles.valid : styles.invalid}>
          {requirements.hasLowerCase ? "✓" : "✕"} At least one lowercase letter
        </li>
        <li className={requirements.hasUpperCase ? styles.valid : styles.invalid}>
          {requirements.hasUpperCase ? "✓" : "✕"} At least one uppercase letter
        </li>
        <li className={requirements.hasDigit ? styles.valid : styles.invalid}>
          {requirements.hasDigit ? "✓" : "✕"} Contains a number
        </li>
        <li className={requirements.hasSpecialChar ? styles.valid : styles.invalid}>
          {requirements.hasSpecialChar ? "✓" : "✕"} Contains a special character
        </li>
        <li className={requirements.isMinLength ? styles.valid : styles.invalid}>
          {requirements.isMinLength ? "✓" : "✕"} Minimum length of 8 characters
        </li>
        <li className={requirements.usernameValid ? styles.valid : styles.invalid}>
          {requirements.usernameValid ? "✓" : "✕"} Username: only letters, numbers, '_' and '.'
        </li>
      </ul>
    </div>
  );
});

PasswordRequirementsList.displayName = "PasswordRequirementsList";

export default PasswordRequirementsList; 