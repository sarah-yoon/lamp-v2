import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: mockOrder,
        }),
      }),
      insert: (data: any) => {
        mockInsert(data);
        return { select: () => ({ single: vi.fn().mockResolvedValue({ data: { id: "wtl-1", ...data }, error: null }) }) };
      },
    }),
  }),
}));

const { GET, POST } = await import("@/app/api/want-to-listen/route");

describe("GET /api/want-to-listen", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns saved albums for authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockOrder.mockResolvedValue({
      data: [{ id: "wtl-1", spotify_album_id: "abc", album_name: "Test" }],
      error: null,
    });

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
  });
});

describe("POST /api/want-to-listen", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/want-to-listen", {
      method: "POST",
      body: JSON.stringify({ spotify_album_id: "abc", album_name: "Test", album_artist: "Artist" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when missing required fields", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const req = new NextRequest("http://localhost:3000/api/want-to-listen", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 on successful save", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const req = new NextRequest("http://localhost:3000/api/want-to-listen", {
      method: "POST",
      body: JSON.stringify({
        spotify_album_id: "abc",
        album_name: "Test Album",
        album_artist: "Test Artist",
        album_image_url: "https://example.com/img.jpg",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
