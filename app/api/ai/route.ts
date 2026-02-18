import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
            return NextResponse.json({ error: `Gemini API error: ${res.status} ${err}` }, { status: res.status });
        }

        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hmm...";

        return NextResponse.json({ reply: reply.trim() });
    } catch (err: any) {
        console.error("AI Error:", err);
        return NextResponse.json({ error: `Oops! ${err.message}` }, { status: 500 });
    }
}