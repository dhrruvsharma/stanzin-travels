import Image from "next/image";
import { Bike, CarFront } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { FLEET, type Vehicle } from "@/src/lib/site-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <article className="group h-full overflow-hidden rounded-xl border border-white/10 bg-ink-2 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-bone">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-xl font-medium text-bone">
              {vehicle.name}
            </h3>
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] whitespace-nowrap text-primary uppercase">
              {vehicle.kind}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-bone/65">
            {vehicle.blurb}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {vehicle.specs.map((spec) => (
              <li
                key={spec}
                className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-bone/75"
              >
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export function FleetSection() {
  return (
    <section id="fleet" className="grain bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            dark
            eyebrow="The garage"
            title="Pick your machine."
            description="Every vehicle is kept ready for thin air and long climbs — choose comfort on four wheels or wind on two."
          />
        </div>

        <Tabs defaultValue="cars" className="mt-12">
          <TabsList className="h-10 border border-white/10 bg-ink-2">
            <TabsTrigger
              value="cars"
              className="gap-2 px-5 text-bone/60 hover:text-bone data-active:bg-bone data-active:text-ink"
            >
              <CarFront className="size-4" /> Four wheels
            </TabsTrigger>
            <TabsTrigger
              value="bikes"
              className="gap-2 px-5 text-bone/60 hover:text-bone data-active:bg-bone data-active:text-ink"
            >
              <Bike className="size-4" /> Two wheels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars" className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {FLEET.cars.map((vehicle, i) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} index={i} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="bikes" className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {FLEET.bikes.map((vehicle, i) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} index={i} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
