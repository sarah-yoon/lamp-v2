import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSingle = vi.fn();
const mockSelectCount = vi.fn();
const mockSelectRatings = vi.fn();
const mockRange = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "profiles") {
        return { select: () => ({ eq: () => ({ single: mockSingle }) }) };
      }
      return {
        select: vi.fn().mockImplementation((_cols: string, opts?: any) => {
          if (opts?.count === "exact") {
            return { eq: () => mockSelectCount() };
          }
          if (_cols === "rating") {
            return { eq: () => mockSelectRatings() };
          }
          return {
            eq: () => ({
              order: () => ({ range: mockRange }),
            }),
          };
        }),
      };
    }),
  }),
}));

const { GET } = await import("@/app/api/profile/[username]/route");

describe("GET /api/profile/[username]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 404 when profile not found", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
    const req = new Request("http://localhost:3000/api/profile/nonexistent");
    const res = await GET(req, { params: Promise.resolve({ username: "nonexistent" }) });
    expect(res.status).toBe(404);
  });

  it("returns profile with stats and reviews", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "user-1", username: "testuser", bio: "Hi", favorite_genres: ["Rock"], avatar_url: null, created_at: "2026-01-01" },
      error: null,
    });
    mockSelectCount.mockResolvedValue({ count: 5 });
    mockSelectRatings.mockResolvedValue({ data: [{ rating: 4 }, { rating: 5 }, { rating: 3 }] });
    mockRange.mockResolvedValue({
      data: [{ id: "r1", spotify_album_id: "abc", album_name: "Album", album_artist: "Artist", album_image_url: "https://img.com/1.jpg", rating: 4, created_at: "2026-01-01" }],
      error: null,
    });

    const req = new Request("http://localhost:3000/api/profile/testuser");
    const res = await GET(req, { params: Promise.resolve({ username: "testuser" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.profile.username).toBe("testuser");
    expect(data.stats.totalReviews).toBe(5);
    expect(data.stats.avgRating).toBe(4);
    expect(data.reviews).toHaveLength(1);
    expect(data.pagination).toBeDefined();
  });

  it("returns correct pagination for page 2", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "user-1", username: "testuser", bio: "", favorite_genres: [], avatar_url: null, created_at: "2026-01-01" },
      error: null,
    });
    mockSelectCount.mockResolvedValue({ count: 25 });
    mockSelectRatings.mockResolvedValue({ data: [] });
    mockRange.mockResolvedValue({ data: [], error: null });

    const req = new Request("http://localhost:3000/api/profile/testuser?page=2");
    const res = await GET(req, { params: Promise.resolve({ username: "testuser" }) });
    const data = await res.json();

    expect(data.pagination.page).toBe(2);
    expect(data.pagination.totalPages).toBe(2);
  });
});
