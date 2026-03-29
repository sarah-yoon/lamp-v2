import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending",
};

export default function TrendingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Trending</h1>
      <p className="text-text-secondary">Coming soon</p>
    </div>
  );
}
