"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from "firebase/firestore";

import {
  collections as seedCollections,
  discounts as seedDiscounts,
  products as seedProducts
} from "@/lib/mock-data";
import { db } from "@/lib/firebaseConfig";
import { Collection, DiscountRule, MenuSection, Product } from "@/lib/types";

const STORAGE_KEY = "vanta-kits-catalog";

interface CatalogSnapshot {
  products: Product[];
  collections: Collection[];
  discounts: DiscountRule[];
}

interface CatalogContextValue {
  products: Product[];
  rawProducts: Product[];
  collections: Collection[];
  featuredCollections: Collection[];
  discounts: DiscountRule[];
  menuSections: MenuSection[];
  featuredProducts: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getCollectionBySlug: (slug: string) => Collection | undefined;
  getProductsByCollectionId: (collectionId: string) => Product[];
  searchProducts: (query: string) => Product[];
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  upsertCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  upsertDiscount: (discount: DiscountRule) => Promise<void>;
  deleteDiscount: (discountId: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(record: Record<string, unknown>, id: string): Product {
  const imageUrl =
    typeof record.imageUrl === "string"
      ? record.imageUrl
      : typeof record["image"] === "string"
        ? String(record["image"])
        : "/images/jerseys/club-sky-front.svg";
  const backImageUrl =
    typeof record.backImageUrl === "string"
      ? record.backImageUrl
      : imageUrl;
  const rawVariants = Array.isArray(record.variants) ? record.variants : null;
  const basePrice = toNumber(record.priceFrom ?? record.price, 0);
  const sport =
    record.sport === "Cricket" || record.category === "Cricket" ? "Cricket" : "Football";
  const productCategory = record.category === "National" ? "National" : "Club";
  const playerPrice = rawVariants?.[0]
    ? toNumber((rawVariants[0] as { price?: unknown }).price, basePrice)
    : basePrice;
  const fanPrice = rawVariants?.[1]
    ? toNumber((rawVariants[1] as { price?: unknown }).price, basePrice)
    : basePrice;

  return {
    id,
    slug:
      typeof record.slug === "string"
        ? record.slug
        : String(record.name ?? "new-jersey").toLowerCase().replace(/\s+/g, "-"),
    name: String(record.name ?? "Untitled Jersey"),
    shortName: String(record.shortName ?? record.name ?? "Untitled Jersey"),
    team: String(record.team ?? "Custom Team"),
    league: String(record.league ?? "Featured"),
    sport,
    category: productCategory,
    accent: String(record.accent ?? "from-slate-900 via-slate-700 to-blue-500"),
    priceFrom: toNumber(record.priceFrom, Math.min(playerPrice, fanPrice)),
    rating: toNumber(record.rating, 4.8),
    reviewCount: toNumber(record.reviewCount, 0),
    heroTag: String(record.heroTag ?? "New Drop"),
    description: String(record.description ?? "Freshly uploaded jersey product."),
    highlights: Array.isArray(record.highlights)
      ? record.highlights.map((item) => String(item))
      : [
          "Uploaded through the admin panel",
          "Price controlled from the dashboard",
          "Cloudinary image attached"
        ],
    tags: Array.isArray(record.tags)
      ? record.tags.map((item) => String(item))
      : [String(record.name ?? "jersey").toLowerCase()],
    collectionIds: Array.isArray(record.collectionIds)
      ? record.collectionIds.map((item) => String(item))
      : [],
    discountPercentage: toNumber(record.discountPercentage, 0),
    source: record.source === "author" ? "author" : "seed",
    imageUrl,
    backImageUrl,
    uploaderUid: typeof record.uploaderUid === "string" ? record.uploaderUid : undefined,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : undefined,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : undefined,
    media: Array.isArray(record.media)
      ? (record.media as Record<string, unknown>[])
          .filter((media) => media.type !== "video")
          .slice(0, 2)
          .map((media, index) => {
            const item = media as Record<string, unknown>;

            return {
              id: String(item.id ?? `${id}-media-${index}`),
              type: "image" as const,
              src:
                typeof item.src === "string"
                  ? item.src
                  : index === 0
                    ? imageUrl
                    : backImageUrl,
              alt: String(
                item.alt ??
                  `${record.name ?? "Jersey"} ${index === 0 ? "front" : "back"} view`
              ),
              label: String(item.label ?? (index === 0 ? "Front View" : "Back View"))
            };
          })
      : [
          {
            id: `${id}-front`,
            type: "image",
            src: imageUrl,
            alt: `${record.name ?? "Jersey"} front view`,
            label: "Front View"
          },
          {
            id: `${id}-back`,
            type: "image",
            src: backImageUrl,
            alt: `${record.name ?? "Jersey"} back view`,
            label: "Back View"
          }
        ],
    variants: rawVariants?.length
      ? rawVariants.map((variant, index) => {
          const item = variant as Record<string, unknown>;

          return {
            id: String(item.id ?? `${id}-variant-${index}`),
            edition:
              item.edition === "Fan Version" || item.edition === "Retro Jersey" || item.edition === "Limited Drop"
                ? item.edition
                : "Player Version",
            sku: String(item.sku ?? `${String(record.name ?? "jersey").replace(/\s+/g, "-").toUpperCase()}-${index + 1}`),
            price: toNumber(item.price, basePrice),
            compareAtPrice: item.compareAtPrice ? toNumber(item.compareAtPrice) : undefined,
            badge:
              item.badge === "Limited Edition" || item.badge === "Low Stock"
                ? item.badge
                : "In Stock",
            fitProfile: String(item.fitProfile ?? (index === 0 ? "Slim competition fit" : "Relaxed supporter fit")),
            sizes: Array.isArray(item.sizes)
              ? item.sizes.map((size) => {
                  const sizeItem = size as Record<string, unknown>;

                  return {
                    label: String(sizeItem.label ?? "M"),
                    stock: toNumber(sizeItem.stock, 10),
                    fitNote:
                      typeof sizeItem.fitNote === "string" ? sizeItem.fitNote : undefined
                  };
                })
              : [
                  { label: "S", stock: 10 },
                  { label: "M", stock: 10 },
                  { label: "L", stock: 10 },
                  { label: "XL", stock: 10 }
                ]
          };
        })
      : [
          {
            id: `${id}-player`,
            edition: "Player Version",
            sku: `${String(record.name ?? "jersey").replace(/\s+/g, "-").toUpperCase()}-PLAYER`,
            price: playerPrice,
            compareAtPrice: playerPrice > 0 ? Math.round(playerPrice * 1.1) : undefined,
            badge: "In Stock",
            fitProfile: "Slim competition fit",
            sizes: [
              { label: "S", stock: 10 },
              { label: "M", stock: 10 },
              { label: "L", stock: 10 },
              { label: "XL", stock: 10 }
            ]
          },
          {
            id: `${id}-fan`,
            edition: "Fan Version",
            sku: `${String(record.name ?? "jersey").replace(/\s+/g, "-").toUpperCase()}-FAN`,
            price: fanPrice || playerPrice,
            compareAtPrice: fanPrice > 0 ? Math.round(fanPrice * 1.1) : undefined,
            badge: "In Stock",
            fitProfile: "Relaxed supporter fit",
            sizes: [
              { label: "S", stock: 10 },
              { label: "M", stock: 10 },
              { label: "L", stock: 10 },
              { label: "XL", stock: 10 }
            ]
          }
        ],
    patches: Array.isArray(record.patches)
      ? record.patches.map((patch, index) => {
          const item = patch as Record<string, unknown>;

          return {
            id: String(item.id ?? `${id}-patch-${index}`),
            name: String(item.name ?? "Official Patch"),
            tournament: String(item.tournament ?? "League"),
            price: toNumber(item.price, 0),
            description: String(item.description ?? "Applied at production time.")
          };
        })
      : [],
    customization:
      typeof record.customization === "object" && record.customization
        ? (record.customization as Product["customization"])
        : {
            nameMax: 12,
            numberRange: [0, 99],
            sizeGuide: {
              player: [
                { size: "S", chest: "48 cm", length: "69 cm", recommendation: "Slim fit" },
                { size: "M", chest: "50 cm", length: "71 cm", recommendation: "Athletic fit" }
              ],
              fan: [
                { size: "S", chest: "51 cm", length: "70 cm", recommendation: "Regular fit" },
                { size: "M", chest: "54 cm", length: "72 cm", recommendation: "Regular fit" }
              ]
            }
          }
  };
}

function normalizeCollection(record: Record<string, unknown>, id: string): Collection {
  return {
    id,
    name: String(record.name ?? "Untitled Collection"),
    slug: String(record.slug ?? String(record.name ?? "collection").toLowerCase().replace(/\s+/g, "-")),
    description: String(record.description ?? "Author-managed collection."),
    accent: String(record.accent ?? "from-slate-900 via-slate-700 to-blue-500"),
    coverImage: String(record.coverImage ?? "/images/jerseys/video-preview.svg"),
    featured: Boolean(record.featured)
  };
}

function normalizeDiscount(record: Record<string, unknown>, id: string): DiscountRule {
  return {
    id,
    title: String(record.title ?? "Discount"),
    code: String(record.code ?? "SAVE"),
    mode: record.mode === "fixed" ? "fixed" : "percentage",
    value: toNumber(record.value, 0),
    target:
      record.target === "sitewide" || record.target === "collection" ? record.target : "product",
    targetIds: Array.isArray(record.targetIds) ? record.targetIds.map((item) => String(item)) : [],
    active: record.active !== false
  };
}

function applySingleDiscount(value: number, percent: number, fixed: number) {
  const discounted = value * (1 - percent / 100) - fixed;
  return Math.max(0, Math.round(discounted));
}

function getDiscountForProduct(product: Product, activeDiscounts: DiscountRule[]) {
  let percent = product.discountPercentage ?? 0;
  let fixed = 0;

  for (const rule of activeDiscounts) {
    const matches =
      rule.target === "sitewide" ||
      (rule.target === "product" && rule.targetIds.includes(product.id)) ||
      (rule.target === "collection" &&
        product.collectionIds.some((collectionId) => rule.targetIds.includes(collectionId)));

    if (!matches) {
      continue;
    }

    if (rule.mode === "percentage") {
      percent = Math.max(percent, rule.value);
    } else {
      fixed = Math.max(fixed, rule.value);
    }
  }

  return { percent, fixed };
}

function applyDiscounts(products: Product[], discounts: DiscountRule[]) {
  const activeDiscounts = discounts.filter((rule) => rule.active);

  return products.map((entry) => {
    const product = cloneValue(entry);
    const discount = getDiscountForProduct(product, activeDiscounts);

    product.variants = product.variants.map((variant) => {
      const originalPrice = variant.price;
      const discountedPrice = applySingleDiscount(originalPrice, discount.percent, discount.fixed);
      const hasDiscount = discountedPrice < originalPrice;

      return {
        ...variant,
        price: discountedPrice,
        compareAtPrice: hasDiscount
          ? Math.max(variant.compareAtPrice ?? 0, originalPrice)
          : variant.compareAtPrice
      };
    });

    product.priceFrom = Math.min(...product.variants.map((variant) => variant.price));

    return product;
  });
}

function deriveMenuSections(products: Product[]): MenuSection[] {
  const leagues = Array.from(
    new Set(
      products
        .filter((product) => product.category === "Club")
        .map((product) => product.league)
        .filter(Boolean)
    )
  ).slice(0, 6);
  const nationalTeams = Array.from(
    new Set(
      products
        .filter((product) => product.category === "National")
        .map((product) => product.team)
        .filter(Boolean)
    )
  ).slice(0, 6);
  const editions = Array.from(
    new Set(products.flatMap((product) => product.variants.map((variant) => variant.edition)))
  );

  return [
    {
      title: "Leagues",
      items: leagues
    },
    {
      title: "National Teams",
      items: nationalTeams
    },
    {
      title: "Editions",
      items: editions
    }
  ];
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [rawProducts, setRawProducts] = useState<Product[]>(cloneValue(seedProducts));
  const [collections, setCollections] = useState<Collection[]>(cloneValue(seedCollections));
  const [discounts, setDiscounts] = useState<DiscountRule[]>(cloneValue(seedDiscounts));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<CatalogSnapshot>;

        if (parsed.products?.length) {
          setRawProducts(parsed.products);
        }

        if (parsed.collections?.length) {
          setCollections(parsed.collections);
        }

        if (parsed.discounts?.length) {
          setDiscounts(parsed.discounts);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      if (snapshot.empty) {
        return;
      }

      setRawProducts(
        snapshot.docs.map((entry) =>
          normalizeProduct(entry.data() as Record<string, unknown>, entry.id)
        )
      );
    });

    const unsubscribeCollections = onSnapshot(collection(db, "collections"), (snapshot) => {
      if (snapshot.empty) {
        return;
      }

      setCollections(
        snapshot.docs.map((entry) =>
          normalizeCollection(entry.data() as Record<string, unknown>, entry.id)
        )
      );
    });

    const unsubscribeDiscounts = onSnapshot(collection(db, "discounts"), (snapshot) => {
      if (snapshot.empty) {
        return;
      }

      setDiscounts(
        snapshot.docs.map((entry) =>
          normalizeDiscount(entry.data() as Record<string, unknown>, entry.id)
        )
      );
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCollections();
      unsubscribeDiscounts();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        products: rawProducts,
        collections,
        discounts
      } satisfies CatalogSnapshot)
    );
  }, [collections, discounts, hydrated, rawProducts]);

  const products = useMemo(() => applyDiscounts(rawProducts, discounts), [discounts, rawProducts]);
  const menuSections = useMemo(() => deriveMenuSections(products), [products]);
  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const featuredCollections = useMemo(
    () => collections.filter((collection) => collection.featured).slice(0, 3),
    [collections]
  );

  async function upsertProduct(product: Product) {
    setRawProducts((current) => {
      const next = current.some((entry) => entry.id === product.id)
        ? current.map((entry) => (entry.id === product.id ? product : entry))
        : [product, ...current];
      return next;
    });

    await setDoc(doc(db, "products", product.id), product, { merge: true });
  }

  async function deleteProduct(productId: string) {
    setRawProducts((current) => current.filter((entry) => entry.id !== productId));
    await deleteDoc(doc(db, "products", productId));
  }

  async function upsertCollection(collectionData: Collection) {
    setCollections((current) =>
      current.some((entry) => entry.id === collectionData.id)
        ? current.map((entry) => (entry.id === collectionData.id ? collectionData : entry))
        : [collectionData, ...current]
    );

    await setDoc(doc(db, "collections", collectionData.id), collectionData, { merge: true });
  }

  async function deleteCollection(collectionId: string) {
    setCollections((current) => current.filter((entry) => entry.id !== collectionId));
    setRawProducts((current) =>
      current.map((product) => ({
        ...product,
        collectionIds: product.collectionIds.filter((id) => id !== collectionId)
      }))
    );
    await deleteDoc(doc(db, "collections", collectionId));
  }

  async function upsertDiscount(discount: DiscountRule) {
    setDiscounts((current) =>
      current.some((entry) => entry.id === discount.id)
        ? current.map((entry) => (entry.id === discount.id ? discount : entry))
        : [discount, ...current]
    );

    await setDoc(doc(db, "discounts", discount.id), discount, { merge: true });
  }

  async function deleteDiscount(discountId: string) {
    setDiscounts((current) => current.filter((entry) => entry.id !== discountId));
    await deleteDoc(doc(db, "discounts", discountId));
  }

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      rawProducts,
      collections,
      featuredCollections,
      discounts,
      menuSections,
      featuredProducts,
      getProductBySlug: (slug) => products.find((product) => product.slug === slug),
      getCollectionBySlug: (slug) => collections.find((collection) => collection.slug === slug),
      getProductsByCollectionId: (collectionId) =>
        products.filter((product) => product.collectionIds.includes(collectionId)),
      searchProducts: (query) => {
        const term = query.trim().toLowerCase();

        if (!term) {
          return featuredProducts;
        }

        return products.filter((product) => product.name.toLowerCase().includes(term));
      },
      upsertProduct,
      deleteProduct,
      upsertCollection,
      deleteCollection,
      upsertDiscount,
      deleteDiscount
    }),
    [collections, discounts, featuredCollections, featuredProducts, menuSections, products, rawProducts]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }

  return context;
}
