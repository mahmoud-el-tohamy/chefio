"use client";
import React, { useState } from 'react';
import Step1 from '@/components/create-recipe/Step1';
import Step2 from '@/components/create-recipe/Step2';
import SuccessModal from '@/components/create-recipe/SuccessModal';
import axios from 'axios';
import { getAccessToken } from '@/services/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Category } from '@/types';

export default function CreateRecipePage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipeData, setRecipeData] = useState({
    foodName: '',
    recipePicture: null as File | null,
    description: '',
    cookingDuration: 0,
    ingredients: [] as string[],
    instructions: [] as string[],
    category: { _id: '', name: '' } as unknown as Category,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1Complete = (data: { 
    foodName: string; 
    recipePicture: File | null; 
    description: string; 
    cookingDuration: number; 
    category: Category 
  }) => {
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
      if (recipeData.recipePicture) {
        formData.append('recipePicture', recipeData.recipePicture);
      }
      formData.append('description', recipeData.description);
      formData.append('cookingDuration', recipeData.cookingDuration.toString());
      formData.append('category', recipeData.category._id);
      formData.append('ingredients', JSON.stringify(data.ingredients));
      formData.append('steps', JSON.stringify(data.steps));

      const response = await axios.post(
        'https://chefio-beta.vercel.app/api/v1/recipe/create-recipe',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
      setShowSuccess(true);
        setRecipeData({
          foodName: '',
          recipePicture: null,
          description: '',
          cookingDuration: 0,
          ingredients: [],
          instructions: [],
          category: { _id: '', name: '' },
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

  const step1InitialData: { foodName: string; recipePicture: string; description: string; cookingDuration: number; category: Category } = {
    foodName: recipeData.foodName,
    recipePicture: recipeData.recipePicture ? URL.createObjectURL(recipeData.recipePicture) : '',
    description: recipeData.description,
    cookingDuration: recipeData.cookingDuration,
    category: recipeData.category,
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleStep1Complete} onCancel={handleCancel} initialData={step1InitialData} />}
      {step === 2 && <Step2 onNext={handleStep2Complete} onBack={handleBack} onCancel={handleCancel} initialData={recipeData} />}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
      {loading && <LoadingSpinner message="Creating Recipe..." />}
      {error && <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000}}>{error}</div>}
    </div>
  );
} 