import { PasswordRequirements } from "../types/auth";

export const validatePassword = (password: string, username: string = ""): PasswordRequirements => {
  return {
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&#]/.test(password),
    isMinLength: password.length >= 8,
    usernameValid: username ? /^[A-Za-z0-9_.]+$/.test(username) : true
  };
};

export const areAllRequirementsMet = (requirements: PasswordRequirements): boolean => {
  return Object.values(requirements).every(requirement => requirement);
}; 