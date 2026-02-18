// app/api/news/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const endpoint = searchParams.get("endpoint");
  const country = searchParams.get("country") || "us";
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const sortBy = searchParams.get("sortBy") || "publishedAt";
  const pageSize = searchParams.get("pageSize") || "15";

  if (!endpoint || !["top-headlines", "everything"].includes(endpoint)) {
    return NextResponse.json({ error: "Invalid or missing endpoint" }, { status: 400 });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error("Missing NEWS_API_KEY in env");
    return NextResponse.json({ error: "Server env error" }, { status: 500 });
  }

  const params = new URLSearchParams({ apiKey });

  if (endpoint === "top-headlines") {
    params.append("country", country);
    if (category) params.append("category", category);
  } else {
    if (!q) return NextResponse.json({ error: "Missing q for everything" }, { status: 400 });
    params.append("q", q);
    params.append("sortBy", sortBy);
    params.append("pageSize", pageSize);
  }

  const url = `https://newsapi.org/v2/${endpoint}?${params}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const err = await res.text();
      console.error("NewsAPI error:", res.status, err);
      return NextResponse.json({ error: err || "NewsAPI failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
