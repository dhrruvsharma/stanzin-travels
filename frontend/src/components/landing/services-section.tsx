import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { SERVICES } from "@/src/lib/site-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function ServicesSection() {
  return (
    <section id="services" className="grain bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What we arrange"
          title="Three ways to do Ladakh."
          description="Bring your own plan, your own wheels, or nothing at all — there's a version of this trip for each."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.number} delay={i * 0.12} className="h-full">
              <Card
                className={cn(
                  "group h-full gap-0 overflow-hidden pt-0 pb-0 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl",
                  service.featured && "ring-2 ring-primary/60",
                )}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-display text-5xl font-semibold text-bone/90">
                    {service.number}
                  </span>
                  {service.featured ? (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  ) : null}
                </div>
                <CardContent className="flex h-full flex-col p-6">
                  <h3 className="font-display text-2xl font-medium">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-saffron">
                    {service.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-flag-green" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
