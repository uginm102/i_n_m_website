// @/components/sections/HeroBanner.tsx
'use client';

import { useState } from 'react';
// If you are using Next.js routing, import useRouter to redirect on search
// import { useRouter } from 'next/navigation'; 

/**
 * TypeScript definitions for the data this component receives.
 * This structure should match your Strapi 'sections.hero-banner' component schema.
 */
interface HeroBannerProps {
  title: string;             // e.g., "Good Evening! Welcome to I&M Help & Support"
  searchPlaceholder: string; // e.g., "How can we help?"
  searchButtonText: string;  // e.g., "Search"
}

/**
 * HeroBanner component - Renders the main title and the active search input field.
 */
export default function HeroBanner({
  title,
  searchPlaceholder,
  searchButtonText,
}: HeroBannerProps) {
  // 1. Manage the search query state locally
  const [query, setQuery] = useState('');
  
  // const router = useRouter(); // Initialize router for navigation (optional)

  // 2. Handle the form submission (when user clicks Search or presses Enter)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') return; // Don't search if the input is empty

    console.log(`Searching for: "${query}"`);
    
    // INTEGRATION POINT: This is where you connect to your search solution.
    // Examples:
    // A) Route to a search results page: router.push(`/support/search?q=${encodeURIComponent(query)}`);
    // B) Call an API directly to filter results: callMySearchApi(query);
  };

  return (
    
      <section className="hero">
        <h1 className="hero-title"> {title} </h1>
        <form onSubmit={handleSearch}>
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true"></i>
                       <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)} // Update state on change
               placeholder={searchPlaceholder}
             />
          <button className="search-btn" type="submit">{searchButtonText} </button>
        </div>
        </form>
      </section>
  );
}