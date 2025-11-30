// src/hooks/useAINewsAssistant.ts
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

const NEWSAPI_KEY = "f66b46eb655241d18cadb4e2f50070fd";

export const useAINewsAssistant = () => {
    const ai = useAIAssistant();

    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isFetchingNews, setIsFetchingNews] = useState(false);
    const [displayResponse, setDisplayResponse] = useState("");
    const lastProcessedResponse = useRef<string>(""); // Prevents infinite loop

    useEffect(() => {
        const raw = ai.response;
        if (!raw || isFetchingNews || raw === lastProcessedResponse.current) return;

        // Mark this response as processed
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

        // Clean JSON from UI and trigger news fetch
        const cleaned = raw.replace(/```json\s*[\s\S]*?\s*```/g, "").trim();
        setDisplayResponse(cleaned || "Here are the latest articles");

        fetchNews(action);
    }, [ai.response, isFetchingNews]);

    const fetchNews = async (action: any) => {
        // Prevent double-fetch
        if (isFetchingNews) return;

        setIsFetchingNews(true);
        setArticles([]);

        try {
            const params = new URLSearchParams({ apiKey: NEWSAPI_KEY });
            let url = "";

            if (action.intent === "search_news") {
                url = "https://newsapi.org/v2/everything";
                params.append("q", action.query || "news");
                params.append("sortBy", "publishedAt");
                params.append("pageSize", "20");
            } else {
                url = "https://newsapi.org/v2/top-headlines";
                params.append("country", action.country || "us");
                if (action.category) params.append("category", action.category);
            }

            const res = await fetch(`${url}?${params}`);
            const data = await res.json();

            if (data.status === "ok") {
                const filtered = data.articles
                    .filter((a: any) => a.title && !a.title.includes("[Removed]"))
                    .slice(0, 15);
                setArticles(filtered);
            } else {
                setDisplayResponse("Sorry, I couldn't fetch news right now.");
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
        response: displayResponse,           // Clean text only
        articles,
        isFetchingNews: isFetchingNews,
        hasNews: articles.length > 0,
        clearNews: () => {
            setArticles([]);
            setDisplayResponse("");
            lastProcessedResponse.current = "";
        },
    };
};