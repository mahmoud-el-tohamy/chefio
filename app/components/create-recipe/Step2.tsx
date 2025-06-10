import React, { useState } from 'react';
import styles from '@/styles/CreateRecipe.module.css';

interface Step2Props {
  onNext: (data: { ingredients: string[]; instructions: string[] }) => void;
  onBack: () => void;
  initialData?: {
    ingredients?: string[];
    instructions?: string[];
  };
}

const Step2: React.FC<Step2Props> = ({ onNext, onBack, initialData }) => {
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || ['']);
  const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || ['']);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients.length ? newIngredients : ['']);
  };

  const removeInstruction = (index: number) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions.length ? newInstructions : ['']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      ingredients: ingredients.filter(ing => ing.trim() !== ''),
      instructions: instructions.filter(inst => inst.trim() !== '')
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Ingredients</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.inputGroup}>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1}`}
              required
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredient} className={styles.addButton}>
          Add Ingredient
        </button>
      </div>

      <div className={styles.formGroup}>
        <label>Instructions</label>
        {instructions.map((instruction, index) => (
          <div key={index} className={styles.inputGroup}>
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              required
            />
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addInstruction} className={styles.addButton}>
          Add Step
        </button>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button type="submit" className={styles.submitButton}>
          Create Recipe
        </button>
      </div>
    </form>
  );
};

export default Step2; 