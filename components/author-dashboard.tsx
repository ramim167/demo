"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

import { useAuth } from "@/components/auth-provider";
import { useCatalog } from "@/components/catalog-provider";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebaseConfig";
import { Collection, DiscountRule, Product } from "@/lib/types";

const accents = [
  "from-slate-900 via-slate-700 to-blue-500",
  "from-sky-400 via-cyan-300 to-white",
  "from-zinc-950 via-zinc-800 to-slate-500",
  "from-yellow-300 via-emerald-300 to-emerald-500"
];
const frontPlaceholder = "/images/jerseys/club-sky-front.svg";
const backPlaceholder = "/images/jerseys/club-sky-back.svg";

type PendingAuthor = { id: string; name: string; email: string; requestedAt?: string };

function blankProduct(): Product {
  return {
    id: "",
    slug: "",
    name: "",
    shortName: "",
    team: "",
    league: "",
    sport: "Football",
    category: "Club",
    accent: accents[0],
    priceFrom: 0,
    rating: 4.8,
    reviewCount: 0,
    heroTag: "New Drop",
    description: "",
    highlights: ["Author-created product", "Live pricing control", "Front/back web uploads"],
    tags: [],
    collectionIds: [],
    discountPercentage: 0,
    source: "author",
    imageUrl: frontPlaceholder,
    backImageUrl: backPlaceholder,
    media: [
      { id: crypto.randomUUID(), type: "image", src: frontPlaceholder, alt: "Front view", label: "Front View" },
      { id: crypto.randomUUID(), type: "image", src: backPlaceholder, alt: "Back view", label: "Back View" }
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
        sizes: [{ label: "S", stock: 5 }, { label: "M", stock: 5 }, { label: "L", stock: 5 }, { label: "XL", stock: 5 }]
      },
      {
        id: crypto.randomUUID(),
        edition: "Fan Version",
        sku: "",
        price: 0,
        compareAtPrice: 0,
        badge: "In Stock",
        fitProfile: "Relaxed supporter fit",
        sizes: [{ label: "S", stock: 10 }, { label: "M", stock: 10 }, { label: "L", stock: 10 }, { label: "XL", stock: 10 }]
      }
    ],
    patches: [],
    customization: {
      nameMax: 12,
      numberRange: [0, 99],
      sizeGuide: {
        player: [{ size: "S", chest: "48 cm", length: "69 cm", recommendation: "Slim fit" }],
        fan: [{ size: "S", chest: "51 cm", length: "70 cm", recommendation: "Regular fit" }]
      }
    }
  };
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="premium-input p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{label}</span>
      <input className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => onChange(e.target.value)} type={type} value={value} />
    </label>
  );
}

function ImgBox({ label, src, preview, onPick }: { label: string; src: string; preview: string; onPick: (file: File | null) => void }) {
  return (
    <div className="rounded-[30px] border border-ink/8 bg-white/76 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={label} className="mt-4 h-56 w-full rounded-[24px] object-cover" src={preview || src} />
      <input accept="image/*" className="mt-4 block w-full cursor-pointer text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-white" onChange={(e) => onPick(e.target.files?.[0] ?? null)} type="file" />
    </div>
  );
}

