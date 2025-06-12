"use client";
import React, { useState, useEffect } from 'react';
import Step1 from '@/components/create-recipe/Step1';
import Step2 from '@/components/create-recipe/Step2';
import SuccessModal from '@/components/create-recipe/SuccessModal';
import axios from 'axios';
import { getAccessToken } from '@/services/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useParams, useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipe';
import Head from 'next/head';
import styles from '@/styles/CreateRecipe.module.css';

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipeData, setRecipeData] = useState({
    foodName: '',
    coverPhoto: null as File | null,
    existingCoverPhoto: '',
    description: '',
    cookingDuration: 0,
    ingredients: [] as string[],
    steps: [] as string[],
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getRecipe(params.id as string);
        if (!response.recipe) {
          setError('Recipe not found');
          return;
        }

        setRecipeData({
          foodName: response.recipe.foodName,
          coverPhoto: null,
          existingCoverPhoto: response.recipe.recipePicture,
          description: response.recipe.description,
          cookingDuration: response.recipe.cookingDuration,
          ingredients: response.recipe.ingredients,
          steps: response.recipe.steps,
          category: response.recipe.category._id,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const handleStep1Complete = (data: { foodName: string; coverPhoto: File | null; description: string; cookingDuration: number; category: string }) => {
    setRecipeData(prev => ({
      ...prev,
      ...data,
    }));
    setStep(2);
  };

  const handleStep2Complete = async (data: { ingredients: string[]; steps: string[] }) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      if (!token) {
        alert("You need to be logged in to edit a recipe.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('foodName', recipeData.foodName);
      if (recipeData.coverPhoto) {
        formData.append('recipePicture', recipeData.coverPhoto);
      }
      formData.append('description', recipeData.description);
      formData.append('cookingDuration', recipeData.cookingDuration.toString());
      formData.append('category', recipeData.category);
      formData.append('ingredients', JSON.stringify(data.ingredients));
      formData.append('steps', JSON.stringify(data.steps));

      const response = await axios.patch(
        `https://chefio-beta.vercel.app/api/v1/recipe/update-recipe/${params.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
      } else {
        setError(response.data.message || "Failed to update recipe.");
      }
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      setError(err.response?.data?.message || err.message || "An error occurred while updating the recipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep(step - 1);
  const handleCancel = () => router.push(`/recipes/${params.id}`);
  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(`/recipes/${params.id}`);
  };

  if (loading && !recipeData.foodName) {
    return <LoadingSpinner message="Loading recipe..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push(`/recipes/${params.id}`)}>Go Back</button>
      </div>
    );
  }

  const step1InitialData = {
    foodName: recipeData.foodName,
    recipePicture: recipeData.coverPhoto ? URL.createObjectURL(recipeData.coverPhoto) : recipeData.existingCoverPhoto,
    description: recipeData.description,
    cookingDuration: recipeData.cookingDuration,
    category: recipeData.category,
  };

  return (
    <>
      <Head>
        <title>Edit Recipe - Chefio</title>
      </Head>
      <div className={styles['edit-recipe-container']}>
        <h1 className={styles['edit-recipe-title']}>Edit Recipe</h1>
        {step === 1 && <Step1 onNext={handleStep1Complete} onCancel={handleCancel} initialData={step1InitialData} />}
        {step === 2 && <Step2 onNext={handleStep2Complete} onBack={handleBack} onCancel={handleCancel} initialData={recipeData} />}
        {showSuccess && <SuccessModal onClose={handleSuccessClose} message="Recipe updated successfully!" />}
        {loading && <LoadingSpinner message="Updating Recipe..." />}
        {error && <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000}}>{error}</div>}
      </div>
    </>
  );
} 