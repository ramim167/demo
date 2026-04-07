"use client";

import Link from "next/link";

import { useCatalog } from "@/components/catalog-provider";
import { ProductCustomizer } from "@/components/product-customizer";
import { ProductGallery } from "@/components/product-gallery";
import { formatPrice } from "@/lib/utils";

export function ProductRouteView({ slug }: { slug: string }) {
  const { getProductBySlug } = useCatalog();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="shell py-16">
        <div className="panel p-8 text-center">
          <p className="eyebrow">Not Found</p>
          <h1 className="section-heading mt-4 text-5xl">This jersey is not available</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 muted-copy">
            The slug exists as a route, but no product currently matches it in the catalog store.
            Authors can add a product from the author dashboard and then revisit this URL.
          </p>
          <div className="mt-6 flex justify-center">
            <Link className="button-primary" href="/author">
              Open author dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.media.filter((item) => item.type === "image").map((item) => item.src),
    description: product.description,
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: "Vanta Kits"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: product.priceFrom,
      highPrice: Math.max(...product.variants.map((variant) => variant.price)),
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="shell py-10">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        suppressHydrationWarning
        type="application/ld+json"
      />

      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <ProductGallery media={product.media} />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{product.heroTag}</p>
            <span className="rounded-full border border-ink/8 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/50">
              {product.sport}
            </span>
          </div>
          <h1 className="section-heading mt-4 text-6xl sm:text-7xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/55">
            <span>
              {product.league} / {product.category}
            </span>
            <span>
              {product.rating.toFixed(1)} rating / {product.reviewCount} reviews
            </span>
            <span>From {formatPrice(product.priceFrom)}</span>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-8 muted-copy">{product.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {product.highlights.map((highlight) => (
              <div
                className="rounded-[26px] border border-white/80 bg-white/76 p-4 shadow-[0_16px_34px_rgba(8,18,34,0.06)] backdrop-blur"
                key={highlight}
              >
                <p className="text-sm leading-6 text-ink/66">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <ProductCustomizer product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
