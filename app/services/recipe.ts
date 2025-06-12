import axios from 'axios';

const API_BASE_URL = 'https://chefio-beta.vercel.app/api/v1';

// Helper function to get access token from Authorization cookie
const getAccessToken = () => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('Authorization='));
  if (!authCookie) return null;
  // Remove 'Authorization=' and trim, then strip 'Bearer ' if present
  return decodeURIComponent(authCookie.split('=')[1].trim().replace(/^Bearer /, ''));
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    // Only add 'Bearer ' if not already present
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the token and redirect to login
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export interface Recipe {
  likesCount: number;
  _id: string;
  createdBy: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  recipePicture: string;
  foodName: string;
  description: string;
  cookingDuration: number;
  ingredients: string[];
  steps: string[];
  category: {
    _id: string;
    name: string;
  };
  likes: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

export interface RecipeResponse {
  success: boolean;
  recipe: Recipe;
}

export const recipeService = {
  async getRecipe(id: string): Promise<RecipeResponse> {
    try {
      const response = await api.get(`/recipe/get-recipe/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recipe');
    }
  },

  async updateRecipe(id: string, formData: FormData): Promise<RecipeResponse> {
    try {
      const response = await api.put(`/recipe/update-recipe/${id}`, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update recipe');
    }
  }
}; 