import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { CONTACT } from "@/src/lib/site-data";
import { PrayerFlagStripe } from "./prayer-flag-stripe";
import { Reveal } from "./reveal";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink">
      <PrayerFlagStripe />
      <div className="absolute inset-0">
        <Image
          src="/images/leh-night-lights.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 sm:py-36">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            Plan your Ladakh trip
          </p>
          <h2 className="mt-5 font-display text-5xl font-medium text-bone sm:text-7xl">
            Say <em className="text-primary italic">Julley.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
            Tell us your dates, your group and how you like to travel — we
            shape the rest. Book below, or reach the man who&apos;ll drive you
            directly.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={CONTACT.tel}
            className="mt-10 inline-block font-display text-3xl font-semibold tracking-tight text-bone transition-colors hover:text-primary sm:text-5xl"
          >
            {CONTACT.phoneDisplay}
          </a>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
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
        </Reveal>
      </div>
    </section>
  );
}
