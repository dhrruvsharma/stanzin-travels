import { CONTACT } from "@/src/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-lg font-semibold text-bone">
            Stanzin Travels
          </p>
          <p className="text-xs tracking-[0.24em] text-bone/50 uppercase">
            {CONTACT.base}
          </p>
        </div>
        <div className="text-xs leading-relaxed text-bone/50">
          <p>
            © {new Date().getFullYear()} Stanzin Travels · {CONTACT.phoneDisplay}
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
