import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock supabase
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockSelectChain = vi.fn();
const mockSingleInsert = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: () => ({
      insert: (data: any) => {
        mockInsert(data);
        return {
          select: () => ({ single: mockSingleInsert }),
        };
      },
    }),
  }),
}));

const { POST } = await import("@/app/api/reviews/route");

function makeRequest(body: any) {
  return new NextRequest("http://localhost:3000/api/reviews", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(makeRequest({ spotify_album_id: "abc", album_name: "Test", album_artist: "Artist", rating: 4 }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 when missing required fields", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(makeRequest({ rating: 4 }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 for rating below 1", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 0,
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Rating must be 1-5");
  });

  it("returns 400 for rating above 5", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 6,
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-integer rating", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 3.5,
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for review text over 2000 characters", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 4,
      review_text: "a".repeat(2001),
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Review too long (max 2000 chars)");
  });

  it("returns 201 on successful review creation", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const reviewData = { id: "review-1", rating: 4 };
    mockSingleInsert.mockResolvedValue({ data: reviewData, error: null });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test Album",
      album_artist: "Test Artist",
      rating: 4,
      review_text: "Great album!",
    }));
    expect(res.status).toBe(201);
  });

  it("returns 409 for duplicate review", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingleInsert.mockResolvedValue({ data: null, error: { code: "23505", message: "duplicate" } });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 4,
    }));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("You've already reviewed this album");
  });

  it("trims review text before insertion", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingleInsert.mockResolvedValue({ data: { id: "review-1" }, error: null });

    await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 4,
      review_text: "  Great album!  ",
    }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ review_text: "Great album!" })
    );
  });

  it("allows review without review_text (rating only)", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingleInsert.mockResolvedValue({ data: { id: "review-1" }, error: null });

    const res = await POST(makeRequest({
      spotify_album_id: "abc",
      album_name: "Test",
      album_artist: "Artist",
      rating: 5,
    }));
    expect(res.status).toBe(201);
  });
});
