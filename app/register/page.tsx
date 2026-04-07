"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { UserRole } from "@/lib/types";

export default function RegisterPage() {
  const { signUp } = useAuth();

  const [role, setRole] = useState<UserRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");

    try {
      await signUp({
        name,
        email,
        password,
        role
      });

      setPassword("");
      setStatus(
        role === "author"
          ? "A verification email has been sent to your inbox. Please verify before logging in. After verification, your author request will wait for the main author to approve it."
          : "A verification email has been sent to your inbox. Please verify before logging in."
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell py-10">
      <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="panel-dark p-6 sm:p-8">
          <p className="eyebrow border-white/10 bg-white/10 text-white">Registration</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">
            Create a verified store account
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/72">
            New accounts receive a Firebase verification email immediately after sign-up. Author
            accounts then move into the approval flow handled by the main author.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                User Accounts
              </p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Verify the email, then sign in and start shopping.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                Author Accounts
              </p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Verify first. After that, the main author reviews and approves sub-author access.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" href="/login">
                Go to login
              </Link>
              <Link
                className="button-secondary border-white/15 bg-transparent text-white hover:border-white/30 hover:text-white"
                href="/"
              >
                Back to storefront
              </Link>
            </div>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Register</p>
              <h2 className="section-heading mt-4 text-5xl sm:text-6xl">Create your account</h2>
            </div>
            <Link
              className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-accent hover:text-accent"
              href="/login"
            >
              Already registered?
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { id: "user", label: "User", note: "Verified storefront access" },
              { id: "author", label: "Author", note: "Needs verification and approval" }
            ].map((option) => (
              <button
                className={`rounded-[28px] border p-5 text-left transition duration-200 ${
                  role === option.id
                    ? "border-accent bg-[linear-gradient(180deg,_rgba(91,124,250,0.08),_rgba(255,255,255,0.94))] shadow-glow"
                    : "border-ink/10 bg-white/78"
                }`}
                key={option.id}
                onClick={() => setRole(option.id as UserRole)}
                type="button"
              >
                <p className="font-display text-4xl leading-[0.9] text-ink">{option.label}</p>
                <p className="mt-2 text-sm leading-7 muted-copy">{option.note}</p>
              </button>
            ))}
          </div>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Name
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                value={name}
              />
            </label>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Email
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                type="email"
                value={email}
              />
            </label>

            <label className="premium-input p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                Password
              </span>
              <input
                className="mt-3 w-full border-none bg-transparent p-0 text-base text-ink outline-none"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                value={password}
              />
            </label>

            <button className="button-primary mt-2 w-full" disabled={loading} type="submit">
              {loading ? "Creating account..." : `Create ${role} account`}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          ) : null}

          {status ? (
            <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {status}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
