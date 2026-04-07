"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { useCatalog } from "@/components/catalog-provider";
import { Collection, DiscountRule, Product } from "@/lib/types";

const accentPresets = [
  "from-slate-900 via-slate-700 to-blue-500",
  "from-sky-400 via-cyan-300 to-white",
  "from-zinc-950 via-zinc-800 to-slate-500",
  "from-yellow-300 via-emerald-300 to-emerald-500",
  "from-emerald-700 via-emerald-500 to-red-500",
  "from-violet-500 via-fuchsia-400 to-rose-300"
];

function buildBlankProduct(): Product {
  return {
    id: "",
    slug: "",
    name: "",
    shortName: "",
    team: "",
    league: "",
    sport: "Football",
    category: "Club",
    accent: accentPresets[0],
    priceFrom: 0,
    rating: 4.8,
    reviewCount: 0,
    heroTag: "New Drop",
    description: "",
    highlights: [
      "Author-created product",
      "Price editable from dashboard",
      "Image URLs controlled from the web"
    ],
    tags: [],
    collectionIds: [],
    discountPercentage: 0,
    source: "author",
    media: [
      {
        id: crypto.randomUUID(),
        type: "image",
        src: "/images/jerseys/club-sky-front.svg",
        alt: "Front view",
        label: "Front View"
      },
      {
        id: crypto.randomUUID(),
        type: "image",
        src: "/images/jerseys/club-sky-back.svg",
        alt: "Back view",
        label: "Back View"
      },
      {
        id: crypto.randomUUID(),
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: "Video preview",
        label: "Video Preview"
      }
    ],
    variants: [
      {
        id: crypto.randomUUID(),
        edition: "Player Version",
        sku: "",
        price: 0,
        compareAtPrice: 0,
        badge: "Limited Edition",
        fitProfile: "Slim competition fit",
        sizes: [
          { label: "S", stock: 5 },
          { label: "M", stock: 5 },
          { label: "L", stock: 5 },
          { label: "XL", stock: 5 }
        ]
      },
      {
        id: crypto.randomUUID(),
        edition: "Fan Version",
        sku: "",
        price: 0,
        compareAtPrice: 0,
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
    patches: [],
    customization: {
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

export function AuthorDashboard() {
  const { hydrated, user, isAuthor } = useAuth();
  const {
    rawProducts,
    collections,
    discounts,
    upsertProduct,
    deleteProduct,
    upsertCollection,
    deleteCollection,
    upsertDiscount,
    deleteDiscount
  } = useCatalog();

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [draftProduct, setDraftProduct] = useState<Product>(buildBlankProduct());
  const [status, setStatus] = useState("");

  const [collectionDraft, setCollectionDraft] = useState<Collection>({
    id: "",
    name: "",
    slug: "",
    description: "",
    accent: accentPresets[1],
    coverImage: "/images/jerseys/video-preview.svg",
    featured: false
  });

  const [discountDraft, setDiscountDraft] = useState<DiscountRule>({
    id: "",
    title: "",
    code: "",
    mode: "percentage",
    value: 10,
    target: "product",
    targetIds: [],
    active: true
  });

  const selectedProduct = useMemo(
    () => rawProducts.find((product) => product.id === selectedProductId),
    [rawProducts, selectedProductId]
  );

  useEffect(() => {
    if (selectedProduct) {
      setDraftProduct(selectedProduct);
    }
  }, [selectedProduct]);

  if (!hydrated) {
    return (
      <div className="shell py-10">
        <div className="panel p-8 text-center text-sm text-ink/60">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="shell py-10">
        <div className="panel p-8 text-center">
          <p className="eyebrow">Author Login Required</p>
          <h1 className="section-heading mt-4 text-5xl">Sign in first to manage the catalog</h1>
          <div className="mt-6 flex justify-center">
            <Link className="button-primary" href="/login">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="shell py-10">
        <div className="panel p-8 text-center">
          <p className="eyebrow">Access Restricted</p>
          <h1 className="section-heading mt-4 text-5xl">This dashboard is for authors only</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 muted-copy">
            Sign in as an author to edit prices, create collections, manage discounts, and update
            jersey image URLs from the browser.
          </p>
        </div>
      </div>
    );
  }

  async function handleSaveProduct() {
    const playerVariant = draftProduct.variants[0];
    const fanVariant = draftProduct.variants[1] ?? draftProduct.variants[0];
    const productId = draftProduct.id || crypto.randomUUID();
    const slug = draftProduct.slug.trim() || draftProduct.name.toLowerCase().replace(/\s+/g, "-");

    const nextProduct: Product = {
      ...draftProduct,
      id: productId,
      slug,
      shortName: draftProduct.shortName || draftProduct.name,
      tags: [draftProduct.name, draftProduct.team, draftProduct.league, draftProduct.sport]
        .filter(Boolean)
        .map((entry) => entry.toLowerCase()),
      priceFrom: Math.min(playerVariant.price, fanVariant.price),
      source: "author"
    };

    await upsertProduct(nextProduct);
    setSelectedProductId(productId);
    setStatus("Product saved. Pricing, discount, and image URLs are now controlled from the dashboard.");
  }

  async function handleSaveCollection() {
    const nextCollection = {
      ...collectionDraft,
      id: collectionDraft.id || crypto.randomUUID()
    };

    await upsertCollection(nextCollection);
    setCollectionDraft({
      id: "",
      name: "",
      slug: "",
      description: "",
      accent: accentPresets[1],
      coverImage: "/images/jerseys/video-preview.svg",
      featured: false
    });
    setStatus("Collection saved.");
  }

  async function handleSaveDiscount() {
    const nextDiscount = {
      ...discountDraft,
      id: discountDraft.id || crypto.randomUUID(),
      targetIds: discountDraft.targetIds.filter(Boolean)
    };

    await upsertDiscount(nextDiscount);
    setDiscountDraft({
      id: "",
      title: "",
      code: "",
      mode: "percentage",
      value: 10,
      target: "product",
      targetIds: [],
      active: true
    });
    setStatus("Discount rule saved.");
  }

  return (
    <div className="shell py-10">
      <div className="grid gap-6">
        <div className="panel-dark p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow border-white/10 bg-white/10 text-white">Author Dashboard</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">
                Control pricing, collections, discounts, and image URLs from inside the web app
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/admin/add-product">
                Upload new product
              </Link>
              <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
                Firestore sync:
                <span className="ml-2 font-semibold text-white">live</span>
              </div>
            </div>
          </div>
          {status ? <p className="mt-4 text-sm font-semibold text-accentSoft">{status}</p> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Product Studio</p>
                <h2 className="section-heading mt-4 text-5xl">Edit live products or create a new one</h2>
              </div>
              <div className="flex gap-2">
                <select
                  className="rounded-full border border-ink/10 bg-white/80 px-4 py-3 text-sm"
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  value={selectedProductId}
                >
                  <option value="">New product</option>
                  {rawProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <button
                  className="button-secondary"
                  onClick={() => {
                    setSelectedProductId("");
                    setDraftProduct(buildBlankProduct());
                  }}
                  type="button"
                >
                  New
                </button>
              </div>
            </div>

            <ProductEditor collections={collections} draftProduct={draftProduct} setDraftProduct={setDraftProduct} />

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="button-primary" onClick={handleSaveProduct} type="button">
                Save product
              </button>
              {selectedProductId ? (
                <button
                  className="button-secondary"
                  onClick={() => deleteProduct(selectedProductId)}
                  type="button"
                >
                  Delete product
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6">
            <CollectionEditor
              collectionDraft={collectionDraft}
              collections={collections}
              onDelete={deleteCollection}
              onSave={handleSaveCollection}
              setCollectionDraft={setCollectionDraft}
            />
            <DiscountEditor
              collections={collections}
              discountDraft={discountDraft}
              discounts={discounts}
              onDelete={deleteDiscount}
              onSave={handleSaveDiscount}
              products={rawProducts}
              setDiscountDraft={setDiscountDraft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductEditor({
  draftProduct,
  collections,
  setDraftProduct
}: {
  draftProduct: Product;
  collections: Collection[];
  setDraftProduct: Dispatch<SetStateAction<Product>>;
}) {
  return (
    <div className="mt-8 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Name", "name"],
          ["Slug", "slug"],
          ["Short Name", "shortName"],
          ["Team", "team"],
          ["League", "league"],
          ["Hero Tag", "heroTag"]
        ].map(([label, key]) => (
          <label className="premium-input p-4" key={key}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{label}</span>
            <input
              className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
              onChange={(event) =>
                setDraftProduct((current) => ({ ...current, [key]: event.target.value }))
              }
              value={String(draftProduct[key as keyof Product] ?? "")}
            />
          </label>
        ))}
      </div>

      <label className="premium-input p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Description</span>
        <textarea
          className="mt-3 min-h-24 w-full resize-none border-none bg-transparent p-0 text-base text-ink outline-none"
          onChange={(event) => setDraftProduct((current) => ({ ...current, description: event.target.value }))}
          value={draftProduct.description}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Front Image URL</span>
          <input className="mt-3 w-full border-none bg-transparent p-0 text-sm text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, media: [{ ...current.media[0], src: event.target.value }, current.media[1], current.media[2]] }))} value={draftProduct.media[0]?.src ?? ""} />
        </label>
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Back Image URL</span>
          <input className="mt-3 w-full border-none bg-transparent p-0 text-sm text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, media: [current.media[0], { ...current.media[1], src: event.target.value }, current.media[2]] }))} value={draftProduct.media[1]?.src ?? ""} />
        </label>
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Video Poster URL</span>
          <input className="mt-3 w-full border-none bg-transparent p-0 text-sm text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, media: [current.media[0], current.media[1], { ...current.media[2], src: event.target.value }] }))} value={draftProduct.media[2]?.src ?? ""} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Player Price</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, variants: current.variants.map((variant, index) => index === 0 ? { ...variant, price: Number(event.target.value) || 0 } : variant) }))} type="number" value={draftProduct.variants[0]?.price ?? 0} /></label>
        <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Fan Price</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, variants: current.variants.map((variant, index) => index === 1 ? { ...variant, price: Number(event.target.value) || 0 } : variant) }))} type="number" value={draftProduct.variants[1]?.price ?? 0} /></label>
        <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Discount %</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, discountPercentage: Number(event.target.value) || 0 }))} type="number" value={draftProduct.discountPercentage ?? 0} /></label>
        <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Accent</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, accent: event.target.value }))} value={draftProduct.accent}>{accentPresets.map((accent) => <option key={accent} value={accent}>{accent}</option>)}</select></label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Sport</span>
          <select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, sport: event.target.value as Product["sport"] }))} value={draftProduct.sport}>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
          </select>
        </label>
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Category</span>
          <select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDraftProduct((current) => ({ ...current, category: event.target.value as Product["category"] }))} value={draftProduct.category}>
            <option value="Club">Club</option>
            <option value="National">National</option>
          </select>
        </label>
      </div>

      <div className="rounded-[30px] bg-[#eef3f8] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Collections</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {collections.map((collection) => {
            const active = draftProduct.collectionIds.includes(collection.id);

            return (
              <button
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? "border-accent bg-accent text-white" : "border-ink/10 bg-white text-ink"
                }`}
                key={collection.id}
                onClick={() =>
                  setDraftProduct((current) => ({
                    ...current,
                    collectionIds: active
                      ? current.collectionIds.filter((id) => id !== collection.id)
                      : [...current.collectionIds, collection.id]
                  }))
                }
                type="button"
              >
                {collection.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CollectionEditor({
  collectionDraft,
  collections,
  onDelete,
  onSave,
  setCollectionDraft
}: {
  collectionDraft: Collection;
  collections: Collection[];
  onDelete: (id: string) => Promise<void>;
  onSave: () => Promise<void>;
  setCollectionDraft: Dispatch<SetStateAction<Collection>>;
}) {
  return (
    <div className="panel p-6">
      <p className="eyebrow">Collections</p>
      <h2 className="section-heading mt-4 text-4xl">Add or adjust collection groups</h2>
      <div className="mt-6 grid gap-3">
        {["name", "slug", "description", "coverImage"].map((field) => (
          <label className="premium-input p-4" key={field}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{field}</span>
            <input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setCollectionDraft((current) => ({ ...current, [field]: event.target.value }))} value={String(collectionDraft[field as keyof Collection] ?? "")} />
          </label>
        ))}
        <label className="premium-input p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Accent</span>
          <select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setCollectionDraft((current) => ({ ...current, accent: event.target.value }))} value={collectionDraft.accent}>
            {accentPresets.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-[24px] border border-ink/10 bg-white/70 px-4 py-4">
          <input checked={collectionDraft.featured ?? false} onChange={(event) => setCollectionDraft((current) => ({ ...current, featured: event.target.checked }))} type="checkbox" />
          <span className="text-sm font-semibold text-ink">Show this collection on the homepage</span>
        </label>
        <button className="button-primary mt-2" onClick={onSave} type="button">Save collection</button>
      </div>
      <div className="mt-6 space-y-3">
        {collections.slice(0, 4).map((collection) => (
          <div className="rounded-[24px] border border-ink/8 bg-white/78 p-4" key={collection.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{collection.name}</p>
                <p className="text-xs text-ink/45">{collection.slug}</p>
              </div>
              <button className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500" onClick={() => onDelete(collection.id)} type="button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscountEditor({
  collections,
  discountDraft,
  discounts,
  onDelete,
  onSave,
  products,
  setDiscountDraft
}: {
  collections: Collection[];
  discountDraft: DiscountRule;
  discounts: DiscountRule[];
  onDelete: (id: string) => Promise<void>;
  onSave: () => Promise<void>;
  products: Product[];
  setDiscountDraft: Dispatch<SetStateAction<DiscountRule>>;
}) {
  const targetOptions =
    discountDraft.target === "collection"
      ? collections.map((collection) => ({ id: collection.id, name: collection.name }))
      : products.map((product) => ({ id: product.id, name: product.name }));

  return (
    <div className="panel p-6">
      <p className="eyebrow">Discounts</p>
      <h2 className="section-heading mt-4 text-4xl">Manage offers from the web</h2>
      <div className="mt-6 grid gap-3">
        <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Title</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, title: event.target.value }))} value={discountDraft.title} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Code</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, code: event.target.value }))} value={discountDraft.code} /></label>
          <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Value</span><input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, value: Number(event.target.value) || 0 }))} type="number" value={discountDraft.value} /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Mode</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, mode: event.target.value as DiscountRule["mode"] }))} value={discountDraft.mode}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></label>
          <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Target</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, target: event.target.value as DiscountRule["target"], targetIds: [] }))} value={discountDraft.target}><option value="product">Product</option><option value="collection">Collection</option><option value="sitewide">Sitewide</option></select></label>
        </div>
        {discountDraft.target !== "sitewide" ? (
          <label className="premium-input p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Target Item</span>
            <select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(event) => setDiscountDraft((current) => ({ ...current, targetIds: event.target.value ? [event.target.value] : [] }))} value={discountDraft.targetIds[0] ?? ""}>
              <option value="">Select target</option>
              {targetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button className="button-primary mt-2" onClick={onSave} type="button">Save discount</button>
      </div>
      <div className="mt-6 space-y-3">
        {discounts.map((discount) => (
          <div className="rounded-[24px] border border-ink/8 bg-white/78 p-4" key={discount.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{discount.title}</p>
                <p className="text-xs text-ink/45">
                  {discount.code} / {discount.value}
                  {discount.mode === "percentage" ? "%" : " BDT"}
                </p>
              </div>
              <button className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500" onClick={() => onDelete(discount.id)} type="button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
