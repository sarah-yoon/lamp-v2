export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  favorite_genres: string[];
  avatar_url: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  spotify_album_id: string;
  album_name: string;
  album_artist: string;
  album_image_url: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface WantToListen {
  id: string;
  user_id: string;
  spotify_album_id: string;
  album_name: string;
  album_artist: string;
  album_image_url: string | null;
  created_at: string;
}

export interface AlbumDetail {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string; width: number; height: number }[];
  release_date: string;
  tracks: { items: { name: string; duration_ms: number; track_number: number }[] };
}

export interface ReviewsResponse {
  locked: boolean;
  count: number;
  reviews?: (Review & { username: string })[];
  userReview?: Review | null;
}

export interface TrendingAlbum {
  spotify_album_id: string;
  album_name: string;
  album_artist: string;
  album_image_url: string | null;
  review_count: number;
  avg_rating: number;
  trending_score: number;
}
