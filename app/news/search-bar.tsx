"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
      params.delete("category"); // clear category when searching
    } else {
      params.delete("q");
    }
    router.push(`/news?${params.toString()}`);
  }, 500);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <input
        type="text"
        placeholder="Search news..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
      />

      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {defaultValue && (
        <button
          type="button"
          onClick={() => {
            router.push("/news");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <svg
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
}
