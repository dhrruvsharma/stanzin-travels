import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import {
  BASE_KEYWORDS,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  jsonLdScript,
  travelAgencyJsonLd,
  websiteJsonLd,
} from "@/src/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Travel Leh–Ladakh with Laddakh Hodophile — drivers, vehicles, stays and complete itineraries arranged by a Nubra Valley local, with pickups from Srinagar to Manali. Call +91 96220 68288.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ladakh, driven by a local`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: BASE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "travel",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_URL,
    title: `${SITE_NAME} — Ladakh, driven by a local`,
    description:
      "Drivers, stays and complete Ladakh itineraries with a Nubra-born local at the wheel.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Golden evening light over the Srinagar–Leh highway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ladakh, driven by a local`,
    description:
      "Drivers, stays and complete Ladakh itineraries with a Nubra-born local at the wheel.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1d2a",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${fraunces.variable} ${manrope.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(travelAgencyJsonLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd())}
        />
      </body>
    </html>
  );
}
