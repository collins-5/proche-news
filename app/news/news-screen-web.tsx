"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { NewsService } from "@/hooks/newsService";
import { formatDate } from "@/lib/utils/formatters";

export const categories = [
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "world",
  "politics",
  "environment",
  "food",
] as const;

type Category = (typeof categories)[number];
const categoryColors: Record<Category, string> = {
  business: "bg-red-600",
  technology: "bg-blue-600",
  sports: "bg-green-600",
  entertainment: "bg-purple-600",
  health: "bg-teal-600",
  science: "bg-indigo-600",
  world: "bg-gray-800",
  politics: "bg-yellow-600",
  environment: "bg-emerald-600",
  food: "bg-pink-600",
};

export default function NewsScreenWeb() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") as Category | null;
  const validCategory =
    urlCategory && categories.includes(urlCategory)
      ? urlCategory
      : categories[0];

  const [category, setCategory] = useState<Category>(validCategory);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Sync category with URL
  useEffect(() => {
    const newCat =
      urlCategory && categories.includes(urlCategory as any)
        ? (urlCategory as Category)
        : categories[0];
    setCategory(newCat);
    setIsSearching(false);
    setSearchQuery("");
  }, [urlCategory]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const news =
        isSearching && searchQuery.trim()
          ? await NewsService.searchNews(searchQuery.trim())
          : await NewsService.getTopHeadlines("us", category);

      setArticles(news);
    } catch (err) {
      console.error(err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, isSearching, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCategoryClick = (cat: Category) => {
    setCategory(cat);
    setIsSearching(false);
    setSearchQuery("");
    router.push(`/news?category=${cat}`, {
      scroll: false,
    });
  };

  const handleSearch = () => {
    setIsSearching(searchQuery.trim().length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 px-6 py-8">
        <h1 className="text-4xl font-bold text-white tracking-tight text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-lg"
          />
          <svg
            className="absolute left-4 top-5 w-6 h-6 text-gray-500"
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
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-4 top-5">
              <svg
                className="w-6 h-6 text-gray-500 hover:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Categories */}
        {!isSearching && (
          <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-3 rounded-full font-semibold text-white transition-all ${
                  category === cat
                    ? categoryColors[cat]
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Loading & Articles Grid */}
        {loading && (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
              >
                <div className="w-full h-64 bg-gray-300" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-11/12" />
                  <div className="h-4 bg-gray-300 rounded w-full" />
                  <div className="h-4 bg-gray-300 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <p className="text-center text-gray-500 py-20 text-lg">
            No articles found
          </p>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.url}
                onClick={() => window.open(article.url, "_blank")}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                {article.urlToImage ? (
                  <div className="relative aspect-video bg-gray-200">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      NEWS
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {article.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-red-600">
                      {article.source.name}
                    </span>
                    <time className="text-gray-400">
                      {formatDate(article.publishedAt)}
                    </time>
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
