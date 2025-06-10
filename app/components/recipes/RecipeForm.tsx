import React, { useState } from 'react';
import { Recipe } from '@/types';

interface Category {
  _id: string;
  name: string;
}

interface RecipeFormProps {
  onSubmit: (data: {
    foodName: string;
    description: string;
    cookingDuration: number;
    category: Category;
    ingredients: string[];
    instructions: string[];
  }) => void;
}

const CATEGORIES: Category[] = [
  { _id: "1", name: "Breakfast" },
  { _id: "2", name: "Lunch" },
  { _id: "3", name: "Dinner" },
  { _id: "4", name: "Dessert" }
];

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    cookingDuration: 0,
    category: { _id: '', name: '' } as Category,
    ingredients: [] as string[],
    instructions: [] as string[]
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
          value={formData.category._id}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {CATEGORIES.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RecipeForm; 