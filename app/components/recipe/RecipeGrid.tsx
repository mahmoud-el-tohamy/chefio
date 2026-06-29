"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/RecipeGrid.module.css';
import { Recipe } from "@/types";
import Link from 'next/link';
import UserAvatar from '@/components/common/UserAvatar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Cookies from 'js-cookie';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface RecipeGridProps {
  recipes: Recipe[];
  onToggleLike: (recipeId: string) => void;
  isLoading?: boolean;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onToggleLike, isLoading = false }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('accessToken') || Cookies.get('Authorization');
    if (token) {
      try {
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        const payload = JSON.parse(atob(cleanToken.split('.')[1]));
        setCurrentUserId(payload.id || payload._id || payload.userId || payload.user_id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <LoadingSpinner message="Loading recipes..." />
      </div>
    );
  }

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
            <ImageWithFallback
              fallbackSrc="/images/recipe-placeholder.svg"
              src={recipe.recipePicture}
              alt={`Image of ${recipe.foodName}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              priority={false}
            />
            {recipe.createdBy._id !== currentUserId && (
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
            )}
          </div>
          
          <div className={styles.authorInfo}>
            <UserAvatar
              src={recipe.createdBy.profilePicture}
              alt={`Avatar of ${recipe.createdBy.username}`}
              size={32}
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