export const APP_CONFIG = {
  MAX_RECIPE_DURATION: 60,
  MIN_RECIPE_DURATION: 1,
  MAX_FILE_SIZE: 12 * 1024 * 1024, // 12MB
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  NOTIFICATION_REFRESH_INTERVAL: 60000, // 1 minute
} as const;

export const ROUTES = {
  HOME: '/home',
  CREATE_RECIPE: '/create-recipe',
  PROFILE: (username: string) => `/profile/${username}`,
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot',
  },
} as const;

export const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snacks',
  'Drinks',
] as const; 