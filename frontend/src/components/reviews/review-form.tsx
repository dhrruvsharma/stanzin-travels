"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Star } from "lucide-react";
import { createReviewAction } from "@/src/actions/review";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Reveal } from "@/src/components/landing/reveal";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-ink-2 px-4 py-3 text-base text-bone shadow-none transition-colors outline-none placeholder:text-bone/35 hover:border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/35";

const fieldLabelClass =
  "mb-2 block text-xs font-semibold tracking-[0.18em] text-bone/60 uppercase";

const MAX_RATING = 5;

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(null)}>
      {Array.from({ length: MAX_RATING }, (_, i) => {
        const star = i + 1;
        const active = star <= shown;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            aria-pressed={star <= value}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star === value ? star - 1 : star)}
            className="rounded-md p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-8 transition-colors",
                active
                  ? "fill-saffron text-saffron"
                  : "fill-transparent text-bone/30",
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      <span className="ml-2 min-w-16 text-sm text-bone/60">
        {value > 0 ? `${value} / ${MAX_RATING}` : "Rate us"}
      </span>
    </div>
  );
}

export function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Tell us your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      return setError("That email doesn't look right.");
    if (rating < 1) return setError("Give us a star rating.");
    if (!body.trim()) return setError("Write a few words about your trip.");

    setSubmitting(true);
    const result = await createReviewAction({
      name: name.trim(),
      email: email.trim(),
      rating,
      body: body.trim(),
    });
    setSubmitting(false);

    if (result.success) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.message);
    }
  };

  if (done) {
    return (
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-ink-2 p-8 text-center sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-flag-green/15 text-flag-green">
            <Check className="size-7" strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 font-display text-2xl font-medium text-bone sm:text-3xl">
            Julley, {name.split(" ")[0]}!
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-bone/70">
            Thank you for the kind words — your review is in. It helps other
            travellers find their way to the mountains.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-white/10 bg-ink-2/60 p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className={fieldLabelClass}>
              Your name
            </label>
            <input
              id="review-name"
              type="text"
              autoComplete="name"
              maxLength={120}
              placeholder="Tenzin Dorjay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="review-email" className={fieldLabelClass}>
              Email
            </label>
            <input
              id="review-email"
              type="email"
              autoComplete="email"
              maxLength={200}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-bone/45">
              One review per email — no verification, no spam.
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className={fieldLabelClass}>Your rating</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="review-body" className={fieldLabelClass}>
              Your review
            </label>
            <textarea
              id="review-body"
              rows={5}
              maxLength={2000}
              placeholder="Tell fellow travellers about your trip with Laddakh Hodophile…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={cn(inputClass, "resize-y")}
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-5 text-sm font-medium text-flag-red">
            {error}
          </p>
        ) : null}

        <div className="mt-6">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? (
              <Loader2 data-slot="icon" className="animate-spin" />
            ) : (
              <ArrowRight data-slot="icon" />
            )}
            {submitting ? "Posting your review…" : "Post review"}
          </Button>
        </div>
      </form>
    </Reveal>
  );
}
