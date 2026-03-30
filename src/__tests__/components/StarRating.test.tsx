import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StarRating } from "@/components/StarRating";

describe("StarRating", () => {
  it("renders 5 star buttons", () => {
    render(<StarRating value={0} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("calls onChange when a star is clicked", () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]); // 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onChange with correct value for each star", () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    [1, 2, 3, 4, 5].forEach((i) => {
      fireEvent.click(buttons[i - 1]);
      expect(onChange).toHaveBeenCalledWith(i);
    });
  });

  it("disables buttons in readonly mode", () => {
    render(<StarRating value={3} readonly />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("does not call onChange in readonly mode", () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} readonly />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders with different size classes", () => {
    const { container: sm } = render(<StarRating value={3} size="sm" />);
    expect(sm.firstChild).toHaveClass("text-sm");

    const { container: md } = render(<StarRating value={3} size="md" />);
    expect(md.firstChild).toHaveClass("text-xl");

    const { container: lg } = render(<StarRating value={3} size="lg" />);
    expect(lg.firstChild).toHaveClass("text-3xl");
  });
});
