import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    rpc: (fn: string, params: any) => mockRpc(fn, params),
  }),
}));

const { GET } = await import("@/app/api/trending/route");

function makeRequest(params: string = "") {
  return new Request(`http://localhost:3000/api/trending${params ? `?${params}` : ""}`);
}

describe("GET /api/trending", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns trending albums with default period 'all'", async () => {
    mockRpc.mockResolvedValue({
      data: [
        { spotify_album_id: "abc", album_name: "Test", album_artist: "Artist", review_count: 10, avg_rating: 4.5, trending_score: 65 },
      ],
      error: null,
    });

    const res = await GET(makeRequest());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].album_name).toBe("Test");
    expect(mockRpc).toHaveBeenCalledWith("get_trending", { period: "all" });
  });

  it("passes period parameter to RPC", async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });
    await GET(makeRequest("period=week"));
    expect(mockRpc).toHaveBeenCalledWith("get_trending", { period: "week" });
  });

  it("supports offset and limit for pagination", async () => {
    const allAlbums = Array.from({ length: 25 }, (_, i) => ({
      spotify_album_id: `album-${i}`,
      album_name: `Album ${i}`,
      album_artist: "Artist",
      review_count: 25 - i,
      avg_rating: 4.0,
      trending_score: (25 - i) * 6,
    }));
    mockRpc.mockResolvedValue({ data: allAlbums, error: null });

    const res = await GET(makeRequest("period=all&offset=20&limit=20"));
    const data = await res.json();
    expect(data).toHaveLength(5);
  });

  it("returns 500 on RPC error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "DB error" } });
    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });

  it("defaults invalid period to 'all'", async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });
    await GET(makeRequest("period=invalid"));
    expect(mockRpc).toHaveBeenCalledWith("get_trending", { period: "all" });
  });
});
