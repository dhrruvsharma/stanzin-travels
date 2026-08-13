import Link from "next/link";
import { InteriorHeader } from "@/src/components/layout/interior-header";
import { CONTACT } from "@/src/lib/site-data";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/src/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and conditions for booking Ladakh trips, drivers, vehicles and stays with Laddakh Hodophile — bookings, payment, cancellations, permits, liability and governing law.",
  path: "/terms",
  keywords: ["Ladakh tour terms and conditions", "booking terms", "cancellation policy"],
});

const LAST_UPDATED = "13 August 2026";

type Clause = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

const CLAUSES: Clause[] = [
  {
    heading: "1. About these terms",
    paragraphs: [
      `These terms and conditions govern the use of this website and any travel services arranged by ${CONTACT.name} ("we", "us", "our"), a travel services provider operating from Leh, Ladakh, India. By making an enquiry, confirming a booking or otherwise using our services, you ("you", "the traveller") agree to these terms.`,
      "Please read them before confirming a trip. If anything here is unclear or does not match what you were told, ask us before you pay — we will confirm the position in writing.",
    ],
  },
  {
    heading: "2. Services we provide",
    paragraphs: [
      "We arrange road travel and related services within Ladakh, and pickups from as far as Srinagar and Manali. Depending on what you book, this may include any of the following:",
    ],
    list: [
      "A driver and vehicle for an agreed route and duration",
      "Accommodation in hotels, camps or homestays",
      "Complete itineraries combining route, vehicle, driver and stays",
      "Assistance with permits and local logistics",
    ],
  },
  {
    heading: "3. Enquiries and confirmation",
    paragraphs: [
      "Submitting a trip request through this website is an enquiry, not a booking. It creates no obligation on either side and requires no payment or account.",
      "We will contact you to discuss your dates, group and requirements, and provide a quotation. A booking is confirmed only when we have confirmed it to you directly and any agreed advance has been received. All services remain subject to availability until then.",
    ],
  },
  {
    heading: "4. Quotations and pricing",
    paragraphs: [
      "Quotations are based on the itinerary, group size, vehicle and dates discussed at the time. They are valid for the period stated in the quotation and are subject to availability.",
      "Unless expressly stated in your quotation, prices exclude airfares and travel to the pickup point, meals, permit and entry fees, monastery and monument tickets, oxygen and medical costs, tips, insurance, and any personal expenses.",
      "Where costs outside our control change materially before your trip — fuel prices, government taxes or fees, permit charges, or a route diversion forced by road conditions — we may need to revise the price. We will tell you as soon as we know, and you may cancel without penalty if the revision is not acceptable to you.",
    ],
  },
  {
    heading: "5. Payment",
    paragraphs: [
      "An advance is normally payable to confirm a booking, with the balance due as set out in your confirmation. Payment terms, amounts and accepted methods will be stated in writing before you pay.",
      "We will not ask you for card details, passwords or one-time passwords over the phone or on this website. If you receive such a request claiming to be from us, do not act on it and contact us on the number below.",
    ],
  },
  {
    heading: "6. Cancellation by you",
    paragraphs: [
      "Cancellations must be made in writing or by telephone to the contact details below. The applicable cancellation charges are those set out in your booking confirmation, and reflect what we have already committed on your behalf — advance payments to hotels, camps and vehicle owners, which are frequently non-refundable in peak season.",
      "Where a refund is due, we will process it to the original payment method within a reasonable period. Third-party charges already incurred and non-refundable to us cannot be refunded. No-shows and unused services are not refundable.",
    ],
  },
  {
    heading: "7. Changes and cancellation by us",
    paragraphs: [
      "Ladakh is high-altitude terrain, and conditions change. Passes close, roads wash out, permits are suspended and weather turns without notice. Where this happens we will offer the nearest reasonable alternative — a changed route, a changed order of nights, or a substituted stay of comparable standard.",
      "If we must cancel your trip entirely for reasons within our control, we will refund the amounts you have paid to us. We are not able to refund or compensate for costs you incurred separately, such as flights, and we strongly recommend travel insurance covering trip disruption.",
    ],
  },
  {
    heading: "8. Permits, identification and eligibility",
    paragraphs: [
      "Several areas in Ladakh require an Inner Line Permit or, for foreign nationals, a Protected Area Permit. You are responsible for carrying valid original photo identification, and for holding a valid visa where applicable. Permit issue and the areas covered are decided by the authorities, not by us.",
      "We will assist with permit applications where we can, but we cannot guarantee that a permit will be granted, and we are not liable for costs arising from a refused permit or a route closed by order of the authorities.",
    ],
  },
  {
    heading: "9. Health, altitude and fitness",
    paragraphs: [
      "Much of Ladakh lies above 3,000 metres, and routes cross passes above 5,000 metres. Acute mountain sickness can affect anyone regardless of age or fitness. You should consult a doctor before travelling, particularly if you have a cardiac, respiratory or blood-pressure condition, or are pregnant.",
      "You must tell us at the time of booking about any medical condition, allergy, mobility need or dietary requirement relevant to your trip. We will build in acclimatisation where the itinerary allows, but you travel at your own risk and remain responsible for your own health decisions during the trip. Our drivers may curtail or divert a route on health or safety grounds.",
    ],
  },
  {
    heading: "10. Vehicles, driving and motorcycles",
    paragraphs: [
      "Vehicles are provided with a driver unless expressly agreed otherwise. Vehicle models shown on this website are indicative; we may substitute a vehicle of equivalent or higher standard where necessary.",
      "Where you ride a motorcycle yourself, you must hold a valid licence for that category, wear a helmet at all times, and comply with all traffic laws. You are responsible for fuel, traffic fines, and any damage to or loss of the motorcycle during your possession of it, save for fair wear and tear. Riding under the influence of alcohol or drugs ends the arrangement immediately with no refund.",
    ],
  },
  {
    heading: "11. Accommodation",
    paragraphs: [
      "Stays are booked in hotels, camps and homestays selected for their location on your route. Standards in remote valleys differ from those in Leh town: power, hot water, heating and mobile network may be limited or unavailable, and this is a feature of the region rather than a shortfall in the service.",
      "Where a booked property becomes unavailable, we will provide alternative accommodation of a comparable standard.",
    ],
  },
  {
    heading: "12. Your responsibilities",
    list: [
      "Provide accurate personal and travel information at the time of booking",
      "Carry valid identification, permits and any required visa",
      "Arrive at agreed pickup points at the agreed time",
      "Follow the reasonable instructions of your driver on matters of safety",
      "Respect local customs, monasteries, residents and the environment, and carry your waste out of the valleys",
      "Not behave in a way that endangers or unreasonably disturbs others",
    ],
    paragraphs: [
      "We may end a trip without refund where a traveller's conduct puts others at risk or makes the trip unmanageable.",
    ],
  },
  {
    heading: "13. Insurance",
    paragraphs: [
      "We strongly recommend comprehensive travel insurance covering medical treatment and evacuation at high altitude, trip cancellation and curtailment, and loss of baggage. Where you ride a motorcycle, check that your policy covers it. We do not provide insurance.",
    ],
  },
  {
    heading: "14. Liability",
    paragraphs: [
      "We provide our services with reasonable care and skill. We are not liable for any loss, delay, injury or damage arising from events beyond our reasonable control, including road and pass closures, landslides, avalanches, floods, weather, strikes, civil or military action, government orders, permit refusals, mechanical breakdown, or acts of third parties.",
      "Where we arrange services supplied by third parties — hotels, camps, homestays, airlines or other operators — we do so as an agent, and those services are subject to the supplier's own terms. To the fullest extent permitted by law, our total liability in connection with a booking is limited to the amount you paid to us for that booking.",
      "Nothing in these terms excludes or limits liability for death or personal injury caused by our negligence, or for fraud, or any other liability that cannot be excluded under applicable law.",
    ],
  },
  {
    heading: "15. Website content and intellectual property",
    paragraphs: [
      `The text, photographs, layout and design of this website belong to ${CONTACT.name} or are used with permission, and may not be reproduced for commercial purposes without our written consent. Landscape photography is shot on our own routes; certain vehicle photographs are used under their respective licences.`,
      "Route descriptions, images and prices on this site are illustrative. Conditions in Ladakh change, and nothing on this website forms part of a contract until confirmed in your booking.",
    ],
  },
  {
    heading: "16. Reviews submitted by travellers",
    paragraphs: [
      "Reviews posted through this website must be your own honest account of a trip you actually took with us. By submitting a review you grant us a non-exclusive right to display it on this website and in our marketing, alongside the name you supply.",
      "We may decline to publish or may remove content that is abusive, unlawful, misleading, or that discloses another person's private information. We do not edit reviews to change their meaning.",
    ],
  },
  {
    heading: "17. Privacy and your data",
    paragraphs: [
      "We collect only what we need to plan and run your trip: your name, contact number, travel dates, group size and any requirements you tell us about. We use it to prepare your quotation, make bookings on your behalf and contact you about your trip.",
      "We share your details with the hotels, camps and permit authorities involved in your booking, and nowhere else. We do not sell your data or pass it to third parties for marketing. We keep it only as long as needed for the trip and for our records.",
      "You may ask us what we hold about you, ask for it to be corrected, or ask us to delete it, by calling the number below.",
    ],
  },
  {
    heading: "18. Complaints",
    paragraphs: [
      "If something goes wrong during your trip, tell your driver or call us at once — nearly everything can be fixed on the spot, and very little can be fixed after you have gone home. If a matter remains unresolved, contact us on the number below and we will respond as quickly as the network in the valleys allows.",
    ],
  },
  {
    heading: "19. Governing law and jurisdiction",
    paragraphs: [
      "These terms are governed by the laws of India. Any dispute arising from them or from services we provide is subject to the exclusive jurisdiction of the courts at Leh, Ladakh.",
    ],
  },
  {
    heading: "20. Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The version published on this page at the time you confirm your booking is the version that applies to that booking. The date of the current version is shown above.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="grain min-h-svh bg-ink pb-24 sm:pb-32">
      <InteriorHeader />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="py-14 sm:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
            Legal
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] font-medium text-balance text-bone sm:text-6xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-5 text-base leading-relaxed text-bone/70">
            The terms on which {CONTACT.name} arranges drivers, vehicles, stays
            and itineraries in Ladakh.
          </p>
          <p className="mt-4 text-sm text-bone/50">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <nav aria-label="On this page" className="mb-14 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold tracking-[0.24em] text-bone/60 uppercase">
            On this page
          </h2>
          <ol className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {CLAUSES.map((clause) => (
              <li key={clause.heading}>
                <a
                  href={`#${slugify(clause.heading)}`}
                  className="text-sm text-bone/65 transition-colors hover:text-primary"
                >
                  {clause.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {CLAUSES.map((clause) => (
            <section key={clause.heading} id={slugify(clause.heading)} className="scroll-mt-24">
              <h2 className="font-display text-2xl font-medium text-bone sm:text-3xl">
                {clause.heading}
              </h2>
              {clause.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-base leading-relaxed text-bone/70"
                >
                  {paragraph}
                </p>
              ))}
              {clause.list ? (
                <ul className="mt-4 space-y-2">
                  {clause.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-base leading-relaxed text-bone/70"
                    >
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section id="contact-us" className="scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="font-display text-2xl font-medium text-bone sm:text-3xl">
              21. Contact us
            </h2>
            <p className="mt-4 text-base leading-relaxed text-bone/70">
              For any question about these terms, a booking or a complaint,
              reach us directly:
            </p>
            <ul className="mt-5 space-y-2 text-base text-bone/80">
              <li>
                <span className="text-bone/50">Operator:</span> {CONTACT.name} (
                {CONTACT.owner})
              </li>
              <li>
                <span className="text-bone/50">Phone:</span>{" "}
                <a href={CONTACT.tel} className="hover:text-primary">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="text-bone/50">WhatsApp:</span>{" "}
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Message us
                </a>
              </li>
              <li>
                <span className="text-bone/50">Based in:</span> {CONTACT.base}
              </li>
            </ul>
            <p className="mt-6 text-sm text-bone/50">
              Read more{" "}
              <Link href="/about" className="underline hover:text-primary">
                about us
              </Link>{" "}
              or{" "}
              <Link href="/book" className="underline hover:text-primary">
                request a trip
              </Link>
              .
            </p>
          </section>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms" },
          ]),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": absoluteUrl("/terms#webpage"),
          url: absoluteUrl("/terms"),
          name: `Terms & Conditions — ${CONTACT.name}`,
          inLanguage: "en-IN",
          isPartOf: { "@id": absoluteUrl("/#website") },
        })}
      />
    </main>
  );
}

/** Turns "3. Enquiries and confirmation" into "enquiries-and-confirmation". */
function slugify(heading: string): string {
  return heading
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
