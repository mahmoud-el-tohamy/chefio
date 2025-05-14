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
  id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
  duration: string;
  author: User;
  ingredients: string[];
  steps: {
    description: string;
    image?: string;
  }[];
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  cookingTime: string;
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