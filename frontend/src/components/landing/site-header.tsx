"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CONTACT } from "@/src/lib/site-data";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Fleet", href: "#fleet" },
  { label: "Reach", href: "#reach" },
  { label: "Destinations", href: "#destinations" },
  { label: "About", href: "#about" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-bone">
            Stanzin
          </span>
          <span className="text-[0.6rem] font-semibold tracking-[0.32em] text-bone/60 uppercase group-hover:text-primary transition-colors">
            Travels · Ladakh
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bone/75 transition-colors hover:text-bone"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden text-bone/80 hover:bg-bone/10 hover:text-bone sm:inline-flex"
          >
            <a href={CONTACT.tel}>
              <Phone data-slot="icon" />
              {CONTACT.phoneDisplay}
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/book">Book the trip</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
