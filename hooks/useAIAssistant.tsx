import { useState } from "react";
import { PROCHE_SYSTEM_PROMPT } from "@/lib/systemPrompt";

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
        role: "model",
        parts: [{ text: PROCHE_SYSTEM_PROMPT }],
      },
      ...conversation.flatMap((msg) => [
        { role: "user", parts: [{ text: msg.prompt }] },
        { role: "model", parts: [{ text: msg.response }] },
      ]),
      { role: "user", parts: [{ text: prompt }] },
    ];

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API error: ${res.status} ${err}`);
      }

      const data = await res.json();
      const reply = data.reply ?? "Hmm...";

      setConversation((prev) => [...prev, { prompt, response: reply }]);
      setResponse(reply);
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