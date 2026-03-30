import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookmarkButton } from "@/components/BookmarkButton";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const albumData = {
  name: "Test Album",
  artist: "Test Artist",
  imageUrl: "https://example.com/img.jpg",
};

// Helper: mock the initial check-if-saved fetch that fires on mount
function mockInitialCheck(saved: boolean) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ saved }) });
}

describe("BookmarkButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders unsaved state by default", () => {
    mockInitialCheck(false);
    render(<BookmarkButton albumId="abc" albumData={albumData} />);
    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
  });

  it("renders saved state when initialSaved is true", () => {
    render(<BookmarkButton albumId="abc" albumData={albumData} initialSaved={true} />);
    const button = screen.getByRole("button", { name: /unsave/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles to saved on click (optimistic)", async () => {
    mockInitialCheck(false);
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /unsave/i })).toBeInTheDocument();
    });
  });

  it("reverts on failed save", async () => {
    mockInitialCheck(false);
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });

  it("calls POST to save and DELETE to unsave", async () => {
    mockInitialCheck(false);
    // POST for save
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    // DELETE for unsave
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    // Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/want-to-listen", expect.objectContaining({ method: "POST" }));
    });

    // Unsave
    fireEvent.click(screen.getByRole("button", { name: /unsave/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/want-to-listen/abc", expect.objectContaining({ method: "DELETE" }));
    });
  });

  it("checks saved state on mount", async () => {
    mockInitialCheck(true);

    render(<BookmarkButton albumId="abc" albumData={albumData} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /unsave/i })).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/want-to-listen/abc");
  });
});
