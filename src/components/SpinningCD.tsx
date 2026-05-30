"use client";

interface SpinningCDProps {
  albumArt?: string | null;
  albumName?: string;
  size?: number;
}

export default function SpinningCD({ albumArt, albumName, size = 380 }: SpinningCDProps) {
  return (
    <div
      aria-label={albumName ? `Album art: ${albumName}` : "Spinning CD"}
      className="cd-spin"
      style={{
        width: size,
        height: size,
        position: "relative",
        borderRadius: "50%",
        flexShrink: 0,
        filter: "drop-shadow(0 24px 64px rgba(0,0,0,0.35))",
      }}
    >
      {/* Album art or gradient fallback */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundImage: albumArt
            ? `url(${albumArt})`
            : "conic-gradient(from 0deg, #b5d4cf, #c8b4d4, #d4b4b4, #b4ccd4, #b5d4cf)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Iridescent prism overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, rgba(255,80,80,0.1), rgba(255,210,60,0.09), rgba(60,255,140,0.1), rgba(60,140,255,0.09), rgba(200,60,255,0.1), rgba(255,80,80,0.1))",
          mixBlendMode: "overlay",
        }}
      />

      {/* Center hub */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "28%",
          height: "28%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 32%, #f0f0f0, #b0b0b0 55%, #d0d0d0)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.25), inset 0 1px 3px rgba(255,255,255,0.6)",
        }}
      />

      {/* Center hole */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "7%",
          height: "7%",
          borderRadius: "50%",
          background: "var(--color-bg)",
        }}
      />
    </div>
  );
}
