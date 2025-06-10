'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/SearchResults.module.css';
import { Recipe } from "@/types";
import UserAvatar from '@/components/common/UserAvatar';

interface SearchResultsProps {
  query?: string;
  results: Recipe[];
  isVisible: boolean;
  onToggleLike: (recipeId: string) => void;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  query, 
  results, 
  isVisible,
  onToggleLike,
  onClearSearch
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <button 
            onClick={onClearSearch} 
            className={styles.backButton}
            type="button"
            aria-label="Back to all recipes"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="Back"
              width={24}
              height={24}
            />
            <span>All Recipes</span>
          </button>
          <h2 className={styles.title}>
            {query ? `Searching Results for "${query}"` : 'All Recipes'}
          </h2>
        </div>
      </div>
      
      <div className={styles.grid}>
        {results.map((recipe) => (
          <div key={recipe._id} className={styles.recipeCard}>
            <div className={styles.imageContainer}>
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={200}
                height={150}
                className={styles.recipeImage}
              />
              <button 
                className={`${styles.favoriteButton} ${recipe.isLiked ? styles.liked : ''}`}
                onClick={() => onToggleLike(recipe._id)}
                aria-label={recipe.isLiked ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
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
              <UserAvatar
                src={recipe.createdBy.profilePicture}
                alt={`Avatar of ${recipe.createdBy.username}`}
                size={32}
                className={styles.avatar}
              />
              <span className={styles.authorName}>{recipe.createdBy.username}</span>
            </div>

            <div className={styles.recipeInfo}>
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
              <p className={styles.recipeDescription}>{recipe.description}</p>
              <div className={styles.recipeMeta}>
                <span className={styles.category}>{recipe.category}</span>
                <span className={styles.duration}>{recipe.cookingDuration} mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults; 