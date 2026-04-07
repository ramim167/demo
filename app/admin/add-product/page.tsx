"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";

import { useAuth } from "@/components/auth-provider";
import { useCatalog } from "@/components/catalog-provider";
import { auth, db } from "@/lib/firebaseConfig";
import { cloudinaryConfig, uploadImageToCloudinary } from "@/lib/cloudinary";
import { Product } from "@/lib/types";

const sportOptions = ["Football", "Cricket"] as const;

type StatusState =
  | { tone: "idle"; message: string }
  | { tone: "success"; message: string }
  | { tone: "error"; message: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProductPayload({
  productId,
  name,
  price,
  sport,
  collectionTag,
  collectionId,
  frontImageUrl,
  backImageUrl,
  uploaderUid
}: {
  productId: string;
  name: string;
  price: number;
  sport: (typeof sportOptions)[number];
  collectionTag: string;
  collectionId: string;
  frontImageUrl: string;
  backImageUrl: string;
  uploaderUid: string;
}): Product {
  const now = new Date().toISOString();
  const slugBase = slugify(name) || "jersey";
  const slug = `${slugBase}-${productId.slice(0, 6)}`;
  const teamLabel = sport === "Cricket" ? "National Select" : "Club Select";
  const leagueLabel = sport === "Cricket" ? "Cricket Collection" : "Football Collection";

  return {
    id: productId,
    slug,
    name,
    shortName: name,
    team: teamLabel,
    league: leagueLabel,
    sport,
    category: "Club",
    accent: "from-slate-900 via-slate-700 to-blue-500",
    priceFrom: price,
    rating: 5,
    reviewCount: 0,
    heroTag: "Fresh Upload",
    description: `${name} uploaded from the admin product studio.`,
    highlights: [
      "Uploaded from the author dashboard",
      "Front and back images managed from the web",
      `Assigned to the ${collectionTag} group`
    ],
    tags: [name.toLowerCase(), sport.toLowerCase(), collectionTag.toLowerCase()],
    collectionIds: [collectionId],
    discountPercentage: 0,
    source: "author",
    imageUrl: frontImageUrl,
    backImageUrl,
    uploaderUid,
    createdAt: now,
    updatedAt: now,
    media: [
      {
        id: `${productId}-front`,
        type: "image",
        src: frontImageUrl,
        alt: `${name} front view`,
        label: "Front View"
      },
      {
        id: `${productId}-back`,
        type: "image",
        src: backImageUrl,
        alt: `${name} back view`,
        label: "Back View"
      }
    ],
    variants: [
      {
        id: `${productId}-player`,
        edition: "Player Version",
        sku: `${slugBase.toUpperCase()}-PLAYER`,
        price,
        compareAtPrice: Math.round(price * 1.12),
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
        id: `${productId}-fan`,
        edition: "Fan Version",
        sku: `${slugBase.toUpperCase()}-FAN`,
        price,
        compareAtPrice: Math.round(price * 1.08),
        badge: "In Stock",
        fitProfile: "Relaxed supporter fit",
        sizes: [
          { label: "S", stock: 12 },
          { label: "M", stock: 12 },
          { label: "L", stock: 12 },
          { label: "XL", stock: 12 }
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
          { size: "M", chest: "50 cm", length: "71 cm", recommendation: "Athletic fit" },
          { size: "L", chest: "52 cm", length: "73 cm", recommendation: "Athletic fit" }
        ],
        fan: [
          { size: "S", chest: "51 cm", length: "70 cm", recommendation: "Regular fit" },
          { size: "M", chest: "54 cm", length: "72 cm", recommendation: "Regular fit" },
          { size: "L", chest: "57 cm", length: "74 cm", recommendation: "Relaxed fit" }
        ]
      }
    }
  };
}

function ImageField({
  id,
  label,
  inputRef,
  previewUrl,
  onChange
}: {
  id: string;
  label: string;
  inputRef: { current: HTMLInputElement | null };
  previewUrl: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-[30px] border border-ink/8 bg-white/76 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <div className="mt-4 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,_rgba(91,124,250,0.08),_rgba(255,255,255,0.82))]">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={label} className="h-[280px] w-full object-cover" src={previewUrl} />
        ) : (
          <div className="flex h-[280px] items-center justify-center px-6 text-center text-sm text-ink/45">
            Select an image file to preview the {label.toLowerCase()}.
          </div>
        )}
      </div>
      <input
        accept="image/*"
        className="mt-4 block w-full cursor-pointer text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-white"
        id={id}
        onChange={onChange}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}

