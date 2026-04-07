"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";

export function AccountPanel() {
  const { hydrated, user, signOut } = useAuth();

  if (!hydrated) {
    return (
      <div className="panel p-8 text-center text-sm text-ink/60">Loading account...</div>
    );
  }

  if (!user) {
    return (
      <div className="panel p-8 text-center">
        <p className="eyebrow">No Session</p>
        <h1 className="section-heading mt-4 text-5xl">Sign in to access your account</h1>
        <div className="mt-6 flex justify-center">
          <Link className="button-primary" href="/login">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <div className="panel-dark p-6 sm:p-8">
        <p className="eyebrow border-white/10 bg-white/10 text-white">Account</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">
          Welcome back, {user.name}
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Your current role is <span className="font-semibold text-white">{user.role}</span>.
          Authors can open the dashboard to manage catalog data. Users can continue shopping and
          track orders.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {user.role === "author" ? (
            <Link className="button-primary" href="/author">
              Open author dashboard
            </Link>
          ) : (
            <Link className="button-primary" href="/">
              Continue shopping
            </Link>
          )}
          <button className="button-secondary border-white/15 bg-transparent text-white hover:border-white/30 hover:text-white" onClick={() => void signOut()} type="button">
            Logout
          </button>
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <p className="eyebrow">Session Details</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="premium-input p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Name</p>
            <p className="mt-3 text-base font-semibold text-ink">{user.name}</p>
          </div>
          <div className="premium-input p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Role</p>
            <p className="mt-3 text-base font-semibold text-ink">{user.role}</p>
          </div>
          <div className="premium-input p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Email</p>
            <p className="mt-3 text-base font-semibold text-ink">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
