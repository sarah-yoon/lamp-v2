import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockUpdateSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: () => ({
      update: (data: any) => {
        mockUpdate(data);
        return {
          eq: vi.fn().mockReturnValue({
            eq: () => ({
              select: () => ({ single: mockUpdateSingle }),
            }),
          }),
        };
      },
      delete: () => {
        return {
          eq: vi.fn().mockReturnValue({
            eq: () => mockDelete(),
          }),
        };
      },
    }),
  }),
}));

const { PATCH, DELETE } = await import("@/app/api/reviews/[reviewId]/route");

describe("PATCH /api/reviews/[reviewId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest("http://localhost:3000/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ rating: 4 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid rating", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const req = new NextRequest("http://localhost:3000/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ rating: 6 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(400);
  });

  it("returns 400 for review text over 2000 chars", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const req = new NextRequest("http://localhost:3000/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ review_text: "a".repeat(2001) }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(400);
  });

  it("returns 200 on successful update", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockUpdateSingle.mockResolvedValue({ data: { id: "review-1", rating: 5 }, error: null });

    const req = new NextRequest("http://localhost:3000/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ rating: 5 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(200);
  });

  it("trims review text on update", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockUpdateSingle.mockResolvedValue({ data: { id: "review-1" }, error: null });

    const req = new NextRequest("http://localhost:3000/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ review_text: "  Updated review  " }),
      headers: { "Content-Type": "application/json" },
    });

    await PATCH(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(mockUpdate).toHaveBeenCalledWith({ review_text: "Updated review" });
  });
});

describe("DELETE /api/reviews/[reviewId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new Request("http://localhost:3000/api/reviews/review-1");
    const res = await DELETE(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns success on successful delete", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockDelete.mockResolvedValue({ error: null });

    const req = new Request("http://localhost:3000/api/reviews/review-1");
    const res = await DELETE(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    const data = await res.json();

    expect(data.success).toBe(true);
  });

  it("returns 500 when delete fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockDelete.mockResolvedValue({ error: { message: "DB error" } });

    const req = new Request("http://localhost:3000/api/reviews/review-1");
    const res = await DELETE(req, { params: Promise.resolve({ reviewId: "review-1" }) });
    expect(res.status).toBe(500);
  });
});
