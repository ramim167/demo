"use client";

import Link from "next/link";

import { CollectionShowcase } from "@/components/collection-showcase";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/components/catalog-provider";

export default function HomePage() {
  const { featuredProducts, menuSections } = useCatalog();

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

      <CollectionShowcase />

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
                  body: "A compact search button keeps the header clean and searches jersey titles only."
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
              The UI now includes verified Firebase roles, pending author approvals, and live
              Firestore-backed author controls.
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
