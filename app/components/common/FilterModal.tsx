"use client";

import React, { useState } from "react";
import styles from "@/styles/FilterModal.module.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters: {
    category: string;
    cookingDuration: number | null;
    sortBy: string;
    order: string;
    page: number;
    limit: number;
  };
}

interface FilterValues {
  cookingDuration: number | null;
  sortBy: string;
  order: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [duration, setDuration] = React.useState(initialFilters.cookingDuration ?? 30);
  const [sortBy, setSortBy] = React.useState(initialFilters.sortBy);
  const [order, setOrder] = React.useState(initialFilters.order);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add a Filter</h2>
        </div>

        <div className={styles.content}>
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
                value={duration ?? 30}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.input}
            >
              <option value="createdAt">Created At</option>
              <option value="likes">Likes</option>
            </select>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Order</h3>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className={styles.input}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
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
              onApply({ cookingDuration: duration, sortBy, order });
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