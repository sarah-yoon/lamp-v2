import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Previous
        </Link>
      )}
      <span className="text-sm text-text-tertiary">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
