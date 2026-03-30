"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface AvatarUploadProps {
  currentUrl: string | null;
  username: string;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ currentUrl, username, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || currentUrl;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onUpload(data.avatar_url);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-accent-gold">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={username}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bg text-3xl font-bold">
            {username[0]?.toUpperCase()}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
            <span className="text-text-primary text-xs">Uploading...</span>
          </div>
        )}
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-accent-gold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Change Avatar"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-accent-coral text-xs">{error}</p>}
    </div>
  );
}
