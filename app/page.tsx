import Image from "next/image";
import Link from "next/link";
import { NewsService } from "@/hooks/newsService";
import { bgGradient, bgGradientBr } from "@/components/nav-bar";

export const AllLink = "/news";

export const categories = [
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
] as const;

const categoryColors: Record<(typeof categories)[number], string> = {
  business: "text-red-600",
  technology: "text-blue-600",
  sports: "text-green-600",
  entertainment: "text-purple-600",
  health: "text-teal-600",
};

const categoryTitles: Record<(typeof categories)[number], string> = {
  business: "BUSINESS",
  technology: "TECHNOLOGY",
  sports: "SPORTS",
  entertainment: "ENTERTAINMENT",
  health: "HEALTH",
};

export default async function HomePage() {
  const results = await Promise.all(
    categories.map((cat) => NewsService.getTopHeadlines("us", cat))
  );

  const allArticles = categories.reduce((acc, cat, i) => {
    (acc as any)[cat] = results[i];
    return acc;
  }, {} as Record<string, any[]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const ArticleCard = ({ article }: { article: any }) => (
    <Link
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 block"
    >
      {article.urlToImage ? (
        <div className="relative h-56 bg-gray-200">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div
          className={`h-56 ${bgGradientBr} from-gray-100 to-gray-200 flex items-center justify-center`}
        >
          <span className="text-4xl font-bold text-gray-400">NEWS</span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition line-clamp-3">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`py-10 bg-primary`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 inline-block">
            <h3 className="text-white text-3xl font-bold mb-4">
              Rank higher. Grow faster.
            </h3>
            <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600">
              Try It Free
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - All 6 Categories with CORRECT "View All" Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {categories.map((cat) => {
          const articles = allArticles[cat];
          if (!articles || articles.length === 0) return null;

          const viewAllHref = `/news?category=${cat}`;

          return (
            <section key={cat}>
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-4xl font-bold ${categoryColors[cat]}`}>
                  {categoryTitles[cat]}
                </h2>
                <Link
                  href={viewAllHref}
                  className={`${categoryColors[cat]} font-semibold hover:underline flex items-center gap-2 transition-all hover:gap-4`}
                >
                  View All
                  <span className="text-2xl">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {articles.slice(0, 6).map((article: any) => (
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
