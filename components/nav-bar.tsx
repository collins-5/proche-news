// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Sun, Moon, Smartphone } from "lucide-react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import SearchOverlay from "./search-overlay";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <>
      {/* Top Bar – Uses your theme colors */}
      <header className="bg-accent text-black dark:text-white border-b border-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 text-sm">
            <div className="flex gap-6 font-medium">
              <Link href="/who-we-are" className="hover:underline">
                WHO WE ARE
              </Link>
              <Link href="/careers" className="hover:underline">
                WORK WITH US
              </Link>
              <Link href="/pr-agencies" className="hover:underline">
                FOR PR AGENCIES
              </Link>
              <Link href="/csr" className="hover:underline">
                CORPORATE SOCIAL RESPONSIBILITY
              </Link>
            </div>

            <div className="flex items-center gap-5">
              {/* Social Icons */}
              <div className="flex gap-4">
                <Facebook className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Linkedin className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
              </div>

              {/* Theme Toggle – Teal pill */}
              <div className="flex items-center bg-black/10 dark:bg-white/10 backdrop-blur rounded-full p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-full transition ${
                    theme === "light"
                      ? "bg-white text-black shadow-sm"
                      : "hover:bg-white/20"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-full transition ${
                    theme === "dark"
                      ? "bg-white text-black shadow-sm"
                      : "hover:bg-white/20"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-2 rounded-full transition ${
                    theme === "system"
                      ? "bg-white text-black shadow-sm"
                      : "hover:bg-white/20"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <Search
                onClick={() => setIsSearchOpen(true)}
                className="w-5 h-5 cursor-pointer hover:scale-110 transition"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Navbar – Uses your theme */}
      <nav className="bg-surface border-b border-surface-border sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="text-5xl font-black tracking-tight text-accent"
            >
              PROCHE
            </Link>

            <div className="flex items-center gap-10 text-lg font-medium text-foreground">
              <Link href="/" className="hover:text-accent transition">
                HOME
              </Link>
              <Link href="/news" className="hover:text-accent transition">
                ALL NEWS
              </Link>
              {[
                "business",
                "technology",
                "sports",
                "entertainment",
                "health",
              ].map((cat) => (
                <Link
                  key={cat}
                  href={`/news?category=${cat}`}
                  className="hover:text-accent transition capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
