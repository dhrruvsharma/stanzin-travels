import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { DESTINATIONS } from "@/src/lib/site-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function DestinationsSection() {
  return (
    <section id="destinations" className="grain bg-secondary/50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="Where he'll take you"
          title="Postcards from the top of the world."
          description="Every photograph below was taken on the routes we drive — no stock, no filters, just Ladakh."
        />

        <div className="mt-14 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {DESTINATIONS.map((destination, i) => (
            <Reveal
              key={destination.name}
              delay={(i % 4) * 0.08}
              className={cn("h-full", destination.span)}
            >
              <figure className="group relative h-full overflow-hidden rounded-xl">
                <Image
                  src={destination.image}
                  alt={destination.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-4 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="font-display text-lg leading-tight text-bone">
                    {destination.name}
                  </p>
                  <p className="mt-0.5 text-xs tracking-wide text-bone/75 uppercase">
                    {destination.note}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
