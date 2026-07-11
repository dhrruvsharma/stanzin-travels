"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Loader2,
  MessageCircle,
  Minus,
  Phone,
  Plus,
} from "lucide-react";
import { createTripRequestAction } from "@/src/actions/trip";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CONTACT, FLEET, SERVICES, type Vehicle } from "@/src/lib/site-data";
import type { ServiceType, TripRequest } from "@/src/schema/trip/index.type";
import { Reveal } from "@/src/components/landing/reveal";

const MAX_TRIP_DAYS = 30;
const MAX_GROUP_SIZE = 50;

const PLACE_HINTS = [
  "Leh — acclimatise",
  "Nubra Valley",
  "Pangong Tso",
  "Turtuk",
  "Tso Moriri",
  "Hanle",
  "Back to Leh",
];

const inputClass =
  "w-full rounded-lg border border-white/15 bg-ink-2 px-4 py-3 text-base text-bone shadow-none transition-colors outline-none placeholder:text-bone/35 hover:border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/35 [color-scheme:dark]";

const fieldLabelClass =
  "mb-2 block text-xs font-semibold tracking-[0.18em] text-bone/60 uppercase";

/** Days in the trip, inclusive of both ends; 0 while dates are incomplete. */
function countDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const from = new Date(`${start}T00:00:00`);
  const to = new Date(`${end}T00:00:00`);
  const days = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
  return days >= 1 ? days : 0;
}

function dayLabel(start: string, offset: number): string {
  const date = new Date(`${start}T00:00:00`);
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function todayISO(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function SectionMarker({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 md:block">
      <span className="font-display text-4xl font-semibold text-bone/25 md:text-5xl">
        {number}
      </span>
      <h2 className="font-display text-2xl font-medium text-bone md:mt-2">
        {title}
      </h2>
    </div>
  );
}

function VehicleOption({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative overflow-hidden rounded-xl border text-left transition-all duration-300",
        selected
          ? "border-primary bg-ink-2 ring-2 ring-primary/60"
          : "border-white/10 bg-ink-2 hover:-translate-y-0.5 hover:border-white/30",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bone">
        <Image
          src={vehicle.image}
          alt={vehicle.imageAlt}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full border transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-white/50 bg-ink/50 text-transparent backdrop-blur-sm",
          )}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>
      <div className="p-4">
        <p className="font-display text-lg leading-tight font-medium text-bone">
          {vehicle.name}
        </p>
        <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
          {vehicle.kind}
        </p>
      </div>
    </button>
  );
}

