// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { NewsService } from "@/hooks/newsService";

const categories = [
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
] as const;

type Category = (typeof categories)[number];

const categoryColors: Record<Category, string> = {
  business: "text-red-600 dark:text-red-400",
  technology: "text-blue-600 dark:text-blue-400",
  sports: "text-green-600 dark:text-green-400",
  entertainment: "text-purple-600 dark:text-purple-400",
  health: "text-teal-600 dark:text-teal-400",
};

const categoryTitles: Record<Category, string> = {
  business: "BUSINESS",
  technology: "TECHNOLOGY",
  sports: "SPORTS",
  entertainment: "ENTERTAINMENT",
  health: "HEALTH",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const ArticleCard = ({ article }: { article: any }) => (
  <Link
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
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
        <span className="text-5xl font-black text-muted-foreground/30">
          NEWS
        </span>
      </div>
    )}

    <div className="p-5">
      <h3 className="font-bold text-lg line-clamp-3 group-hover:text-accent transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-3">
        {formatDate(article.publishedAt)}
      </p>
    </div>
  </Link>
);

export default async function HomePage() {
  const results = await Promise.allSettled(
    categories.map((cat) => NewsService.getTopHeadlines("us", cat))
  );

  // Check if ALL requests failed → means network issue
  const allFailed = results.every((r) => r.status === "rejected");

  const allArticles = categories.reduce((acc, cat, i) => {
    const result = results[i];
    acc[cat] = result.status === "fulfilled" ? result.value : [];
    return acc;
  }, {} as Record<Category, any[]>);

  // If everything failed → show network error
  if (allFailed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="text-8xl mb-8">Offline</div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            No internet connection
          </h2>
          <p className="text-muted-foreground mb-8">
            Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-accent-hover transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-background to-background py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
            Stay Ahead of the News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Real-time headlines from trusted sources, beautifully delivered.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-3 bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-accent-hover transition"
          >
            Explore All News
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {categories.map((cat) => {
          const articles = allArticles[cat];

          // If this category failed, show small message
          if (!articles.length) {
            return (
              <section key={cat} className="space-y-8">
                <h2 className={`text-4xl font-black ${categoryColors[cat]}`}>
                  {categoryTitles[cat]}
                </h2>
                <p className="text-muted-foreground text-center py-12">
                  No articles available right now.
                </p>
              </section>
            );
          }

          return (
            <section key={cat} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className={`text-4xl font-black ${categoryColors[cat]}`}>
                  {categoryTitles[cat]}
                </h2>
                <Link
                  href={`/news?category=${cat}`}
                  className={`${categoryColors[cat]} font-bold text-lg hover:gap-3 flex items-center gap-2 transition-all`}
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.url} article={article} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
