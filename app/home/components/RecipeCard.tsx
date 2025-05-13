"use client";
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/home/RecipeCard.module.css';
import Image from 'next/image';
import { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link href={`/recipe/${recipe.id}`} className={styles.card} aria-label={`View details for ${recipe.title}`}>
      <div className={styles.imageContainer}>
        <Image
          src={recipe.image}
          alt={`Image of ${recipe.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
          priority
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <div className={styles.footer}>
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              <Image
                width={32}
                height={32}
                src={recipe.author.avatar || "/Images/anonymous.png"}
                alt={`Avatar of ${recipe.author.name}`}
                className={styles.image}
              />
            </div>
            <span className={styles.authorName}>{recipe.author.name}</span>
          </div>
          <div className={styles.time}>
            <Image
              src="/icons/time.svg"
              alt="Cooking time"
              width={16}
              height={16}
            />
            <span>{recipe.cookingTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
