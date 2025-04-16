"use client";

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/RecipeGrid.module.css';

interface Recipe {
  id: string;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  duration: string;
  isLiked?: boolean;
}

interface RecipeGridProps {
  recipes: Recipe[];
  onToggleLike: (recipeId: string) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onToggleLike }) => {
  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <div key={recipe.id} className={styles.recipeCard}>
          <div className={styles.imageContainer}>
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className={styles.image}
            />
            <button 
              className={`${styles.favoriteButton} ${recipe.isLiked ? styles.liked : ''}`}
              onClick={() => onToggleLike(recipe.id)}
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
              src={recipe.author.avatar}
              alt={recipe.author.name}
              width={32}
              height={32}
              className={styles.avatar}
            />
            <span className={styles.authorName}>{recipe.author.name}</span>
          </div>

          <h3 className={styles.recipeTitle}>{recipe.title}</h3>
          
          <div className={styles.recipeDetails}>
            <span>{recipe.category}</span>
            <span>•</span>
            <span>{recipe.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid; 