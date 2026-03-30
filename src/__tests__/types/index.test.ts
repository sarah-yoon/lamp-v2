import { describe, it, expectTypeOf } from "vitest";
import type {
  UserProfile,
  Review,
  WantToListen,
  AlbumDetail,
  ReviewsResponse,
  TrendingAlbum,
} from "@/types";

describe("TypeScript interfaces", () => {
  it("UserProfile has correct shape", () => {
    const profile: UserProfile = {
      id: "uuid",
      username: "testuser",
      bio: "Hello",
      favorite_genres: ["Rock"],
      avatar_url: null,
      created_at: "2024-01-01",
    };
    expectTypeOf(profile.id).toBeString();
    expectTypeOf(profile.username).toBeString();
    expectTypeOf(profile.bio).toBeString();
    expectTypeOf(profile.favorite_genres).toEqualTypeOf<string[]>();
    expectTypeOf(profile.avatar_url).toEqualTypeOf<string | null>();
    expectTypeOf(profile.created_at).toBeString();
  });

  it("Review has correct shape", () => {
    const review: Review = {
      id: "uuid",
      user_id: "uuid",
      spotify_album_id: "abc",
      album_name: "Album",
      album_artist: "Artist",
      album_image_url: null,
      rating: 4,
      review_text: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };
    expectTypeOf(review.rating).toBeNumber();
    expectTypeOf(review.review_text).toEqualTypeOf<string | null>();
    expectTypeOf(review.album_image_url).toEqualTypeOf<string | null>();
  });

  it("WantToListen has correct shape", () => {
    const item: WantToListen = {
      id: "uuid",
      user_id: "uuid",
      spotify_album_id: "abc",
      album_name: "Album",
      album_artist: "Artist",
      album_image_url: "https://example.com/img.jpg",
      created_at: "2024-01-01",
    };
    expectTypeOf(item.spotify_album_id).toBeString();
  });

  it("AlbumDetail has correct nested shape", () => {
    const album: AlbumDetail = {
      id: "abc",
      name: "Test Album",
      artists: [{ name: "Artist" }],
      images: [{ url: "https://img.com/a.jpg", width: 640, height: 640 }],
      release_date: "2024-01-01",
      tracks: {
        items: [{ name: "Track 1", duration_ms: 200000, track_number: 1 }],
      },
    };
    expectTypeOf(album.artists).toEqualTypeOf<{ name: string }[]>();
    expectTypeOf(album.tracks.items[0].duration_ms).toBeNumber();
  });

  it("ReviewsResponse has locked and unlocked variants", () => {
    const locked: ReviewsResponse = { locked: true, count: 5 };
    expectTypeOf(locked.locked).toBeBoolean();
    expectTypeOf(locked.count).toBeNumber();
    expectTypeOf(locked.reviews).toEqualTypeOf<(Review & { username: string })[] | undefined>();

    const unlocked: ReviewsResponse = {
      locked: false,
      count: 5,
      reviews: [],
      userReview: null,
    };
    expectTypeOf(unlocked.userReview).toEqualTypeOf<Review | null | undefined>();
  });

  it("TrendingAlbum has scoring fields", () => {
    const trending: TrendingAlbum = {
      spotify_album_id: "abc",
      album_name: "Album",
      album_artist: "Artist",
      album_image_url: null,
      review_count: 100,
      avg_rating: 4.2,
      trending_score: 620,
    };
    expectTypeOf(trending.review_count).toBeNumber();
    expectTypeOf(trending.avg_rating).toBeNumber();
    expectTypeOf(trending.trending_score).toBeNumber();
  });
});
