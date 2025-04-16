'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/SearchPage.module.css';
import SearchBar from '@/app/components/common/SearchBar';
import SearchResults from '@/app/components/SearchResults';

export default function SearchPage() {
  return (
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
        <SearchBar />
      </div>
      <SearchResults />
    </div>
  );
} 