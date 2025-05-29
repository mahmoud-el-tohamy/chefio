"use client";

import React, { useState } from "react";
import Image from "next/image";
import FilterModal from "./FilterModal";
import styles from "@/styles/SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: {
    cookingDuration: number | null;
    sortBy: string;
    order: string;
  }) => void;
  initialFilters: {
    search: string;
    category: string;
    cookingDuration: number | null;
    sortBy: string;
    order: string;
    page: number;
    limit: number;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, onFilter, initialFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.searchContainer}>
        <button 
          type="submit"
          className={styles.searchButton}
          aria-label="Search"
        >
          <Image
            src="/icons/search.svg"
            alt=""
            width={20}
            height={20}
            className={styles.searchIcon}
          />
        </button>
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.searchInput}
        />
        <button 
          type="button"
          className={styles.filterButton}
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open filters"
        >
          <Image
            src="/icons/filter.svg"
            alt="Filter"
            width={20}
            height={20}
          />
        </button>
      </form>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={onFilter}
        initialFilters={initialFilters}
      />
    </>
  );
};

export default SearchBar; 