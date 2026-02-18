"use client";

import { Button } from "@/components/ui/button";
import { categories } from "./news-screen-web";
import { cn } from "@/lib/utils";

type Category = (typeof categories)[number];

type NewsCategoriesProps = {
  currentCategory: Category;
  onCategoryChange: (cat: Category) => void;
};

export default function NewsCategories({
  currentCategory,
  onCategoryChange,
}: NewsCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-4 pb-6 border-b border-surface-border">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={currentCategory === cat ? "default" : "outline"}
          size="lg"
          onClick={() => onCategoryChange(cat)}
          className={cn(
            "font-bold uppercase tracking-wider transition-all",
            currentCategory === cat
              ? "bg-accent text-black shadow-lg shadow-accent/30"
              : "bg-surface hover:bg-accent/10"
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
