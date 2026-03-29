import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
};

export default function ExplorePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Explore</h1>
      <p className="text-text-secondary">Coming soon</p>
    </div>
  );
}
