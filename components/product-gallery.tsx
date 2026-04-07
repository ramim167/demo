"use client";

import { useState } from "react";

import { ProductMedia } from "@/lib/types";

export function ProductGallery({ media }: { media: ProductMedia[] }) {
  const [activeId, setActiveId] = useState(media[0]?.id ?? "");
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const activeMedia = media.find((item) => item.id === activeId) ?? media[0];

  return (
    <div className="space-y-4">
      <div
        className="panel group overflow-hidden p-4"
        onMouseLeave={() => setOrigin({ x: 50, y: 50 })}
        onMouseMove={(event) => {
          const target = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - target.left) / target.width) * 100;
          const y = ((event.clientY - target.top) / target.height) * 100;
          setOrigin({ x, y });
        }}
      >
        {activeMedia.type === "image" ? (
          <div className="relative overflow-hidden rounded-[28px] bg-[#edf2f8]">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50 backdrop-blur">
              Hover to zoom
            </div>
            <img
              alt={activeMedia.alt}
              className="h-[520px] w-full object-cover transition duration-500 group-hover:scale-[1.34]"
              src={activeMedia.src}
              style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
            />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[28px] bg-ink">
            <img
              alt={activeMedia.alt}
              className="h-[520px] w-full object-cover opacity-60"
              src={activeMedia.src}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-white">
              <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl shadow-[0_18px_34px_rgba(5,10,20,0.24)]">
                <svg aria-hidden="true" className="h-7 w-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6v12l10-6-10-6Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Video Slot
                </p>
                <h3 className="mt-2 font-display text-4xl uppercase leading-[0.9]">
                  Fabric and print preview
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {media.map((item) => {
          const active = item.id === activeId;

          return (
            <button
              className={`panel overflow-hidden p-2 text-left transition duration-200 ${
                active ? "ring-2 ring-accent shadow-[0_20px_44px_rgba(17,100,255,0.16)]" : ""
              }`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              <div className="relative overflow-hidden rounded-[20px] bg-base">
                <img alt={item.alt} className="h-28 w-full object-cover" src={item.src} />
                {item.type === "video" ? (
                  <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-ink/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Video
                  </span>
                ) : null}
              </div>
              <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
