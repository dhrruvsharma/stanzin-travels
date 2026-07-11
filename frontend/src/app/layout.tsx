import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stanzin Travels — Ladakh, driven by a local",
  description:
    "Travel Leh–Ladakh with Namsras Stanzin, a Nubra Valley local. Drivers, stays and complete itineraries, with pickups from Srinagar to Manali. Call +91 96220 68288.",
  keywords: [
    "Ladakh travel",
    "Leh taxi",
    "Nubra Valley",
    "Ladakh itinerary",
    "Ladakh bike trip",
  ],
  openGraph: {
    title: "Stanzin Travels — Ladakh, driven by a local",
    description:
      "Drivers, stays and complete Ladakh itineraries with a Nubra-born local at the wheel.",
    images: ["/images/hero-golden-highway.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
