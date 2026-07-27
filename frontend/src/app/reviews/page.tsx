import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { ReviewForm } from "@/src/components/reviews/review-form";
import { ReviewCard, Stars } from "@/src/components/reviews/review-card";
import { Reveal } from "@/src/components/landing/reveal";
import { CONTACT } from "@/src/lib/site-data";
import { ReviewService } from "@/src/service";

export const metadata: Metadata = {
  title: "Reviews — Stanzin Travels",
  description:
    "What travellers say about their Ladakh trips with Stanzin Travels — and leave a review of your own.",
};

// Reviews change when travellers post, so keep this page fresh.
export const dynamic = "force-dynamic";

function averageRating(ratings: number[]): string {
  if (ratings.length === 0) return "0.0";
  const sum = ratings.reduce((total, r) => total + r, 0);
  return (sum / ratings.length).toFixed(1);
}

export default async function ReviewsPage() {
  const result = await ReviewService.listReviews();
  const reviews = result.success && result.data ? result.data : [];
  const average = averageRating(reviews.map((r) => r.rating));

  return (
    <main className="grain min-h-svh bg-ink pb-24 sm:pb-32">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-bone/60 transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-4" />
          Stanzin Travels
        </Link>
        <a
          href={CONTACT.tel}
          className="inline-flex items-center gap-2 text-sm text-bone/60 transition-colors hover:text-primary"
        >
          <Phone className="size-4" />
          {CONTACT.phoneDisplay}
        </a>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="py-14 sm:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
            Traveller reviews
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] font-medium text-balance text-bone sm:text-6xl">
            Voices from the mountains.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Honest words from travellers who rode the passes with Namsras. Been
            with us? Leave a review below — it takes a minute.
          </p>
          {reviews.length > 0 ? (
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2">
              <Stars rating={Math.round(Number(average))} />
              <span className="text-sm text-bone/80">
                <span className="font-semibold text-bone">{average}</span> from{" "}
                {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : null}
        </div>

        <section className="mb-16 sm:mb-24">
          <h2 className="mb-6 font-display text-2xl font-medium text-bone">
            Leave a review
          </h2>
          <ReviewForm />
        </section>

        <section>
          <h2 className="mb-6 font-display text-2xl font-medium text-bone">
            What travellers say
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-bone/60">
              No reviews yet — be the first to share your trip.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {reviews.map((review) => (
                <Reveal key={review.id}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
