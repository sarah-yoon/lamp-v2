import Image from "next/image";
import Link from "next/link";
import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfile;
  stats: { totalReviews: number; avgRating: number };
  isOwn: boolean;
}

export function ProfileHeader({ profile, stats, isOwn }: ProfileHeaderProps) {
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-accent-gold flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-bg text-2xl sm:text-3xl font-bold">
              {profile.username[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <h1 className="text-2xl font-bold text-text-primary">{profile.username}</h1>
            {isOwn && (
              <Link
                href="/profile/edit"
                className="text-xs px-3 py-1 rounded-lg bg-surface border border-surface-border text-text-secondary hover:text-text-primary transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
          <p className="text-sm text-text-tertiary mt-1">Joined {joinDate}</p>
          {profile.bio && (
            <p className="text-sm text-text-secondary mt-2">{profile.bio}</p>
          )}
          {profile.favorite_genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
              {profile.favorite_genres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2.5 py-1 rounded-full bg-surface border border-surface-border text-text-secondary"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 justify-center sm:justify-start">
        <div className="text-center">
          <p className="text-xl font-bold text-text-primary">{stats.totalReviews}</p>
          <p className="text-xs text-text-tertiary uppercase tracking-wider">Albums Rated</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-text-primary">{stats.avgRating || "—"}</p>
          <p className="text-xs text-text-tertiary uppercase tracking-wider">Avg Rating</p>
        </div>
      </div>
    </div>
  );
}
