import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ReviewCard } from "@/src/components/reviews/review-card";
import { ReviewService } from "@/src/service";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

// Reviews come from the backend, so this band re-renders per request.
export async function ReviewsSection() {
  const result = await ReviewService.listReviews();
  const reviews = result.success && result.data ? result.data : [];

  // Nothing to show yet — keep the home page clean.
  if (reviews.length === 0) return null;

  const featured = reviews.slice(0, 3);

  return (
    <section id="reviews" className="grain bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Traveller reviews"
          title="Trusted by the people in the back seat."
          description="Real words from travellers who rode the passes with Namsras."
          dark
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {featured.map((review) => (
            <Reveal key={review.id}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/reviews">
              Read all reviews
              <ArrowRight data-slot="icon" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
          >
            <Link href="/reviews">Leave your own</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
