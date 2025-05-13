'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/SearchPage.module.css';
import SearchBar from '@/components/common/SearchBar';
import SearchResults from '@/components/SearchResults';
import Head from "next/head";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
    // TODO: Implement actual search logic
  };
  
  const handleFilter = (filters: unknown) => {
    // TODO: Implement filter logic
    console.log('Filters:', filters);
  };
  
  const handleToggleLike = (id: string) => {
    // TODO: Implement like toggle logic
    console.log('Toggle like for recipe:', id);
  };
  const handleClearSearch = () => { setShowResults(false); setSearchResults([]); setSearchQuery(''); };

  useEffect(() => {
    setLoading(true);
    setHasError(false);
    // Simulate loading and error (for demo, always succeeds after 1s)
    const timer = setTimeout(() => {
      // setHasError(true); // Uncomment to simulate error
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading search...</div>
    );
  }

  if (hasError) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>
        Failed to load search. Please try again later.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chefio | Search</title>
        <meta name="description" content="Search for recipes on Chefio." />
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/home" className={styles.backButton}>
            <Image
              src="/icons/arrow-left.svg"
              alt="Back"
              width={24}
              height={24}
            />
            <span>All Recipes</span>
          </Link>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </div>
        <SearchResults
          results={searchResults}
          isVisible={showResults}
          onToggleLike={handleToggleLike}
          onClearSearch={handleClearSearch}
        />
      </div>
    </>
  );
} 