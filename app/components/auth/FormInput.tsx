import React from 'react';
import Image from 'next/image';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/types';
import styles from '@/styles/auth.module.css';

/**
 * Props for the FormInput component
 * @template T - The type of form values
 */
interface FormInputProps {
  /** The type of input (text, password, etc.) */
  type: string;
  /** Name of the form field */
  name: keyof FormValues;
  /** Placeholder text for the input */
  placeholder: string;
  /** Path to the icon image */
  icon: string;
  /** React Hook Form register function */
  register: UseFormRegister<FormValues>;
  /** Error messages for the form field */
  errors: FieldErrors<FormValues>;
  /** Whether to show the password (for password inputs) */
  showPassword?: boolean;
  /** Function to toggle password visibility */
  onTogglePassword?: () => void;
  /** HTML autocomplete attribute value */
  autoComplete?: string;
}

/**
 * A reusable form input component with icon and error handling
 * @template T - The type of form values
 * @param props - Component props
 * @returns A form input element with icon and error handling
 */
const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  placeholder,
  icon,
  register,
  errors,
  showPassword,
  onTogglePassword,
  autoComplete,
}) => {
  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputAndIcon}>
        <div className={styles.iconWrapper}>
          <Image
            src={icon}
            alt={`${name} Icon`}
            width={20}
            height={20}
            className={styles.inputIcon}
          />
        </div>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className={styles.input}
          autoComplete={autoComplete}
          {...register(name)}
        />
        {type === 'password' && onTogglePassword && (
          <div
            className={styles.toggleIconWrapper}
            onClick={onTogglePassword}
          >
            <Image
              src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
              alt="Toggle Password Visibility"
              width={20}
              height={20}
              className={styles.toggleIcon}
              title="Show/Hide Your Password"
            />
          </div>
        )}
      </div>
      {errors[name] && (
        <p className={styles.error}>{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default FormInput; 