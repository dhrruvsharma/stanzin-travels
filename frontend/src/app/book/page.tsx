import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { CONTACT } from "@/src/lib/site-data";

export const metadata: Metadata = {
  title: "Book your trip — Stanzin Travels",
  description:
    "Request a Ladakh trip with Stanzin Travels — drivers, stays and complete itineraries.",
};

/** Placeholder for the trip request form; the form will live here. */
export default function BookPage() {
  return (
    <main className="grain flex min-h-svh flex-col items-center justify-center bg-ink px-4 py-24 text-center">
      <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
        <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
        Trip request
        <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
      </p>
      <h1 className="mt-5 font-display text-4xl font-medium text-bone sm:text-6xl">
        Book your trip.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-bone/75">
        Until the request form lands here, the fastest way to lock in your
        dates is a call or a WhatsApp message.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a href={CONTACT.tel}>
            <Phone data-slot="icon" />
            {CONTACT.phoneDisplay}
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
        >
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle data-slot="icon" />
            WhatsApp
          </a>
        </Button>
      </div>

      <Button
        asChild
        variant="ghost"
        className="mt-12 text-bone/60 hover:bg-bone/10 hover:text-bone"
      >
        <Link href="/">
          <ArrowLeft data-slot="icon" />
          Back to home
        </Link>
      </Button>
    </main>
  );
}
