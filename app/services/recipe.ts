import { apiClient as api } from './apiClient';

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
      const data = response.data;
      if (data?.recipe?.steps) {
        data.recipe.steps = data.recipe.steps.map((s: any) => s.step || s);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recipe');
    }
  },

  async updateRecipe(id: string, formData: FormData): Promise<RecipeResponse> {
    try {
      const response = await api.patch(`/recipe/update-recipe/${id}`, formData);
      const data = response.data;
      if (data?.recipe?.steps) {
        data.recipe.steps = data.recipe.steps.map((s: any) => s.step || s);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update recipe');
    }
  }
}; 