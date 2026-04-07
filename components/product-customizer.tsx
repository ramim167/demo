"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCustomizer({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [size, setSize] = useState(product.variants[0]?.sizes[0]?.label ?? "");
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [selectedPatches, setSelectedPatches] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [feedback, setFeedback] = useState("");

  const currentVariant =
    product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];

  useEffect(() => {
    if (!currentVariant) {
      return;
    }

    const hasActiveSize = currentVariant.sizes.some(
      (option) => option.label === size && option.stock > 0
    );

    if (!hasActiveSize) {
      const nextSize = currentVariant.sizes.find((option) => option.stock > 0);
      setSize(nextSize?.label ?? "");
    }
  }, [currentVariant, size]);

  if (!currentVariant) {
    return null;
  }

  const minNumber = product.customization.numberRange[0];
  const maxNumber = product.customization.numberRange[1];
  const remainingChars = product.customization.nameMax - customName.length;
  const patchTotal = product.patches
    .filter((patch) => selectedPatches.includes(patch.id))
    .reduce((sum, patch) => sum + patch.price, 0);
  const selectedSize = currentVariant.sizes.find((option) => option.label === size);
  const livePrice = currentVariant.price + patchTotal;

  function togglePatch(patchId: string) {
    setSelectedPatches((current) =>
      current.includes(patchId) ? current.filter((id) => id !== patchId) : [...current, patchId]
    );
  }

  function handleAddToCart() {
    const parsedNumber = customNumber ? Number(customNumber) : undefined;

    if (customName.length > product.customization.nameMax) {
      setFeedback(`Custom name must be ${product.customization.nameMax} characters or less.`);
      return;
    }

    if (
      parsedNumber !== undefined &&
      (Number.isNaN(parsedNumber) || parsedNumber < minNumber || parsedNumber > maxNumber)
    ) {
      setFeedback(`Custom number must be between ${minNumber} and ${maxNumber}.`);
      return;
    }

    if (!size) {
      setFeedback("Select a size before adding to cart.");
      return;
    }

    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      variantId: currentVariant.id,
      variantLabel: currentVariant.edition,
      size,
      unitPrice: livePrice,
      heroTag: product.heroTag,
      accent: product.accent,
      customName: customName.trim() || undefined,
      customNumber: parsedNumber,
      patches: product.patches.filter((patch) => selectedPatches.includes(patch.id))
    });

    setFeedback("Added to cart. The side drawer updates instantly.");
  }

  return (
    <>
      <div className="panel p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
              currentVariant.badge === "Limited Edition"
                ? "bg-amber-100 text-amber-700"
                : currentVariant.badge === "Low Stock"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {currentVariant.badge}
          </span>
          <span className="rounded-full bg-base px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            {currentVariant.fitProfile}
          </span>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(145deg,_rgba(255,255,255,0.82),_rgba(241,246,255,0.96))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
          <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              Live Price
            </p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-6xl uppercase leading-none text-ink">
                {formatPrice(livePrice)}
              </span>
              {currentVariant.compareAtPrice ? (
                <span className="pb-1 text-base text-ink/35 line-through">
                  {formatPrice(currentVariant.compareAtPrice)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="text-right text-sm text-ink/55">
            <p>SKU {currentVariant.sku}</p>
            <p>{selectedSize?.stock ?? 0} units in selected size</p>
          </div>
        </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
              Edition
            </h3>
            <button
              className="text-sm font-semibold text-accent"
              onClick={() => setShowGuide(true)}
              type="button"
            >
              Size guide
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {product.variants.map((variant) => {
              const active = variant.id === variantId;

              return (
                <button
                  className={`rounded-[26px] border p-4 text-left transition duration-200 ${
                    active
                      ? "border-accent bg-[linear-gradient(180deg,_rgba(17,100,255,0.08),_rgba(255,255,255,0.9))] shadow-glow"
                      : "border-ink/10 bg-white/78 hover:border-accent/30"
                  }`}
                  key={variant.id}
                  onClick={() => setVariantId(variant.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-semibold text-ink">{variant.edition}</span>
                    <span className="text-sm font-semibold text-accent">
                      {formatPrice(variant.price)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/55">{variant.fitProfile}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">Size</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {currentVariant.sizes.map((option) => {
              const active = option.label === size;
              const disabled = option.stock === 0;

              return (
                <button
                  className={`rounded-[20px] border px-4 py-3 text-sm font-semibold transition duration-200 ${
                    active
                      ? "border-accent bg-accent text-white shadow-[0_16px_30px_rgba(17,100,255,0.2)]"
                      : disabled
                        ? "cursor-not-allowed border-ink/8 bg-base text-ink/25"
                        : "border-ink/10 bg-white/78 text-ink hover:border-accent hover:text-accent"
                  }`}
                  disabled={disabled}
                  key={option.label}
                  onClick={() => setSize(option.label)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {selectedSize?.fitNote ? (
            <p className="mt-3 text-sm text-ink/55">{selectedSize.fitNote}</p>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
              Custom Back Print
            </h3>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">
              Name max {product.customization.nameMax}
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                Custom Name
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-lg font-semibold uppercase text-ink outline-none placeholder:text-ink/20"
                maxLength={product.customization.nameMax}
                onChange={(event) => setCustomName(event.target.value.toUpperCase())}
                placeholder="DE BRUYNE"
                value={customName}
              />
              <span className="mt-2 block text-xs text-ink/45">{remainingChars} characters left</span>
            </label>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                Custom Number
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-lg font-semibold uppercase text-ink outline-none placeholder:text-ink/20"
                max={maxNumber}
                min={minNumber}
                onChange={(event) => setCustomNumber(event.target.value)}
                placeholder="17"
                type="number"
                value={customNumber}
              />
              <span className="mt-2 block text-xs text-ink/45">
                Allowed range: {minNumber}-{maxNumber}
              </span>
            </label>
          </div>

          <div className="mt-4 rounded-[28px] bg-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              Print Preview
            </p>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.03))] p-6 text-center">
              <p className="font-display text-5xl uppercase leading-none">
                {customName || "YOUR NAME"}
              </p>
              <p className="mt-4 font-display text-8xl uppercase leading-none text-accentSoft">
                {customNumber || "00"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">Patches</h3>
          <div className="mt-3 space-y-3">
            {product.patches.map((patch) => {
              const active = selectedPatches.includes(patch.id);

              return (
                <button
                  className={`flex w-full items-start justify-between gap-4 rounded-[26px] border p-4 text-left transition duration-200 ${
                    active
                      ? "border-accent bg-[linear-gradient(180deg,_rgba(17,100,255,0.08),_rgba(255,255,255,0.9))]"
                      : "border-ink/10 bg-white/78"
                  }`}
                  key={patch.id}
                  onClick={() => togglePatch(patch.id)}
                  type="button"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-ink">{patch.name}</span>
                      <span className="rounded-full bg-base px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                        {patch.tournament}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink/55">{patch.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    +{formatPrice(patch.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button className="button-primary mt-8 w-full" onClick={handleAddToCart} type="button">
          Add to cart
        </button>
        <p className="mt-3 text-sm text-ink/55">
          Inside City and Outside City shipping are handled during one-page checkout.
        </p>
        {feedback ? <p className="mt-3 text-sm font-semibold text-accent">{feedback}</p> : null}
      </div>

      {showGuide ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4">
          <div className="panel max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Fit Guidance</p>
                <h3 className="mt-4 font-display text-4xl uppercase leading-none text-ink">
                  Size guide
                </h3>
                <p className="mt-3 text-sm text-ink/60">
                  Player versions run tighter through chest and shoulder. Fan versions are more
                  forgiving for casual wear.
                </p>
              </div>
              <button
                className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold"
                onClick={() => setShowGuide(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[30px] bg-[#eef3f8] p-5">
                <h4 className="text-lg font-semibold text-ink">Player Version</h4>
                <div className="mt-4 space-y-3">
                  {product.customization.sizeGuide.player.map((row) => (
                    <div className="rounded-[22px] border border-white/80 bg-white p-4" key={row.size}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-ink">{row.size}</span>
                        <span className="text-sm text-ink/55">
                          Chest {row.chest} / Length {row.length}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink/60">{row.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-[#eef3f8] p-5">
                <h4 className="text-lg font-semibold text-ink">Fan Version</h4>
                <div className="mt-4 space-y-3">
                  {product.customization.sizeGuide.fan.map((row) => (
                    <div className="rounded-[22px] border border-white/80 bg-white p-4" key={row.size}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-ink">{row.size}</span>
                        <span className="text-sm text-ink/55">
                          Chest {row.chest} / Length {row.length}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink/60">{row.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
