"use client";

import { useRouter } from "next/navigation";

export default function CategoryTabs({
  categories,
  current,
}: {
  categories: readonly string[];
  current: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => router.push(`/news?category=${cat}`)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            current === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
