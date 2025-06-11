import { CATEGORIES } from '@/constants';
import { Category } from '@/types';

export const mockRecipes = [
  {
    id: "1",
    title: "Pancake",
    image: "/images/recipes/pancake.jpg",
    category: "Food" as Category,
    duration: ">60 mins",
    author: {
      id: "1",
      username: "calum",
      name: "Calum Lewis",
      avatar: "/images/avatars/calum.jpg",
      email: "calum@example.com",
      recipes: 0,
      following: 0,
      followers: 0
    },
    description: "",
    ingredients: [],
    steps: [],
    createdAt: "",
    updatedAt: "",
    cookingTime: ""
  },
  {
    id: "2",
    title: "Salad",
    image: "/images/recipes/salad.jpg",
    category: "Food" as Category,
    duration: ">60 mins",
    author: {
      id: "2",
      username: "eilif",
      name: "Eilif Sonas",
      avatar: "/images/avatars/eilif.jpg",
      email: "eilif@example.com",
      recipes: 0,
      following: 0,
      followers: 0
    },
    description: "",
    ingredients: [],
    steps: [],
    createdAt: "",
    updatedAt: "",
    cookingTime: ""
  },
  {
    id: "3",
    title: "Salad",
    image: "/images/recipes/salad2.jpg",
    category: "Food" as Category,
    duration: ">60 mins",
    author: {
      id: "3",
      username: "john",
      name: "John Priyadi",
      avatar: "/images/avatars/john.jpg",
      email: "john@example.com",
      recipes: 0,
      following: 0,
      followers: 0
    },
    description: "",
    ingredients: [],
    steps: [],
    createdAt: "",
    updatedAt: "",
    cookingTime: ""
  },
  {
    id: "4",
    title: "Pancake",
    image: "/images/recipes/pancake2.jpg",
    category: "Food" as Category,
    duration: ">60 mins",
    author: {
      id: "4",
      username: "elena",
      name: "Elena Shelby",
      avatar: "/images/avatars/elena.jpg",
      email: "elena@example.com",
      recipes: 0,
      following: 0,
      followers: 0
    },
    description: "",
    ingredients: [],
    steps: [],
    createdAt: "",
    updatedAt: "",
    cookingTime: ""
  }
]; 