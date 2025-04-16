"use client";

import React from "react";
import styles from "@/styles/CategoryFilter.module.css";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["All", "Food", "Drink"];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryFilter}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.categoryButton} ${
            selectedCategory === category ? styles.active : ""
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter; 