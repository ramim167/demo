"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";

import { useAuth } from "@/components/auth-provider";
import { auth, db } from "@/lib/firebaseConfig";
import { Product } from "@/lib/types";

const sportOptions = ["Football", "Cricket"] as const;
const cloudName = "dwcbgl4oc";
const uploadPreset = "Jersey";
const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

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
  imageUrl,
  uploaderUid
}: {
  productId: string;
  name: string;
  price: number;
  sport: (typeof sportOptions)[number];
  imageUrl: string;
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
      "Cloudinary image attached",
      "Pricing can be edited live from the web"
    ],
    tags: [name.toLowerCase(), sport.toLowerCase(), "new upload"],
    collectionIds: [],
    discountPercentage: 0,
    source: "author",
    imageUrl,
    uploaderUid,
    createdAt: now,
    updatedAt: now,
    media: [
      {
        id: `${productId}-front`,
        type: "image",
        src: imageUrl,
        alt: `${name} front view`,
        label: "Front View"
      },
      {
        id: `${productId}-back`,
        type: "image",
        src: imageUrl,
        alt: `${name} alternate view`,
        label: "Back View"
      },
      {
        id: `${productId}-video`,
        type: "video",
        src: "/images/jerseys/video-preview.svg",
        alt: `${name} video preview`,
        label: "Video Preview"
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

async function uploadImageToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Image upload failed. Check Cloudinary preset configuration.");
  }

  const payload = (await response.json()) as { secure_url?: string };

  if (!payload.secure_url) {
    throw new Error("Cloudinary did not return a secure image URL.");
  }

  return payload.secure_url;
}

export default function AddProductPage() {
  const { hydrated, user, isAuthor } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sport, setSport] = useState<(typeof sportOptions)[number]>("Football");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    tone: "idle",
    message: "Upload a jersey image, then the product will be written into Firestore."
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function resetForm() {
    setName("");
    setPrice("");
    setSport("Football");
    setImageFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hydrated) {
      return;
    }

    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !user || firebaseUser.uid !== user.id || !isAuthor) {
      setStatus({
        tone: "error",
        message: "Only an authenticated author account can upload products."
      });
      return;
    }

    if (!trimmedName || !Number.isFinite(numericPrice) || numericPrice <= 0 || !imageFile) {
      setStatus({
        tone: "error",
        message: "Jersey name, valid price, category, and image are all required."
      });
      return;
    }

    setLoading(true);
    setStatus({
      tone: "idle",
      message: "Uploading image to Cloudinary and saving the product to Firestore..."
    });

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      const productRef = doc(collection(db, "products"));
      const payload = buildProductPayload({
        productId: productRef.id,
        name: trimmedName,
        price: numericPrice,
        sport,
        imageUrl,
        uploaderUid: firebaseUser.uid
      });

      await setDoc(productRef, payload);

      resetForm();
      setStatus({
        tone: "success",
        message: "Product uploaded successfully. The new jersey is now in the products collection."
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
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 muted-copy">
            This page only submits when a Firebase-authenticated session exists.
          </p>
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
            User accounts can browse and shop. Author accounts can upload jerseys, edit prices,
            build collections, and manage discount logic.
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
            This form uploads the image directly to Cloudinary with your unsigned preset, then
            writes the product into Firestore so the storefront can read it live.
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
              <p>1. Firebase Auth verifies the current author session.</p>
              <p>2. Cloudinary returns `secure_url` for the uploaded image.</p>
              <p>3. Firestore stores the product in the `products` collection.</p>
              <p>4. The storefront listens to Firestore and updates automatically.</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm text-white/70">
              Cloudinary:
              <span className="ml-2 font-semibold text-white">{cloudName}</span>
              <br />
              Upload preset:
              <span className="ml-2 font-semibold text-white">{uploadPreset}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/author">
                Open author dashboard
              </Link>
              <Link className="button-secondary border-white/15 bg-transparent text-white hover:border-white/30 hover:text-white" href="/">
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
                Jersey Image
              </span>
              <input
                accept="image/*"
                className="mt-3 block w-full cursor-pointer text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-white"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[30px] border border-ink/8 bg-white/76 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                  Preview
                </p>
                <div className="mt-4 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,_rgba(91,124,250,0.08),_rgba(255,255,255,0.82))]">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Selected jersey preview"
                      className="h-[320px] w-full object-cover"
                      src={previewUrl}
                    />
                  ) : (
                    <div className="flex h-[320px] items-center justify-center px-6 text-center text-sm text-ink/45">
                      Select an image file to preview the jersey before upload.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[30px] border border-ink/8 bg-white/76 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                  Saved Product Shape
                </p>
                <div className="mt-4 grid gap-3 text-sm text-ink/70">
                  <p>`name`, `priceFrom`, `sport`, and `imageUrl` are saved directly.</p>
                  <p>`variants`, `media`, and `customization` are generated for storefront compatibility.</p>
                  <p>`uploaderUid` is attached from the current Firebase Auth user.</p>
                  <p>The form resets automatically after a successful upload.</p>
                </div>
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
