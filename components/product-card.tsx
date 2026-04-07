import Link from "next/link";

import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="panel group block overflow-hidden p-4 transition duration-300 hover:-translate-y-1.5 hover:shadow-glow"
      href={`/product/${product.slug}`}
    >
      <div className={`rounded-[28px] bg-gradient-to-br ${product.accent} p-4`}>
        <div className="overflow-hidden rounded-[24px] bg-white/72 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur">
          <img
            alt={product.media[0].alt}
            className="h-64 w-full rounded-[20px] object-cover transition duration-500 group-hover:scale-105"
            src={product.media[0].src}
          />
        </div>
      </div>
      <div className="px-2 pb-2 pt-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {product.heroTag}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
            {product.sport}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">{product.name}</h3>
        <p className="mt-2 text-sm text-ink/60">
          {product.league} / {product.category}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.highlights.slice(0, 2).map((highlight) => (
            <span
              className="rounded-full border border-ink/8 bg-[#f4f6fb] px-3 py-1.5 text-[11px] font-medium text-ink/68"
              key={highlight}
            >
              {highlight}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-ink/6 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/38">From</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink">
              {formatPrice(product.priceFrom)}
            </p>
          </div>
          <div className="rounded-[20px] bg-[#f3f6fb] px-4 py-3 text-right">
            <p className="text-sm font-semibold text-ink">{product.rating.toFixed(1)} / 5</p>
            <p className="text-xs text-ink/45">{product.reviewCount} reviews</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
