import React, { useState, useEffect } from 'react';
import styles from '@/styles/CreateRecipe.module.css';
import axios from 'axios';
import { getAccessToken } from '@/services/auth';

interface Step1Props {
  onNext: (data: { foodName: string; coverPhoto: File | null; description: string; cookingDuration: number; category: string }) => void;
  onCancel: () => void;
  initialData: { foodName: string; recipePicture: string; description: string; cookingDuration: number; category: string; ingredients?: string[]; steps?: string[] };
}

interface Category {
  _id: string;
  name: string;
}

export default function Step1({ onNext, onCancel, initialData }: Step1Props) {
  const [foodName, setFoodName] = useState(initialData.foodName);
  const [description, setDescription] = useState(initialData.description);
  const [duration, setDuration] = useState(initialData.cookingDuration);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData.recipePicture || null);
  const [category, setCategory] = useState(initialData.category);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        const response = await axios.get(
          'https://chefio-beta.vercel.app/api/v1/recipe/get-categories',
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );

        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          setError(response.data.message || "Failed to fetch categories.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData.recipePicture && !coverPhoto) {
      setCoverPreview(initialData.recipePicture);
    }
  }, [initialData.recipePicture, coverPhoto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhoto(file);
      setCoverPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, recipePicture: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!foodName.trim()) {
      newErrors.foodName = 'Please enter a food name';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    if (!category.trim()) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validateStep1()) {
      onNext({
        foodName,
        coverPhoto: coverPhoto,
        description,
        cookingDuration: duration,
        category,
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setErrors(prev => ({ ...prev, category: '' }));
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headerRow}>
        <span className={styles.stepTitle}>Upload Your Post <span className={styles.stepCount}>1/2</span></span>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
      
      <label className={styles.coverPhotoBox} htmlFor="cover-photo-input">
        {coverPreview ? (
          <img src={coverPreview} alt="Cover Preview" className={styles.coverPreview} />
        ) : (
          <div className={styles.coverPhotoPlaceholder}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 40L36.5858 32.5858C36.2107 32.2107 35.702 32 35.1716 32H28.8284C28.298 32 27.7893 32.2107 27.4142 32.5858L20 40" stroke="var(--outline-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="32" cy="28" r="4" stroke="var(--outline-color)" strokeWidth="2"/>
            </svg>
            <div className={styles.coverPhotoText}>Add Cover Photo</div>
            <div className={styles.coverPhotoSubText}>(up to 12 Mb)</div>
          </div>
        )}
        <input
          id="cover-photo-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </label>
      {errors.recipePicture && <div className={styles.errorText}>{errors.recipePicture}</div>}

      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label className={styles.inputLabel}>Food Name</label>
          <input
            className={`${styles.input} ${errors.foodName ? styles.inputError : ''}`}
            type="text"
            placeholder="Enter food name"
            value={foodName}
            onChange={e => {
              setFoodName(e.target.value);
              setErrors(prev => ({ ...prev, foodName: '' }));
            }}
          />
          {errors.foodName && <div className={styles.errorText}>{errors.foodName}</div>}
        </div>
        <div className={styles.formCol}>
          <label className={styles.inputLabel}>Description</label>
          <textarea
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            placeholder="Tell a little about your food"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: '' }));
            }}
          />
          {errors.description && <div className={styles.errorText}>{errors.description}</div>}
        </div>
      </div>
      
      <div className={styles.durationRow}>
        <label className={styles.inputLabel}>Cooking Duration (in minutes)</label>
        <div className={styles.durationSliderRow}>
          <span className={styles.durationLabel}>&lt;10</span>
          <input
            type="range"
            min={1}
            max={60}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className={styles.durationSlider}
          />
          <span className={styles.durationValue}>{duration}</span>
          <span className={styles.durationLabel}>&gt;60</span>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label className={styles.inputLabel}>Category</label>
          <select
            className={`${styles.input} ${errors.category ? styles.inputError : ''}`}
            value={category}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <div className={styles.errorText}>{errors.category}</div>}
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.nextBtn} onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
} 