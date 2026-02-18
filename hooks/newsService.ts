import { NewsArticle, NewsCategory, NewsResponse } from "@/types/news";

const APP_URL = 'https://proche-news.vercel.app';

export class NewsService {
  static async getTopHeadlines(
    country: string = "us",
    category?: NewsCategory
  ): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({
        endpoint: "top-headlines",
        country,
      });
      if (category) params.append("category", category);

      const url = `${APP_URL}/api/news?${params.toString()}`;
      console.log("Fetching:", url); // debug - check logs

      const response = await fetch(url);

      if (!response.ok) {
        console.error("Proxy response not OK:", response.status);
        return [];
      }

      const data = (await response.json()) as NewsResponse;

      if (data.status !== "ok") return [];

      return data.articles.filter(a => a.title && a.title !== "[Removed]");
    } catch (error) {
      console.error("getTopHeadlines error:", error);
      return [];
    }
  }

  static async searchNews(
    query: string,
    sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt"
  ): Promise<NewsArticle[]> {
    if (!query.trim()) return [];

    try {
      const params = new URLSearchParams({
        endpoint: "everything",
        q: query,
        sortBy,
        pageSize: "20",
      });

      const url = `${APP_URL}/api/news?${params.toString()}`;
      console.log("Fetching:", url);

      const response = await fetch(url);

      if (!response.ok) return [];

      const data = (await response.json()) as NewsResponse;

      if (data.status !== "ok") return [];

      return data.articles.filter(a => a.title && a.title !== "[Removed]");
    } catch (error) {
      console.error("searchNews error:", error);
      return [];
    }
  }

  static async getNewsByCategory(category: NewsCategory, country = "us") {
    return this.getTopHeadlines(country, category);
  }
}