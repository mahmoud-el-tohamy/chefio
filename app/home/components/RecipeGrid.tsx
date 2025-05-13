"use client";
import React from "react";
import RecipeCard from "./RecipeCard";
import "../../styles/home/RecipeGrid.css";

interface Recipe {
  id: number;
  title: string;
  category: string;
  author: string;
  avatar: string;
  imageUrl: string;
  time: string;
}

interface RecipeGridProps {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
