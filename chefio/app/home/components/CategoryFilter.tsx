"use client";
import React from "react";
import "../../styles/home/CategoryFilter.css";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  const categories = ["All", "Food", "Drink"];

  return (
    <div className="category-filter">
      <span className="category-filter__label">Category</span>
      <div className="category-filter__buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
