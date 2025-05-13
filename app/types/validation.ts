import { RegisterOptions } from "react-hook-form";
import { FormValues } from "./auth";

export type ValidationRules = {
  [K in keyof FormValues]: RegisterOptions<FormValues, K>;
};

export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      message: "Must include uppercase, lowercase, digit, special char, and be at least 8 characters long",
    },
  },
  username: {
    required: "Username is required",
    validate: {
      noSpaces: (value: string) =>
        /^[A-Za-z0-9_.]+$/.test(value || "") ||
        "Username cannot contain spaces",
      englishOnly: (value: string) =>
        /^[A-Za-z0-9_.]+$/.test(value || "") ||
        "Only letters, numbers, '_' and '.' allowed",
    },
  },
}; 