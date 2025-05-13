"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import CategoryFilter from "@/components/recipe/CategoryFilter";
import SearchBar from "@/components/common/SearchBar";
import SearchResults from "@/components/SearchResults";
import { mockRecipes } from "@/data/mockRecipes";
import styles from "@/styles/HomePage.module.css";

interface Recipe {
  id: string;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  duration: string;
  isLiked?: boolean;
}

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [executedQuery, setExecutedQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());

  const filteredByCategory = mockRecipes.map(recipe => ({
    ...recipe,
    isLiked: likedRecipes.has(recipe.id)
  })).filter((recipe) => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesDuration = parseInt(recipe.duration.replace(/[^0-9]/g, "")) <= durationFilter;
    return matchesCategory && matchesDuration;
  });

  const handleSearch = (query: string) => {
    // Prevent empty searches
    if (!query.trim()) {
      return;
    }

    setShowResults(true);
    setExecutedQuery(query);
    const results = mockRecipes.map(recipe => ({
      ...recipe,
      isLiked: likedRecipes.has(recipe.id)
    })).filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                          recipe.author.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
      const matchesDuration = parseInt(recipe.duration.replace(/[^0-9]/g, "")) <= durationFilter;
      return matchesSearch && matchesCategory && matchesDuration;
    });
    setSearchResults(results);
  };

  const handleFilter = (filters: { category: string; duration: number }) => {
    setSelectedCategory(filters.category);
    setDurationFilter(filters.duration);
  };

  const handleToggleLike = (recipeId: string) => {
    setLikedRecipes(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(recipeId)) {
        newLiked.delete(recipeId);
      } else {
        newLiked.add(recipeId);
      }
      return newLiked;
    });

    // Update search results if they're being shown
    if (showResults) {
      setSearchResults(prev => 
        prev.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, isLiked: !recipe.isLiked }
            : recipe
        )
      );
    }
  };

  const clearSearch = () => {
    setShowResults(false);
    setSearchQuery("");
    setExecutedQuery("");
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.topSection}>
          <div className={styles.filterSection}>
            <h2 className={styles.categoryTitle}>Category</h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </div>
        {!showResults ? (
          <RecipeGrid 
            recipes={filteredByCategory}
            onToggleLike={handleToggleLike}
          />
        ) : (
          <SearchResults
            query={executedQuery}
            results={searchResults.filter(recipe => 
              selectedCategory === "All" || recipe.category === selectedCategory
            )}
            isVisible={true}
            onToggleLike={handleToggleLike}
            onClearSearch={clearSearch}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
