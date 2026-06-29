export interface AuthFormProps {
  type: "login" | "signup";
}

export interface FormValues {
  email: string;
  password: string;
  username?: string;
  providedCode?: string;
}

export interface PasswordRequirements {
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  isMinLength: boolean;
  usernameValid: boolean;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  success: boolean;
  accessToken: string;
  refreshToken?: string;
  message: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  result?: any;
  newUser?: any;
} 