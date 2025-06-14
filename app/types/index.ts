import { CATEGORIES } from '@/constants';

export type Category = typeof CATEGORIES[number];

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  email: string;
  recipes: number;
  following: number;
  followers: number;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
}

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
  message?: string;
  recipes: Recipe[];
  total: number;
  totalRecipes: number;
  currentPage: number;
  totalPages: number;
}

export interface FormValues {
  email: string;
  password: string;
  username?: string;
}

export interface AuthFormProps {
  type: "login" | "signup";
}

export interface SearchResultsProps {
  query?: string;
  results: Recipe[];
  isVisible: boolean;
  onToggleLike: (recipeId: string) => void;
  onClearSearch: () => void;
}

export interface RecipeFormData {
  title: string;
  description: string;
  coverPhoto: File | null;
  duration: number;
  ingredients: string[];
  steps: {
    description: string;
    image?: File;
  }[];
}

interface RecipeGridProps {
  recipes: Recipe[];
} 