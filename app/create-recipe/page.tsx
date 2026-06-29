"use client";
import React, { useState } from 'react';
import Step1 from '@/components/create-recipe/Step1';
import Step2 from '@/components/create-recipe/Step2';
import SuccessModal from '@/components/create-recipe/SuccessModal';
import { apiClient } from '@/services/apiClient';
import { getAccessToken } from '@/services/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Head from 'next/head';
import styles from '@/styles/CreateRecipe.module.css';

export default function CreateRecipePage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipeData, setRecipeData] = useState({
    foodName: '',
    coverPhoto: null as File | null,
    description: '',
    cookingDuration: 0,
    ingredients: [] as string[],
    steps: [] as string[],
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        alert("You need to be logged in to create a recipe.");
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
      formData.append('categoryId', recipeData.category);
      formData.append('ingredients', JSON.stringify(data.ingredients));
      
      const formattedSteps = data.steps.map(step => ({ step }));
      formData.append('steps', JSON.stringify(formattedSteps));

      const response = await apiClient.post(
        '/recipe/create-recipe',
        formData
      );

      if (response.data.success) {
      setShowSuccess(true);
        setRecipeData({
          foodName: '',
          coverPhoto: null,
          description: '',
          cookingDuration: 0,
          ingredients: [],
          steps: [],
          category: '',
        });
    } else {
        setError(response.data.message || "Failed to create recipe.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while creating the recipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep(step - 1);
  const handleCancel = () => window.location.href = '/home';
  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = '/home';
  };

  const step1InitialData: { foodName: string; recipePicture: string; description: string; cookingDuration: number; category: string } = {
    foodName: recipeData.foodName,
    recipePicture: recipeData.coverPhoto ? URL.createObjectURL(recipeData.coverPhoto) : '',
    description: recipeData.description,
    cookingDuration: recipeData.cookingDuration,
    category: recipeData.category,
  };

  return (
    <>
      <Head>
        <title>Create Recipe - Chefio</title>
      </Head>
      <div className={styles['edit-recipe-container']}>
        <h1 className={styles['edit-recipe-title']}>Create New Recipe</h1>
        {step === 1 && <Step1 onNext={handleStep1Complete} onCancel={handleCancel} initialData={step1InitialData} />}
        {step === 2 && <Step2 onNext={handleStep2Complete} onBack={handleBack} onCancel={handleCancel} initialData={recipeData} />}
        {showSuccess && <SuccessModal onClose={handleSuccessClose} message="Recipe created successfully!" />}
        {loading && <LoadingSpinner message="Creating Recipe..." />}
        {error && <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000}}>{error}</div>}
      </div>
    </>
  );
} 