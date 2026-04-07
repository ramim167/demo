"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { useCatalog } from "@/components/catalog-provider";

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Leagues");
  const { menuSections, collections } = useCatalog();
  const { isAuthor } = useAuth();

  const sections = [
    ...menuSections,
    {
      title: "Groups",
      items: collections.map((collection) => collection.name)
    }
  ];

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/78 px-4 py-3 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/65">Sections</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
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

      {open ? (
        <div className="absolute right-0 top-16 z-30 w-[min(92vw,28rem)] overflow-hidden rounded-[34px] border border-white/80 bg-white/94 shadow-[0_32px_90px_rgba(8,18,34,0.18)] backdrop-blur-xl">
          <div className="p-4">
            <div className="rounded-[28px] bg-[linear-gradient(160deg,_#0d1728,_#08111d)] p-5 text-white shadow-[0_24px_60px_rgba(4,8,16,0.22)]">
              <p className="eyebrow border-white/10 bg-white/10 text-white">Browse Store</p>
              <h3 className="mt-4 font-display text-4xl leading-[0.9] text-white">
                Open any section and jump straight into the catalog
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Browse by league, national team, edition, or custom author-created groups.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {sections.map((section) => {
                const active = section.title === activeSection;

                return (
                  <div className="rounded-[26px] border border-ink/8 bg-white/80 p-3" key={section.title}>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        className="flex flex-1 items-center justify-between rounded-[20px] px-3 py-3 text-left transition hover:bg-[#f5f7fd]"
                        onClick={() =>
                          setActiveSection((current) =>
                            current === section.title ? "" : section.title
                          )
                        }
                        type="button"
                      >
                        <span className="text-sm font-semibold text-ink">{section.title}</span>
                        <svg
                          aria-hidden="true"
                          className={`h-4 w-4 text-ink/50 transition ${active ? "rotate-180" : ""}`}
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

                      {section.title === "Groups" && isAuthor ? (
                        <Link
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-glow"
                          href="/#collections"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Add group</span>+
                        </Link>
                      ) : null}
                    </div>

                    {active ? (
                      <div className="grid gap-2 px-3 pb-2 pt-1">
                        {section.items.map((item) => {
                          const matchingCollection = collections.find(
                            (collection) => collection.name === item
                          );
                          const href = matchingCollection
                            ? `/collections/${matchingCollection.slug}`
                            : "/#collections";

                          return (
                            <Link
                              className="rounded-[18px] border border-transparent bg-[#f7f8fc] px-4 py-3 text-sm font-medium text-ink/82 transition duration-200 hover:border-accent/20 hover:bg-[#eef4ff] hover:text-accent"
                              href={href}
                              key={item}
                              onClick={() => setOpen(false)}
                            >
                              {item}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
