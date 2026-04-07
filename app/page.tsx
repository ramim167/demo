"use client";

import Link from "next/link";

import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/components/catalog-provider";

export default function HomePage() {
  const { featuredCollections, featuredProducts, menuSections } = useCatalog();

  return (
    <div className="pb-10">
      <Hero />

      <section className="shell mt-20" id="collections">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Navigation Architecture</p>
            <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
              Discovery starts with precision, not clutter
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 muted-copy">
            Mirror the browsing logic customers already understand: league, national team, and
            edition. That keeps the first session friction low on mobile.
          </p>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {menuSections.map((section, index) => (
            <div
              className={`panel overflow-hidden p-6 ${
                index === 0 ? "bg-[linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(236,243,255,0.92))]" : ""
              }`}
              key={section.title}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                {section.title}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {section.items.map((item) => (
                  <span
                    className="rounded-full border border-ink/8 bg-white/80 px-3 py-2 text-sm font-medium text-ink/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Curated Collections</p>
            <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
              Author-managed collections now surface directly on the storefront
            </h2>
          </div>
          <Link className="button-secondary" href="/author">
            Open author dashboard
          </Link>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {featuredCollections.map((collection) => (
            <div className="panel overflow-hidden p-4" key={collection.id}>
              <div className={`rounded-[28px] bg-gradient-to-br ${collection.accent} p-4`}>
                <div className="overflow-hidden rounded-[24px] bg-white/72 p-3 backdrop-blur">
                  <img
                    alt={collection.name}
                    className="h-60 w-full rounded-[20px] object-cover"
                    src={collection.coverImage}
                  />
                </div>
              </div>
              <div className="px-2 pb-2 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                  Collection
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
                  {collection.name}
                </h3>
                <p className="mt-3 text-sm leading-7 muted-copy">{collection.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured Drops</p>
            <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
              Home modules that push users toward the product page fast
            </h2>
          </div>
          <Link className="button-secondary" href="/checkout">
            View checkout prototype
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="shell mt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel-dark p-6 sm:p-7 lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              UX Flow
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Search",
                  body: "AI-style autocomplete with product thumbnails, team keywords, and edition intent."
                },
                {
                  title: "Customize",
                  body: "The product page captures print name, number, patching, and fit selection in a single block."
                },
                {
                  title: "Author Control",
                  body: "Authors can log in, update prices, assign collections, change discount rules, and swap image URLs from inside the web app."
                }
              ].map((item) => (
                <div
                  className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  key={item.title}
                >
                  <h3 className="font-display text-4xl leading-[0.9] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Operational Need
            </p>
            <h3 className="section-heading mt-4 text-5xl">
              Login roles are ready for user and author flows
            </h3>
            <p className="mt-4 text-sm leading-7 muted-copy">
              The UI now includes a role-based auth scaffold. You can keep using the local logic
              for development and later connect Firebase by filling the blank endpoints file.
            </p>
            <Link className="button-primary mt-6" href="/login">
              Review login flow
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
