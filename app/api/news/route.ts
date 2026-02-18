import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const endpoint = searchParams.get("endpoint"); // "top-headlines" | "everything"
    const country = searchParams.get("country") || "us";
    const category = searchParams.get("category") || undefined;
    const q = searchParams.get("q") || undefined;
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const pageSize = searchParams.get("pageSize") || "20";

    if (!endpoint || !["top-headlines", "everything"].includes(endpoint)) {
        return NextResponse.json({ error: "Missing or invalid endpoint" }, { status: 400 });
    }

    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            console.error("NEWS_API_KEY is not set in environment variables");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const params = new URLSearchParams({ apiKey });

        if (endpoint === "top-headlines") {
            params.append("country", country);
            if (category) params.append("category", category);
        } else {
            // everything
            if (!q) {
                return NextResponse.json({ error: "Query 'q' is required for everything endpoint" }, { status: 400 });
            }
            params.append("q", q);
            params.append("sortBy", sortBy);
            params.append("pageSize", pageSize);
            // You can add language, domains, etc. later if needed
        }

        const url = `https://newsapi.org/v2/${endpoint}?${params.toString()}`;
        console.log("Fetching news from:", url.replace(apiKey, "[REDACTED]")); // debug

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("NewsAPI failed:", res.status, errorText);
            return NextResponse.json({ error: `NewsAPI error ${res.status}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("News proxy error:", err);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}