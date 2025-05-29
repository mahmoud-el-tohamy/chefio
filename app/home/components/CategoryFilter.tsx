"use client";
import React, { useState, useEffect } from "react";
import "../../styles/home/CategoryFilter.css";
import { CATEGORIES } from "@/constants";
import axios from 'axios';
import { getAccessToken } from '@/services/auth';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (categoryName: string) => void;
}

interface Category {
  _id: string;
  name: string;
}

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        // No token check here as categories might be public
        
        const response = await axios.get(
          'https://chefio-beta.vercel.app/api/v1/recipe/get-categories',
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );

        if (response.data.success) {
          // Add an "All" category option at the beginning
          setCategories([{ _id: 'all', name: 'All' }, ...response.data.categories]);
        } else {
          setError(response.data.message || "Failed to fetch categories.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run only once on mount

  // const categories = CATEGORIES; // Remove static categories

  if (loading) {
    return <div className="category-filter">Loading Categories...</div>;
  }

  if (error) {
    return <div className="category-filter">Error: {error}</div>;
  }

  return (
    <div className="category-filter">
      <span className="category-filter__label">Category</span>
      <div className="category-filter__buttons">
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`category-btn ${selectedCategory === (cat._id === 'all' ? '' : cat.name) ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat._id === 'all' ? '' : cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
