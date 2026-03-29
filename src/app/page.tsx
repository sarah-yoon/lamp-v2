import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        {/* Logo */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-primary">LAMP</span>
          <span className="text-accent-coral">.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-text-secondary">
          Listen. Rate. Discover.
        </p>

        {/* Description */}
        <p className="text-sm text-text-tertiary max-w-sm">
          Rate albums, write unbiased reviews, and discover what&apos;s trending.
          You can&apos;t see others&apos; reviews until you write your own.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-2">
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded-lg bg-accent-gold text-bg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Join LAMP
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg border border-surface-border text-text-secondary font-semibold text-sm hover:bg-surface-hover transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Bottom decorative text */}
      <p className="absolute bottom-8 text-text-tertiary text-xs tracking-widest uppercase">
        Album reviews, unbiased
      </p>
    </div>
  );
}
