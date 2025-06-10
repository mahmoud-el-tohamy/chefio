import React, { useState } from 'react';
import { Recipe } from '@/types';

interface RecipeFormProps {
  onSubmit: (data: {
    foodName: string;
    description: string;
    cookingDuration: number;
    category: string;
    ingredients: string[];
    instructions: string[];
  }) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    cookingDuration: 0,
    category: '',
    ingredients: [] as string[],
    instructions: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cookingDuration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="cookingDuration">Cooking Duration (minutes)</label>
        <input
          type="number"
          id="cookingDuration"
          name="cookingDuration"
          value={formData.cookingDuration}
          onChange={handleChange}
          required
          min={1}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RecipeForm; 