import { Collection, DiscountRule, MenuSection, Product, TrackingOrder } from "@/lib/types";

export const menuSections: MenuSection[] = [
  {
    title: "Leagues",
    items: ["Premier League", "La Liga", "Serie A", "Champions League", "IPL"]
  },
  {
    title: "National Teams",
    items: ["Brazil", "Argentina", "Portugal", "Bangladesh", "India"]
  },
  {
    title: "Editions",
    items: ["Player Version", "Fan Version", "Retro Jersey", "Limited Drop"]
  }
];

export const products: Product[] = [
  {
    id: "prod_mancity_2526_home",
    slug: "man-city-home-25-26",
    name: "Manchester City Home 25/26",
    shortName: "Man City Home",
    team: "Manchester City",
    league: "Premier League",
    sport: "Football",
    category: "Club",
    accent: "from-sky-400 via-cyan-300 to-white",
    priceFrom: 79,
    rating: 4.9,
    reviewCount: 186,
    heroTag: "Club Drop",
    description:
      "Heat-pressed crest, lightweight knit, and print-ready customization tuned for premium fan delivery.",
    highlights: [
      "Player and Fan versions with different fit blocks",
      "Badge-ready sleeves for Champions League or Premier League patches",
      "Mobile-first purchase flow with instant side-cart"
    ],
    tags: [
      "manchester city",
      "premier league",
      "club",
      "football",
      "player version",
      "fan version",
      "custom print"
    ],
    collectionIds: ["col-premier-league", "col-player-edition"],
    source: "seed",
    media: [
      {
        id: "mci-1",
        type: "image",
        src: "/images/jerseys/club-sky-front.svg",
        alt: "Manchester City home jersey front view",
        label: "Front View"
      },
      {
        id: "mci-2",
        type: "image",
        src: "/images/jerseys/club-sky-back.svg",
        alt: "Manchester City home jersey back view",
        label: "Back View"
      },
      {
        id: "mci-3",
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: "Manchester City jersey video preview",
        label: "Video Preview"
      }
    ],
    variants: [
      {
        id: "var_mci_player",
        edition: "Player Version",
        sku: "MCI-2526-PV",
        price: 109,
        compareAtPrice: 129,
        badge: "Limited Edition",
        fitProfile: "Slim competition fit",
        sizes: [
          { label: "S", stock: 5, fitNote: "Tighter chest cut" },
          { label: "M", stock: 8, fitNote: "Best for athletic build" },
          { label: "L", stock: 3, fitNote: "Low remaining stock" },
          { label: "XL", stock: 2, fitNote: "Low remaining stock" }
        ]
      },
      {
        id: "var_mci_fan",
        edition: "Fan Version",
        sku: "MCI-2526-FV",
        price: 89,
        compareAtPrice: 99,
        badge: "In Stock",
        fitProfile: "Relaxed everyday fit",
        sizes: [
          { label: "S", stock: 10 },
          { label: "M", stock: 14 },
          { label: "L", stock: 11 },
          { label: "XL", stock: 7 }
        ]
      }
    ],
    patches: [
      {
        id: "patch_ucl",
        name: "Champions League",
        tournament: "UEFA",
        price: 8,
        description: "Official-style starball sleeve badge."
      },
      {
        id: "patch_epl",
        name: "Premier League",
        tournament: "Domestic",
        price: 6,
        description: "Lion sleeve patch for league matches."
      }
    ],
    customization: {
      nameMax: 12,
      numberRange: [0, 99],
      sizeGuide: {
        player: [
          { size: "S", chest: "48 cm", length: "69 cm", recommendation: "Slim fit" },
          { size: "M", chest: "50 cm", length: "71 cm", recommendation: "Athletic fit" },
          { size: "L", chest: "52 cm", length: "73 cm", recommendation: "Tight performance fit" },
          { size: "XL", chest: "54 cm", length: "75 cm", recommendation: "Performance fit" }
        ],
        fan: [
          { size: "S", chest: "50 cm", length: "70 cm", recommendation: "Regular fit" },
          { size: "M", chest: "53 cm", length: "72 cm", recommendation: "Most popular fit" },
          { size: "L", chest: "56 cm", length: "74 cm", recommendation: "Relaxed fit" },
          { size: "XL", chest: "59 cm", length: "76 cm", recommendation: "Relaxed fit" }
        ]
      }
    }
  },
  {
    id: "prod_madrid_away_2526",
    slug: "real-madrid-away-25-26",
    name: "Real Madrid Away 25/26",
    shortName: "Real Madrid Away",
    team: "Real Madrid",
    league: "La Liga",
    sport: "Football",
    category: "Club",
    accent: "from-zinc-950 via-zinc-800 to-slate-500",
    priceFrom: 84,
    rating: 4.8,
    reviewCount: 142,
    heroTag: "Away Kit",
    description:
      "Dark-match palette with tonal trim, premium sponsor detailing, and print-safe material for sharp personalization.",
    highlights: [
      "Tonal premium aesthetic optimized for mobile merchandising",
      "High-resolution gallery with back-print visibility",
      "Designed for quick patch and size selection"
    ],
    tags: [
      "real madrid",
      "la liga",
      "football",
      "away kit",
      "retro jersey",
      "fan version"
    ],
    collectionIds: ["col-la-liga", "col-night-away"],
    source: "seed",
    media: [
      {
        id: "rm-1",
        type: "image",
        src: "/images/jerseys/club-dark-front.svg",
        alt: "Real Madrid away jersey front view",
        label: "Front View"
      },
      {
        id: "rm-2",
        type: "image",
        src: "/images/jerseys/club-dark-back.svg",
        alt: "Real Madrid away jersey back view",
        label: "Back View"
      },
      {
        id: "rm-3",
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: "Real Madrid jersey video preview",
        label: "Video Preview"
      }
    ],
    variants: [
      {
        id: "var_rm_player",
        edition: "Player Version",
        sku: "RMA-2526-PV",
        price: 114,
        compareAtPrice: 132,
        badge: "Low Stock",
        fitProfile: "Slim on-body cut",
        sizes: [
          { label: "S", stock: 2 },
          { label: "M", stock: 4 },
          { label: "L", stock: 3 },
          { label: "XL", stock: 1 }
        ]
      },
      {
        id: "var_rm_fan",
        edition: "Fan Version",
        sku: "RMA-2526-FV",
        price: 94,
        compareAtPrice: 108,
        badge: "In Stock",
        fitProfile: "Regular stadium fit",
        sizes: [
          { label: "S", stock: 9 },
          { label: "M", stock: 12 },
          { label: "L", stock: 8 },
          { label: "XL", stock: 6 }
        ]
      }
    ],
    patches: [
      {
        id: "patch_ucl",
        name: "Champions League",
        tournament: "UEFA",
        price: 8,
        description: "Official-style starball sleeve badge."
      },
      {
        id: "patch_fifa",
        name: "Club World Cup",
        tournament: "FIFA",
        price: 7,
        description: "Tournament winner chest badge."
      }
    ],
    customization: {
      nameMax: 12,
      numberRange: [0, 99],
      sizeGuide: {
        player: [
          { size: "S", chest: "47 cm", length: "68 cm", recommendation: "Performance fit" },
          { size: "M", chest: "49 cm", length: "70 cm", recommendation: "Athletic fit" },
          { size: "L", chest: "51 cm", length: "72 cm", recommendation: "Tapered fit" },
          { size: "XL", chest: "53 cm", length: "74 cm", recommendation: "Tapered fit" }
        ],
        fan: [
          { size: "S", chest: "50 cm", length: "70 cm", recommendation: "Regular fit" },
          { size: "M", chest: "53 cm", length: "72 cm", recommendation: "Regular fit" },
          { size: "L", chest: "56 cm", length: "74 cm", recommendation: "Relaxed fit" },
          { size: "XL", chest: "59 cm", length: "76 cm", recommendation: "Relaxed fit" }
        ]
      }
    }
  },
  {
    id: "prod_brazil_home_2026",
    slug: "brazil-home-2026",
    name: "Brazil Home 2026",
    shortName: "Brazil Home",
    team: "Brazil",
    league: "National Teams",
    sport: "Football",
    category: "National",
    accent: "from-yellow-300 via-emerald-300 to-emerald-500",
    priceFrom: 82,
    rating: 4.9,
    reviewCount: 211,
    heroTag: "National Team",
    description:
      "Tournament-focused release with bright crest execution, layered fabric texture, and global delivery-ready packaging.",
    highlights: [
      "National team navigation ready for tournament discovery",
      "Supports World Cup patching and custom back print",
      "Built for premium collection storytelling"
    ],
    tags: [
      "brazil",
      "national team",
      "football",
      "world cup",
      "player version",
      "fan version"
    ],
    collectionIds: ["col-national-icons", "col-world-stage"],
    source: "seed",
    media: [
      {
        id: "br-1",
        type: "image",
        src: "/images/jerseys/national-yellow-front.svg",
        alt: "Brazil home jersey front view",
        label: "Front View"
      },
      {
        id: "br-2",
        type: "image",
        src: "/images/jerseys/national-yellow-back.svg",
        alt: "Brazil home jersey back view",
        label: "Back View"
      },
      {
        id: "br-3",
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: "Brazil jersey video preview",
        label: "Video Preview"
      }
    ],
    variants: [
      {
        id: "var_brazil_player",
        edition: "Player Version",
        sku: "BRA-2026-PV",
        price: 111,
        compareAtPrice: 126,
        badge: "Limited Edition",
        fitProfile: "Tournament slim fit",
        sizes: [
          { label: "S", stock: 4 },
          { label: "M", stock: 5 },
          { label: "L", stock: 3 },
          { label: "XL", stock: 2 }
        ]
      },
      {
        id: "var_brazil_fan",
        edition: "Fan Version",
        sku: "BRA-2026-FV",
        price: 92,
        compareAtPrice: 104,
        badge: "In Stock",
        fitProfile: "Regular supporter fit",
        sizes: [
          { label: "S", stock: 11 },
          { label: "M", stock: 13 },
          { label: "L", stock: 10 },
          { label: "XL", stock: 8 }
        ]
      }
    ],
    patches: [
      {
        id: "patch_worldcup",
        name: "World Cup",
        tournament: "FIFA",
        price: 9,
        description: "Tournament sleeve badge for national kits."
      }
    ],
    customization: {
      nameMax: 12,
      numberRange: [0, 99],
      sizeGuide: {
        player: [
          { size: "S", chest: "48 cm", length: "69 cm", recommendation: "Athletic fit" },
          { size: "M", chest: "50 cm", length: "71 cm", recommendation: "Athletic fit" },
          { size: "L", chest: "52 cm", length: "73 cm", recommendation: "Slim fit" },
          { size: "XL", chest: "54 cm", length: "75 cm", recommendation: "Slim fit" }
        ],
        fan: [
          { size: "S", chest: "51 cm", length: "70 cm", recommendation: "Regular fit" },
          { size: "M", chest: "54 cm", length: "72 cm", recommendation: "Regular fit" },
          { size: "L", chest: "57 cm", length: "74 cm", recommendation: "Relaxed fit" },
          { size: "XL", chest: "60 cm", length: "76 cm", recommendation: "Relaxed fit" }
        ]
      }
    }
  },
  {
    id: "prod_bd_cricket_wc",
    slug: "bangladesh-cricket-world-cup-edition",
    name: "Bangladesh Cricket World Cup Edition",
    shortName: "Bangladesh Cricket",
    team: "Bangladesh",
    league: "ICC World Cup",
    sport: "Cricket",
    category: "National",
    accent: "from-emerald-700 via-emerald-500 to-red-500",
    priceFrom: 76,
    rating: 4.7,
    reviewCount: 118,
    heroTag: "Cricket Special",
    description:
      "A cricket-first drop with breathable mesh zones, tournament identity, and support for custom player print.",
    highlights: [
      "Cricket product architecture shares the same premium PDP flow",
      "Supports patch toggles and print export for backend operations",
      "Built for Dhaka-centric inside/outside city shipping"
    ],
    tags: [
      "bangladesh",
      "cricket",
      "world cup",
      "national team",
      "fan version",
      "player version"
    ],
    collectionIds: ["col-cricket-premium", "col-world-stage"],
    source: "seed",
    media: [
      {
        id: "bd-1",
        type: "image",
        src: "/images/jerseys/cricket-green-front.svg",
        alt: "Bangladesh cricket jersey front view",
        label: "Front View"
      },
      {
        id: "bd-2",
        type: "image",
        src: "/images/jerseys/cricket-green-back.svg",
        alt: "Bangladesh cricket jersey back view",
        label: "Back View"
      },
      {
        id: "bd-3",
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: "Bangladesh cricket jersey video preview",
        label: "Video Preview"
      }
    ],
    variants: [
      {
        id: "var_bd_player",
        edition: "Player Version",
        sku: "BD-CRIC-PV",
        price: 98,
        compareAtPrice: 114,
        badge: "Low Stock",
        fitProfile: "Athletic cricket fit",
        sizes: [
          { label: "S", stock: 3 },
          { label: "M", stock: 4 },
          { label: "L", stock: 2 },
          { label: "XL", stock: 1 }
        ]
      },
      {
        id: "var_bd_fan",
        edition: "Fan Version",
        sku: "BD-CRIC-FV",
        price: 84,
        compareAtPrice: 96,
        badge: "In Stock",
        fitProfile: "Regular supporter fit",
        sizes: [
          { label: "S", stock: 12 },
          { label: "M", stock: 16 },
          { label: "L", stock: 12 },
          { label: "XL", stock: 9 }
        ]
      }
    ],
    patches: [
      {
        id: "patch_worldcup",
        name: "World Cup",
        tournament: "ICC",
        price: 7,
        description: "Tournament patch for major cricket events."
      }
    ],
    customization: {
      nameMax: 12,
      numberRange: [0, 99],
      sizeGuide: {
        player: [
          { size: "S", chest: "49 cm", length: "70 cm", recommendation: "Athletic fit" },
          { size: "M", chest: "51 cm", length: "72 cm", recommendation: "Athletic fit" },
          { size: "L", chest: "53 cm", length: "74 cm", recommendation: "Slim fit" },
          { size: "XL", chest: "55 cm", length: "76 cm", recommendation: "Slim fit" }
        ],
        fan: [
          { size: "S", chest: "52 cm", length: "71 cm", recommendation: "Regular fit" },
          { size: "M", chest: "55 cm", length: "73 cm", recommendation: "Regular fit" },
          { size: "L", chest: "58 cm", length: "75 cm", recommendation: "Relaxed fit" },
          { size: "XL", chest: "61 cm", length: "77 cm", recommendation: "Relaxed fit" }
        ]
      }
    }
  }
];

