import Link from "next/link";

import { AuthControls } from "@/components/auth-controls";
import { CartButton } from "@/components/cart-button";
import { MegaMenu } from "@/components/mega-menu";
import { SearchBar } from "@/components/search-bar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 pt-3">
      <div className="shell">
        <div className="mb-3 hidden items-center justify-between rounded-full border border-white/70 bg-white/55 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/52 backdrop-blur xl:flex">
          <span>Premium fanwear architecture</span>
          <span>Mobile-first jersey commerce</span>
        </div>

        <div className="rounded-[34px] border border-white/75 bg-white/72 px-4 py-4 shadow-[0_22px_60px_rgba(8,18,34,0.1)] backdrop-blur-xl lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link className="flex items-center gap-3" href="/">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(160deg,_#0e1a2d,_#060d16)] text-lg font-black text-white shadow-[0_14px_28px_rgba(5,10,20,0.22)]">
                VK
                </div>
                <div>
                  <div className="font-display text-[2.2rem] uppercase leading-none text-ink">
                    Vanta Kits
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                    Elite jersey atelier
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2 lg:hidden">
                <MegaMenu />
                <CartButton />
                <AuthControls compact />
              </div>
            </div>

            <div className="order-3 hidden items-center gap-3 lg:flex">
              <nav className="flex items-center gap-2 text-sm font-semibold text-ink/75">
                <a
                  className="rounded-full px-3 py-2 transition hover:bg-base hover:text-accent"
                  href="/"
                >
                  Home
                </a>
                <a
                  className="rounded-full px-3 py-2 transition hover:bg-base hover:text-accent"
                  href="/#collections"
                >
                  Collections
                </a>
                <Link
                  className="rounded-full px-3 py-2 transition hover:bg-base hover:text-accent"
                  href="/checkout"
                >
                  Checkout
                </Link>
                <Link
                  className="rounded-full px-3 py-2 transition hover:bg-base hover:text-accent"
                  href="/track-order"
                >
                  Track Order
                </Link>
              </nav>
              <MegaMenu />
              <CartButton />
              <AuthControls />
            </div>

            <div className="order-2 w-full lg:mx-8 lg:max-w-2xl">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