export function TripRequestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [vehicleSlug, setVehicleSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<TripRequest | null>(null);

  const minStart = useMemo(todayISO, []);
  const dayCount = countDays(startDate, endDate);
  const tooLong = dayCount > MAX_TRIP_DAYS;
  const needsDayPlans =
    serviceType === "driver_only" || serviceType === "hotel_only";

  const setPlace = (index: number, value: string) => {
    setPlaces((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push("");
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Tell us your name.");
    if (!/^\+?[0-9][0-9 \-]{6,17}$/.test(phone.trim()))
      return setError("That phone number doesn't look right.");
    if (!serviceType) return setError("Pick how you'd like to do Ladakh.");
    if (dayCount < 1) return setError("Pick your travel dates.");
    if (tooLong)
      return setError(
        `Trips through the form can be at most ${MAX_TRIP_DAYS} days — call us for longer plans.`,
      );
    if (needsDayPlans) {
      const missing = Array.from({ length: dayCount }).findIndex(
        (_, i) => !places[i]?.trim(),
      );
      if (missing !== -1)
        return setError(`Where would you like to be on day ${missing + 1}?`);
    }
    if (!vehicleSlug) return setError("Pick a machine from the fleet.");

    setSubmitting(true);
    const result = await createTripRequestAction({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      group_size: groupSize,
      service_type: serviceType,
      start_date: startDate,
      end_date: endDate,
      vehicle_slug: vehicleSlug,
      day_plans: needsDayPlans
        ? Array.from({ length: dayCount }, (_, i) => ({
            day_number: i + 1,
            place: places[i].trim(),
          }))
        : [],
    });
    setSubmitting(false);

    if (result.success) {
      setConfirmed(result.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.message);
    }
  };

  if (confirmed) {
    const vehicle = [...FLEET.cars, ...FLEET.bikes].find(
      (v) => v.slug === confirmed.vehicle_slug,
    );
    return (
      <Reveal className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-ink-2 p-8 text-center sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-flag-green/15 text-flag-green">
            <Check className="size-7" strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-medium text-bone sm:text-4xl">
            Julley, {confirmed.customer_name.split(" ")[0]}!
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-bone/70">
            Your request is in. Namsras will call you on{" "}
            <span className="text-bone">{confirmed.customer_phone}</span> to
            shape the details and confirm your dates.
          </p>
          <ul className="mx-auto mt-7 flex flex-wrap justify-center gap-2 text-xs text-bone/75">
            <li className="rounded-full border border-white/15 px-3 py-1">
              {confirmed.start_date} → {confirmed.end_date}
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1">
              {confirmed.group_size}{" "}
              {confirmed.group_size === 1 ? "traveller" : "travellers"}
            </li>
            {vehicle ? (
              <li className="rounded-full border border-white/15 px-3 py-1">
                {vehicle.name}
              </li>
            ) : null}
          </ul>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle data-slot="icon" />
                Say hello on WhatsApp
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-bone/30 bg-bone/5 text-bone backdrop-blur-sm hover:bg-bone/15 hover:text-bone"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-16 sm:space-y-20">
      {/* 01 — Who's coming */}
      <Reveal>
        <section className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <SectionMarker number="01" title="The travellers" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={fieldLabelClass}>
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={120}
                placeholder="Tenzin Dorjay"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={fieldLabelClass}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <span className={fieldLabelClass}>Size of the group</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="One traveller fewer"
                  onClick={() => setGroupSize((n) => Math.max(1, n - 1))}
                  className="flex size-12 items-center justify-center rounded-lg border border-white/15 bg-ink-2 text-bone transition-colors hover:border-primary hover:text-primary"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-14 text-center font-display text-2xl font-medium text-bone">
                  {groupSize}
                </span>
                <button
                  type="button"
                  aria-label="One traveller more"
                  onClick={() =>
                    setGroupSize((n) => Math.min(MAX_GROUP_SIZE, n + 1))
                  }
                  className="flex size-12 items-center justify-center rounded-lg border border-white/15 bg-ink-2 text-bone transition-colors hover:border-primary hover:text-primary"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 02 — Service type */}
      <Reveal>
        <section className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <SectionMarker number="02" title="The plan" />
          <div className="grid gap-4 sm:grid-cols-3">
            {SERVICES.map((service) => {
              const selected = serviceType === service.slug;
              return (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => setServiceType(service.slug)}
                  aria-pressed={selected}
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border p-5 text-left transition-all duration-300",
                    selected
                      ? "border-primary bg-ink-2 ring-2 ring-primary/60"
                      : "border-white/10 bg-ink-2 hover:-translate-y-0.5 hover:border-white/30",
                  )}
                >
                  {service.featured ? (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.14em] text-primary-foreground uppercase">
                      Most popular
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/30 text-transparent",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="mt-4 font-display text-xl font-medium text-bone">
                    {service.title}
                  </span>
                  <span className="mt-1 text-sm font-semibold text-primary">
                    {service.tagline}
                  </span>
                  <span className="mt-3 text-sm leading-relaxed text-bone/60">
                    {service.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* 03 — Dates & day-by-day route */}
      <Reveal>
        <section className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <SectionMarker number="03" title="The days" />
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className={fieldLabelClass}>
                  First day
                </label>
                <input
                  id="start-date"
                  name="start_date"
                  type="date"
                  min={minStart}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="end-date" className={fieldLabelClass}>
                  Last day
                </label>
                <input
                  id="end-date"
                  name="end_date"
                  type="date"
                  min={startDate || minStart}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {dayCount > 0 ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-bone/80">
                <CalendarDays className="size-4 text-primary" />
                {dayCount} {dayCount === 1 ? "day" : "days"} on the road
                {tooLong ? (
                  <span className="text-flag-red">
                    — that's beyond the form; give us a call
                  </span>
                ) : null}
              </p>
            ) : null}

            {needsDayPlans && dayCount > 0 && !tooLong ? (
              <ol className="relative mt-8 space-y-4 border-l border-dashed border-white/20 pl-6">
                {Array.from({ length: dayCount }, (_, i) => (
                  <li key={i} className="relative">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 -left-6 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                        places[i]?.trim()
                          ? "border-primary bg-primary"
                          : "border-white/40 bg-ink",
                      )}
                    />
                    <label
                      htmlFor={`day-${i + 1}`}
                      className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-bone/55 uppercase"
                    >
                      Day {i + 1}{" "}
                      <span className="normal-case tracking-normal text-bone/40">
                        · {dayLabel(startDate, i)}
                      </span>
                    </label>
                    <input
                      id={`day-${i + 1}`}
                      type="text"
                      maxLength={160}
                      placeholder={PLACE_HINTS[i % PLACE_HINTS.length]}
                      value={places[i] ?? ""}
                      onChange={(e) => setPlace(i, e.target.value)}
                      className={inputClass}
                    />
                  </li>
                ))}
              </ol>
            ) : null}

            {serviceType === "complete_itinerary" ? (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm leading-relaxed text-bone/80">
                On the complete itinerary, the day-by-day route is our job —
                Namsras will shape it around your dates, your group and your
                pace, then walk you through it on a call.
              </div>
            ) : null}
          </div>
        </section>
      </Reveal>

      {/* 04 — Vehicle */}
      <Reveal>
        <section className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <SectionMarker number="04" title="The machine" />
          <div className="space-y-8">
            {(
              [
                ["Four wheels", FLEET.cars],
                ["Two wheels", FLEET.bikes],
              ] as const
            ).map(([label, vehicles]) => (
              <div key={label}>
                <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-bone/60 uppercase">
                  {label}
                </p>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <VehicleOption
                      key={vehicle.slug}
                      vehicle={vehicle}
                      selected={vehicleSlug === vehicle.slug}
                      onSelect={() => setVehicleSlug(vehicle.slug)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Submit */}
      <Reveal>
        <div className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <span aria-hidden className="hidden md:block" />
          <div className="border-t border-white/10 pt-8">
            {error ? (
              <p role="alert" className="mb-5 text-sm font-medium text-flag-red">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-5">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <Loader2 data-slot="icon" className="animate-spin" />
                ) : (
                  <ArrowRight data-slot="icon" />
                )}
                {submitting ? "Sending your request…" : "Send trip request"}
              </Button>
              <p className="text-sm text-bone/55">
                Prefer to talk?{" "}
                <a
                  href={CONTACT.tel}
                  className="inline-flex items-center gap-1.5 text-bone/80 underline underline-offset-4 hover:text-primary"
                >
                  <Phone className="size-3.5" />
                  {CONTACT.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </form>
  );
}
