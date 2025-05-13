export interface AuthFormProps {
  type: "login" | "signup";
}

export interface FormValues {
  email: string;
  password: string;
  username?: string;
}

export interface PasswordRequirements {
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  isMinLength: boolean;
  usernameValid: boolean;
} 