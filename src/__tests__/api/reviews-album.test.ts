import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockSingle = vi.fn();
const mockSelectCount = vi.fn();
const mockSelectReviews = vi.fn();
const mockSelectProfiles = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            in: () => mockSelectProfiles(),
          }),
        };
      }
      // reviews table
      return {
        select: vi.fn().mockImplementation((cols: string, opts?: any) => {
          if (opts?.count === "exact") {
            return {
              eq: () => mockSelectCount(),
            };
          }
          if (cols === "*") {
            return {
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({ single: mockSingle }),
                order: () => mockSelectReviews(),
              }),
            };
          }
          return {
            eq: () => ({
              order: () => mockSelectReviews(),
            }),
          };
        }),
      };
    }),
  }),
}));

const { GET } = await import("@/app/api/reviews/album/[albumId]/route");

function makeRequest() {
  return new Request("http://localhost:3000/api/reviews/album/test-album-id");
}

describe("GET /api/reviews/album/[albumId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET(makeRequest(), {
      params: Promise.resolve({ albumId: "test-album" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns locked:true when user has not reviewed the album", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingle.mockResolvedValue({ data: null });
    mockSelectCount.mockResolvedValue({ count: 5 });

    const res = await GET(makeRequest(), {
      params: Promise.resolve({ albumId: "test-album" }),
    });
    const data = await res.json();

    expect(data.locked).toBe(true);
    expect(data.count).toBe(5);
    expect(data.reviews).toBeUndefined();
  });

  it("returns locked:false with reviews when user has reviewed", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingle.mockResolvedValue({
      data: { id: "review-1", user_id: "user-1", rating: 4 },
    });
    mockSelectCount.mockResolvedValue({ count: 3 });
    mockSelectReviews.mockResolvedValue({
      data: [
        { id: "review-1", user_id: "user-1", rating: 4 },
        { id: "review-2", user_id: "user-2", rating: 5 },
      ],
    });
    mockSelectProfiles.mockResolvedValue({
      data: [
        { id: "user-1", username: "testuser" },
        { id: "user-2", username: "otheruser" },
      ],
    });

    const res = await GET(makeRequest(), {
      params: Promise.resolve({ albumId: "test-album" }),
    });
    const data = await res.json();

    expect(data.locked).toBe(false);
    expect(data.count).toBe(3);
    expect(data.reviews).toBeDefined();
    expect(data.reviews.length).toBe(2);
    expect(data.reviews[0].username).toBe("testuser");
    expect(data.reviews[1].username).toBe("otheruser");
    expect(data.userReview).toBeDefined();
  });

  it("returns count of 0 when no reviews exist", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockSingle.mockResolvedValue({ data: null });
    mockSelectCount.mockResolvedValue({ count: 0 });

    const res = await GET(makeRequest(), {
      params: Promise.resolve({ albumId: "new-album" }),
    });
    const data = await res.json();

    expect(data.locked).toBe(true);
    expect(data.count).toBe(0);
  });
});
