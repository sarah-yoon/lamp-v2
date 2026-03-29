"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav({ username }: { username: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/explore", label: "Explore", icon: "🎵" },
    { href: "/trending", label: "Trending", icon: "🔥" },
    { href: "/saved", label: "Saved", icon: "🔖" },
    { href: `/profile/${username}`, label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-light border-t border-surface-border z-40">
      <div className="flex items-stretch">
        {tabs.map(({ href, label, icon }) => {
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
              <span className="text-lg leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
