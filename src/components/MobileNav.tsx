"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Search, BookMarked, Headphones } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/explore", label: "Explore", icon: Music },
    { href: "/search", label: "Search", icon: Search },
    { href: "/saved", label: "Library", icon: BookMarked },
    { href: "/listen", label: "Listening", icon: Headphones },
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
