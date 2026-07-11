"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { CONTACT } from "@/src/lib/site-data";

const HERO_STATS = [
  { value: "17,582 ft", label: "highest pass on the route" },
  { value: "Nubra-born", label: "local since day one" },
  { value: "6 machines", label: "cars & Royal Enfields" },
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? undefined : { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-golden-highway.webp"
          alt="Golden evening light over the Srinagar–Leh highway"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-32 pb-20 sm:px-6 sm:pb-24">
        <motion.p
          {...fadeUp(0.15)}
          className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-bone/85 uppercase"
        >
          <span aria-hidden className="flag-stripe h-0.5 w-12 rounded-full" />
          Leh · Nubra · Pangong — Srinagar to Manali pickups
        </motion.p>

        <motion.h1
          {...fadeUp(0.3)}
          className="max-w-3xl font-display text-5xl leading-[1.02] font-medium text-bone sm:text-7xl"
        >
          The mountains
          <br />
          <em className="text-primary italic">know him by name.</em>
        </motion.h1>

        <motion.p
          {...fadeUp(0.45)}
          className="mt-6 max-w-xl text-base leading-relaxed text-bone/80 sm:text-lg"
        >
          Travel Ladakh with {CONTACT.owner} — born in Nubra Valley, bike-marshal
          turned mountain driver. We pick you up as far as Srinagar or Manali,
          but the real journey happens up here.
        </motion.p>

        <motion.div {...fadeUp(0.6)} className="mt-9 flex flex-wrap gap-3">
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
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle data-slot="icon" />
              WhatsApp us
            </a>
          </Button>
        </motion.div>

        <motion.dl
          {...fadeUp(0.75)}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-bone/15 pt-6"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.value}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-lg font-semibold text-bone sm:text-2xl">
                {stat.value}
              </dd>
              <dd className="mt-1 text-[0.7rem] tracking-wide text-bone/60 uppercase sm:text-xs">
                {stat.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-bone/60 transition-colors hover:text-bone sm:block"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </motion.a>
    </section>
  );
}
