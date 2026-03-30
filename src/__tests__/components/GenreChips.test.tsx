import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GenreChips from "@/components/GenreChips";

const ALL_GENRES = [
  "Rock", "Pop", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic",
  "Country", "Folk", "Metal", "Punk", "Indie", "Blues", "Soul",
  "Reggae", "Latin", "K-Pop", "Alternative",
];

describe("GenreChips", () => {
  it("renders all 18 genres", () => {
    render(<GenreChips selected={[]} onChange={() => {}} />);
    ALL_GENRES.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  it("calls onChange with genre added when clicking unselected genre", () => {
    const onChange = vi.fn();
    render(<GenreChips selected={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Rock"));
    expect(onChange).toHaveBeenCalledWith(["Rock"]);
  });

  it("calls onChange with genre removed when clicking selected genre", () => {
    const onChange = vi.fn();
    render(<GenreChips selected={["Rock", "Jazz"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Rock"));
    expect(onChange).toHaveBeenCalledWith(["Jazz"]);
  });

  it("supports multiple selections", () => {
    const onChange = vi.fn();
    render(<GenreChips selected={["Rock"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Pop"));
    expect(onChange).toHaveBeenCalledWith(["Rock", "Pop"]);
  });

  it("renders all buttons with type='button' to prevent form submission", () => {
    render(<GenreChips selected={[]} onChange={() => {}} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });
});
