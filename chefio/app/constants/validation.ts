export const VALIDATION_PATTERNS = {
  email: /^\S+@\S+\.\S+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  username: /^[A-Za-z0-9_.]+$/,
};

export const VALIDATION_MESSAGES = {
  email: {
    required: "Email is required",
    invalid: "Invalid email address",
  },
  password: {
    required: "Password is required",
    invalid: "Must include uppercase, lowercase, digit, special char, and be at least 8 characters long",
  },
  username: {
    required: "Username is required",
    noSpaces: "Username cannot contain spaces",
    englishOnly: "Only letters, numbers, '_' and '.' allowed",
  },
}; 