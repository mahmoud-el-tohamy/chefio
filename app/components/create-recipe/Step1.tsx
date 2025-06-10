import React, { useState, useEffect } from 'react';
import styles from '@/styles/CreateRecipe.module.css';
import axios from 'axios';
import { getAccessToken } from '@/services/auth';
import { Category } from '@/types';

interface Step1Props {
  onNext: (data: { 
    foodName: string; 
    recipePicture: File | null; 
    description: string; 
    cookingDuration: number; 
    category: Category 
  }) => void;
  onCancel: () => void;
  initialData: { 
    foodName: string; 
    recipePicture: string; 
    description: string; 
    cookingDuration: number; 
    category: Category;
    ingredients?: string[]; 
    instructions?: string[] 
  };
}

const CATEGORIES: Category[] = [
  { _id: "1", name: "Breakfast" },
  { _id: "2", name: "Lunch" },
  { _id: "3", name: "Dinner" },
  { _id: "4", name: "Dessert" }
];

const Step1: React.FC<Step1Props> = ({ onNext, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    foodName: initialData.foodName || '',
    recipePicture: null as File | null,
    description: initialData.description || '',
    cookingDuration: initialData.cookingDuration || 0,
    category: initialData.category || { _id: '', name: '' }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const selectedCategory = CATEGORIES.find(cat => cat._id === value);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          category: selectedCategory
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'cookingDuration' ? parseInt(value) : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        recipePicture: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="foodName">Recipe Name</label>
        <input
          type="text"
          id="foodName"
          name="foodName"
          value={formData.foodName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="recipePicture">Cover Photo</label>
        <input
          type="file"
          id="recipePicture"
          name="recipePicture"
          accept="image/*"
          onChange={handleImageChange}
          required={!initialData.recipePicture}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cookingDuration">Cooking Duration (minutes)</label>
        <input
          type="number"
          id="cookingDuration"
          name="cookingDuration"
          value={formData.cookingDuration}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category._id}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.nextButton}>
          Next
        </button>
      </div>
    </form>
  );
};

export default Step1; 