import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AlbumCard } from "@/components/AlbumCard";
import { StarRating } from "@/components/StarRating";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username}'s Profile` };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { username } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-text-primary mb-2">User not found</p>
        <p className="text-text-secondary">The profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isOwn = user?.id === profile.id;

  const { data: ratingData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("user_id", profile.id);

  const ratings = (ratingData || []).map((r: any) => r.rating);
  const totalReviews = ratings.length;
  const avgRating = totalReviews > 0
    ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / totalReviews) * 10) / 10
    : 0;

  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, spotify_album_id, album_name, album_artist, album_image_url, rating, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil(totalReviews / pageSize);

  return (
    <div>
      <ProfileHeader
        profile={profile}
        stats={{ totalReviews, avgRating }}
        isOwn={isOwn}
      />

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Reviews
        </h2>
      </div>

      {totalReviews === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-2">
            No reviews yet. {isOwn ? "Start rating albums to build your music portfolio!" : ""}
          </p>
          {isOwn && (
            <Link href="/search" className="text-accent-gold text-sm hover:opacity-80">
              Search for albums →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(reviews || []).map((review: any) => (
              <div key={review.id}>
                <AlbumCard
                  id={review.spotify_album_id}
                  name={review.album_name}
                  artist={review.album_artist}
                  imageUrl={review.album_image_url || ""}
                />
                <div className="mt-1">
                  <StarRating value={review.rating} readonly size="sm" />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/profile/${username}`}
          />
        </>
      )}
    </div>
  );
}
