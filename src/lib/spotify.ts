let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to get Spotify access token");

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken!;
}

async function spotifyFetch(endpoint: string, revalidate?: number) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchAlbums(query: string) {
  const data = await spotifyFetch(
    `/search?type=album&q=${encodeURIComponent(query)}&limit=20`,
    0
  );
  return data.albums.items;
}

export async function getAlbum(id: string) {
  return spotifyFetch(`/albums/${id}`, 86400);
}

export async function getNewReleases() {
  const data = await spotifyFetch("/browse/new-releases?limit=20", 3600);
  return data.albums.items;
}
