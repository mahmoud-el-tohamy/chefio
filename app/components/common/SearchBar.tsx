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
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z" fill="#9FA5C0"/>
          </svg>
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