"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import styles from "./RecipePage.module.css";

// Mock data
const mockRecipe = {
  title: "Cacao Maca Walnut Milk Recipe:",
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  author: {
    name: "Elena Shelby",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  likes: 273,
  liked: false,
  description: "Your recipe has been uploaded, you can see it on your profile. Your recipe has been uploaded, you can see it on your",
  category: "Food",
  duration: "60 mins",
  ingredients: [
    "4 Eggs",
    "1/2 Butter",
    "1/2 Butter",
  ],
  steps: [
    {
      text: "Your recipe has been uploaded, you can see it on your profile. Your recipe has been uploaded, you can see it on your",
      image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    },
    {
      text: "Your recipe has been uploaded, you can see it on your profile. Your recipe has been uploaded, you can see it on your",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    },
  ],
};

function LikeButton({ initialLiked, initialCount }: { initialLiked: boolean; initialCount: number }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  return (
    <button
      className={styles.likeButton + (liked ? " " + styles.liked : "")}
      onClick={() => {
        setLiked((prev) => !prev);
        setCount((c) => (liked ? c - 1 : c + 1));
      }}
      aria-label={liked ? "Unlike" : "Like"}
      type="button"
    >
      <span className={styles.likeIcon} aria-hidden="true">
        <Image
          src={liked ? "/icons/heart-filled.svg" : "/icons/heart.svg"}
          alt="Like"
          width={22}
          height={22}
        />
      </span>
      <span className={styles.likeCount}>{count} Likes</span>
    </button>
  );
}

function RecipeHeader({ recipe }: { recipe: typeof mockRecipe }) {
  return (
    <div className={styles.header}>
      <div className={styles.imageWrapper}>
        <Image src={recipe.image} alt={recipe.title} width={300} height={300} className={styles.recipeImage} />
      </div>
      <div className={styles.meta}>
        <div className={styles.authorRow}>
          <Image src={recipe.author.avatar} alt={recipe.author.name} width={32} height={32} className={styles.avatar} />
          <span className={styles.authorName}>{recipe.author.name}</span>
          <LikeButton initialLiked={recipe.liked} initialCount={recipe.likes} />
        </div>
        <div className={styles.categoryRow}>
          <span className={styles.category}>{recipe.category}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.duration}>{recipe.duration}</span>
        </div>
      </div>
    </div>
  );
}

function RecipeIngredients({ ingredients }: { ingredients: string[] }) {
  return (
    <div className={styles.ingredientsBox}>
      <h2 className={styles.sectionTitle}>Ingredients</h2>
      <ul className={styles.ingredientsList}>
        {ingredients.map((item, i) => (
          <li key={i} className={styles.ingredientItem}>
            <span className={styles.checkIcon}>✔️</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecipeSteps({ steps }: { steps: { text: string; image: string }[] }) {
  return (
    <div className={styles.stepsBox}>
      <h2 className={styles.sectionTitle}>Steps</h2>
      <ol className={styles.stepsList}>
        {steps.map((step, i) => (
          <li key={i} className={styles.stepItem}>
            <div className={styles.stepNumber}>{i + 1}</div>
            <div className={styles.stepContent}>
              <div className={styles.stepText}>{step.text}</div>
              <Image src={step.image} alt={`Step ${i + 1}`} width={180} height={120} className={styles.stepImage} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RecipePage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>{mockRecipe.title}</h1>
        <div className={styles.contentGrid}>
          <div>
            <RecipeHeader recipe={mockRecipe} />
            <div className={styles.descriptionBox}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <div className={styles.descriptionText}>{mockRecipe.description}</div>
            </div>
          </div>
          <div>
            <RecipeIngredients ingredients={mockRecipe.ingredients} />
            <RecipeSteps steps={mockRecipe.steps} />
          </div>
        </div>
      </main>
    </>
  );
} 