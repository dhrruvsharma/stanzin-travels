import { cn } from "@/src/lib/utils";

/** Thin five-colour band echoing a string of lungta prayer flags. */
export function PrayerFlagStripe({ className }: { className?: string }) {
  return <div aria-hidden className={cn("flag-stripe h-1 w-full", className)} />;
}
