"use client";
import { useState, useEffect } from "react";
import { Search, Sun, Moon, Smartphone, Menu, X } from "lucide-react"; // Add Menu & X icons
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import SearchOverlay from "./search-overlay";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);


  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/news", label: "ALL NEWS" },
    { href: "/news?category=business", label: "Business" },
    { href: "/news?category=technology", label: "Technology" },
    { href: "/news?category=sports", label: "Sports" },
    { href: "/news?category=entertainment", label: "Entertainment" },
    { href: "/news?category=health", label: "Health" },
  ];

  return (
    <>
      <header className="bg-accent text-black dark:text-white border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 text-sm">
            <div className="hidden md:flex gap-6 font-medium">
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

            <div className="md:hidden flex items-center gap-4">
            </div>

            <div className="flex items-center gap-5">
              {/* Social Icons */}
              <div className="hidden sm:flex gap-4">
                <Facebook className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Linkedin className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-70 transition" />
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center bg-black/10 dark:bg-white/10 backdrop-blur rounded-full p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-full transition ${theme === "light" ? "bg-white text-black shadow-sm" : "hover:bg-white/20"
                    }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-full transition ${theme === "dark" ? "bg-white text-black shadow-sm" : "hover:bg-white/20"
                    }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-2 rounded-full transition ${theme === "system" ? "bg-white text-black shadow-sm" : "hover:bg-white/20"
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

      {/* Main Navbar */}
      <nav className="bg-surface border-b border-surface-border sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="text-4xl md:text-5xl font-black tracking-tight text-accent">
              PROCHE
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10 text-base lg:text-lg font-medium text-foreground">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-accent transition capitalize"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-foreground focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-surface-border">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 text-lg font-medium text-foreground">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-accent transition capitalize"
                  onClick={() => setIsMobileMenuOpen(false)} // Close on click
                >
                  {link.label}
                </Link>
              ))}
              {/* Optional: Add top-bar links here for mobile */}
              <div className="flex flex-col gap-4 pt-4 border-t border-surface-border">
                <Link href="/who-we-are" className="hover:underline">
                  WHO WE ARE
                </Link>
                <Link href="/careers" className="hover:underline">
                  WORK WITH US
                </Link>
                {/* ... add others if desired */}
              </div>

              {/* Social icons on mobile */}
              <div className="flex gap-6 pt-4">
                <Facebook className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
                <Twitter className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
                <Linkedin className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
                <Youtube className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
