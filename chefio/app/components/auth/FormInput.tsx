import React, { memo } from "react";
import Image from "next/image";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import styles from "../../styles/auth.module.css";

/**
 * Props for the FormInput component
 * @template T - The type of form values
 */
interface FormInputProps<T extends FieldValues> {
  /** The type of input (text, password, etc.) */
  type: string;
  /** Placeholder text for the input */
  placeholder: string;
  /** Path to the icon image */
  icon: string;
  /** HTML autocomplete attribute value */
  autoComplete?: string;
  /** Whether to show the password (for password inputs) */
  showPassword?: boolean;
  /** Function to toggle password visibility */
  togglePasswordVisibility?: () => void;
  /** React Hook Form register function */
  register: UseFormRegister<T>;
  /** Name of the form field */
  name: Path<T>;
  /** Error message to display */
  error?: string;
  /** Label text for the input */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * A reusable form input component with icon and error handling
 * @template T - The type of form values
 * @param props - Component props
 * @returns A form input element with icon and error handling
 */
const FormInput = memo(<T extends FieldValues>({
  type,
  placeholder,
  icon,
  autoComplete,
  showPassword,
  togglePasswordVisibility,
  register,
  name,
  error,
  label,
  required = false,
}: FormInputProps<T>) => {
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputAndIcon}>
        <div className={styles.iconWrapper}>
          <Image
            src={icon}
            alt=""
            width={20}
            height={20}
            className={styles.inputIcon}
            aria-hidden="true"
          />
        </div>
        <input
          id={inputId}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={styles.input}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          {...register(name)}
        />
        {type === "password" && (
          <button
            type="button"
            className={styles.toggleIconWrapper}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Image
              src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
              alt=""
              width={20}
              height={20}
              className={styles.toggleIcon}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}) as <T extends FieldValues>(props: FormInputProps<T>) => JSX.Element;

FormInput.displayName = "FormInput";

export default FormInput; 