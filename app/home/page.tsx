"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "@/components/common/SearchBar";
import SearchResults from "@/components/SearchResults";
import styles from "@/styles/HomePage.module.css";
import { Recipe, RecipeResponse } from "@/types";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAccessToken } from '../services/auth';
import axios from 'axios';

const API_BASE_URL = 'https://chefio-beta.vercel.app/api/v1';

const HomePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [executedQuery, setExecutedQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [limit] = useState(12);
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    cookingDuration: null as number | null,
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getAccessToken();
      console.log('Access token:', token);
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'cookingDuration') {
             queryParams.append(key, value.toString());
          } else {
             queryParams.append(key, value.toString());
          }
        }
      });

      const response = await axios.get<RecipeResponse>(
        `${API_BASE_URL}/recipe/get-recipes?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setRecipes(response.data.recipes);
        setTotalPages(Math.ceil(response.data.total / searchParams.limit));
      } else {
        setError(response.data.message || 'Failed to fetch recipes');
      }
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilter = (filters: {
    cookingDuration: number | null;
    sortBy: string;
    order: string;
  }) => {
    setSearchParams(prev => ({
      ...prev,
      cookingDuration: filters.cookingDuration,
      sortBy: filters.sortBy,
      order: filters.order,
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split('-');
    setSearchParams(prev => ({ ...prev, sortBy, order, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleToggleLike = async (recipeId: string) => {
    // Implement like/unlike functionality here
    // You'll need to make an API call to update the like status
  };

  // New handler for category selection
  const handleCategorySelect = (categoryName: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: categoryName,
      page: 1, // Reset page when category changes
    }));
  };

  return (
    <>
      <Head>
        <title>Chefio | Home</title>
        <meta name="description" content="Discover, share, and save your favorite recipes on Chefio." />
      </Head>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.topSection}>
            <div className={styles.filterSection}>
              <h2 className={styles.categoryTitle}>Category</h2>
              <CategoryFilter
                selectedCategory={searchParams.category}
                setSelectedCategory={handleCategorySelect}
              />
            </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onFilter={handleFilter}
              initialFilters={searchParams}
            />
          </div>
          
          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <RecipeGrid 
                recipes={recipes}
                onToggleLike={handleToggleLike}
              />
              
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default HomePage;
