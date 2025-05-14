"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import styles from "./RecipePage.module.css";
import Link from "next/link";

// Mock data
const mockRecipe = {
  title: "Cacao Maca Walnut Milk Recipe:",
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  author: {
    name: "Elena Shelby",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    username: "elena_shelby",
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
    {
      text: "Mix all ingredients thoroughly until smooth. Pour into a baking dish and bake at 180°C for 45 minutes.",
      image: "",
    },
    {
      text: "Let the dish cool for 10 minutes before serving. Garnish with fresh herbs or fruit as desired.",
      image: "",
    },
    {
      text: "Enjoy your delicious homemade recipe! Share with friends and family.",
      image: "",
    },
    {
      text: "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
      image: "",
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
          <Link href={`/profile/${recipe.author.username}`} className={styles.authorProfileLink} aria-label={`View ${recipe.author.name}'s profile`}>
            <Image src={recipe.author.avatar} alt={recipe.author.name} width={32} height={32} className={styles.avatar} />
            <span className={styles.authorName}>{recipe.author.name}</span>
          </Link>
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
        <div className={styles.gridLayout}>
          <div className={styles.stickyColumn}>
            <div className={styles.sidebarTitle}>{mockRecipe.title}</div>
            <div className={styles.coverImageWrapper}>
              <Image src={mockRecipe.image} alt={mockRecipe.title} width={250} height={250} className={styles.coverImage} />
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.authorLikeRow}>
                <Link href={`/profile/${mockRecipe.author.username}`} className={styles.authorProfileLink} aria-label={`View ${mockRecipe.author.name}'s profile`}>
                  <Image src={mockRecipe.author.avatar} alt={mockRecipe.author.name} width={40} height={40} className={styles.avatar} />
                  <span className={styles.authorName}>{mockRecipe.author.name}</span>
                </Link>
                <LikeButton initialLiked={mockRecipe.liked} initialCount={mockRecipe.likes} />
              </div>
              <div className={styles.descriptionBox + ' ' + styles.hideOnTablet}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <div className={styles.metaRow}><span className={styles.category}>{mockRecipe.category}</span> <span className={styles.dot}>•</span> <span className={styles.duration}>{mockRecipe.duration}</span></div>
                <div className={styles.descriptionText}>{mockRecipe.description}</div>
              </div>
            </div>
          </div>
          <div className={styles.scrollColumn}>
            <div className={styles.descriptionBox + ' ' + styles.showOnTablet}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <div className={styles.metaRow}><span className={styles.category}>{mockRecipe.category}</span> <span className={styles.dot}>•</span> <span className={styles.duration}>{mockRecipe.duration}</span></div>
              <div className={styles.descriptionText}>{mockRecipe.description}</div>
            </div>
            <div className={styles.ingredientsBox}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              <ul className={styles.ingredientsList}>
                {mockRecipe.ingredients.map((item, i) => (
                  <li key={i} className={styles.ingredientItem}>
                    <span className={styles.checkIcon}>✔️</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.stepsBox}>
              <h2 className={styles.sectionTitle}>Steps</h2>
              <ol className={styles.stepsList}>
                {mockRecipe.steps.map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <div className={styles.stepNumber}>{i + 1}</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepText}>{step.text}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 