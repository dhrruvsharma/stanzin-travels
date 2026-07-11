import Image from "next/image";
import { Info } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const WAYPOINTS = [
  {
    place: "Srinagar",
    region: "Kashmir · western pickup limit",
    note: "We meet you here and bring you up the NH1.",
    dot: "bg-flag-blue",
  },
  {
    place: "Leh",
    region: "Ladakh · home base",
    note: "Where every trip truly begins — and where we explore.",
    dot: "bg-primary",
    highlight: true,
  },
  {
    place: "Manali",
    region: "Himachal · southern pickup limit",
    note: "Pickup over the Manali–Leh highway's five passes.",
    dot: "bg-flag-green",
  },
];

export function ReachSection() {
  return (
    <section id="reach" className="bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Where we reach"
            title="Picked up far, explored deep."
            description="Pickups stretch from Srinagar in the west to Manali in the south. Those legs are just the commute — all the exploring happens inside Ladakh."
          />

          <Reveal delay={0.15} className="mt-10">
            <ol className="relative ml-2 space-y-8 border-l-2 border-dashed border-bone-2 pl-8">
              {WAYPOINTS.map((wp) => (
                <li key={wp.place} className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1.5 -left-[2.45rem] size-4 rounded-full ring-4 ring-background",
                      wp.dot,
                    )}
                  />
                  <h3
                    className={cn(
                      "font-display text-2xl font-medium",
                      wp.highlight && "text-saffron",
                    )}
                  >
                    {wp.place}
                  </h3>
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {wp.region}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {wp.note}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.25} className="mt-10">
            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-accent/60 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-saffron" />
              <p className="text-sm leading-relaxed">
                <strong className="font-semibold">Pickups only</strong> outside
                Ladakh — no sightseeing detours in Kashmir or Himachal. We save
                the wandering for where we know every stone.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl lg:aspect-[4/5]">
            <Image
              src="/images/open-road-blue-sky.webp"
              alt="Open mountain highway under a deep blue Ladakh sky"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 rounded-lg bg-ink/70 px-4 py-3 backdrop-blur-sm">
              <p className="font-display text-lg text-bone">The road to Leh</p>
              <p className="text-xs tracking-wide text-bone/70 uppercase">
                Big skies, thin air, zero traffic lights
              </p>
            </figcaption>
          </div>
          <div
            aria-hidden
            className="absolute -top-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-primary/30"
          />
        </Reveal>
      </div>
    </section>
  );
}
