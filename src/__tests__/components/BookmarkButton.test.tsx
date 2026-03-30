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

describe("BookmarkButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders unsaved state by default", () => {
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
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /unsave/i })).toBeInTheDocument();
    });
  });

  it("reverts on failed save", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });

  it("calls POST to save and DELETE to unsave", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    render(<BookmarkButton albumId="abc" albumData={albumData} />);

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
});
