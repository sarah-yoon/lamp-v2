import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the supabase server client
const mockSelect = vi.fn();
const mockLimit = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (table: string) => {
      mockFrom(table);
      return {
        select: (cols: string) => {
          mockSelect(cols);
          return { limit: mockLimit };
        },
      };
    },
  }),
}));

// Must import after mocks are set up
const { GET } = await import("@/app/api/health/route");

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with ok status when Supabase is healthy", async () => {
    mockLimit.mockResolvedValue({ error: null });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.supabase).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });

  it("returns 503 with degraded status when Supabase returns error", async () => {
    mockLimit.mockResolvedValue({ error: { message: "Connection refused" } });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("degraded");
    expect(data.supabase).toBe("error");
  });

  it("returns 503 when Supabase throws exception", async () => {
    mockLimit.mockRejectedValue(new Error("Network error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("degraded");
    expect(data.supabase).toBe("error");
  });

  it("queries the profiles table", async () => {
    mockLimit.mockResolvedValue({ error: null });

    await GET();

    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockSelect).toHaveBeenCalledWith("id");
    expect(mockLimit).toHaveBeenCalledWith(1);
  });

  it("includes ISO timestamp in response", async () => {
    mockLimit.mockResolvedValue({ error: null });

    const response = await GET();
    const data = await response.json();

    // Verify it's a valid ISO timestamp
    const parsed = new Date(data.timestamp);
    expect(parsed.toISOString()).toBe(data.timestamp);
  });
});
