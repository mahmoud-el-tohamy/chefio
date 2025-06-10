import { CATEGORIES } from '@/constants';
import { Category } from '@/types';

export const mockRecipes = [
  {
    _id: "1",
    foodName: "Pancake",
    recipePicture: "/images/recipes/pancake.jpg",
    category: {
      _id: "1",
      name: "Breakfast"
    },
    cookingDuration: 60,
    createdBy: {
      _id: "1",
      username: "calum",
      profilePicture: "/images/avatars/calum.jpg"
    },
    description: "Delicious fluffy pancakes",
    ingredients: ["flour", "eggs", "milk"],
    instructions: ["Mix ingredients", "Cook on pan"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  },
  {
    _id: "2",
    foodName: "Salad",
    recipePicture: "/images/recipes/salad.jpg",
    category: {
      _id: "2",
      name: "Lunch"
    },
    cookingDuration: 30,
    createdBy: {
      _id: "2",
      username: "eilif",
      profilePicture: "/images/avatars/eilif.jpg"
    },
    description: "Fresh and healthy salad",
    ingredients: ["lettuce", "tomatoes", "cucumber"],
    instructions: ["Chop vegetables", "Mix together"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  },
  {
    _id: "3",
    foodName: "Caesar Salad",
    recipePicture: "/images/recipes/salad2.jpg",
    category: {
      _id: "2",
      name: "Lunch"
    },
    cookingDuration: 45,
    createdBy: {
      _id: "3",
      username: "john",
      profilePicture: "/images/avatars/john.jpg"
    },
    description: "Classic Caesar salad with homemade dressing",
    ingredients: ["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing"],
    instructions: ["Wash and chop lettuce", "Add croutons and cheese", "Drizzle with dressing"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  },
  {
    _id: "4",
    foodName: "Blueberry Pancakes",
    recipePicture: "/images/recipes/pancake2.jpg",
    category: {
      _id: "1",
      name: "Breakfast"
    },
    cookingDuration: 30,
    createdBy: {
      _id: "4",
      username: "elena",
      profilePicture: "/images/avatars/elena.jpg"
    },
    description: "Fluffy pancakes with fresh blueberries",
    ingredients: ["flour", "eggs", "milk", "blueberries", "sugar"],
    instructions: ["Mix dry ingredients", "Add wet ingredients", "Fold in blueberries", "Cook on griddle"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  }
]; 