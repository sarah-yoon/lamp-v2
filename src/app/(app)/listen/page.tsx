import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Listening" };

export default function ListenIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="font-display text-4xl text-[#6b9e99]">listening</p>
      <p className="text-sm text-text-tertiary font-mono font-light">
        pick a track from an album to start annotating
      </p>
      <Link
        href="/explore"
        className="btn-join px-6 py-2 font-sans font-bold text-sm text-white mt-2"
      >
        explore albums
      </Link>
    </div>
  );
}
