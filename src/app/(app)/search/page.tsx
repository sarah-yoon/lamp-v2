"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { AlbumGrid } from "@/components/AlbumGrid";

export default function SearchPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleResults(data: any[]) {
    setResults(data);
    setHasSearched(true);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Search</h1>
      <SearchBar
        onResults={handleResults}
        onLoading={setLoading}
        className="mb-6"
      />
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square skeleton mb-2" />
              <div className="skeleton h-4 w-3/4 mb-1" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}
      {!loading && results.length > 0 && <AlbumGrid albums={results} />}
      {!loading && hasSearched && results.length === 0 && (
        <p className="text-text-secondary text-sm text-center py-12">
          No albums found. Try a different search.
        </p>
      )}
    </div>
  );
}
