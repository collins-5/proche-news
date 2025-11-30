// components/Navbar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import SearchOverlay from "./search-overlay";

export const bgGradient = "bg-gradient-to-r";
export const bgGradientBr = "bg-gradient-to-br";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <header className={`text-white ${bgGradient} from-red-700 to-red-600`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex gap-6">
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
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80" />
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80" />
                <Linkedin className="w-4 h-4 cursor-pointer hover:opacity-80" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80" />
              </div>
              <Search
                onClick={() => setIsSearchOpen(true)}
                className="w-5 h-5 cursor-pointer hover:opacity-80 transition hover:scale-110"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="bg-red-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-5xl font-bold tracking-wider">
              PROCHE
            </Link>
            <div className="flex items-center gap-10 text-lg font-medium">
              <Link href="/" className="hover:text-red-200">
                HOME
              </Link>
              <Link href="/news" className="hover:text-red-200">
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
                  className="hover:text-red-200 capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Reusable Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
