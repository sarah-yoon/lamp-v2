import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "@/components/AuthForm";

// Mock supabase client
const mockSignUp = vi.fn();
const mockSignIn = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignIn,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
    }),
  }),
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: { origin: "http://localhost:3000" },
  writable: true,
});

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login mode", () => {
    it("renders login form with correct elements", () => {
      render(<AuthForm mode="login" />);
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
      expect(screen.getByText("Sign up")).toBeInTheDocument();
    });

    it("has link to signup page", () => {
      render(<AuthForm mode="login" />);
      const link = screen.getByText("Sign up");
      expect(link.closest("a")).toHaveAttribute("href", "/signup");
    });

    it("shows loading state on submit", async () => {
      mockSignIn.mockReturnValue(new Promise(() => {})); // never resolves
      render(<AuthForm mode="login" />);
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Signing in\u2026" })).toBeDisabled();
      });
    });

    it("shows error on failed login", async () => {
      mockSignIn.mockResolvedValue({ data: null, error: new Error("Invalid credentials") });
      render(<AuthForm mode="login" />);
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("redirects to /explore when user has profile", async () => {
      const mockPush = vi.fn();
      vi.mocked(await import("next/navigation")).useRouter = () => ({
        push: mockPush, refresh: vi.fn(), back: vi.fn(), replace: vi.fn(),
        forward: vi.fn(), prefetch: vi.fn(),
      }) as any;

      mockSignIn.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockResolvedValue({ data: { id: "user-1" }, error: null });

      render(<AuthForm mode="login" />);
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: "test@test.com",
          password: "password123",
        });
      });
    });
  });

  describe("Signup mode", () => {
    it("renders signup form with correct elements", () => {
      render(<AuthForm mode="signup" />);
      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
      expect(screen.getByText("Sign in")).toBeInTheDocument();
    });

    it("has link to login page", () => {
      render(<AuthForm mode="signup" />);
      const link = screen.getByText("Sign in");
      expect(link.closest("a")).toHaveAttribute("href", "/login");
    });

    it("shows confirmation message after signup with email confirmation", async () => {
      mockSignUp.mockResolvedValue({
        data: { session: null, user: { id: "user-1" } },
        error: null,
      });

      render(<AuthForm mode="signup" />);
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@test.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: "Create account" }));

      await waitFor(() => {
        expect(screen.getByText("Check your email")).toBeInTheDocument();
        expect(screen.getByText("new@test.com")).toBeInTheDocument();
      });
    });

    it("shows error on failed signup", async () => {
      mockSignUp.mockResolvedValue({ data: null, error: new Error("Email already registered") });

      render(<AuthForm mode="signup" />);
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "taken@test.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: "Create account" }));

      await waitFor(() => {
        expect(screen.getByText("Email already registered")).toBeInTheDocument();
      });
    });
  });
});