export function AuthorDashboard() {
  const { hydrated, user, isAuthor, isMainAuthor } = useAuth();
  const { rawProducts, collections, discounts, upsertProduct, deleteProduct, upsertCollection, deleteCollection, upsertDiscount, deleteDiscount } = useCatalog();
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<Product>(blankProduct());
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [pendingAuthors, setPendingAuthors] = useState<PendingAuthor[]>([]);
  const [collectionDraft, setCollectionDraft] = useState<Collection>({ id: "", name: "", slug: "", description: "", accent: accents[1], coverImage: frontPlaceholder, featured: false });
  const [discountDraft, setDiscountDraft] = useState<DiscountRule>({ id: "", title: "", code: "", mode: "percentage", value: 10, target: "product", targetIds: [], active: true });
  const selectedProduct = useMemo(() => rawProducts.find((p) => p.id === selectedId), [rawProducts, selectedId]);

  useEffect(() => {
    if (selectedProduct) {
      setDraft(selectedProduct);
      resetUploads();
    }
  }, [selectedProduct]);

  useEffect(() => () => {
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (backPreview) URL.revokeObjectURL(backPreview);
  }, [frontPreview, backPreview]);

  useEffect(() => {
    if (!isMainAuthor) return;
    return onSnapshot(collection(db, "users"), (snapshot) => {
      setPendingAuthors(snapshot.docs.map((entry) => {
        const d = entry.data();
        return { id: entry.id, name: String(d.name ?? "Unnamed"), email: String(d.email ?? ""), requestedAt: d.approvalRequestedAt ? String(d.approvalRequestedAt) : undefined, role: String(d.role ?? ""), authorStatus: String(d.authorStatus ?? "") };
      }).filter((entry) => entry.role === "author" && entry.authorStatus === "pending_approval").map(({ id, name, email, requestedAt }) => ({ id, name, email, requestedAt })));
    });
  }, [isMainAuthor]);

  function resetUploads() {
    setFrontFile(null);
    setBackFile(null);
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (backPreview) URL.revokeObjectURL(backPreview);
    setFrontPreview("");
    setBackPreview("");
  }

  function pickFile(file: File | null, preview: string, setFile: (file: File | null) => void, setPreview: (value: string) => void) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function saveProduct() {
    const isNew = !draft.id;
    const id = draft.id || crypto.randomUUID();
    const frontSrc = draft.media[0]?.src ?? frontPlaceholder;
    const backSrc = draft.media[1]?.src ?? backPlaceholder;
    if (isNew && !frontFile && !backFile && frontSrc === frontPlaceholder && backSrc === backPlaceholder) {
      setStatus("Upload front and back photos before saving a new product.");
      return;
    }
    setSaving(true);
    setStatus("Saving product...");
    try {
      const [frontUrl, backUrl] = await Promise.all([
        frontFile ? uploadImageToCloudinary(frontFile) : Promise.resolve(frontSrc),
        backFile ? uploadImageToCloudinary(backFile) : Promise.resolve(backSrc)
      ]);
      const next: Product = {
        ...draft,
        id,
        slug: draft.slug.trim() || draft.name.toLowerCase().replace(/\s+/g, "-"),
        shortName: draft.shortName || draft.name,
        priceFrom: Math.min(draft.variants[0]?.price ?? 0, draft.variants[1]?.price ?? draft.variants[0]?.price ?? 0),
        tags: [draft.name, draft.team, draft.league, draft.sport].filter(Boolean).map((v) => v.toLowerCase()),
        source: "author",
        imageUrl: frontUrl,
        backImageUrl: backUrl,
        updatedAt: new Date().toISOString(),
        media: [
          { id: draft.media[0]?.id ?? `${id}-front`, type: "image", src: frontUrl, alt: `${draft.name || "Jersey"} front view`, label: "Front View" },
          { id: draft.media[1]?.id ?? `${id}-back`, type: "image", src: backUrl, alt: `${draft.name || "Jersey"} back view`, label: "Back View" }
        ]
      };
      await upsertProduct(next);
      setDraft(next);
      setSelectedId(id);
      resetUploads();
      setStatus(frontFile || backFile ? "Product saved and previous photos were replaced in the product record." : "Product saved.");
    } finally {
      setSaving(false);
    }
  }

  async function approveAuthor(id: string) {
    if (!user) return;
    const now = new Date().toISOString();
    await updateDoc(doc(db, "users", id), { authorStatus: "approved", approvedAt: now, approvedBy: user.email, updatedAt: now });
    setStatus("Author account approved.");
  }

  async function rejectAuthor(id: string) {
    await updateDoc(doc(db, "users", id), { authorStatus: "rejected", updatedAt: new Date().toISOString() });
    setStatus("Author request rejected.");
  }

  if (!hydrated) return <div className="shell py-10"><div className="panel p-8 text-center text-sm text-ink/60">Loading dashboard...</div></div>;
  if (!user) return <div className="shell py-10"><div className="panel p-8 text-center"><p className="eyebrow">Author Login Required</p><h1 className="section-heading mt-4 text-5xl">Sign in first to manage the catalog</h1><div className="mt-6 flex justify-center"><Link className="button-primary" href="/login">Go to login</Link></div></div></div>;
  if (!isAuthor) return <div className="shell py-10"><div className="panel p-8 text-center"><p className="eyebrow">Access Restricted</p><h1 className="section-heading mt-4 text-5xl">This dashboard is for approved authors only</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 muted-copy">Verify your email and wait for main-author approval before using catalog tools.</p></div></div>;

  return (
    <div className="shell py-10">
      <div className="grid gap-6">
        <div className="panel-dark p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow border-white/10 bg-white/10 text-white">Author Dashboard</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">Manage products, collections, discounts, and jersey photos</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/admin/add-product">Upload new product</Link>
              <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">Firestore sync:<span className="ml-2 font-semibold text-white">live</span></div>
            </div>
          </div>
          {status ? <p className="mt-4 text-sm font-semibold text-accentSoft">{status}</p> : null}
        </div>

        {isMainAuthor ? (
          <div className="panel p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Main Author</p><h2 className="section-heading mt-4 text-5xl">Approve author accounts</h2></div><div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">{pendingAuthors.length} pending</div></div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {pendingAuthors.length ? pendingAuthors.map((author) => (
                <div className="rounded-[30px] border border-ink/8 bg-white/76 p-5" key={author.id}>
                  <p className="font-display text-4xl leading-[0.92] text-ink">{author.name}</p>
                  <p className="mt-2 text-sm font-semibold text-ink/72">{author.email}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink/45">Requested: {author.requestedAt || "Pending"}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="button-primary" onClick={() => void approveAuthor(author.id)} type="button">Approve author</button>
                    <button className="button-secondary" onClick={() => void rejectAuthor(author.id)} type="button">Reject</button>
                  </div>
                </div>
              )) : <div className="rounded-[30px] border border-ink/8 bg-white/76 p-5 text-sm text-ink/62">No pending author approvals right now.</div>}
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="eyebrow">Product Studio</p><h2 className="section-heading mt-4 text-5xl">Edit or create products</h2></div>
              <div className="flex gap-2">
                <select className="rounded-full border border-ink/10 bg-white/80 px-4 py-3 text-sm" onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
                  <option value="">New product</option>
                  {rawProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
                <button className="button-secondary" onClick={() => { setSelectedId(""); setDraft(blankProduct()); resetUploads(); }} type="button">New</button>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Name" onChange={(value) => setDraft((c) => ({ ...c, name: value }))} value={draft.name} />
                <Input label="Slug" onChange={(value) => setDraft((c) => ({ ...c, slug: value }))} value={draft.slug} />
                <Input label="Short Name" onChange={(value) => setDraft((c) => ({ ...c, shortName: value }))} value={draft.shortName} />
                <Input label="Team" onChange={(value) => setDraft((c) => ({ ...c, team: value }))} value={draft.team} />
                <Input label="League" onChange={(value) => setDraft((c) => ({ ...c, league: value }))} value={draft.league} />
                <Input label="Hero Tag" onChange={(value) => setDraft((c) => ({ ...c, heroTag: value }))} value={draft.heroTag} />
              </div>

              <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Description</span><textarea className="mt-3 min-h-24 w-full resize-none border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))} value={draft.description} /></label>

              <div className="grid gap-4 lg:grid-cols-2">
                <ImgBox label="Front Image" onPick={(file) => pickFile(file, frontPreview, setFrontFile, setFrontPreview)} preview={frontPreview} src={draft.media[0]?.src ?? frontPlaceholder} />
                <ImgBox label="Back Image" onPick={(file) => pickFile(file, backPreview, setBackFile, setBackPreview)} preview={backPreview} src={draft.media[1]?.src ?? draft.media[0]?.src ?? backPlaceholder} />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Player Price" onChange={(value) => setDraft((c) => ({ ...c, variants: c.variants.map((v, i) => i === 0 ? { ...v, price: Number(value) || 0 } : v) }))} type="number" value={draft.variants[0]?.price ?? 0} />
                <Input label="Fan Price" onChange={(value) => setDraft((c) => ({ ...c, variants: c.variants.map((v, i) => i === 1 ? { ...v, price: Number(value) || 0 } : v) }))} type="number" value={draft.variants[1]?.price ?? 0} />
                <Input label="Discount %" onChange={(value) => setDraft((c) => ({ ...c, discountPercentage: Number(value) || 0 }))} type="number" value={draft.discountPercentage ?? 0} />
                <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Accent</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDraft((c) => ({ ...c, accent: e.target.value }))} value={draft.accent}>{accents.map((accent) => <option key={accent} value={accent}>{accent}</option>)}</select></label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Sport</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDraft((c) => ({ ...c, sport: e.target.value as Product["sport"] }))} value={draft.sport}><option value="Football">Football</option><option value="Cricket">Cricket</option></select></label>
                <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Category</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDraft((c) => ({ ...c, category: e.target.value as Product["category"] }))} value={draft.category}><option value="Club">Club</option><option value="National">National</option></select></label>
              </div>

              <div className="rounded-[30px] bg-[#eef3f8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Collections</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {collections.map((entry) => {
                    const active = draft.collectionIds.includes(entry.id);
                    return <button className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-accent bg-accent text-white" : "border-ink/10 bg-white text-ink"}`} key={entry.id} onClick={() => setDraft((c) => ({ ...c, collectionIds: active ? c.collectionIds.filter((id) => id !== entry.id) : [...c.collectionIds, entry.id] }))} type="button">{entry.name}</button>;
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="button-primary" disabled={saving} onClick={() => void saveProduct()} type="button">{saving ? "Saving..." : "Save product"}</button>
              {selectedId ? <button className="button-secondary" onClick={() => void deleteProduct(selectedId)} type="button">Delete product</button> : null}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="panel p-6">
              <p className="eyebrow">Collections</p>
              <h2 className="section-heading mt-4 text-4xl">Manage collection groups</h2>
              <div className="mt-6 grid gap-3">
                <Input label="Name" onChange={(value) => setCollectionDraft((c) => ({ ...c, name: value }))} value={collectionDraft.name} />
                <Input label="Slug" onChange={(value) => setCollectionDraft((c) => ({ ...c, slug: value }))} value={collectionDraft.slug} />
                <Input label="Description" onChange={(value) => setCollectionDraft((c) => ({ ...c, description: value }))} value={collectionDraft.description} />
                <Input label="Cover Image" onChange={(value) => setCollectionDraft((c) => ({ ...c, coverImage: value }))} value={collectionDraft.coverImage} />
                <button className="button-primary mt-2" onClick={() => void upsertCollection({ ...collectionDraft, id: collectionDraft.id || crypto.randomUUID() }).then(() => { setCollectionDraft({ id: "", name: "", slug: "", description: "", accent: accents[1], coverImage: frontPlaceholder, featured: false }); setStatus("Collection saved."); })} type="button">Save collection</button>
              </div>
              <div className="mt-6 space-y-3">
                {collections.slice(0, 4).map((entry) => <div className="rounded-[24px] border border-ink/8 bg-white/78 p-4" key={entry.id}><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-ink">{entry.name}</p><p className="text-xs text-ink/45">{entry.slug}</p></div><button className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500" onClick={() => void deleteCollection(entry.id)} type="button">Delete</button></div></div>)}
              </div>
            </div>

            <div className="panel p-6">
              <p className="eyebrow">Discounts</p>
              <h2 className="section-heading mt-4 text-4xl">Manage offers</h2>
              <div className="mt-6 grid gap-3">
                <Input label="Title" onChange={(value) => setDiscountDraft((c) => ({ ...c, title: value }))} value={discountDraft.title} />
                <Input label="Code" onChange={(value) => setDiscountDraft((c) => ({ ...c, code: value }))} value={discountDraft.code} />
                <Input label="Value" onChange={(value) => setDiscountDraft((c) => ({ ...c, value: Number(value) || 0 }))} type="number" value={discountDraft.value} />
                <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Target</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDiscountDraft((c) => ({ ...c, target: e.target.value as DiscountRule["target"], targetIds: [] }))} value={discountDraft.target}><option value="product">Product</option><option value="collection">Collection</option><option value="sitewide">Sitewide</option></select></label>
                {discountDraft.target !== "sitewide" ? <label className="premium-input p-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Target Item</span><select className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none" onChange={(e) => setDiscountDraft((c) => ({ ...c, targetIds: e.target.value ? [e.target.value] : [] }))} value={discountDraft.targetIds[0] ?? ""}><option value="">Select target</option>{(discountDraft.target === "collection" ? collections : rawProducts).map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label> : null}
                <button className="button-primary mt-2" onClick={() => void upsertDiscount({ ...discountDraft, id: discountDraft.id || crypto.randomUUID(), targetIds: discountDraft.targetIds.filter(Boolean) }).then(() => { setDiscountDraft({ id: "", title: "", code: "", mode: "percentage", value: 10, target: "product", targetIds: [], active: true }); setStatus("Discount rule saved."); })} type="button">Save discount</button>
              </div>
              <div className="mt-6 space-y-3">
                {discounts.map((entry) => <div className="rounded-[24px] border border-ink/8 bg-white/78 p-4" key={entry.id}><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-ink">{entry.title}</p><p className="text-xs text-ink/45">{entry.code} / {entry.value}{entry.mode === "percentage" ? "%" : " BDT"}</p></div><button className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500" onClick={() => void deleteDiscount(entry.id)} type="button">Delete</button></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
