"use client";

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/RecipeGrid.module.css';
import { Recipe } from "@/types";
import Link from 'next/link';

interface RecipeGridProps {
  recipes: Recipe[];
  onToggleLike: (recipeId: string) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onToggleLike }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className={styles.grid}>
        <p className={styles.noRecipes}>No recipes found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <Link 
          key={recipe._id} 
          href={`/recipes/${recipe._id}`} 
          className={styles.recipeCard}
        >
          <div className={styles.imageContainer}>
            <Image
              src={recipe.recipePicture}
              alt={`Image of ${recipe.foodName}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              priority={false}
            />
            <button 
              className={`${styles.favoriteButton} ${recipe.isLiked ? styles.liked : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                onToggleLike(recipe._id); 
              }}
              aria-label={recipe.isLiked ? `Remove ${recipe.foodName} from favorites` : `Add ${recipe.foodName} to favorites`}
            >
              <Image
                src={recipe.isLiked ? "/icons/heart-filled.svg" : "/icons/heart.svg"}
                alt={recipe.isLiked ? "Remove from favorites" : "Add to favorites"}
                width={24}
                height={24}
              />
            </button>
          </div>
          
          <div className={styles.authorInfo}>
            <Image
              src={recipe.createdBy.profilePicture}
              alt={`Avatar of ${recipe.createdBy.username}`}
              width={32}
              height={32}
              className={styles.avatar}
            />
            <span className={styles.authorName}>{recipe.createdBy.username}</span>
          </div>

          <h3 className={styles.recipeTitle}>{recipe.foodName}</h3>
          
          <div className={styles.recipeDetails}>
            <span className={styles.category}>{recipe.category.name}</span>
            <span>•</span>
            <span className={styles.duration}>{recipe.cookingDuration} mins</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeGrid; 