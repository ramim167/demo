"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { useCatalog } from "@/components/catalog-provider";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const defaultAccents = [
  "from-slate-900 via-slate-700 to-blue-500",
  "from-sky-400 via-cyan-300 to-white",
  "from-zinc-950 via-zinc-800 to-slate-500",
  "from-yellow-300 via-emerald-300 to-emerald-500"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CollectionShowcase() {
  const { collections, products, upsertCollection, deleteProduct } = useCatalog();
  const { isAuthor } = useAuth();
  const [openCollectionId, setOpenCollectionId] = useState<string>(collections[0]?.id ?? "");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [accent, setAccent] = useState(defaultAccents[0]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const collectionProductMap = useMemo(
    () =>
      collections.reduce<Record<string, typeof products>>((accumulator, collection) => {
        accumulator[collection.id] = products.filter((product) =>
          product.collectionIds.includes(collection.id)
        );
        return accumulator;
      }, {}),
    [collections, products]
  );

  function resetCreateForm() {
    setName("");
    setDescription("");
    setCoverFile(null);
    setAccent(defaultAccents[0]);
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
      setCoverPreview("");
    }
  }

  async function handleCreateCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setStatus("Enter a valid group name before saving.");
      return;
    }

    const slug = slugify(trimmedName);
    const exists = collections.some(
      (collection) =>
        collection.slug.toLowerCase() === slug || collection.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setStatus("That group already exists. Use a unique valid group name.");
      return;
    }

    setSaving(true);
    setStatus("Creating group...");

    try {
      const coverImage = coverFile
        ? await uploadImageToCloudinary(coverFile)
        : "/images/jerseys/club-sky-front.svg";

      const nextCollection = {
        id: crypto.randomUUID(),
        name: trimmedName,
        slug,
        description: description.trim() || `${trimmedName} group curated by the author team.`,
        accent,
        coverImage,
        featured: true
      };

      await upsertCollection(nextCollection);
      setOpenCollectionId(nextCollection.id);
      setShowCreate(false);
      resetCreateForm();
      setStatus("Group created successfully.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="shell mt-20" id="collections">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Store Groups</p>
          <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
            Author-managed blocks open smoothly and show the matching jerseys
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {isAuthor ? (
            <>
              <button
                className="button-primary flex h-12 w-12 items-center justify-center px-0 text-2xl"
                onClick={() => setShowCreate((current) => !current)}
                type="button"
              >
                +
              </button>
              <Link className="button-secondary" href="/author">
                Open author dashboard
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {showCreate ? (
        <form className="panel mt-8 grid gap-4 p-6 sm:p-8" onSubmit={handleCreateCollection}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">New Group</p>
              <h3 className="section-heading mt-4 text-4xl">Create a storefront block</h3>
            </div>
            <button className="button-secondary" onClick={() => setShowCreate(false)} type="button">
              Close
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Group Name</span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setName(event.target.value)}
                placeholder="Serie A"
                value={name}
              />
            </label>
            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Accent</span>
              <select
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setAccent(event.target.value)}
                value={accent}
              >
                {defaultAccents.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="premium-input p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Description</span>
            <textarea
              className="mt-3 min-h-24 w-full resize-none border-none bg-transparent p-0 text-base text-ink outline-none"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Premium Serie A jersey group"
              value={description}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-[30px] border border-ink/8 bg-white/76 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Cover Preview</p>
              <div className="mt-4 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,_rgba(91,124,250,0.08),_rgba(255,255,255,0.82))]">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Group cover preview" className="h-56 w-full object-cover" src={coverPreview} />
                ) : (
                  <div className="flex h-56 items-center justify-center px-6 text-center text-sm text-ink/45">
                    Upload a cover image for the group card.
                  </div>
                )}
              </div>
            </div>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Cover Photo</span>
              <input
                accept="image/*"
                className="mt-3 block w-full cursor-pointer text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-white"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (coverPreview) {
                    URL.revokeObjectURL(coverPreview);
                  }
                  setCoverFile(file);
                  setCoverPreview(file ? URL.createObjectURL(file) : "");
                }}
                type="file"
              />
              <p className="mt-4 text-sm text-ink/55">
                The group cover appears on the storefront block and collection page.
              </p>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary" disabled={saving} type="submit">
              {saving ? "Saving..." : "Create group"}
            </button>
            {status ? <p className="self-center text-sm font-semibold text-accent">{status}</p> : null}
          </div>
        </form>
      ) : null}

      {!showCreate && status ? <p className="mt-6 text-sm font-semibold text-accent">{status}</p> : null}

      <div className="mt-9 grid gap-5 lg:grid-cols-3">
        {collections.map((collection) => {
          const open = openCollectionId === collection.id;
          const collectionProducts = collectionProductMap[collection.id] ?? [];

          return (
            <div className="panel overflow-hidden p-4" key={collection.id}>
              <div className={`rounded-[28px] bg-gradient-to-br ${collection.accent} p-4`}>
                <div className="overflow-hidden rounded-[24px] bg-white/72 p-3 backdrop-blur">
                  <img
                    alt={collection.name}
                    className="h-56 w-full rounded-[20px] object-cover"
                    src={collection.coverImage}
                  />
                </div>
              </div>
              <div className="px-2 pb-2 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                      Group
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
                      {collection.name}
                    </h3>
                  </div>
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink transition hover:border-accent hover:text-accent"
                    onClick={() =>
                      setOpenCollectionId((current) => (current === collection.id ? "" : collection.id))
                    }
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 muted-copy">{collection.description}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f4f7ff] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                    {collectionProducts.length} jerseys
                  </span>
                  <Link
                    className="text-sm font-semibold text-accent transition hover:opacity-80"
                    href={`/collections/${collection.slug}`}
                  >
                    Open group
                  </Link>
                </div>

                {open ? (
                  <div className="mt-5 grid gap-3 border-t border-ink/6 pt-5">
                    {collectionProducts.length ? (
                      collectionProducts.map((product) => (
                        <div
                          className="rounded-[24px] border border-ink/8 bg-[#f8f9fc] p-4"
                          key={product.id}
                        >
                          <div className="flex items-start gap-4">
                            <img
                              alt={product.media[0]?.alt ?? product.name}
                              className="h-20 w-20 rounded-[18px] object-cover"
                              src={product.media[0]?.src}
                            />
                            <div className="min-w-0 flex-1">
                              <Link
                                className="text-sm font-semibold text-ink transition hover:text-accent"
                                href={`/product/${product.slug}`}
                              >
                                {product.name}
                              </Link>
                              <p className="mt-1 text-xs text-ink/48">
                                {product.league} / {product.category}
                              </p>
                            </div>
                            {isAuthor ? (
                              <button
                                className="rounded-full border border-red-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500 transition hover:bg-red-50"
                                onClick={() => void deleteProduct(product.id)}
                                type="button"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-ink/12 bg-[#f8f9fc] px-4 py-5 text-sm text-ink/55">
                        No jerseys are assigned to this group yet.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
