"use client";
import React from "react";
import RecipeCard from "./RecipeCard";
import "../../styles/home/RecipeGrid.css";
import { Recipe } from '@/types';

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