export const collections: Collection[] = [
  {
    id: "col-premier-league",
    name: "Premier League Elite",
    slug: "premier-league-elite",
    description: "Top-flight club shirts curated for collectors and weekly wear.",
    accent: "from-sky-400 via-cyan-300 to-white",
    coverImage: "/images/jerseys/club-sky-front.svg",
    featured: true
  },
  {
    id: "col-la-liga",
    name: "La Liga Luxe",
    slug: "la-liga-luxe",
    description: "Clean away kits and statement matchday drops from Spain.",
    accent: "from-zinc-950 via-zinc-800 to-slate-500",
    coverImage: "/images/jerseys/club-dark-front.svg",
    featured: true
  },
  {
    id: "col-national-icons",
    name: "National Icons",
    slug: "national-icons",
    description: "Premium national team jerseys with tournament-ready styling.",
    accent: "from-yellow-300 via-emerald-300 to-emerald-500",
    coverImage: "/images/jerseys/national-yellow-front.svg",
    featured: true
  },
  {
    id: "col-cricket-premium",
    name: "Cricket Premium",
    slug: "cricket-premium",
    description: "Modern cricket jerseys with breathable fabric stories and print-ready finishes.",
    accent: "from-emerald-700 via-emerald-500 to-red-500",
    coverImage: "/images/jerseys/cricket-green-front.svg",
    featured: false
  },
  {
    id: "col-player-edition",
    name: "Player Edition",
    slug: "player-edition",
    description: "Slim competition fits for fans who want the on-pitch silhouette.",
    accent: "from-slate-900 via-slate-700 to-blue-500",
    coverImage: "/images/jerseys/video-preview.svg",
    featured: false
  },
  {
    id: "col-night-away",
    name: "Night Away Kits",
    slug: "night-away-kits",
    description: "Dark-toned away kits with premium trims and collector appeal.",
    accent: "from-zinc-900 via-slate-700 to-slate-300",
    coverImage: "/images/jerseys/club-dark-back.svg",
    featured: false
  },
  {
    id: "col-world-stage",
    name: "World Stage",
    slug: "world-stage",
    description: "Tournament-focused drops for the biggest international fixtures.",
    accent: "from-blue-500 via-cyan-300 to-white",
    coverImage: "/images/jerseys/video-preview.svg",
    featured: false
  }
];

