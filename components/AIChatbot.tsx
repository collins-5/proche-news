// src/components/AIChatbot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAINewsAssistant } from "@/hooks/useAINewsAssistant";
import { Send, Newspaper, X, MessageCircle, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "./ui/button";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    prompt,
    setPrompt,
    response,
    loading,
    generate,
    articles,
    isFetchingNews,
    hasNews,
    clearNews,
  } = useAINewsAssistant();

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages, articles]);

  useEffect(() => {
    if (response) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    await generate();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement).closest(".chat-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          size="lg"
          icon={<Icon name="message-circle" className="w-6 h-6" />}
          onClick={() => setIsOpen(true)}
          className="bg-accent text-black hover:bg-accent-hover shadow-2xl hover:shadow-accent/40 hover:scale-110 transition-all duration-300 rounded-full px-6 font-bold"
        />
      </div>

      {/* Full Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="chat-container relative w-full max-w-5xl h-[90vh] mx-6 bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-surface-border">
            {/* Header */}
            <div className="bg-surface border-b border-surface-border px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-black">P</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">
                    Proche AI
                  </h2>
                  <p className="text-muted-foreground">
                    Your intelligent news companion
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {hasNews && (
                  <button
                    onClick={clearNews}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Clear News
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-muted/50 rounded-2xl transition"
                >
                  <Icon name="x" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {messages.length === 0 && !hasNews ? (
                <div className="text-center mt-20">
                  <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-accent" />
                  </div>
                  <h3 className="text-4xl font-black text-foreground mb-4">
                    Hi, I'm Proche AI
                  </h3>
                  <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    Ask me anything — from breaking news to deep analysis.
                  </p>
                  <div className="mt-10 space-y-3 max-w-2xl mx-auto text-left bg-surface border border-surface-border rounded-3xl p-8 shadow-xl">
                    <p className="font-bold text-accent text-lg">Try asking:</p>
                    {[
                      "Latest AI breakthroughs?",
                      "What’s happening in climate tech?",
                      "Summarize today’s top headlines",
                      "Explain quantum computing simply",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setPrompt(q);
                          handleSubmit(new Event("submit") as any);
                        }}
                        className="block w-full text-left py-3 px-5 rounded-2xl bg-muted/50 hover:bg-accent/10 transition text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-5 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-lg shrink-0">
                          <span className="text-xl font-black text-black">
                            P
                          </span>
                        </div>
                      )}
                      <div
                        className={`max-w-3xl px-6 py-4 rounded-3xl ${
                          msg.role === "user"
                            ? "bg-accent text-black shadow-lg"
                            : "bg-muted/50 text-foreground border border-surface-border"
                        }`}
                      >
                        <div
                          className="prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong class='font-bold text-accent'>$1</strong>"
                              )
                              .replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-5">
                      <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
                        <span className="text-xl font-black text-black">P</span>
                      </div>
                      <div className="bg-muted/50 px-6 py-4 rounded-3xl border border-surface-border">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" />
                          <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-100" />
                          <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* News Articles */}
                  {isFetchingNews && (
                    <div className="text-center py-16">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
                      <p className="mt-6 text-lg text-muted-foreground">
                        Fetching latest news...
                      </p>
                    </div>
                  )}

                  {articles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                      {articles.map((article, i) => (
                        <a
                          key={i}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all border border-surface-border"
                        >
                          {article.urlToImage && (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-5">
                            <h3 className="font-bold text-foreground line-clamp-2 mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm mt-4">
                              <span className="text-accent font-semibold">
                                {article.source.name}
                              </span>
                              <span className="text-muted-foreground">
                                Read
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-surface-border bg-surface p-6"
            >
              <div className="max-w-4xl mx-auto flex gap-4">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Proche AI anything..."
                  className="flex-1 px-6 py-5 bg-muted/50 border border-surface-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground text-lg transition"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="px-8 py-5 bg-accent text-black font-bold rounded-3xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-accent/50 flex items-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Powered by Gemini • Real-time News • Built for Truth
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
