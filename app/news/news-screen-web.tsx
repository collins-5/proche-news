// app/news/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { NewsService } from "@/hooks/newsService";
import { formatDate } from "@/lib/utils/formatters";
import { Icon } from "@/components/ui/icon";
import NewsCategories from "./NewsCategories";

// Shared categories — you can also move this to lib/constants.ts
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

export default function NewsScreenWeb() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") as Category | null;
  const validCategory = urlCategory && categories.includes(urlCategory)
    ? urlCategory
    : categories[0];

  const [category, setCategory] = useState<Category>(validCategory);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Sync URL → state
  useEffect(() => {
    const newCat = urlCategory && categories.includes(urlCategory as any)
      ? (urlCategory as Category)
      : categories[0];
    setCategory(newCat);
    setIsSearching(false);
    setSearchQuery("");
  }, [urlCategory]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const news = isSearching && searchQuery.trim()
        ? await NewsService.searchNews(searchQuery.trim())
        : await NewsService.getTopHeadlines("us", category);

      setArticles(news);
    } catch (err) {
      console.error("Failed to fetch news:", err);
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
    router.push(`/news?category=${cat}`, { scroll: false });
  };

  const handleSearch = () => {
    setIsSearching(searchQuery.trim().length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h1 className="text-5xl font-black text-foreground">
            {isSearching
              ? `Search: "${searchQuery}"`
              : category.charAt(0).toUpperCase() + category.slice(1) + " News"}
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-14 pr-14 py-5 rounded-2xl bg-surface border border-surface-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 text-lg transition-shadow"
          />
          <Icon name="search" className="absolute left-5 top-6 h-6 w-6 text-muted-foreground" />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-5 top-6">
              <Icon name="x" className="h-6 w-6 text-muted-foreground hover:text-foreground transition" />
            </button>
          )}
        </div>

        {/* Reusable Categories */}
        {!isSearching && (
          <NewsCategories
            currentCategory={category}
            onCategoryChange={handleCategoryClick}
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-muted rounded w-11/12" />
                  <div className="h-5 bg-muted rounded w-full" />
                  <div className="h-5 bg-muted rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-32">
            <Icon name="search" className="mx-auto h-20 w-20 text-muted-foreground/30 mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {isSearching ? "No results found" : "No articles available"}
            </h3>
            <p className="text-muted-foreground text-lg">
              {isSearching ? "Try a different search term" : "Check back later"}
            </p>
          </div>
        )}

        {/* Articles */}
        {!loading && articles.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.url}
                onClick={() => window.open(article.url, "_blank")}
                className="bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-surface-border"
              >
                {article.urlToImage ? (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-6xl font-black text-muted-foreground/20">NEWS</span>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground line-clamp-3 group-hover:text-accent transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-accent">
                      {article.source.name}
                    </span>
                    <time className="text-muted-foreground">
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