export default function AddProductPage() {
  const { collections } = useCatalog();
  const { hydrated, user, isAuthor } = useAuth();
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sport, setSport] = useState<(typeof sportOptions)[number]>("Football");
  const [groupTag, setGroupTag] = useState("");
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState("");
  const [backPreviewUrl, setBackPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    tone: "idle",
    message: "Upload front and back jersey images, then the product will be written to Firestore."
  });

  useEffect(() => {
    return () => {
      if (frontPreviewUrl) {
        URL.revokeObjectURL(frontPreviewUrl);
      }

      if (backPreviewUrl) {
        URL.revokeObjectURL(backPreviewUrl);
      }
    };
  }, [backPreviewUrl, frontPreviewUrl]);

  function handleFilePreview(
    file: File | null,
    currentPreviewUrl: string,
    setFile: (value: File | null) => void,
    setPreviewUrl: (value: string) => void
  ) {
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    setFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function resetForm() {
    setName("");
    setPrice("");
    setSport("Football");
    setGroupTag("");
    setFrontImageFile(null);
    setBackImageFile(null);

    if (frontPreviewUrl) {
      URL.revokeObjectURL(frontPreviewUrl);
      setFrontPreviewUrl("");
    }

    if (backPreviewUrl) {
      URL.revokeObjectURL(backPreviewUrl);
      setBackPreviewUrl("");
    }

    if (frontInputRef.current) {
      frontInputRef.current.value = "";
    }

    if (backInputRef.current) {
      backInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hydrated) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedGroupTag = groupTag.trim();
    const numericPrice = Number(price);
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !user || firebaseUser.uid !== user.id || !isAuthor) {
      setStatus({
        tone: "error",
        message: "Only an authenticated approved author account can upload products."
      });
      return;
    }

    if (
      !trimmedName ||
      !trimmedGroupTag ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !frontImageFile ||
      !backImageFile
    ) {
      setStatus({
        tone: "error",
        message: "Jersey name, valid price, valid group tag, front image, and back image are all required."
      });
      return;
    }

    const matchedCollection = collections.find(
      (collection) =>
        collection.name.toLowerCase() === trimmedGroupTag.toLowerCase() ||
        collection.slug.toLowerCase() === trimmedGroupTag.toLowerCase()
    );

    if (!matchedCollection) {
      setStatus({
        tone: "error",
        message: "Use a valid existing tag/block name before uploading this jersey."
      });
      return;
    }

    setLoading(true);
    setStatus({
      tone: "idle",
      message: "Uploading front and back images to Cloudinary and saving the product..."
    });

    try {
      const [frontImageUrl, backImageUrl] = await Promise.all([
        uploadImageToCloudinary(frontImageFile),
        uploadImageToCloudinary(backImageFile)
      ]);

      const productRef = doc(collection(db, "products"));
      const payload = buildProductPayload({
        productId: productRef.id,
        name: trimmedName,
        price: numericPrice,
        sport,
        collectionTag: matchedCollection.name,
        collectionId: matchedCollection.id,
        frontImageUrl,
        backImageUrl,
        uploaderUid: firebaseUser.uid
      });

      await setDoc(productRef, payload);
      resetForm();
      setStatus({
        tone: "success",
        message: "Product uploaded successfully with separate front and back images."
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to upload product."
      });
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="shell py-10">
        <div className="panel p-8 text-center text-sm text-ink/60">Checking Firebase session...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="shell py-10">
        <div className="panel p-8 text-center">
          <p className="eyebrow">Login Required</p>
          <h1 className="section-heading mt-4 text-5xl">Sign in before uploading products</h1>
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
          <p className="eyebrow">Author Access Only</p>
          <h1 className="section-heading mt-4 text-5xl">Your account does not have upload permission</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 muted-copy">
            Only approved author accounts can upload or edit jersey products.
          </p>
          <div className="mt-6 flex justify-center">
            <Link className="button-primary" href="/account">
              Return to account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="panel-dark p-6 sm:p-8">
          <p className="eyebrow border-white/10 bg-white/10 text-white">Admin Upload</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">
            Publish a new jersey from the browser
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/72">
            This form uploads separate front and back jersey images directly to Cloudinary and
            stores the product in Firestore for the storefront to read live.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                Signed In
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{user.name}</p>
              <p className="text-sm text-white/62">{user.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accentSoft">
                Role: {user.role}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-white/70">
              <p className="font-semibold text-white">Developer flow</p>
              <p>1. Firebase Auth verifies the current approved author session.</p>
              <p>2. Cloudinary returns `secure_url` for front and back uploads.</p>
              <p>3. Firestore stores both image URLs in the `products` collection.</p>
              <p>4. The storefront updates automatically through the live listener.</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm text-white/70">
              Cloudinary:
              <span className="ml-2 font-semibold text-white">{cloudinaryConfig.cloudName}</span>
              <br />
              Upload preset:
              <span className="ml-2 font-semibold text-white">
                {cloudinaryConfig.uploadPreset}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/author">
                Open author dashboard
              </Link>
              <Link
                className="button-secondary border-white/15 bg-transparent text-white hover:border-white/30 hover:text-white"
                href="/"
              >
                Back to storefront
              </Link>
            </div>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Product Form</p>
              <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
                Add a new jersey product
              </h2>
            </div>
            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                status.tone === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : status.tone === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-accent/10 text-accent"
              }`}
            >
              {loading ? "Uploading..." : status.message}
            </div>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="premium-input p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                  Jersey Name
                </span>
                <input
                  className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Real Madrid Home 24/25"
                  value={name}
                />
              </label>

              <label className="premium-input p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                  Price
                </span>
                <input
                  className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                  min="1"
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="1990"
                  step="0.01"
                  type="number"
                  value={price}
                />
              </label>
            </div>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Category
              </span>
              <select
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setSport(event.target.value as (typeof sportOptions)[number])}
                value={sport}
              >
                {sportOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Group Tag
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                list="collection-tags"
                onChange={(event) => setGroupTag(event.target.value)}
                placeholder="National Team"
                value={groupTag}
              />
              <datalist id="collection-tags">
                {collections.map((entry) => (
                  <option key={entry.id} value={entry.name} />
                ))}
              </datalist>
              <p className="mt-3 text-xs text-ink/50">
                This must match an existing block name exactly. The jersey will be attached to that
                group at upload time.
              </p>
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <ImageField
                id="front-image"
                inputRef={frontInputRef}
                label="Front Image"
                onChange={(event) =>
                  handleFilePreview(
                    event.target.files?.[0] ?? null,
                    frontPreviewUrl,
                    setFrontImageFile,
                    setFrontPreviewUrl
                  )
                }
                previewUrl={frontPreviewUrl}
              />

              <ImageField
                id="back-image"
                inputRef={backInputRef}
                label="Back Image"
                onChange={(event) =>
                  handleFilePreview(
                    event.target.files?.[0] ?? null,
                    backPreviewUrl,
                    setBackImageFile,
                    setBackPreviewUrl
                  )
                }
                previewUrl={backPreviewUrl}
              />
            </div>

            <div className="rounded-[30px] border border-ink/8 bg-white/76 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Saved Product Shape
              </p>
              <div className="mt-4 grid gap-3 text-sm text-ink/70">
                <p>`imageUrl` stores the front image and `backImageUrl` stores the back image.</p>
                <p>`collectionIds` is filled from the valid group tag you entered above.</p>
                <p>`media` contains only `Front View` and `Back View` items.</p>
                <p>`uploaderUid` is attached from the current Firebase Auth user.</p>
                <p>The form resets automatically after a successful upload.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button-primary" disabled={loading} type="submit">
                {loading ? "Uploading..." : "Upload product"}
              </button>
              <button
                className="button-secondary"
                disabled={loading}
                onClick={resetForm}
                type="button"
              >
                Reset form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
