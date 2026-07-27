import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Review } from "@/src/schema/review/index.type";

const MAX_RATING = 5;

/** Read-only row of stars for a given rating out of 5. */
export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of ${MAX_RATING} stars`}>
      {Array.from({ length: MAX_RATING }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-saffron text-saffron" : "fill-transparent text-bone/25",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-2 p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-bone/80">
        “{review.body}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {initials(review.name)}
        </span>
        <span>
          <span className="block text-sm font-medium text-bone">
            {review.name}
          </span>
          <span className="block text-xs text-bone/50">
            {formatDate(review.created_at)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
