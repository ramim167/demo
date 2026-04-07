"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";

export function SideCart() {
  const { items, isOpen, subtotal, closeCart, removeItem } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/45 transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[linear-gradient(180deg,_rgba(11,19,33,0.98),_rgba(6,11,20,0.99))] text-white shadow-2xl transition ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              Ajax Side Cart
            </p>
            <h2 className="mt-1 font-display text-3xl uppercase">Bag Summary</h2>
          </div>
          <button
            className="rounded-full border border-white/15 px-3 py-2 text-sm font-semibold text-white/80"
            onClick={closeCart}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-white/20 p-6 text-sm leading-7 text-white/70">
              Your bag is empty. Add a jersey from any product page and this drawer will update
              without a full page refresh.
            </div>
          ) : (
            items.map((line) => (
              <div
                className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                key={line.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accentSoft">
                      {line.heroTag}
                    </p>
                    <h3 className="mt-2 text-base font-semibold">{line.name}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {line.variantLabel} / Size {line.size}
                    </p>
                    {line.customName || line.customNumber ? (
                      <p className="mt-1 text-xs text-white/55">
                        Print: {line.customName || "No Name"} / {line.customNumber ?? "--"}
                      </p>
                    ) : null}
                    {line.patches.length ? (
                      <p className="mt-1 text-xs text-white/55">
                        Patches: {line.patches.map((patch) => patch.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <button
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50 transition hover:text-red-300"
                    onClick={() => removeItem(line.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-white/55">Qty {line.quantity}</span>
                  <span className="font-semibold">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span className="text-xl font-semibold text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              className="button-secondary border-white/15 bg-transparent text-white hover:border-white/30 hover:text-white"
              onClick={closeCart}
              type="button"
            >
              Continue Shopping
            </button>
            <Link className="button-primary" href="/checkout" onClick={closeCart}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
