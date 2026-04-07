"use client";

import { useState } from "react";

import { useCatalog } from "@/components/catalog-provider";

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const { menuSections } = useCatalog();

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/65">Shop Menu</span>
        <span className="rounded-full bg-ink/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink/45">
          {open ? "Close" : "Browse"}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-16 z-30 w-[min(92vw,860px)] overflow-hidden rounded-[34px] border border-white/80 bg-white/92 shadow-[0_32px_90px_rgba(8,18,34,0.18)] backdrop-blur-xl">
          <div className="grid gap-6 bg-[radial-gradient(circle_at_top_right,_rgba(17,100,255,0.14),_transparent_34%)] p-6 md:grid-cols-[1.15fr_1fr_1fr_1fr]">
            <div className="rounded-[28px] bg-[linear-gradient(160deg,_#0d1728,_#08111d)] p-6 text-white shadow-[0_24px_60px_rgba(4,8,16,0.28)]">
              <p className="eyebrow border-white/10 bg-white/10 text-white">Matchday Flow</p>
              <h3 className="mt-4 font-display text-4xl uppercase leading-[0.88]">
                Build discovery like a curated jersey vault
              </h3>
              <p className="mt-4 text-sm text-white/75">
                Lead with intent, not catalog noise. Let fans browse by league, national pride, or
                edition quality from the first tap.
              </p>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white/55">
                Premium mobile-first navigation
              </div>
            </div>

            {menuSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/42">
                  {section.title}
                </h4>
                <div className="mt-4 space-y-2.5">
                  {section.items.map((item) => (
                    <a
                      className="block rounded-[22px] border border-transparent bg-white/40 px-3 py-3 text-sm font-medium text-ink/82 transition duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:bg-[#f2f7ff] hover:text-accent"
                      href="/#collections"
                      key={item}
                      onClick={() => setOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
