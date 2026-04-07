export function SiteFooter() {
  return (
    <footer className="mt-24 pb-8">
      <div className="shell">
        <div className="panel-dark overflow-hidden px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46">
                Vanta Kits
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-[0.86] text-white sm:text-6xl">
                Premium football and cricket jersey retail, tuned for mobile conversion
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-white/68">
                Cleaner discovery, stronger product pages, and fulfillment-ready customization data
                from the first version.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-white/72 sm:grid-cols-3 lg:grid-cols-1">
              <a
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                href="/#collections"
              >
                Collections
              </a>
              <a
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                href="/checkout"
              >
                Checkout
              </a>
              <a
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                href="/track-order"
              >
                Track Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
