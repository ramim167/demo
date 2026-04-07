"use client";

import { useState } from "react";

import { useCatalog } from "@/components/catalog-provider";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CheckoutExperience() {
  const { items, subtotal } = useCart();
  const { products } = useCatalog();
  const [zone, setZone] = useState<"inside" | "outside">("inside");
  const [payment, setPayment] = useState<"bkash" | "nagad" | "cod">("bkash");
  const shippingFee = zone === "inside" ? 60 : 120;
  const fallbackProduct = products[0];
  const orderLines =
    items.length > 0 || !fallbackProduct
      ? items
      : [
          {
            id: "preview-line",
            productId: fallbackProduct.id,
            productSlug: fallbackProduct.slug,
            name: fallbackProduct.name,
            variantId: fallbackProduct.variants[0].id,
            variantLabel: fallbackProduct.variants[0].edition,
            size: "M",
            quantity: 1,
            unitPrice: fallbackProduct.variants[0].price,
            heroTag: fallbackProduct.heroTag,
            accent: fallbackProduct.accent,
            customName: "HAALAND",
            customNumber: 9,
            patches: fallbackProduct.patches[0] ? [fallbackProduct.patches[0]] : []
          }
        ];
  const linesSubtotal = items.length > 0 ? subtotal : orderLines[0]?.unitPrice ?? 0;
  const total = linesSubtotal + shippingFee;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="panel p-6 sm:p-8">
        <div>
          <p className="eyebrow">One-page checkout</p>
          <h1 className="section-heading mt-4 text-6xl sm:text-7xl">
            Fast checkout with local payment rails
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 muted-copy">
            The goal is fewer steps, not fewer fields. Shipping zone, payment preference, print
            notes, and delivery contact should all be captured in one screen.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="premium-input p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Full Name
            </span>
            <input
              className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none placeholder:text-ink/20"
              placeholder="Customer name"
            />
          </label>
          <label className="premium-input p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Phone Number
            </span>
            <input
              className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none placeholder:text-ink/20"
              placeholder="01XXXXXXXXX"
            />
          </label>
          <label className="premium-input p-4 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Delivery Address
            </span>
            <textarea
              className="mt-3 min-h-24 w-full resize-none border-none bg-transparent p-0 text-base text-ink outline-none placeholder:text-ink/20"
              placeholder="House, road, area, city"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] bg-[#eef3f8] p-5">
            <h2 className="text-lg font-semibold text-ink">Shipping calculator</h2>
            <div className="mt-4 space-y-3">
              <button
                className={`flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition duration-200 ${
                  zone === "inside"
                    ? "border-accent bg-[linear-gradient(180deg,_rgba(17,100,255,0.08),_rgba(255,255,255,0.92))]"
                    : "border-ink/10 bg-white"
                }`}
                onClick={() => setZone("inside")}
                type="button"
              >
                <div>
                  <p className="font-semibold text-ink">Inside City</p>
                  <p className="text-sm text-ink/55">Fast courier for metro delivery.</p>
                </div>
                <span className="text-sm font-semibold text-accent">{formatPrice(60)}</span>
              </button>
              <button
                className={`flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition duration-200 ${
                  zone === "outside"
                    ? "border-accent bg-[linear-gradient(180deg,_rgba(17,100,255,0.08),_rgba(255,255,255,0.92))]"
                    : "border-ink/10 bg-white"
                }`}
                onClick={() => setZone("outside")}
                type="button"
              >
                <div>
                  <p className="font-semibold text-ink">Outside City</p>
                  <p className="text-sm text-ink/55">Courier routing for district delivery.</p>
                </div>
                <span className="text-sm font-semibold text-accent">{formatPrice(120)}</span>
              </button>
            </div>
          </div>

          <div className="rounded-[30px] bg-[#eef3f8] p-5">
            <h2 className="text-lg font-semibold text-ink">Payment method</h2>
            <div className="mt-4 space-y-3">
              {[
                { id: "bkash", label: "bKash", note: "Mobile payment placeholder integration" },
                { id: "nagad", label: "Nagad", note: "Mobile wallet placeholder integration" },
                { id: "cod", label: "Cash on Delivery", note: "Collect on doorstep" }
              ].map((option) => (
                <button
                  className={`w-full rounded-[24px] border p-4 text-left transition duration-200 ${
                    payment === option.id
                      ? "border-accent bg-[linear-gradient(180deg,_rgba(17,100,255,0.08),_rgba(255,255,255,0.92))]"
                      : "border-ink/10 bg-white"
                  }`}
                  key={option.id}
                  onClick={() => setPayment(option.id as "bkash" | "nagad" | "cod")}
                  type="button"
                >
                  <p className="font-semibold text-ink">{option.label}</p>
                  <p className="mt-1 text-sm text-ink/55">{option.note}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-dark p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Order summary
        </p>
        <div className="mt-6 space-y-4">
          {orderLines.map((line) => (
            <div
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-4"
              key={line.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accentSoft">
                    {line.heroTag}
                  </p>
                  <h3 className="mt-2 font-semibold">{line.name}</h3>
                  <p className="mt-1 text-sm text-white/65">
                    {line.variantLabel} / Size {line.size} / Qty {line.quantity}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    Print: {line.customName || "No Name"} / {line.customNumber ?? "--"}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="mt-4 text-sm text-white/55">
            Cart is empty, so this page is showing a realistic checkout preview order.
          </p>
        ) : null}

        <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(linesSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button className="button-primary mt-8 w-full" type="button">
          Place order with {payment === "bkash" ? "bKash" : payment === "nagad" ? "Nagad" : "COD"}
        </button>
      </div>
    </div>
  );
}
