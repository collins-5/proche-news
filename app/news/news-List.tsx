// app/news/NewsList.tsx

import { NewsService } from "@/hooks/newsService";
import NewsCard from "./news-card";

type Props = {
  query?: string;
  category?: string;
};

export default async function NewsList({ query, category }: Props) {
  let articles: any[] = [];

  try {
    if (query) {
      articles = await NewsService.searchNews(query);
    } else {
      articles = await NewsService.getTopHeadlines("us", category as any);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          {query ? `No results for "${query}"` : "No articles found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <NewsCard key={`${article.url}-${i}`} article={article} />
      ))}
    </div>
  );
}
