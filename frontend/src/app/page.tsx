import { AboutSection } from "@/src/components/landing/about-section";
import { ContactSection } from "@/src/components/landing/contact-section";
import { DestinationsSection } from "@/src/components/landing/destinations-section";
import { FleetSection } from "@/src/components/landing/fleet-section";
import { Hero } from "@/src/components/landing/hero";
import { ReachSection } from "@/src/components/landing/reach-section";
import { ServicesSection } from "@/src/components/landing/services-section";
import { SiteFooter } from "@/src/components/landing/site-footer";
import { SiteHeader } from "@/src/components/landing/site-header";
import { WaypointMarquee } from "@/src/components/landing/waypoint-marquee";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <WaypointMarquee />
        <ServicesSection />
        <FleetSection />
        <ReachSection />
        <DestinationsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
