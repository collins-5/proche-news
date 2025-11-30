// src/hooks/useAIAssistant.tsx
import { useState } from "react";
import { PROCHE_SYSTEM_PROMPT } from "@/lib/systemPrompt";

const API_KEY = "AIzaSyD5VJDe9WhAN1GnJ28Q1yVy9xFgZFynyvo"; // Use env var!

export const useAIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ prompt: string; response: string }>
  >([]);

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    const messages = [
      {
        role: "model" as const,
        parts: [{ text: PROCHE_SYSTEM_PROMPT }],
      },
      ...conversation.flatMap((msg) => [
        { role: "user" as const, parts: [{ text: msg.prompt }] },
        { role: "model" as const, parts: [{ text: msg.response }] },
      ]),
      { role: "user" as const, parts: [{ text: prompt }] },
    ];

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: messages,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error: ${res.status} ${err}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hmm...";

      setConversation((prev) => [...prev, { prompt, response: reply }]);
      setResponse(reply.trim());
      setPrompt("");
    } catch (err: any) {
      console.error("AI Error:", err);
      setResponse(`Oops! ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    response,
    loading,
    conversation,
    generate,
  };
};
