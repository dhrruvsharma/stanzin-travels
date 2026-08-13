import type { Metadata } from "next";
import { CONTACT } from "./site-data";

/**
 * Canonical origin for the site. Overridable per environment so preview
 * deployments don't advertise production URLs to crawlers.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laddakhhodophile.com"
).replace(/\/$/, "");

export const SITE_NAME = CONTACT.name;

/** Shown as the default social card across every page. */
export const OG_IMAGE = "/images/hero-golden-highway.webp";

/**
 * Head terms the whole site should rank for. Page-level keyword sets are
 * appended to these rather than replacing them.
 */
export const BASE_KEYWORDS = [
  "Laddakh Hodophile",
  "Ladakh travel",
  "Ladakh tour package",
  "Leh Ladakh trip",
  "Leh taxi service",
  "Ladakh tour operator",
  "Nubra Valley tour",
  "Pangong Tso trip",
  "Khardung La",
  "Ladakh bike trip",
  "Royal Enfield rental Leh",
  "Srinagar to Leh road trip",
  "Manali to Leh road trip",
  "Ladakh itinerary",
  "local Ladakhi driver",
  "Ladakh hotels and homestays",
];

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Root-relative path, used for the canonical and OG URL. */
  path: string;
  keywords?: string[];
  image?: string;
  /** Thin or duplicate pages (e.g. legal) stay indexable but uncrawled onward. */
  noIndex?: boolean;
};

/**
 * Builds a page's Metadata with the canonical, OpenGraph and Twitter fields
 * filled in consistently. `metadataBase` in the root layout resolves the
 * relative image paths.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = OG_IMAGE,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Organisation-level structured data. Rendered once in the root layout so
 * Google can attach the business to every page of the site.
 */
export function travelAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE),
    logo: absoluteUrl(OG_IMAGE),
    description:
      "Ladakh tours, drivers, vehicles and stays arranged by a Nubra Valley local — with pickups from Srinagar and Manali.",
    telephone: CONTACT.phoneE164,
    priceRange: "₹₹",
    founder: { "@type": "Person", name: CONTACT.owner },
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.addressCountry,
    },
    geo: { "@type": "GeoCoordinates", latitude: 34.1526, longitude: 77.5771 },
    areaServed: [
      { "@type": "Place", name: "Leh" },
      { "@type": "Place", name: "Nubra Valley" },
      { "@type": "Place", name: "Pangong Tso" },
      { "@type": "Place", name: "Tso Moriri" },
      { "@type": "Place", name: "Ladakh" },
    ],
    knowsLanguage: ["en", "hi", "bo"],
    sameAs: [CONTACT.whatsapp],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneE164,
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Ladakhi"],
    },
  };
}

/** Sitelinks search box / site identity for the home page. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

/** Breadcrumbs for interior pages, so Google renders the path in results. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Serialises JSON-LD safely for embedding in a <script> tag. */
export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
