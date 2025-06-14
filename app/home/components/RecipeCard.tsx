"use client";
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/home/RecipeCard.module.css';
import Image from 'next/image';
import { Recipe } from "@/types";
import UserAvatar from '@/components/common/UserAvatar';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className={styles.card}>
      <Link href={`/recipes/${recipe._id}`} className={styles.imageContainer} aria-label={`View details for ${recipe.foodName}`} tabIndex={-1}>
        <Image
          src={recipe.recipePicture}
          alt={`Image of ${recipe.foodName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
          priority
        />
      </Link>
      <div className={styles.content}>
        <Link href={`/recipes/${recipe._id}`} className={styles.title} aria-label={`View details for ${recipe.foodName}`} tabIndex={-1}>
          {recipe.foodName}
        </Link>
        <div className={styles.footer}>
          <div className={styles.author}>
            <Link href={`/profile/${recipe.createdBy.username}`} className={styles.authorProfileLink} aria-label={`View ${recipe.createdBy.username}'s profile`} onClick={e => e.stopPropagation()}>
              <UserAvatar
                src={recipe.createdBy.profilePicture}
                alt={`Avatar of ${recipe.createdBy.username}`}
                size={32}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>{recipe.createdBy.username}</span>
            </Link>
          </div>
          <div className={styles.time}>
            <Image
              src="/icons/time.svg"
              alt="Cooking time"
              width={16}
              height={16}
            />
            <span>{recipe.cookingDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
