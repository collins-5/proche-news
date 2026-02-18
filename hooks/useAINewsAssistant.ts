"use client";

import { useEffect, useState, useRef } from "react";
import { useAIAssistant } from "./useAIAssistant";

export type NewsCategory =
  | "general"
  | "business"
  | "entertainment"
  | "health"
  | "science"
  | "sports"
  | "technology";

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  author: string | null;
}


const APP_URL = 'https://proche-news.vercel.app';


export const useAINewsAssistant = () => {
  const ai = useAIAssistant();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [displayResponse, setDisplayResponse] = useState("");
  const lastProcessedResponse = useRef<string>("");

  useEffect(() => {
    const raw = ai.response;
    if (!raw || isFetchingNews || raw === lastProcessedResponse.current) return;

    lastProcessedResponse.current = raw;

    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      setDisplayResponse(raw);
      return;
    }

    let action;
    try {
      action = JSON.parse(jsonMatch[1]);
    } catch {
      setDisplayResponse(raw);
      return;
    }

    const validIntents = ["show_top_headlines", "show_category", "search_news"];
    if (!validIntents.includes(action.intent)) {
      setDisplayResponse(raw);
      return;
    }

    const cleaned = raw.replace(/```json\s*[\s\S]*?\s*```/g, "").trim();
    setDisplayResponse(cleaned || "Here are the latest articles");

    fetchNews(action);
  }, [ai.response, isFetchingNews]);

  const fetchNews = async (action: any) => {
    if (isFetchingNews) return;
    setIsFetchingNews(true);
    setArticles([]);

    try {
      let params: URLSearchParams;

      if (action.intent === "search_news") {
        params = new URLSearchParams({
          endpoint: "everything",
          q: action.query || "news",
          sortBy: "publishedAt",
          pageSize: "20",
        });
      } else {
        params = new URLSearchParams({
          endpoint: "top-headlines",
          country: action.country || "us",
        });
        if (action.category) params.append("category", action.category);
      }

      // Use your own proxy route
      const res = await fetch(`${APP_URL}/api/news?${params.toString()}`);

      if (!res.ok) {
        console.error("Proxy failed:", res.status, await res.text());
        throw new Error("Proxy request failed");
      }

      const data = await res.json();

      if (data.status === "ok") {
        const filtered = data.articles
          .filter((a: any) => a.title && !a.title.includes("[Removed]"))
          .slice(0, 15);
        setArticles(filtered);
      } else {
        setDisplayResponse(
          data.message || "Sorry, I couldn't fetch news right now."
        );
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setDisplayResponse("Network error while fetching news.");
    } finally {
      setIsFetchingNews(false);
    }
  };

  return {
    ...ai,
    response: displayResponse,
    articles,
    isFetchingNews,
    hasNews: articles.length > 0,
    clearNews: () => {
      setArticles([]);
      setDisplayResponse("");
      lastProcessedResponse.current = "";
    },
  };
};
