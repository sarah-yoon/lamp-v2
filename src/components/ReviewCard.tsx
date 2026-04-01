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
    <div className={isOwn ? "glass p-4 border border-accent-gold/40" : "glass p-4"}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isOwn && (
            <span className="text-[10px] uppercase tracking-wider text-accent-gold font-semibold bg-accent-gold/10 px-2 py-0.5 rounded-full">
              Your Review
            </span>
          )}
          <span className="text-sm font-medium text-text-primary">{username}</span>
          <span className="text-xs text-text-tertiary font-mono font-light">{date}</span>
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
        <p className="text-sm text-text-secondary font-serif mt-2 leading-relaxed">{reviewText}</p>
      )}
    </div>
  );
}
