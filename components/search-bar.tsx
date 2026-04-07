"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";

import { useCatalog } from "@/components/catalog-provider";
import { formatPrice } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const { searchProducts } = useCatalog();
  const suggestions = searchProducts(deferredQuery).slice(0, 5);

  return (
    <div className="relative w-full">
      <label className="sr-only" htmlFor="site-search">
        Search jerseys
      </label>
      <div className="premium-input flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/38">
            AI Search
          </p>
          <input
            className="mt-0.5 w-full border-none bg-transparent p-0 text-sm font-medium text-ink outline-none placeholder:text-ink/35"
            id="site-search"
            onBlur={() => {
              window.setTimeout(() => setFocused(false), 120);
            }}
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => setQuery(value));
            }}
            onFocus={() => setFocused(true)}
            placeholder="Search by club, national team, league, or player version"
            value={query}
          />
        </div>
      </div>

      {focused ? (
        <div className="absolute left-0 right-0 top-[4.6rem] z-30 overflow-hidden rounded-[30px] border border-white/75 bg-white/92 shadow-[0_28px_80px_rgba(8,18,34,0.18)] backdrop-blur-xl">
          <div className="border-b border-ink/5 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            {deferredQuery ? "Suggested Matches" : "Trending Searches"}
          </div>
          <div className="max-h-[360px] overflow-y-auto p-3">
            {suggestions.map((product) => (
              <Link
                className="flex items-center gap-3 rounded-[24px] border border-transparent px-3 py-3 transition duration-200 hover:border-accent/10 hover:bg-[#f3f7ff]"
                href={`/product/${product.slug}`}
                key={product.id}
              >
                <div
                  className={`h-16 w-16 overflow-hidden rounded-[22px] bg-gradient-to-br ${product.accent} p-1 shadow-[0_16px_32px_rgba(8,18,34,0.14)]`}
                >
                  <img
                    alt={product.media[0].alt}
                    className="h-full w-full rounded-[14px] object-cover"
                    src={product.media[0].src}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      {product.heroTag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/55">
                    {product.league} / {product.category}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink">
                  {formatPrice(product.priceFrom)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
