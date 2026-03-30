import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AlbumRow } from "@/components/AlbumRow";

const mockAlbums = [
  { id: "1", name: "Album 1", artists: [{ name: "Artist 1" }], images: [{ url: "https://example.com/1.jpg" }] },
  { id: "2", name: "Album 2", artists: [{ name: "Artist 2" }], images: [{ url: "https://example.com/2.jpg" }] },
];

describe("AlbumRow", () => {
  it("renders title", () => {
    render(<AlbumRow title="New Releases" albums={mockAlbums} />);
    expect(screen.getByText("New Releases")).toBeInTheDocument();
  });

  it("renders album cards", () => {
    render(<AlbumRow title="Test" albums={mockAlbums} />);
    expect(screen.getByText("Album 1")).toBeInTheDocument();
    expect(screen.getByText("Album 2")).toBeInTheDocument();
  });

  it("shows empty message when no albums and emptyMessage provided", () => {
    render(<AlbumRow title="Test" albums={[]} emptyMessage="No albums found" />);
    expect(screen.getByText("No albums found")).toBeInTheDocument();
  });

  it("renders nothing when no albums and no emptyMessage", () => {
    const { container } = render(<AlbumRow title="Test" albums={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
