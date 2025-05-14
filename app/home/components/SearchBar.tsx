"use client";
import React from "react";
import "../../styles/home/SearchBar.css";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="search-bar">
      {/* Search icon (SVG) */}
      <span className="search-bar__icon">
        <svg width="20" height="20" fill="currentColor">
          <path d="M19.03 17.61l-3.79-3.79A7.91 7.91 0 0016 8a8 8 0 10-8 8 7.91 7.91 0 005.82-2.76l3.79 3.79a1 1 0 001.42-1.42zM8 14a6 6 0 116-6 6 6 0 01-6 6z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Three dots icon (options) */}
      <button className="search-bar__more-btn">
        <svg width="20" height="20" fill="currentColor">
          <circle cx="5" cy="10" r="2" />
          <circle cx="10" cy="10" r="2" />
          <circle cx="15" cy="10" r="2" />
        </svg>
      </button>
    </div>
  );
}
