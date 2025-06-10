export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  PATTERNS: {
    LOWERCASE: /[a-z]/,
    UPPERCASE: /[A-Z]/,
    DIGIT: /\d/,
    SPECIAL_CHAR: /[@$!%*?&#]/,
  },
  FULL_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
};

export const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;

export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Invalid email address",
  },
  USERNAME: {
    REQUIRED: "Username is required",
    NO_SPACES: "Username cannot contain spaces",
    ENGLISH_ONLY: "Only letters, numbers, '_' and '.' allowed",
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    INVALID: "Must include uppercase, lowercase, digit, special char, and be at least 8 characters long",
  },
}; 