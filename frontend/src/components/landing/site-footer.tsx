import Link from "next/link";
import { CONTACT } from "@/src/lib/site-data";

const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Book a trip", href: "/book" },
  { label: "Reviews", href: "/reviews" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:items-start md:justify-between md:text-left">
        <div>
          <p className="font-display text-lg font-semibold text-bone">
            {CONTACT.name}
          </p>
          <p className="text-xs tracking-[0.24em] text-bone/50 uppercase">
            {CONTACT.base}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-bone/60 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-xs leading-relaxed text-bone/50">
          <p>
            © {new Date().getFullYear()} {CONTACT.name} ·{" "}
            <a href={CONTACT.tel} className="hover:text-primary">
              {CONTACT.phoneDisplay}
            </a>
          </p>
          <p>
            Landscape photography shot on our routes · vehicle photos via
            Wikimedia Commons
          </p>
        </div>
      </div>
    </footer>
  );
}
