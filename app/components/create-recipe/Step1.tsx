import React, { useState } from 'react';
import styles from '@/styles/CreateRecipe.module.css';

interface Step1Props {
  onNext: () => void;
  onCancel: () => void;
}

export default function Step1({ onNext, onCancel }: Step1Props) {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverPhoto(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
      setErrors(prev => ({ ...prev, coverPhoto: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!coverPhoto) {
      newErrors.coverPhoto = 'Please add a cover photo';
    }
    if (!foodName.trim()) {
      newErrors.foodName = 'Please enter a food name';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      onNext();
    }
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
      {errors.coverPhoto && <div className={styles.errorText}>{errors.coverPhoto}</div>}

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
      <div className={styles.buttonRow}>
        <button className={styles.nextBtn} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
} 