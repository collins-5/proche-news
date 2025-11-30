// src/components/AIChatbot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAINewsAssistant } from "@/hooks/useAINewsAssistant";
import { Send, Newspaper, X, MessageCircle } from "lucide-react";

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

  const [messages, setMessages] = React.useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, articles]);

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

  // Close when clicking outside
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
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Open Proche AI Assistant"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
      </button>

      {/* Full Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="chat-container relative w-full max-w-5xl h-[90vh] mx-4 bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                  P
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    Proche AI Assistant
                  </h2>
                  <p className="text-sm text-gray-500">
                    Real-time news & smart answers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {hasNews && (
                  <button
                    onClick={clearNews}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear News
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages + News Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {messages.length === 0 && !hasNews ? (
                <div className="text-center text-gray-600 mt-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Hi! I'm Proche AI</h3>
                  <p className="text-lg">
                    Your smart assistant for news & more
                  </p>
                  <div className="mt-6 space-y-2 text-left max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
                    <p className="font-medium text-purple-700">Try asking:</p>
                    <p className="text-sm">• "Show me latest tech news"</p>
                    <p className="text-sm">• "What's happening in sports?"</p>
                    <p className="text-sm">• "Search for climate change"</p>
                    <p className="text-sm">• "Write me a poem about stars"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Messages */}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 shrink-0 flex items-center justify-center text-white font-bold">
                          P
                        </div>
                      )}
                      <div
                        className={`max-w-2xl px-5 py-4 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl shadow-sm">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* News Grid */}
                  {isFetchingNews && (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                      <p className="mt-4 text-gray-600 text-lg">
                        Fetching latest news...
                      </p>
                    </div>
                  )}

                  {articles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {articles.map((article, i) => (
                        <article
                          key={i}
                          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                          {article.urlToImage && (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-5">
                            <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900">
                              {article.title}
                            </h3>
                            {article.description && (
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {article.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">
                                {article.source.name}
                              </span>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 font-semibold hover:underline"
                              >
                                Read
                              </a>
                            </div>
                          </div>
                        </article>
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
              className="bg-white border-t border-gray-200 p-4"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask Proche AI anything..."
                    className="flex-1 px-6 py-4 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-800 placeholder-gray-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-medium"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Powered by Gemini • Real-time News • Creative AI
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
