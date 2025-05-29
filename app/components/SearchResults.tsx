'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/SearchResults.module.css';
import { Recipe } from "@/types";

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
          <div key={recipe.id} className={styles.recipeCard}>
            <div className={styles.imageContainer}>
              <Image
                src={recipe.image}
                alt={`Image of ${recipe.title}`}
                fill
                className={styles.image}
              />
              <button 
                className={`${styles.favoriteButton} ${recipe.isLiked ? styles.liked : ''}`}
                onClick={() => onToggleLike(recipe.id)}
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
              <Image
                src={recipe.author.avatar}
                alt={`Avatar of ${recipe.author.name}`}
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
    </div>
  );
};

export default SearchResults; 