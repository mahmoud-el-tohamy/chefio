"use client";

import React from "react";
import styles from "@/styles/FilterModal.module.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

interface FilterValues {
  category: string;
  duration: number;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [category, setCategory] = React.useState("All");
  const [duration, setDuration] = React.useState(30);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add a Filter</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category</h3>
            <div className={styles.categoryButtons}>
              {["All", "Food", "Drink"].map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryButton} ${
                    category === cat ? styles.active : ""
                  }`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Cooking Duration <span className={styles.minutes}>(in minutes)</span>
            </h3>
            <div className={styles.durationSlider}>
              <div className={styles.durationLabels}>
                <span>&lt;10</span>
                <span>30</span>
                <span>&gt;60</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.doneButton}
            onClick={() => {
              onApply({ category, duration });
              onClose();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 