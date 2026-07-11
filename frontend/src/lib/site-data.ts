export const CONTACT = {
  name: "Stanzin Travels",
  owner: "Namsras Stanzin",
  phoneDisplay: "+91 96220 68288",
  tel: "tel:+919622068288",
  whatsapp:
    "https://wa.me/919622068288?text=Julley!%20I%27d%20like%20to%20plan%20a%20Ladakh%20trip.",
  base: "Nubra Valley · Leh · Ladakh",
};

export type Service = {
  number: string;
  /** Stable identifier sent to the backend as `service_type`. */
  slug: "driver_only" | "hotel_only" | "complete_itinerary";
  title: string;
  tagline: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    number: "01",
    slug: "driver_only",
    title: "Driver & Vehicle",
    tagline: "You've planned it. He'll drive it.",
    description:
      "Hotels booked, places picked? Namsras takes the wheel so you can watch the mountains instead of the road.",
    points: [
      "Pickup from Srinagar, Leh or Manali",
      "Any machine from the fleet below",
      "A driver who doubles as a local guide",
    ],
    image: "/images/sunset-drive.webp",
    imageAlt: "Sunset over the highway from behind the wheel in Ladakh",
  },
  {
    number: "02",
    slug: "hotel_only",
    title: "Stays & Hotels",
    tagline: "Your wheels, our rooms.",
    description:
      "Riding your own bike or driving up yourself? We book the right beds along your route — from Leh town to the far valleys.",
    points: [
      "Trusted hotels, camps and homestays",
      "Leh, Nubra, Pangong and beyond",
      "Local relationships, local rates",
    ],
    image: "/images/snow-peaks.webp",
    imageAlt: "Snow peaks above Leh under moody clouds",
  },
  {
    number: "03",
    slug: "complete_itinerary",
    title: "The Complete Itinerary",
    tagline: "Land in Leh. Everything else is done.",
    description:
      "Route, stays, vehicle and driver — one plan shaped around your dates, your group and how you like to travel.",
    points: [
      "Day-by-day route built by a Nubra local",
      "Stays and vehicle matched to your pace",
      "One phone number for the whole trip",
    ],
    image: "/images/nubra-valley-sunset.webp",
    imageAlt: "Pink sunset light on the peaks above Nubra Valley",
    featured: true,
  },
];

export type Vehicle = {
  /** Stable identifier sent to the backend as `vehicle_slug`. */
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  specs: string[];
  image: string;
  imageAlt: string;
};

export const FLEET: { cars: Vehicle[]; bikes: Vehicle[] } = {
  cars: [
    {
      slug: "maruti-ertiga",
      name: "Maruti Ertiga",
      kind: "7-seat MPV",
      blurb: "The easy all-rounder for families and small groups.",
      specs: ["7 seats", "Luggage friendly", "Smooth on tarmac"],
      image: "/images/fleet/ertiga.webp",
      imageAlt: "White Maruti Suzuki Ertiga MPV",
    },
    {
      slug: "innova-crysta",
      name: "Innova Crysta",
      kind: "7-seat flagship",
      blurb: "Maximum comfort for the long passes — the group favourite.",
      specs: ["7 seats", "Captain comfort", "Best for long days"],
      image: "/images/fleet/crysta.webp",
      imageAlt: "Toyota Innova Crysta side profile",
    },
    {
      slug: "maruti-eeco",
      name: "Maruti Eeco",
      kind: "Budget van",
      blurb: "Honest, roomy and light on the pocket.",
      specs: ["5+ seats", "Budget pick", "City & valley runs"],
      image: "/images/fleet/eeco.webp",
      imageAlt: "Maruti Suzuki Eeco van",
    },
  ],
  bikes: [
    {
      slug: "himalayan-450",
      name: "Himalayan 450",
      kind: "Adventure tourer",
      blurb: "Royal Enfield's new workhorse, built for exactly this terrain.",
      specs: ["452 cc", "Liquid cooled", "Long-range tank"],
      image: "/images/fleet/himalayan-450.webp",
      imageAlt: "Royal Enfield Himalayan 450 motorcycle",
    },
    {
      slug: "himalayan-411",
      name: "Himalayan 411",
      kind: "Adventure tourer",
      blurb: "Proven on every pass in Ladakh, a thousand times over.",
      specs: ["411 cc", "Torquey & forgiving", "The pass veteran"],
      image: "/images/fleet/himalayan-411.webp",
      imageAlt: "Royal Enfield Himalayan in the mountains",
    },
    {
      slug: "bullet-350",
      name: "Bullet 350",
      kind: "Classic cruiser",
      blurb: "The classic thump, echoing off Himalayan rock since forever.",
      specs: ["349 cc", "Iconic ride", "Unhurried touring"],
      image: "/images/fleet/bullet-350.webp",
      imageAlt: "Royal Enfield Bullet 350 motorcycle",
    },
  ],
};

export type Destination = {
  name: string;
  note: string;
  image: string;
  imageAlt: string;
  /** Tailwind classes controlling the tile's span in the gallery grid. */
  span: string;
};

export const DESTINATIONS: Destination[] = [
  {
    name: "Khardung La",
    note: "Prayer flags at 17,582 ft",
    image: "/images/prayer-flags-khardungla.webp",
    imageAlt: "Strings of prayer flags on a snowy pass",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Nubra Pastures",
    note: "Yaks at their morning bath",
    image: "/images/yak-grazing.webp",
    imageAlt: "A yak grazing beside a stream",
    span: "",
  },
  {
    name: "Changthang Plateau",
    note: "Pashmina herds on the move",
    image: "/images/pashmina-herd.webp",
    imageAlt: "A herd of pashmina goats and sheep grazing",
    span: "",
  },
  {
    name: "Tso Moriri",
    note: "A lake the colour of night",
    image: "/images/tso-moriri-panorama.webp",
    imageAlt: "Panorama of a deep blue high-altitude lake",
    span: "md:col-span-2",
  },
  {
    name: "Shyok River",
    note: "The river of death, gentler than its name",
    image: "/images/shyok-river-valley.webp",
    imageAlt: "The braided Shyok river between mountain walls",
    span: "",
  },
  {
    name: "Glacier Streams",
    note: "Meltwater over ancient stone",
    image: "/images/mountain-stream.webp",
    imageAlt: "A clear stream rushing over rounded boulders",
    span: "",
  },
  {
    name: "Leh After Dark",
    note: "The valley switches on",
    image: "/images/leh-night-lights.webp",
    imageAlt: "Village lights and river channels at dusk",
    span: "md:col-span-2",
  },
];

export const MARQUEE_STOPS = [
  "Khardung La · 17,582 ft",
  "Nubra Valley",
  "Pangong Tso",
  "Magnetic Hill",
  "Chang La · 17,688 ft",
  "Turtuk",
  "Tso Moriri",
  "Diskit Monastery",
  "Sangam Point",
  "Hunder Dunes",
];
