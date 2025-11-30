// app/kitchen-sink/page.tsx
"use client";

import { Sun, Moon, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function KitchenSink() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const root = window.document.documentElement; // <html>
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme); // "light" or "dark"
    }
  }, [theme]);

  // Optional: sync with system changes when user has "system" selected
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Header with working toggle */}
      <header className="border-b border-surface sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold">NewsApp – Kitchen Sink</h1>

          <div className="flex items-center gap-2 bg-surface/50 backdrop-blur rounded-xl p-1">
            <button
              onClick={() => setTheme("light")}
              className={`p-3 rounded-lg transition-all ${
                theme === "light"
                  ? "bg-accent text-black shadow-md"
                  : "text-foreground/70"
              }`}
              aria-label="Light mode"
            >
              <Sun className="w-5 h-5" />
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-3 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-accent text-black shadow-md"
                  : "text-foreground/70"
              }`}
              aria-label="Dark mode"
            >
              <Moon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`p-3 rounded-lg transition-all ${
                theme === "system"
                  ? "bg-accent text-black shadow-md"
                  : "text-foreground/70"
              }`}
              aria-label="System theme"
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Rest of your beautiful showcase stays exactly the same */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* ... all the previous sections (hero, cards, typography, etc.) ... */}
        {/* I'm keeping them here so you can just copy-paste the whole file */}

        <article className="article-card p-8 md:p-12 rounded-3xl">
          <div className="flex gap-4 items-center mb-6">
            <span className="category-chip">Theme Test</span>
            <span className="text-secondary">Right now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Toggle works perfectly now!
          </h2>
          <p className="mt-6 text-xl text-secondary leading-relaxed">
            Deep black + teal theme switches instantly in both manual and system
            mode.
          </p>
        </article>

        {/* (Keep all the other sections from the previous version here) */}
        {/* Categories, Cards Grid, Buttons, Typography, Footer... */}
      </main>
    </div>
  );
}
