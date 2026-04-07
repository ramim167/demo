import Link from "next/link";

import { storefrontStats } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="shell pt-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-dark relative overflow-hidden p-7 sm:p-10">
          <div className="absolute inset-0 bg-stadium-grid opacity-70" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow border-white/10 bg-white/10 text-white">Premium Sports Commerce</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">
                Club and national drops
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-6xl uppercase leading-[0.82] text-white sm:text-7xl lg:text-[6.1rem]">
              Jersey retail built to feel like a private sportswear release
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
              The storefront should feel sharp, premium, and fast: instant discovery, elevated
              product storytelling, print-ready customization, and checkout flow tuned for mobile
              conversion.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="button-primary" href="/#collections">
                Explore Collections
              </a>
              <Link
                className="button-secondary border-white/12 bg-white/6 text-white hover:border-white/30 hover:text-white"
                href="/track-order"
              >
                Track Existing Order
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Premium club and national team curation",
                "Mobile-first search and purchase flow",
                "Customization captured for production teams"
              ].map((item) => (
                <div
                  className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/72"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel overflow-hidden p-4 sm:p-5">
            <div className="rounded-[30px] bg-[linear-gradient(145deg,_#1264ff,_#08b8dd_58%,_#08111d)] p-6 text-white shadow-[0_22px_60px_rgba(7,20,42,0.24)] sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
                Product Page Priority
              </p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-[0.86]">
                Name, number, badges, and fit guidance in one premium flow
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/76">
                The PDP should carry the brand: zoomed media, premium fit education, and zero-friction add-to-cart.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {storefrontStats.map((stat) => (
              <div className="panel relative overflow-hidden p-5" key={stat.label}>
                <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(17,100,255,0.45),transparent)]" />
                <div className="font-display text-5xl uppercase leading-none text-ink">
                  {stat.value}
                </div>
                <p className="mt-3 text-sm text-ink/58">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="panel px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Drop Logic
                </p>
                <h3 className="mt-2 font-display text-4xl uppercase leading-[0.9] text-ink">
                  League-first, team-first, or edition-first navigation
                </h3>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_16px_34px_rgba(17,100,255,0.24)] sm:flex">
                01
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
