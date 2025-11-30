// components/SearchOverlay.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { NewsService } from "@/hooks/newsService";
import { formatDate } from "@/lib/utils/formatters";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced live search
  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await NewsService.searchNews(query.trim());
        if (!cancelled) setResults(data.slice(0, 12));
      } catch (err) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setQuery("");
        setResults([]);
      }
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Search News</h2>
        <button
          onClick={() => {
            onClose();
            setQuery("");
            setResults([]);
          }}
          className="text-white hover:bg-white/20 p-3 rounded-full transition"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, companies..."
            autoFocus
            className="w-full pl-16 pr-16 py-5 text-xl bg-white text-gray-900 rounded-2xl outline-none shadow-2xl placeholder-gray-500 focus:ring-4 focus:ring-red-500 transition"
          />
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 pb-10 max-w-7xl mx-auto w-full">
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-white/20" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/30 rounded w-11/12" />
                  <div className="h-4 bg-white/20 rounded w-full" />
                  <div className="h-4 bg-white/20 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/70 text-xl">No results found for</p>
            <p className="text-white text-2xl font-bold mt-2">"{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <article
                key={article.url}
                onClick={() => {
                  window.open(article.url, "_blank");
                  onClose();
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
              >
                {article.urlToImage ? (
                  <div className="relative h-56 bg-gray-200">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-600">
                      NEWS
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <span className="font-medium text-red-600">
                      {article.source.name}
                    </span>
                    <time>{formatDate(article.publishedAt)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
