import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Set env vars before importing
vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client-id");
vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-client-secret");

const mockFetch = vi.fn();
global.fetch = mockFetch;

// We need to reset module state between tests since it uses module-level token caching
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client-id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-client-secret");
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

describe("Spotify API service", () => {
  it("searchAlbums fetches token then searches", async () => {
    // Token fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token", expires_in: 3600 }),
    });
    // Search fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        albums: {
          items: [{ id: "1", name: "Album 1" }],
        },
      }),
    });

    const { searchAlbums } = await import("@/lib/spotify");
    const results = await searchAlbums("test query");

    expect(results).toEqual([{ id: "1", name: "Album 1" }]);

    // Verify token request
    expect(mockFetch).toHaveBeenCalledWith(
      "https://accounts.spotify.com/api/token",
      expect.objectContaining({
        method: "POST",
        body: "grant_type=client_credentials",
      })
    );

    // Verify search request
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/search?type=album&q=test%20query&limit=10"),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );
  });

  it("getAlbum fetches album by ID", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token", expires_in: 3600 }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "album-1", name: "Test Album" }),
    });

    const { getAlbum } = await import("@/lib/spotify");
    const album = await getAlbum("album-1");

    expect(album).toEqual({ id: "album-1", name: "Test Album" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.spotify.com/v1/albums/album-1",
      expect.anything()
    );
  });

  it("getNewReleases fetches new releases", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token", expires_in: 3600 }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        albums: { items: [{ id: "new-1", name: "New Album" }] },
      }),
    });

    const { getNewReleases } = await import("@/lib/spotify");
    const releases = await getNewReleases();

    expect(releases).toEqual([{ id: "new-1", name: "New Album" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.spotify.com/v1/browse/new-releases?limit=10",
      expect.anything()
    );
  });

  it("throws on failed token fetch", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

    const { searchAlbums } = await import("@/lib/spotify");
    await expect(searchAlbums("test")).rejects.toThrow("Failed to get Spotify access token");
  });

  it("throws on failed API call", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token", expires_in: 3600 }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: () => Promise.resolve("Album not found"),
    });

    const { searchAlbums } = await import("@/lib/spotify");
    await expect(searchAlbums("nonexistent")).rejects.toThrow("Spotify API error: 404 Not Found");
  });

  it("encodes search query for URL safety", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token", expires_in: 3600 }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ albums: { items: [] } }),
    });

    const { searchAlbums } = await import("@/lib/spotify");
    await searchAlbums("Beyoncé & Jay-Z");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("Beyonc%C3%A9%20%26%20Jay-Z"),
      expect.anything()
    );
  });
});
