"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import styles from "./RecipePage.module.css";
import Link from "next/link";
import { recipeService, Recipe } from "@/services/recipe";
import { useParams, useRouter } from "next/navigation";
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

function DeleteButton({ recipeId, isOwner }: { recipeId: string; isOwner: boolean }) {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('DeleteButton rendered:', { recipeId, isOwner }); // Debug log

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      let token = Cookies.get('Authorization');
      if (!token) {
        alert("You need to be logged in to delete recipes.");
        return;
      }

      if (token.startsWith('Bearer ')) {
        token = token.substring('Bearer '.length);
      }

      const response = await axios.delete(
        `https://chefio-beta.vercel.app/api/v1/recipe/delete-recipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        router.push('/home');
      } else {
        alert("Failed to delete recipe: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("An error occurred while deleting the recipe.");
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  // Always render the button, but control its visibility with CSS
  return (
    <>
      <button
        className={`${styles.deleteButton} ${!isOwner ? styles.hidden : ''}`}
        onClick={() => setShowConfirmDialog(true)}
        aria-label="Delete recipe"
        type="button"
      >
        <span className={styles.trashIcon}></span>
      </button>

      {showConfirmDialog && (
        <div className={styles.confirmationDialogOverlay}>
          <div className={styles.confirmationDialog}>
            <p>Are you sure you want to delete this recipe?</p>
            <div className={styles.dialogButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RecipeHeader({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const handleProfileClick = async (e: React.MouseEvent) => {
    console.log('Profile click handler triggered');
    e.preventDefault();
    e.stopPropagation();
    
    if (!recipe || !recipe.createdBy || !recipe.createdBy._id) {
      console.error('Recipe or creator data is missing:', recipe);
      return;
    }

    const creatorId = recipe.createdBy._id;
    console.log('Using creator ID:', creatorId);
    
    try {
      let token = Cookies.get('Authorization');
      if (!token) {
        console.error('No authorization token found');
        return;
      }

      // Remove 'Bearer ' prefix if it exists
      if (token.startsWith('Bearer ')) {
        token = token.substring(7);
      }

      console.log('Fetching profile for ID:', creatorId);
      const response = await axios.get(
        `https://chefio-beta.vercel.app/api/v1/user/get-profile/${creatorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Profile response:', response.data);
      if (response.data && response.data.profile) {
        const profileId = response.data.profile._id;
        console.log('Profile ID:', profileId);
        const profileUrl = `/profile/${profileId}`;
        console.log('Navigating to:', profileUrl);
        router.push(profileUrl);
      }
    } catch (error) {
      console.error('Error in handleProfileClick:', error);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.imageWrapper}>
        <Image src={recipe.recipePicture} alt={recipe.foodName} width={300} height={300} className={styles.recipeImage} />
      </div>
      <div className={styles.meta}>
        <div className={styles.authorRow}>
          <div 
            className={styles.authorProfileLink} 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Image 
              src={recipe.createdBy.profilePicture} 
              alt={recipe.createdBy.username} 
              width={32} 
              height={32} 
              className={styles.avatar} 
              onClick={handleProfileClick}
            />
            <span 
              className={styles.authorName} 
              onClick={handleProfileClick}
              style={{ 
                cursor: 'pointer', 
                color: '#007bff', 
                textDecoration: 'underline',
                userSelect: 'none'
              }}
            >
              {recipe.createdBy.username}
            </span>
          </div>
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
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('Fetching recipe with ID:', params.id);
        const response = await recipeService.getRecipe(params.id as string);
        console.log('Recipe response:', response);
        if (!response.recipe) {
          setError('Recipe not found');
          return;
        }
        setRecipe(response.recipe);
        console.log('Recipe data set:', response.recipe);
        
        // Get the token and decode it to get user ID
        const token = Cookies.get('Authorization');
        if (token) {
          try {
            // Remove 'Bearer ' prefix if it exists
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            
            // Decode the JWT token (it's in format: header.payload.signature)
            const payload = JSON.parse(atob(cleanToken.split('.')[1]));
            console.log('Full token payload:', payload);
            
            // The user ID might be in different fields, let's check all possibilities
            const currentUserId = payload.id || payload._id || payload.userId || payload.user_id;
            console.log('Current User ID from token:', currentUserId);
            console.log('Recipe Creator ID:', response.recipe.createdBy._id);
            console.log('Are they equal?', currentUserId === response.recipe.createdBy._id);
            
            // Check if the current user is the creator
            const isRecipeOwner = currentUserId === response.recipe.createdBy._id;
            console.log('Is Recipe Owner:', isRecipeOwner);
            
            setIsOwner(isRecipeOwner);
          } catch (err) {
            console.error('Error decoding token:', err);
            console.error('Token value:', token);
            setIsOwner(false);
          }
        } else {
          console.log('No token found');
          setIsOwner(false);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Recipe not found');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    } else {
      setError('Invalid recipe ID');
      setLoading(false);
    }
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
          <div className={styles.error}>
            <h2>Oops!</h2>
            <p>{error || 'Recipe not found'}</p>
            <Link href="/home" className={styles.backButton}>
              Back to Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Handler for sidebar author link
  const handleSidebarProfileClick = async (e: React.MouseEvent) => {
    console.log('Sidebar profile click handler triggered');
    e.preventDefault();
    e.stopPropagation();
    
    if (!recipe || !recipe.createdBy || !recipe.createdBy._id) {
      console.error('Recipe or creator data is missing:', recipe);
      return;
    }

    const creatorId = recipe.createdBy._id;
    console.log('Using creator ID:', creatorId);
    
    try {
      let token = Cookies.get('Authorization');
      if (!token) {
        console.error('No authorization token found');
        return;
      }

      // Remove 'Bearer ' prefix if it exists
      if (token.startsWith('Bearer ')) {
        token = token.substring(7);
      }

      console.log('Fetching profile for ID:', creatorId);
      const response = await axios.get(
        `https://chefio-beta.vercel.app/api/v1/user/get-profile/${creatorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Profile response:', response.data);
      if (response.data && response.data.profile) {
        const profileId = response.data.profile._id;
        console.log('Profile ID:', profileId);
        const profileUrl = `/profile/${profileId}`;
        console.log('Navigating to:', profileUrl);
        router.push(profileUrl);
      } else {
        console.error('Profile data not found in response:', response.data);
      }
    } catch (error) {
      console.error('Error in handleSidebarProfileClick:', error);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.gridLayout}>
          <div className={styles.stickyColumn}>
            <div className={styles.sidebarTitle}>
              {recipe.foodName}
              <DeleteButton recipeId={recipe._id} isOwner={isOwner} />
            </div>
            <div className={styles.coverImageWrapper}>
              <Image src={recipe.recipePicture} alt={recipe.foodName} width={250} height={250} className={styles.coverImage} />
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.authorLikeRow}>
                <div 
                  className={styles.authorProfileLink} 
                  onClick={handleSidebarProfileClick}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Image 
                    src={recipe.createdBy.profilePicture} 
                    alt={recipe.createdBy.username} 
                    width={40} 
                    height={40} 
                    className={styles.avatar}
                    onClick={handleSidebarProfileClick}
                  />
                  <span 
                    className={styles.authorName} 
                    onClick={handleSidebarProfileClick}
                    style={{ 
                      cursor: 'pointer', 
                      color: '#007bff', 
                      textDecoration: 'underline',
                      userSelect: 'none'
                    }}
                  >
                    {recipe.createdBy.username}
                  </span>
                </div>
                <div className={styles.actionButtons}>
                  <LikeButton initialLiked={recipe.isLiked} initialCount={recipe.likes} recipeId={recipe._id} />
                  <DeleteButton recipeId={recipe._id} isOwner={isOwner} />
                </div>
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