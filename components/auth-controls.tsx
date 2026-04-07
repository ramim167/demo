"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";

export function AuthControls({ compact = false }: { compact?: boolean }) {
  const { user, signOut, isAuthor } = useAuth();

  if (compact) {
    return (
      <Link
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        href={user ? (isAuthor ? "/author" : "/account") : "/login"}
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/62">
          {user ? (isAuthor ? "Author" : "Account") : "Login"}
        </span>
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        href="/login"
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/62">Login</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-right shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/40">
          {user.role}
        </p>
        <p className="text-sm font-semibold text-ink">{user.name}</p>
      </div>

      <Link
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        href={isAuthor ? "/author" : "/account"}
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/62">
          {isAuthor ? "Dashboard" : "Account"}
        </span>
      </Link>

      <button
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(8,18,34,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        onClick={() => void signOut()}
        type="button"
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/62">Logout</span>
      </button>
    </div>
  );
}
