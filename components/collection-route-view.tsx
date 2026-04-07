"use client";

import Link from "next/link";

import { useCatalog } from "@/components/catalog-provider";
import { ProductCard } from "@/components/product-card";

export function CollectionRouteView({ slug }: { slug: string }) {
  const { getCollectionBySlug, getProductsByCollectionId } = useCatalog();
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return (
      <div className="shell py-16">
        <div className="panel p-8 text-center">
          <p className="eyebrow">Group Not Found</p>
          <h1 className="section-heading mt-4 text-5xl">This storefront group is not available</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 muted-copy">
            The requested group does not exist in the live collection list right now.
          </p>
          <div className="mt-6 flex justify-center">
            <Link className="button-primary" href="/#collections">
              Back to groups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const groupProducts = getProductsByCollectionId(collection.id);

  return (
    <div className="shell py-10">
      <div className="panel overflow-hidden p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className={`rounded-[30px] bg-gradient-to-br ${collection.accent} p-5`}>
            <div className="overflow-hidden rounded-[26px] bg-white/72 p-4 backdrop-blur">
              <img
                alt={collection.name}
                className="h-[22rem] w-full rounded-[22px] object-cover"
                src={collection.coverImage}
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">Store Group</p>
            <h1 className="section-heading mt-4 text-6xl sm:text-7xl">{collection.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 muted-copy">
              {collection.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-accent/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {groupProducts.length} jerseys
              </span>
              <Link className="button-secondary" href="/#collections">
                Back to all groups
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Assigned Jerseys</p>
            <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
              Every jersey tagged to this block appears here
            </h2>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groupProducts.length ? (
            groupProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="panel col-span-full p-6 text-sm text-ink/55">
              No jerseys have been tagged to this block yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
