"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Music, Search, TrendingUp, Bookmark, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/explore", label: "Explore", icon: Music },
  { href: "/search", label: "Search", icon: Search },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export default function Sidebar({ username, avatarUrl }: { username: string; avatarUrl: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[220px] backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-lg z-40">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2">
        <span className="text-xl font-bold text-text-primary tracking-tight">
          <span className="font-display">LAMP</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-accent-coral inline-block" />
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white/20 border border-white/30 text-accent-gold font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/10",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/20">
        <Link
          href={`/profile/${username}`}
          className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-bg font-semibold text-sm flex-shrink-0">
              {username[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-sm text-text-primary truncate">{username}</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors flex items-center gap-3"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
