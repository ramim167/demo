"use client";

import { useState } from "react";

import { ProductMedia } from "@/lib/types";

export function ProductGallery({ media }: { media: ProductMedia[] }) {
  const imageMedia = media.filter((item) => item.type === "image");
  const [activeId, setActiveId] = useState(imageMedia[0]?.id ?? "");
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const activeMedia = imageMedia.find((item) => item.id === activeId) ?? imageMedia[0];

  if (!activeMedia) {
    return null;
  }

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
      </div>

      <div className={`grid gap-3 ${imageMedia.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {imageMedia.map((item) => {
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
