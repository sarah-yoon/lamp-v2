import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved",
};

export default function SavedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Saved</h1>
      <p className="text-text-secondary">Coming soon</p>
    </div>
  );
}
