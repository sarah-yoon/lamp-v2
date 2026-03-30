import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mockGetUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}));

// Stub env vars
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

const { updateSession } = await import("@/lib/supabase/middleware");

function makeRequest(path: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("updateSession middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users from protected routes to /login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(makeRequest("/explore"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("allows unauthenticated users on public paths", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const paths = ["/", "/login", "/signup"];
    for (const path of paths) {
      const response = await updateSession(makeRequest(path));
      expect(response.status).not.toBe(307);
    }
  });

  it("allows unauthenticated users on /auth/* paths", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(makeRequest("/auth/callback"));
    expect(response.status).not.toBe(307);
  });

  it("allows unauthenticated users on /api/* paths", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(makeRequest("/api/health"));
    expect(response.status).not.toBe(307);
  });

  it("redirects authenticated users from /login to /explore", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(makeRequest("/login"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/explore");
  });

  it("redirects authenticated users from /signup to /explore", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(makeRequest("/signup"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/explore");
  });

  it("allows authenticated users on protected routes", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(makeRequest("/explore"));
    expect(response.status).not.toBe(307);
  });

  it("allows authenticated users on /trending", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(makeRequest("/trending"));
    expect(response.status).not.toBe(307);
  });

  it("allows authenticated users on /saved", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(makeRequest("/saved"));
    expect(response.status).not.toBe(307);
  });

  it("redirects unauthenticated users from /album/[id]", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(makeRequest("/album/abc123"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });
});
