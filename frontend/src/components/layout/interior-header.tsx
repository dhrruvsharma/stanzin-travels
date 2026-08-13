import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { CONTACT } from "@/src/lib/site-data";

/** Back-to-home + call bar shared by the dark interior pages. */
export function InteriorHeader() {
  return (
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
  );
}
