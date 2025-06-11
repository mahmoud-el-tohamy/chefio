import React, { useState } from 'react';
import styles from '@/styles/CreateRecipe.module.css';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Step2Props {
  onNext: (data: { ingredients: string[]; steps: string[] }) => void;
  onBack: () => void;
  onCancel: () => void;
  initialData: { ingredients: string[]; steps: string[] };
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function Step2({ onNext, onBack, onCancel, initialData }: Step2Props) {
  const [ingredients, setIngredients] = useState(initialData.ingredients.length > 0 ? initialData.ingredients : ['', '', '']);
  const [steps, setSteps] = useState(initialData.steps.length > 0 ? initialData.steps : ['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleIngredientChange = (idx: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[idx] = value;
    setIngredients(newIngredients);
    setErrors(prev => ({ ...prev, ingredients: '' }));
  };
  const handleAddIngredient = () => setIngredients([...ingredients, '']);

  const handleStepChange = (idx: number, value: string) => {
    const newSteps = [...steps];
    newSteps[idx] = value;
    setSteps(newSteps);
    setErrors(prev => ({ ...prev, steps: '' }));
  };
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'ingredient') {
      setIngredients(reorder(ingredients, result.source.index, result.destination.index));
    } else if (result.type === 'step') {
      setSteps(reorder(steps, result.source.index, result.destination.index));
    }
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    const hasValidIngredient = ingredients.some(ing => ing.trim() !== '');
    if (!hasValidIngredient) {
      newErrors.ingredients = 'Please add at least one ingredient';
    }

    const hasValidStep = steps.some(step => step.trim() !== '');
    if (!hasValidStep) {
      newErrors.steps = 'Please add at least one step';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validateStep2()) {
      onNext({
        ingredients: ingredients.filter(ing => ing.trim() !== ''),
        steps: steps.filter(step => step.trim() !== ''),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.stepContainer}>
        <div className={styles.headerRow}>
          <span className={styles.stepTitle}>Upload Your Post <span className={styles.stepCount}>2/2</span></span>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
        <div className={styles.ingredientSection}>
          <div className={styles.ingredientHeaderRow}>
            <span className={styles.inputLabel}>Ingredients</span>
          </div>
          <Droppable droppableId="ingredients" type="ingredient">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {ingredients.map((ingredient, idx) => (
                  <Draggable key={idx} draggableId={`ingredient-${idx}`} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        className={styles.ingredientRow}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <span className={styles.dragIcon} {...provided.dragHandleProps}>⋮⋮</span>
                        <input
                          className={`${styles.input} ${errors.ingredients ? styles.inputError : ''}`}
                          type="text"
                          placeholder="Enter ingredient"
                          value={ingredient}
                          onChange={e => handleIngredientChange(idx, e.target.value)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {errors.ingredients && <div className={styles.errorText}>{errors.ingredients}</div>}
          <button className={styles.addIngredientBtn} onClick={handleAddIngredient}>+ Ingredient</button>
        </div>
        <div className={styles.stepsSection}>
          <span className={styles.inputLabel}>Steps</span>
          <Droppable droppableId="steps" type="step">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {steps.map((step, idx) => (
                  <Draggable key={idx} draggableId={`step-${idx}`} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        className={styles.stepRow}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <span className={styles.stepNumber}>{idx + 1}</span>
                        <span className={styles.dragIcon} {...provided.dragHandleProps}>⋮⋮</span>
                        <textarea
                          className={`${styles.textarea} ${errors.steps ? styles.inputError : ''}`}
                          placeholder="Tell a little about your food"
                          value={step}
                          onChange={e => handleStepChange(idx, e.target.value)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {errors.steps && <div className={styles.errorText}>{errors.steps}</div>}
          <button className={styles.addStepBtn} onClick={handleAddStep}>+ Step</button>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.backBtn} onClick={onBack}>Back</button>
          <button className={styles.nextBtn} onClick={handleNextClick}>Next</button>
        </div>
      </div>
    </DragDropContext>
  );
} 