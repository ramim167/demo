"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { UserRole } from "@/lib/types";

export function LoginPanel() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<UserRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const action = mode === "signin" ? signIn : signUp;

      await action({
        name,
        email,
        password,
        role
      });

      setStatus(
        mode === "signin"
          ? "Signed in with Firebase."
          : "Account created with Firebase and role profile saved."
      );
      router.push(role === "author" ? "/author" : "/account");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="panel-dark p-6 sm:p-8">
        <p className="eyebrow border-white/10 bg-white/10 text-white">Role-Based Access</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.92] text-white sm:text-6xl">
          User and author login now runs through Firebase Auth
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Accounts are stored in Firebase Auth and role profiles are stored in Firestore. Author
          and user roles are checked during sign-in so the wrong role cannot access the wrong area.
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              title: "User",
              body: "Can browse, customize, purchase, and track orders."
            },
            {
              title: "Author",
              body: "Can edit prices, create collections, add discount rules, and update jersey image URLs."
            }
          ].map((item) => (
            <div
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              key={item.title}
            >
              <h2 className="font-display text-4xl leading-[0.92] text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{mode === "signin" ? "Sign In" : "Create Account"}</p>
            <h2 className="section-heading mt-4 text-5xl sm:text-6xl">
              Choose your role and continue
            </h2>
          </div>
          {user ? (
            <div className="rounded-[24px] border border-ink/8 bg-white/80 px-4 py-3 text-sm text-ink/68">
              Signed in as <span className="font-semibold text-ink">{user.name}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 inline-flex rounded-full border border-ink/8 bg-white/78 p-1">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "signin" ? "bg-accent text-white" : "text-ink/65"
            }`}
            onClick={() => setMode("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-accent text-white" : "text-ink/65"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Create Account
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { id: "user", label: "User", note: "Shopping and tracking access" },
            { id: "author", label: "Author", note: "Catalog and pricing access" }
          ].map((option) => (
            <button
              className={`rounded-[28px] border p-5 text-left transition duration-200 ${
                role === option.id
                  ? "border-accent bg-[linear-gradient(180deg,_rgba(70,110,255,0.08),_rgba(255,255,255,0.92))] shadow-glow"
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
            {loading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? `Sign in as ${role}`
                : `Create ${role} account`}
          </button>
        </form>

        <div className="mt-4 rounded-[24px] border border-ink/8 bg-white/70 px-4 py-3 text-sm leading-7 text-ink/66">
          Developer note:
          <span className="ml-2 font-semibold text-ink">
            Firestore must allow reading and writing the `users` collection for authenticated users.
          </span>
        </div>
        {status ? <p className="mt-4 text-sm font-semibold text-accent">{status}</p> : null}
      </div>
    </div>
  );
}
