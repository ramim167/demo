"use client";

import { useState } from "react";

import { findTrackingOrder } from "@/lib/mock-data";

export function OrderTracking() {
  const [orderId, setOrderId] = useState("VK-20481");
  const [phone, setPhone] = useState("01711223344");
  const [searched, setSearched] = useState(false);
  const result = searched ? findTrackingOrder(orderId, phone) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel p-6 sm:p-8">
        <p className="eyebrow">Order Tracking</p>
        <h1 className="section-heading mt-4 text-6xl sm:text-7xl">
          Delivery status without support friction
        </h1>
        <p className="mt-4 text-sm leading-7 muted-copy">
          Customers enter their order ID and phone number to see printing, packing, transit, and
          delivery updates in one place.
        </p>

        <div className="mt-8 space-y-4">
          <label className="premium-input block p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Order ID
            </span>
            <input
              className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
              onChange={(event) => setOrderId(event.target.value)}
              value={orderId}
            />
          </label>
          <label className="premium-input block p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Phone Number
            </span>
            <input
              className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
              onChange={(event) => setPhone(event.target.value)}
              value={phone}
            />
          </label>
          <button className="button-primary w-full" onClick={() => setSearched(true)} type="button">
            Track order
          </button>
        </div>
      </div>

      <div className="panel-dark p-6 sm:p-8">
        {result ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  {result.orderId}
                </p>
                <h2 className="mt-3 font-display text-4xl uppercase leading-none">{result.status}</h2>
                <p className="mt-3 text-sm text-white/70">{result.destination}</p>
                <p className="text-sm text-white/70">{result.eta}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                Payment: {result.paymentMethod}
              </div>
            </div>

            <div className="mt-8 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Items
              </p>
              <p className="mt-3 text-sm text-white/80">{result.items.join(" / ")}</p>
            </div>

            <div className="mt-8 space-y-4">
              {result.timeline.map((event) => (
                <div className="flex gap-4" key={`${event.status}-${event.date}`}>
                  <div className="mt-1 h-3 w-3 rounded-full bg-accent" />
                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold">{event.status}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                        {event.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="rounded-[30px] border border-dashed border-white/20 p-6 text-sm leading-7 text-white/70">
            No order matched that ID and phone combination. This page is wired to use order ID
            <span className="font-semibold text-white"> VK-20481 </span>
            with phone
            <span className="font-semibold text-white"> 01711223344</span>.
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-white/20 p-6 text-sm leading-7 text-white/70">
            Enter the order ID and phone number to view live delivery status.
          </div>
        )}
      </div>
    </div>
  );
}
