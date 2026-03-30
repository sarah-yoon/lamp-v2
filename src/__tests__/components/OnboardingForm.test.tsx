import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingForm from "@/components/OnboardingForm";

const mockInsert = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    mockInsert.mockResolvedValue({ error: null });
  });

  it("renders username input and genre selection", () => {
    render(<OnboardingForm />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByText("Rock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("renders profile setup header", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Set up your profile")).toBeInTheDocument();
  });

  it("shows error for username shorter than 3 chars", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "ab" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/Username must be 3–30 characters/i)).toBeInTheDocument();
    });
  });

  it("shows error for username with special characters", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "user@name!" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/letters, numbers, or underscores/i)).toBeInTheDocument();
    });
  });

  it("shows error for reserved username", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/reserved/i)).toBeInTheDocument();
    });
  });

  it("shows error for reserved username case-insensitive", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "Admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/reserved/i)).toBeInTheDocument();
    });
  });

  it("shows error for duplicate username (23505 error)", async () => {
    mockInsert.mockResolvedValue({ error: { code: "23505", message: "duplicate" } });
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "takenuser" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/taken/i)).toBeInTheDocument();
    });
  });

  it("shows error when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Not authenticated") });
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
    });
  });

  it("accepts valid username with letters, numbers, underscores", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "cool_user_123" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it("shows loading state while submitting", async () => {
    mockInsert.mockReturnValue(new Promise(() => {})); // never resolves
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Saving\u2026" })).toBeDisabled();
    });
  });

  it("submits with selected genres", async () => {
    render(<OnboardingForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "musicfan" } });
    fireEvent.click(screen.getByText("Rock"));
    fireEvent.click(screen.getByText("Jazz"));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        id: "user-1",
        username: "musicfan",
        favorite_genres: ["Rock", "Jazz"],
      });
    });
  });
});
