// @/components/sections/HeroBanner.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

/**
 * TypeScript definitions for the data this component receives.
 * This structure should match your Strapi 'sections.hero-banner' component schema.
 */
interface HeroBannerProps {
  title: string; // e.g., "Good Evening! Welcome to I&M Help & Support"
  searchPlaceholder: string; // e.g., "How can we help?"
  searchButtonText: string; // e.g., "Search"
}

/**
 * HeroBanner component - Renders the main title and the active search input field.
 */
export default function HeroBanner({
  title,
  searchPlaceholder,
  searchButtonText,
}: HeroBannerProps) {
  const router = useRouter();
  const params = useParams();
  // router.push(`/en/search?q=${encodeURIComponent("test")}`);
  // 1. Manage the search query state locally
  const [query, setQuery] = useState("");
  const lang = (params?.lang as string) || "en";
  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    // const q = query.trim();
    // console.log("Searching for:", q); // Debugging log
    // if (!q) return;
    // //router.push(`/${lang}/search?q=${encodeURIComponent(q)}`);

    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="hero">
      <h1 className="hero-title"> {title} </h1>
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            name="search"
            value={query}
            onChange={(e) => {
              console.log("Input changed:", e.target.value); // Debugging log
              setQuery(e.target.value);
            }} // Update state on change
            placeholder={searchPlaceholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button className="search-btn" type="submit">
            {searchButtonText}{" "}
          </button>
        </div>
      </form>
    </section>
  );
}
