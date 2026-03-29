import { StarRating } from "./StarRating";

interface ReviewCardProps {
  username: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({ username, rating, reviewText, createdAt, isOwn, onEdit, onDelete }: ReviewCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className={`p-4 rounded-lg border ${isOwn ? "border-accent-gold/30 bg-accent-gold/5" : "border-surface-border bg-surface"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isOwn && (
            <span className="text-[10px] uppercase tracking-wider text-accent-gold font-semibold bg-accent-gold/10 px-2 py-0.5 rounded-full">
              Your Review
            </span>
          )}
          <span className="text-sm font-medium text-text-primary">{username}</span>
          <span className="text-xs text-text-tertiary">{date}</span>
        </div>
        {isOwn && (
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-xs text-text-secondary hover:text-accent-gold transition-colors">Edit</button>
            <button onClick={onDelete} className="text-xs text-text-secondary hover:text-accent-coral transition-colors">Delete</button>
          </div>
        )}
      </div>
      <StarRating value={rating} readonly size="sm" />
      {reviewText && (
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{reviewText}</p>
      )}
    </div>
  );
}
