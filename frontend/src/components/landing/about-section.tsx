import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { CONTACT } from "@/src/lib/site-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const CREDENTIALS = [
  "Born & raised in Nubra Valley",
  "Former bike-group marshal",
  "2 years running trips officially",
  "Knows the passes like the back of his hand",
];

const FACTS = [
  { value: "27", label: "years old, a lifetime at altitude" },
  { value: "2 yrs", label: "official — but local forever" },
  { value: "1 call", label: "and your whole trip is handled" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal className="relative order-last lg:order-first">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/nubra-valley-sunset.webp"
              alt="Alpenglow on the peaks above Nubra Valley at dusk"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="animate-flutter absolute -right-3 -bottom-8 w-44 overflow-hidden rounded-xl border-4 border-background shadow-xl sm:-right-6 sm:w-56">
            <Image
              src="/images/sunset-drive.webp"
              alt="View over the bonnet driving into a Ladakh sunset"
              width={448}
              height={336}
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute -top-4 -left-4 -z-10 h-full w-full rounded-2xl bg-accent"
          />
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Your man in the mountains"
            title="Namsras Stanzin."
            description="Half guide, half driver, all local."
          />

          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Namsras grew up in Nubra Valley, on the far side of Khardung La
                — which means the world&apos;s highest motorable roads were his
                school run. Before starting {CONTACT.name} he rode as a marshal
                for touring bike groups, shepherding riders over the same
                passes he now drives daily.
              </p>
              <p>
                He&apos;s been doing this officially for two years, but there is
                no shortcut, viewpoint or chai stop in Ladakh he hasn&apos;t
                known since childhood. Easy-going and quick to laugh, he has a
                way of turning a group of strangers in the back seat into
                friends by the first pass.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-7 flex flex-wrap gap-2">
              {CREDENTIALS.map((credential) => (
                <li key={credential}>
                  <Badge
                    variant="secondary"
                    className="border border-border px-3 py-1 text-xs font-medium"
                  >
                    {credential}
                  </Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-7">
              {FACTS.map((fact) => (
                <div key={fact.value}>
                  <dd className="font-display text-3xl font-semibold text-saffron">
                    {fact.value}
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-muted-foreground">
                    {fact.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.35}>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-saffron transition-colors hover:text-primary"
            >
              Read the full story
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
