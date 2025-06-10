import { CATEGORIES } from '@/constants';
import { Category } from '@/types';

export const mockRecipes = [
  {
    _id: "1",
    foodName: "Pancake",
    recipePicture: "/images/recipes/pancake.jpg",
    category: {
      _id: "1",
      name: "Food"
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
      name: "Food"
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