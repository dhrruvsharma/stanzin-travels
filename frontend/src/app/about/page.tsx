import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { InteriorHeader } from "@/src/components/layout/interior-header";
import { Reveal } from "@/src/components/landing/reveal";
import { CONTACT } from "@/src/lib/site-data";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/src/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description:
    "Laddakh Hodophile is a Ladakh travel outfit run by Namsras Stanzin, born and raised in Nubra Valley. Drivers, vehicles, stays and complete itineraries across Leh, Nubra, Pangong and Tso Moriri.",
  path: "/about",
  keywords: [
    "about Laddakh Hodophile",
    "Ladakh travel company",
    "local Ladakh guide",
    "Nubra Valley local driver",
    "trusted Ladakh tour operator",
  ],
});

const PILLARS = [
  {
    title: "Local, not outsourced",
    body: "Every trip is run by people who live here year-round. No call-centre in another state, no sub-contracted driver meeting you for the first time at the airport.",
  },
  {
    title: "One number, whole trip",
    body: "From the pickup at Srinagar or Manali to the last drop at Leh airport, the same person is accountable for your plan. Change of weather, change of mind — one call sorts it.",
  },
  {
    title: "Roads before routes",
    body: "Passes close, rivers rise, permits shift. We plan around what the mountain is actually doing this week, not around a brochure printed last winter.",
  },
  {
    title: "Honest, local pricing",
    body: "Vehicles, stays and drivers are quoted at what they cost here, with the terms written down before you commit. No surprise line items at the end of the trip.",
  },
];

const WHAT_WE_DO = [
  {
    heading: "Drivers & vehicles",
    body: "Innova Crysta, Ertiga and Eeco for groups and families; Himalayan 450, Himalayan 411 and Bullet 350 for riders. Every car comes with a driver who knows the passes as well as the machine.",
  },
  {
    heading: "Stays & hotels",
    body: "Hotels, camps and homestays across Leh town, Nubra, Pangong and the far valleys — booked on local relationships and local rates rather than aggregator markups.",
  },
  {
    heading: "Complete itineraries",
    body: "Route, stays, vehicle and driver shaped around your dates, your group size and your appetite for altitude — including the acclimatisation days most plans skip.",
  },
];

export default function AboutPage() {
  return (
    <main className="grain min-h-svh bg-ink pb-24 sm:pb-32">
      <InteriorHeader />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="py-14 sm:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
            About us
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] font-medium text-balance text-bone sm:text-6xl">
            A Ladakh outfit run by{" "}
            <em className="text-primary italic">people from Ladakh.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/70 sm:text-lg">
            {CONTACT.name} arranges drivers, vehicles, stays and complete
            itineraries across Leh–Ladakh. It is run by {CONTACT.owner}, born
            and raised in Nubra Valley, on the far side of Khardung La — with
            pickups reaching as far as Srinagar in the west and Manali in the
            south.
          </p>
        </div>

        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/images/open-road-blue-sky.webp"
              alt="Open mountain highway under a deep blue Ladakh sky on the road to Leh"
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
        </Reveal>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
              Our story
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-bone/70">
              <p>
                {CONTACT.owner} grew up in Nubra Valley, which means the
                world&apos;s highest motorable roads were his school run. Long
                before this was a business, he was riding as a marshal for
                touring bike groups — shepherding riders over Khardung La and
                Chang La, fixing what broke, and learning every chai stop
                between Leh and Turtuk.
              </p>
              <p>
                {CONTACT.name} grew out of that. Travellers he had guided kept
                calling back the next season, asking him to arrange the whole
                trip rather than just ride alongside it — the car, the rooms,
                the route, the permits. What began as favours for returning
                friends became a proper operation, and it has been running
                officially for two years.
              </p>
              <p>
                The name says what it is. A hodophile is someone who loves the
                road, and this is Ladakh&apos;s version of that: high passes,
                thin air, no traffic lights, and a landscape that keeps
                travellers coming back for a second and third season.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
              What we do
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {WHAT_WE_DO.map((item, index) => (
              <Reveal key={item.heading} delay={index * 0.1}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="font-display text-xl font-medium text-bone">
                    {item.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/65">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
              How we work
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.08}>
                <div className="border-t border-white/10 pt-5">
                  <h3 className="font-display text-xl font-medium text-bone">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-bone/65">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
              Where we reach
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-bone/70">
              <p>
                Our home ground is Ladakh — Leh, Nubra Valley, Pangong Tso, Tso
                Moriri, the Changthang plateau, Turtuk and the passes that
                connect them. That is where we know every shortcut, viewpoint
                and place worth stopping.
              </p>
              <p>
                Pickups stretch beyond it: we will meet you at Srinagar in the
                west or Manali in the south and bring you up. Those legs are the
                commute, not the tour — we don&apos;t run sightseeing detours in
                Kashmir or Himachal, because we&apos;d rather be honest about
                where our local knowledge actually ends.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
              <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
                Say <em className="text-primary italic">Julley.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-bone/70">
                Tell us your dates and your group, and we&apos;ll shape the
                rest. No payment and no login to make an enquiry.
              </p>
              <a
                href={CONTACT.tel}
                className="mt-7 inline-block font-display text-3xl font-semibold tracking-tight text-bone transition-colors hover:text-primary sm:text-4xl"
              >
                {CONTACT.phoneDisplay}
              </a>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/book">
                    <ArrowRight data-slot="icon" />
                    Book the trip
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
                >
                  <a href={CONTACT.tel}>
                    <Phone data-slot="icon" />
                    Call now
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
                >
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle data-slot="icon" />
                    WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-7 text-sm text-bone/50">
                Read our{" "}
                <Link href="/terms" className="underline hover:text-primary">
                  terms &amp; conditions
                </Link>{" "}
                or see{" "}
                <Link href="/reviews" className="underline hover:text-primary">
                  what travellers say
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": absoluteUrl("/about#webpage"),
          url: absoluteUrl("/about"),
          name: `About ${CONTACT.name}`,
          description:
            "The story behind Laddakh Hodophile — a Ladakh travel outfit run by a Nubra Valley local.",
          inLanguage: "en-IN",
          about: { "@id": absoluteUrl("/#organization") },
        })}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About us", path: "/about" },
          ]),
        )}
      />
    </main>
  );
}
