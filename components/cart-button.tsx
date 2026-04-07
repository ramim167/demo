"use client";

import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
      onClick={openCart}
      type="button"
    >
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink/62">Cart</span>
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-xs text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        {count}
      </span>
    </button>
  );
}
