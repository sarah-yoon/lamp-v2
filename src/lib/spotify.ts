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

async function spotifyFetch(endpoint: string, cache?: "no-store" | number) {
  const token = await getAccessToken();
  const options: RequestInit & { next?: { revalidate: number } } = {
    headers: { Authorization: `Bearer ${token}` },
  };

  if (cache === "no-store") {
    options.cache = "no-store";
  } else if (typeof cache === "number") {
    options.next = { revalidate: cache };
  }

  const url = `https://api.spotify.com/v1${endpoint}`;
  console.log("Spotify fetch:", url);
  const res = await fetch(url, options);

  if (!res.ok) {
    const body = await res.text();
    console.error("Spotify error body:", body);
    throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchAlbums(query: string) {
  const data = await spotifyFetch(
    `/search?type=album&q=${encodeURIComponent(query)}&limit=10`,
    "no-store"
  );
  return data.albums.items;
}

export async function getAlbum(id: string) {
  return spotifyFetch(`/albums/${id}`, 86400);
}

export async function getNewReleases() {
  const data = await spotifyFetch("/browse/new-releases?limit=10", 3600);
  return data.albums.items;
}

export async function searchByYear(year: number) {
  const data = await spotifyFetch(
    `/search?type=album&q=year%3A${year}&limit=10`,
    3600
  );
  return data.albums.items;
}

export async function searchByGenre(genre: string) {
  const data = await spotifyFetch(
    `/search?type=album&q=genre%3A${encodeURIComponent(genre)}&limit=10`,
    3600
  );
  return data.albums.items;
}
