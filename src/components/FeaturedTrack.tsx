"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SpinningCD from "./SpinningCD";
import NowPlaying from "./NowPlaying";

interface TrackData {
  name: string | null;
  artist: string | null;
  art: string | null;
  previewUrl: string | null;
}

const CACHE_KEY = "lamp_featured_track";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const empty: TrackData = { name: null, artist: null, art: null, previewUrl: null };

export default function FeaturedTrack() {
  const [track, setTrack] = useState<TrackData>(empty);

  useEffect(() => {
    // Check localStorage cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setTrack(data);
          return;
        }
      }
    } catch {}

    // Fetch from API route
    fetch("/api/featured-track")
      .then((res) => res.json())
      .then((data: TrackData) => {
        setTrack(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch {}
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* SVG filter for glass card */}
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="lg-card" colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="3" seed="42" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Spinning CD — behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0 }}
      >
        <SpinningCD albumArt={track.art} albumName={track.name ?? undefined} size={300} />
      </div>

      {/* Glass card */}
      <div className="relative max-w-sm w-full min-h-125" style={{ borderRadius: 20, overflow: "hidden", zIndex: 1 }}>

        {/* Liquid glass backdrop */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            inset: -6,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            background: "rgba(255, 255, 254, 0.18)",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            boxShadow: "0 2px 0 rgba(255,255,255,0.6) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, 0 8px 32px rgba(0,0,0,0.12)",
            borderRadius: 26,
            filter: "url(#lg-card)",
          }}
        />

        {/* Specular arc highlight */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: "20px 20px 0 0",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center gap-5 w-full px-10 py-12 min-h-[500px]" style={{ zIndex: 2 }}>
          <div className="title relative flex flex-col items-center my-6 mb-5">
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[#6b9e99]">
              LAMP
            </h1>
          </div>

          <p className="text-base text-text-secondary font-sans font-medium">
            Listen: Album Museum & Portfolio
          </p>

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-text-tertiary font-mono font-light">
              listen, review, discover, & enjoy
            </p>
            <span className="text-text-tertiary text-xs tracking-widest">·⁺˚ ˚⁺·</span>
          </div>

          <div className="flex gap-10 mt-1">
            <Link href="/signup" className="btn-join px-6 py-2 font-sans font-bold text-sm text-white">
              join LAMP
            </Link>
            <Link href="/login" className="btn-signin px-6 py-2 font-sans font-semibold text-sm text-[#6b9e99]">
              Sign In
            </Link>
          </div>

          <div className="mt-auto w-full">
            <NowPlaying albumName={track.name} artist={track.artist} previewUrl={track.previewUrl} />
          </div>
        </div>
      </div>
    </>
  );
}
