import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="glass flex flex-col items-center gap-6 max-w-sm w-full px-10 py-12">
        {/* Logo */}
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-text-primary">
          LAMP<span className="text-accent-coral">.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-text-secondary font-serif">
          Listen: Album Museum & Portfolio
        </p>

        {/* Description */}
        <p className="text-sm text-text-tertiary font-mono font-light max-w-xs">
          Listen, enjoy, review and discover.<br></br>
          ݁⋆⭒˚.⋆
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
            className="px-6 py-2.5 rounded-lg bg-white/20 border border-white/40 text-text-secondary font-semibold text-sm hover:bg-white/30 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Bottom decorative text */}
      <p className="absolute bottom-8 text-text-tertiary text-xs tracking-widest lowercase
      font-mono font-light">
        what is music to you?
      </p>
    </div>
  );
}