export const discounts: DiscountRule[] = [
  {
    id: "discount-launch",
    title: "Launch Week",
    code: "VANTA10",
    mode: "percentage",
    value: 10,
    target: "collection",
    targetIds: ["col-premier-league"],
    active: true
  }
];

export const featuredProducts = products.slice(0, 4);

export const storefrontStats = [
  { label: "Premium drops", value: "120+" },
  { label: "Avg. mobile load target", value: "<2s" },
  { label: "Print-ready orders", value: "100%" }
];

export const trackingOrders: TrackingOrder[] = [
  {
    orderId: "VK-20481",
    phone: "01711223344",
    destination: "Dhaka, Inside City",
    eta: "Expected April 9, 2026",
    status: "In Transit",
    paymentMethod: "Cash on Delivery",
    items: ["Manchester City Home 25/26", "Champions League Patch"],
    timeline: [
      {
        status: "Order Confirmed",
        date: "April 7, 2026",
        note: "Order and customization details have been validated."
      },
      {
        status: "Printing Queue",
        date: "April 7, 2026",
        note: "Back print is being prepared for heat press production."
      },
      {
        status: "Packed",
        date: "April 8, 2026",
        note: "Shipping label generated and handed to courier."
      },
      {
        status: "In Transit",
        date: "April 8, 2026",
        note: "Courier picked up the parcel for city delivery."
      }
    ]
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function searchProducts(query: string) {
  const term = query.trim().toLowerCase();

  if (!term) {
    return featuredProducts;
  }

  return products.filter((product) => {
    const fields = [product.name, product.team, product.league, product.sport, ...product.tags];
    return fields.some((field) => field.toLowerCase().includes(term));
  });
}

export function findTrackingOrder(orderId: string, phone: string) {
  return trackingOrders.find(
    (order) =>
      order.orderId.toLowerCase() === orderId.trim().toLowerCase() &&
      order.phone === phone.trim()
  );
}
