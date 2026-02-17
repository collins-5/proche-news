// app/kitchen-sink/page.tsx
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Icon } from "@/components/ui/icon";

export default function KitchenSink() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Perfect theme handling (works with system + manual)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme !== "system") {
      root.classList.add(theme);
    }
    // when "system", we let CSS @media handle it (no class needed)
  }, [theme]);

  return (
    <>
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-surface sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Icon name="menu" className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background">
                <div className="mt-12 space-y-2">
                  {["Home", "World", "Politics", "Tech", "Science", "Sports", "Saved"].map((item) => (
                    <Button key={item} variant="ghost" className="w-full justify-start text-lg">
                      {item}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-2xl font-bold">NewsApp</h1>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {["World", "Politics", "Tech", "Science"].map((item) => (
                <Button key={item} variant="ghost" className="text-foreground/70 hover:text-foreground">
                  {item}
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="search" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="bell" className="h-5 w-5" />
            </Button>

            {/* Theme Switcher */}
            <div className="flex items-center gap-1 bg-surface/50 backdrop-blur rounded-xl p-1">
              <Button
                variant={theme === "light" ? "default" : "ghost"}
                size="icon"
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-accent text-black" : ""}
              >
                <Icon name="sun" className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "ghost"}
                size="icon"
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "bg-accent text-black" : ""}
              >
                <Icon name="moon" className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "system" ? "default" : "ghost"}
                size="icon"
                onClick={() => setTheme("system")}
                className={theme === "system" ? "bg-accent text-black" : ""}
              >
                <Icon name="smartphone" className="h-4 w-4" />
              </Button>
            </div>

            <Avatar>
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-surface">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-14">
              <Badge className="mb-6 bg-accent text-black">Breaking</Badge>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Deep Black + Teal Theme<br />with shadcn/ui is perfection
              </h2>
              <p className="mt-6 text-xl text-muted-foreground">
                Your dynamic Icon component + sonner + CSS variables = elite tier in 2025
              </p>
              <div className="mt-10 flex gap-4">
                <Button size="lg" className="bg-accent text-black hover:bg-accent-hover font-semibold">
                  <Icon name="rocket" className="mr-2" />
                  Read Now
                </Button>
                <Button size="lg" variant="outline">
                  <Icon name="bookmark" className="mr-2 h-5 w-5" />
                  Save
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 h-96 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="absolute bottom-8 right-8 text-8xl opacity-10">
                NewsApp
              </div>
            </div>
          </div>
        </Card>

        {/* Articles Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-10">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="bg-muted h-52 border-2 border-dashed border-accent/20" />
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">Tech</Badge>
                    <span className="text-sm text-muted-foreground">5 min read</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl">
                    Next.js 15 + shadcn/ui + dynamic icons = future-proof stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-6">
                    The most beautiful, performant, and maintainable way to build news apps in 2025...
                  </p>
                  <div className="flex items-center justify-between">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon name="menu" className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Icon name="bookmark" className="mr-2 h-4 w-4" /> Save
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icon name="share-2" className="mr-2 h-4 w-4" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Icon name="flag" className="mr-2 h-4 w-4" /> Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Toast Showcase */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-12">Sonner Toasts in Action</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <Button size="lg" onClick={() => toast("Saved offline")}>
              Default
            </Button>
            <Button size="lg" variant="default" className="bg-accent text-black hover:bg-accent-hover"
              onClick={() => toast.success("Article saved successfully!")}>
              Success
            </Button>
            <Button size="lg" variant="destructive" onClick={() => toast.error("Failed to load")}>
              Error
            </Button>
            <Button size="lg" variant="outline"
              onClick={() => toast("Custom toast", {
                description: "Looks perfect with your teal theme",
                duration: 5000,
                action: { label: "Undo", onClick: () => console.log("Undo") }
              })}>
              Rich + Action
            </Button>
          </div>
        </section>

        <footer className="text-center py-16 text-muted-foreground">
          <p className="text-lg">
            Built with <span className="text-accent font-bold">Next.js 15</span> •{" "}
            <span className="text-accent font-bold">shadcn/ui</span> •{" "}
            <span className="text-accent font-bold">Dynamic Icons</span> • 2025
          </p>
        </footer>
      </main>

      <Toaster position="bottom-center" richColors closeButton theme={theme} />
    </div>
  </>
  );
}