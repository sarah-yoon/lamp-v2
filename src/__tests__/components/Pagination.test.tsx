import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/Pagination";

describe("Pagination", () => {
  it("renders current page indicator", () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/profile/testuser" />);
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("renders Previous link when not on first page", () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/profile/testuser" />);
    const prev = screen.getByText("Previous");
    expect(prev.closest("a")).toHaveAttribute("href", "/profile/testuser?page=1");
  });

  it("does not render Previous on first page", () => {
    render(<Pagination currentPage={1} totalPages={5} baseUrl="/profile/testuser" />);
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("renders Next link when not on last page", () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/profile/testuser" />);
    const next = screen.getByText("Next");
    expect(next.closest("a")).toHaveAttribute("href", "/profile/testuser?page=3");
  });

  it("does not render Next on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} baseUrl="/profile/testuser" />);
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("renders nothing when only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} baseUrl="/profile/testuser" />);
    expect(container.firstChild).toBeNull();
  });
});
