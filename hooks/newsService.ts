// src/lib/NewsService.ts  ← keep your file exactly like this
import { NewsArticle, NewsCategory, NewsResponse } from "@/types/news";

const API_KEY = "f66b46eb655241d18cadb4e2f50070fd";
const BASE_URL = "https://newsapi.org/v2";

export class NewsService {
    static async getTopHeadlines(
        country: string = "us",
        category?: NewsCategory
    ): Promise<NewsArticle[]> {
        try {
            let url = `${BASE_URL}/top-headlines?country=${country}&apiKey=${API_KEY}`;
            if (category) url += `&category=${category}`;

            const response = await fetch(url);

            // If offline or server error → fetch fails → catch block
            if (!response.ok) return [];

            const data = (await response.json()) as NewsResponse;

            if (data.status !== "ok") return [];

            return data.articles.filter(a => a.title && a.title !== "[Removed]");
        } catch (error) {
            // Network error, no internet, timeout → silently return empty
            return [];
        }
    }

    static async searchNews(
        query: string,
        sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt"
    ): Promise<NewsArticle[]> {
        if (!query.trim()) return [];

        try {
            const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&apiKey=${API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) return [];

            const data = (await response.json()) as NewsResponse;
            if (data.status !== "ok") return [];

            return data.articles.filter(a => a.title && a.title !== "[Removed]");
        } catch (error) {
            return [];
        }
    }

    static async getNewsByCategory(category: NewsCategory, country = "us") {
        return this.getTopHeadlines(country, category);
    }
}