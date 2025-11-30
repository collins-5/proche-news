// app/news/NewsCard.tsx
"use client";

import Image from "next/image";
import { NewsArticle } from "@/types/news";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article
      onClick={() => window.open(article.url, "_blank", "noopener,noreferrer")}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
    >
      {article.urlToImage ? (
        <div className="relative aspect-video bg-gray-200">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="bg-gray-200 h-64 flex items-center justify-center">
          <span className="text-gray-400 text-lg">No image</span>
        </div>
      )}

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>
        {article.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.description}
          </p>
        )}
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-blue-600">
            {article.source.name}
          </span>
          <time className="text-gray-400">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
