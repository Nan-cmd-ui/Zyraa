"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/"); // Redirect home if empty
      setQuery("");
      return;
    }

    router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
  };

  // Keep input synced if URL changes
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-4">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded-r-full hover:bg-orange-600 transition"
      >
        Search
      </button>
    </form>
  );
}
