// components/SearchBar.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  placeholder?: string;
  buttonText?: string;
};

export default function SearchBar({
  placeholder = "How can we help?",
  buttonText = "Search",
}: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="search-bar">
      <i className="ti ti-search" aria-hidden="true"></i>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button type="button" className="search-btn" onClick={handleSearch}>
        {buttonText}
      </button>

     
    </div>
  );
}