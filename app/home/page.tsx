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
import Pagination from "./components/Pagination";
import Cookies from "js-cookie";

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
  const [limit, setLimit] = useState(8);
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    cookingDuration: null as number | null,
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: limit
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
        console.log('API total:', response.data.totalRecipes, 'Limit:', searchParams.limit);
        setTotalPages(Math.ceil(response.data.totalRecipes / searchParams.limit));
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
    setIsLoading(true);
    setSearchParams(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilter = (filters: {
    cookingDuration: number | null;
    sortBy: string;
    order: string;
  }) => {
    setIsLoading(true);
    setSearchParams(prev => ({
      ...prev,
      cookingDuration: filters.cookingDuration,
      sortBy: filters.sortBy,
      order: filters.order,
    }));
  };

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    const [sortBy, order] = value.split('-');
    setSearchParams(prev => ({ ...prev, sortBy, order, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setSearchParams(prev => ({ ...prev, page }));
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setIsLoading(true);
    setLimit(newLimit);
    setSearchParams(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleToggleLike = async (recipeId: string) => {
    try {
      let token = Cookies.get('Authorization');
      if (!token) {
        alert("You need to be logged in to like recipes.");
        return;
      }

      if (token.startsWith('Bearer ')) {
        token = token.substring('Bearer '.length);
      }

      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, isLiked: !recipe.isLiked, likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes + 1 }
            : recipe
        )
      );

      const response = await axios.post(
        `${API_BASE_URL}/recipe/likes/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === recipeId
              ? { ...recipe, isLiked: !recipe.isLiked, likes: recipe.isLiked ? recipe.likes + 1 : recipe.likes - 1 }
              : recipe
          )
        );
        alert("Failed to update like status: " + response.data.message);
      }
    } catch (err: any) {
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe => {
          const foundRecipe = prevRecipes.find(r => r._id === recipeId);
          if (foundRecipe && recipe._id === recipeId) {
            return { ...recipe, isLiked: !foundRecipe.isLiked, likes: foundRecipe.isLiked ? foundRecipe.likes + 1 : foundRecipe.likes - 1 };
          }
          return recipe;
        })
      );
      console.error("Error toggling like status:", err);
      alert("An error occurred while updating like status.");
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setIsLoading(true);
    setSearchParams(prev => ({
      ...prev,
      category: categoryName,
      page: 1,
    }));
  };

  console.log('Total Pages:', totalPages, 'Current Page:', currentPage);

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
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onFilter={handleFilter}
              initialFilters={searchParams}
            />
            <div className={styles.filterSection}>
              <CategoryFilter
                selectedCategory={searchParams.category}
                setSelectedCategory={handleCategorySelect}
              />
            </div>
          </div>
          
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <RecipeGrid 
                recipes={recipes}
                onToggleLike={handleToggleLike}
              />
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                limit={limit}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default HomePage;
