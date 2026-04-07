"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";

import { useCatalog } from "@/components/catalog-provider";

export function SearchBar() {
  const { searchProducts } = useCatalog();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const suggestions = searchProducts(deferredQuery).slice(0, 6);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/78 px-4 py-3 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span className="text-left">
          <span className="block text-[10px] uppercase tracking-[0.24em] text-ink/42">
            Search
          </span>
          <span className="block text-sm text-ink/78">Jersey titles</span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[4.6rem] z-30 w-[min(92vw,30rem)] overflow-hidden rounded-[30px] border border-white/80 bg-white/94 shadow-[0_28px_80px_rgba(8,18,34,0.18)] backdrop-blur-xl">
          <div className="border-b border-ink/5 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/42">
              Title Search
            </p>
            <input
              autoFocus
              className="mt-3 w-full rounded-[22px] border border-ink/8 bg-[#f7f8fc] px-4 py-3 text-sm font-medium text-ink outline-none transition focus:border-accent focus:bg-white"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by jersey title only"
              value={query}
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto p-3">
            {query.trim() ? (
              suggestions.length ? (
                suggestions.map((product) => (
                  <Link
                    className="flex items-center justify-between gap-3 rounded-[22px] border border-transparent px-4 py-3 transition duration-200 hover:border-accent/10 hover:bg-[#f4f7ff]"
                    href={`/product/${product.slug}`}
                    key={product.id}
                    onClick={() => setOpen(false)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-ink/48">
                        {product.league} / {product.category}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Open
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-[24px] bg-[#f7f8fc] px-4 py-5 text-sm text-ink/55">
                  No jersey title matched. Try the exact or partial product name.
                </div>
              )
            ) : (
              <div className="rounded-[24px] bg-[#f7f8fc] px-4 py-5 text-sm text-ink/55">
                Start typing a jersey title to search.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
