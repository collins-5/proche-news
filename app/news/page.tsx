// app/news/page.tsx

import NewsScreenWeb from "./news-screen-web";

export const dynamic = "force-dynamic"; // This makes it feel instant like React Native
export const revalidate = 0;

export default function Page() {
  return <NewsScreenWeb />;
}
