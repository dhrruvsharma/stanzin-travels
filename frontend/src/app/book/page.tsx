import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { TripRequestForm } from "@/src/components/book/trip-request-form";
import { CONTACT } from "@/src/lib/site-data";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/src/lib/seo";

export const metadata = pageMetadata({
  title: "Book your Ladakh trip",
  description:
    "Request a Ladakh trip with Laddakh Hodophile — drivers, vehicles, stays and complete itineraries. Tell us your dates and group; Namsras calls you back. No payment, no login.",
  path: "/book",
  keywords: [
    "book Ladakh trip",
    "Ladakh trip enquiry",
    "hire taxi in Leh",
    "Ladakh tour booking",
    "custom Ladakh itinerary",
  ],
});

export default function BookPage() {
  return (
    <main className="grain min-h-svh bg-ink pb-24 sm:pb-32">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-bone/60 transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-4" />
          {CONTACT.name}
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
            Trip request
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] font-medium text-balance text-bone sm:text-6xl">
            Tell us about your trip.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Four quick things — who&apos;s coming, what you need, when, and on
            what wheels. Namsras calls you back to lock it in. No payment, no
            login.
          </p>
        </div>

        <TripRequestForm />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Book your Ladakh trip", path: "/book" },
          ]),
        )}
      />
    </main>
  );
}
