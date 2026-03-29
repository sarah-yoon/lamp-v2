"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onResults: (results: any[]) => void;
  onLoading: (loading: boolean) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onResults, onLoading, placeholder = "Search albums...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query || query.trim().length < 2) {
      onResults([]);
      onLoading(false);
      return;
    }

    onLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          onResults(data);
        }
      } catch {
        onResults([]);
      } finally {
        onLoading(false);
      }
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors ${className}`}
    />
  );
}
