import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";

const mockSignOut = vi.fn().mockResolvedValue({});
const mockPush = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signOut: mockSignOut },
  }),
}));

// Override useRouter for this file
vi.mock("next/navigation", async () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/explore",
}));

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders LAMP logo", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("LAMP")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("Explore").closest("a")).toHaveAttribute("href", "/explore");
    expect(screen.getByText("Search").closest("a")).toHaveAttribute("href", "/search");
    expect(screen.getByText("Trending").closest("a")).toHaveAttribute("href", "/trending");
    expect(screen.getByText("Saved").closest("a")).toHaveAttribute("href", "/saved");
  });

  it("displays username", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("displays user avatar with first letter uppercased", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("has sign out button", () => {
    render(<Sidebar username="testuser" />);
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls signOut and redirects to /login on sign out click", async () => {
    render(<Sidebar username="testuser" />);
    fireEvent.click(screen.getByText("Sign out"));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
