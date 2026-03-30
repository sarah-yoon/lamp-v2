"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, TrendingUp, Bookmark, User } from "lucide-react";

export default function MobileNav({ username, avatarUrl }: { username: string; avatarUrl: string | null }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/explore", label: "Explore", icon: Music },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: `/profile/${username}`, label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-light border-t border-surface-border z-40">
      <div className="flex items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
                isActive ? "text-accent-gold" : "text-text-tertiary",
              ].join(" ")}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
