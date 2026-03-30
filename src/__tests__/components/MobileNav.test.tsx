import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileNav from "@/components/MobileNav";

describe("MobileNav", () => {
  it("renders all 4 tab labels", () => {
    render(<MobileNav username="testuser" />);
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders correct links", () => {
    render(<MobileNav username="testuser" />);
    expect(screen.getByText("Explore").closest("a")).toHaveAttribute("href", "/explore");
    expect(screen.getByText("Trending").closest("a")).toHaveAttribute("href", "/trending");
    expect(screen.getByText("Saved").closest("a")).toHaveAttribute("href", "/saved");
  });

  it("links profile to /profile/[username]", () => {
    render(<MobileNav username="cooluser" />);
    expect(screen.getByText("Profile").closest("a")).toHaveAttribute("href", "/profile/cooluser");
  });

  it("renders icons for each tab", () => {
    render(<MobileNav username="testuser" />);
    expect(screen.getByText("🎵")).toBeInTheDocument();
    expect(screen.getByText("🔥")).toBeInTheDocument();
    expect(screen.getByText("🔖")).toBeInTheDocument();
    expect(screen.getByText("👤")).toBeInTheDocument();
  });
});
