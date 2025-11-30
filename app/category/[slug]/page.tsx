// app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import { NewsArticle } from "@/types/news";
import Link from "next/link";
import Image from "next/image";
import { NewsService } from "@/hooks/newsService";

const categoryTitles: Record<string, string> = {
  business: "BUSINESS NEWS",
  technology: "TECHNOLOGY",
  blockchain: "BLOCKCHAIN & CRYPTO",
  entertainment: "ENTERTAINMENT",
  health: "HEALTH",
  science: "SCIENCE",
  sports: "SPORTS",
};

const categoryColors: Record<string, string> = {
  business: "text-red-600",
  technology: "text-blue-600",
  blockchain: "text-purple-600",
  entertainment: "text-pink-600",
  health: "text-green-600",
  science: "text-indigo-600",
  sports: "text-yellow-600",
};

export async function generateStaticParams() {
  return [
    { slug: "business" },
    { slug: "technology" },
    { slug: "blockchain" },
    { slug: "entertainment" },
    { slug: "health" },
    { slug: "science" },
    { slug: "sports" },
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  let articles: NewsArticle[] = [];

  try {
    if (slug === "blockchain") {
      articles = await NewsService.searchNews(
        "blockchain OR cryptocurrency",
        "publishedAt"
      );
    } else if (
      [
        "business",
        "technology",
        "entertainment",
        "health",
        "science",
        "sports",
      ].includes(slug)
    ) {
      articles = await NewsService.getTopHeadlines("us", slug as any);
    } else {
      notFound();
    }
  } catch (error) {
    console.error("Failed to load category:", error);
    articles = [];
  }

  const title = categoryTitles[slug] || "NEWS";
  const color = categoryColors[slug] || "text-gray-600";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            No articles found
          </h1>
          <Link href="/" className="text-red-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Same Header as Homepage */}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 text-xs flex justify-between">
          <div className="flex gap-6">
            <Link href="/who-we-are" className="hover:underline">
              WHO WE ARE
            </Link>
            <Link href="/careers" className="hover:underline">
              WORK WITH US
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-red-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          <Link href="/" className="text-5xl font-bold tracking-wider">
            PROCHE
          </Link>
          <div className="flex gap-10 text-lg font-medium">
            <Link href="/" className="hover:text-red-200">
              HOME
            </Link>
            <Link href="/category/business" className="hover:text-red-200">
              BUSINESS
            </Link>
            <Link href="/category/technology" className="hover:text-red-200">
              TECH
            </Link>
            <Link href="/category/blockchain" className="hover:text-red-200">
              BLOCKCHAIN
            </Link>
          </div>
        </div>
      </nav>

      {/* Category Title */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className={`text-5xl font-bold ${color}`}>{title}</h1>
          <p className="text-gray-600 mt-2">{articles.length} articles</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 block"
            >
              {article.urlToImage ? (
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-500">
                    {title.split(" ")[0]}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </p>
                {article.source.name && (
                  <p className="text-xs text-gray-400 mt-2">
                    Source: {article.source.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
