"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import styles from "./RecipePage.module.css";
import Link from "next/link";
import { recipeService, Recipe } from "@/services/recipe";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie';

function LikeButton({ initialLiked, initialCount, recipeId }: { initialLiked: boolean; initialCount: number; recipeId: string }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleLikeClick = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState); // Optimistic update
    setCount(newLikedState ? count + 1 : count - 1); // Optimistic update

    try {
      let token = Cookies.get('Authorization');
      if (!token) {
        alert("You need to be logged in to like recipes.");
        setLiked(!newLikedState); // Revert optimistic update
        setCount(newLikedState ? count - 1 : count + 1); // Revert optimistic update
        return; // Stop the function if no token
      }

      // Remove 'Bearer ' prefix if it exists in the cookie value
      if (token.startsWith('Bearer ')) {
        token = token.substring('Bearer '.length);
      }

      const response = await axios.post(
        `https://chefio-beta.vercel.app/api/v1/recipe/likes/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from cookie after removing extra Bearer
          },
        }
      );

      if (response.data.success) {
        // API call successful, state already updated optimistically
        console.log(response.data.message); // Log success message
      } else {
        // API call failed, revert optimistic update and show error
        setLiked(!newLikedState);
        setCount(newLikedState ? count - 1 : count + 1);
        alert("Failed to update like status: " + response.data.message); // Show error message
      }
    } catch (error) {
      // Network error or other exception, revert optimistic update and show error
      setLiked(!newLikedState);
      setCount(newLikedState ? count - 1 : count + 1);
      console.error("Error liking/unliking recipe:", error);
      alert("An error occurred while updating like status."); // Show generic error message
    }
  };

  return (
    <button
      className={styles.likeButton + (liked ? " " + styles.liked : "")}
      onClick={handleLikeClick}
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

function RecipeHeader({ recipe }: { recipe: Recipe }) {
  return (
    <div className={styles.header}>
      <div className={styles.imageWrapper}>
        <Image src={recipe.recipePicture} alt={recipe.foodName} width={300} height={300} className={styles.recipeImage} />
      </div>
      <div className={styles.meta}>
        <div className={styles.authorRow}>
          <Link href={`/profile/${recipe.createdBy.username}`} className={styles.authorProfileLink} aria-label={`View ${recipe.createdBy.username}'s profile`}>
            <Image src={recipe.createdBy.profilePicture} alt={recipe.createdBy.username} width={32} height={32} className={styles.avatar} />
            <span className={styles.authorName}>{recipe.createdBy.username}</span>
          </Link>
          <LikeButton initialLiked={recipe.isLiked} initialCount={recipe.likes} recipeId={recipe._id} />
        </div>
        <div className={styles.categoryRow}>
          <span className={styles.category}>{recipe.category.name}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.duration}>{recipe.cookingDuration} mins</span>
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

function RecipeSteps({ steps }: { steps: string[] }) {
  return (
    <div className={styles.stepsBox}>
      <h2 className={styles.sectionTitle}>Steps</h2>
      <ol className={styles.stepsList}>
        {steps.map((step, i) => (
          <li key={i} className={styles.stepItem}>
            <div className={styles.stepNumber}>{i + 1}</div>
            <div className={styles.stepContent}>
              <div className={styles.stepText}>{step}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getRecipe(params.id as string);
        setRecipe(response.recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loading}>Loading recipe...</div>
        </main>
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.error}>{error || 'Recipe not found'}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.gridLayout}>
          <div className={styles.stickyColumn}>
            <div className={styles.sidebarTitle}>{recipe.foodName}</div>
            <div className={styles.coverImageWrapper}>
              <Image src={recipe.recipePicture} alt={recipe.foodName} width={250} height={250} className={styles.coverImage} />
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.authorLikeRow}>
                <Link href={`/profile/${recipe.createdBy.username}`} className={styles.authorProfileLink} aria-label={`View ${recipe.createdBy.username}'s profile`}>
                  <Image src={recipe.createdBy.profilePicture} alt={recipe.createdBy.username} width={40} height={40} className={styles.avatar} />
                  <span className={styles.authorName}>{recipe.createdBy.username}</span>
                </Link>
                <LikeButton initialLiked={recipe.isLiked} initialCount={recipe.likes} recipeId={recipe._id} />
              </div>
              <div className={styles.descriptionBox + ' ' + styles.hideOnTablet}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <div className={styles.metaRow}>
                  <span className={styles.category}>{recipe.category.name}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.duration}>{recipe.cookingDuration} mins</span>
                </div>
                <div className={styles.descriptionText}>{recipe.description}</div>
              </div>
            </div>
          </div>
          <div className={styles.scrollColumn}>
            <div className={styles.descriptionBox + ' ' + styles.showOnTablet}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <div className={styles.metaRow}>
                <span className={styles.category}>{recipe.category.name}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.duration}>{recipe.cookingDuration} mins</span>
              </div>
              <div className={styles.descriptionText}>{recipe.description}</div>
            </div>
            <RecipeIngredients ingredients={recipe.ingredients} />
            <RecipeSteps steps={recipe.steps} />
          </div>
        </div>
      </main>
    </>
  );
} 