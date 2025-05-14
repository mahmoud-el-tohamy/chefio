import React, { useState } from 'react';

interface RecipeFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    cookingTime: string;
    difficulty: string;
  }) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    difficulty: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
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
        <label htmlFor="cookingTime">Cooking Time</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={formData.cookingTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          <option value="">Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RecipeForm; 