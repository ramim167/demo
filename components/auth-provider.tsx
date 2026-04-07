"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebaseConfig";
import { AuthUser, AuthorApprovalStatus, SignInInput, UserRole } from "@/lib/types";

const MAIN_AUTHOR_EMAIL = "nafismohtasimramim@gmail.com";

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signUp: (input: SignInInput) => Promise<AuthUser>;
  resendVerificationEmail: (input: Pick<SignInInput, "email" | "password">) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthor: boolean;
  isUser: boolean;
  isMainAuthor: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isMainAuthorEmail(email: string) {
  return normalizeEmail(email) === MAIN_AUTHOR_EMAIL;
}

function fallbackName(name: string | null | undefined, email: string) {
  return name?.trim() || email.split("@")[0] || "Vanta Member";
}

function normalizeAuthorStatus(
  role: UserRole,
  email: string,
  status?: unknown
): AuthorApprovalStatus {
  if (role !== "author") {
    return "not_applicable";
  }

  if (isMainAuthorEmail(email)) {
    return "approved";
  }

  if (
    status === "pending_verification" ||
    status === "pending_approval" ||
    status === "approved" ||
    status === "rejected"
  ) {
    return status;
  }

  return "approved";
}

function buildProfile(input: AuthUser): AuthUser {
  return input;
}

async function writeUserProfile(input: AuthUser) {
  await setDoc(
    doc(db, "users", input.id),
    {
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt,
      emailVerified: input.emailVerified,
      authorStatus: input.authorStatus,
      isMainAuthor: Boolean(input.isMainAuthor),
      approvalRequestedAt: input.approvalRequestedAt ?? null,
      approvedAt: input.approvedAt ?? null,
      approvedBy: input.approvedBy ?? null
    },
    { merge: true }
  );
}

async function readUserProfile(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const email = String(data.email ?? "");
  const role: UserRole = data.role === "author" ? "author" : "user";

  return buildProfile({
    id: uid,
    name: String(data.name ?? "Vanta Member"),
    email,
    role,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    emailVerified: Boolean(data.emailVerified),
    authorStatus: normalizeAuthorStatus(role, email, data.authorStatus),
    isMainAuthor: Boolean(data.isMainAuthor) || (role === "author" && isMainAuthorEmail(email)),
    approvalRequestedAt: data.approvalRequestedAt ? String(data.approvalRequestedAt) : undefined,
    approvedAt: data.approvedAt ? String(data.approvedAt) : undefined,
    approvedBy: data.approvedBy ? String(data.approvedBy) : undefined
  });
}

async function ensureAuthorizedProfile(
  firebaseUser: FirebaseUser,
  requestedRole?: UserRole
): Promise<{
  profile: AuthUser | null;
  message?: string;
  shouldSignOut?: boolean;
}> {
  await reload(firebaseUser);

  const freshUser = auth.currentUser ?? firebaseUser;

  if (!freshUser.emailVerified) {
    return {
      profile: null,
      message: "Your email is not verified. Please check your inbox.",
      shouldSignOut: true
    };
  }

  const email = normalizeEmail(freshUser.email ?? "");
  const now = new Date().toISOString();
  let profile = await readUserProfile(freshUser.uid);

  if (!profile) {
    if (requestedRole === "author") {
      return {
        profile: null,
        message: "Author profile not found. Register the author account first.",
        shouldSignOut: true
      };
    }

    profile = buildProfile({
      id: freshUser.uid,
      name: fallbackName(freshUser.displayName, email),
      email,
      role: requestedRole ?? "user",
      createdAt: now,
      updatedAt: now,
      emailVerified: true,
      authorStatus: "not_applicable",
      isMainAuthor: false
    });
  }

  if (requestedRole && profile.role !== requestedRole) {
    return {
      profile: null,
      message: `This account is registered as ${profile.role}.`,
      shouldSignOut: true
    };
  }

  let nextProfile: AuthUser = {
    ...profile,
    email,
    emailVerified: true,
    updatedAt: now
  };

  if (nextProfile.role === "author" && isMainAuthorEmail(email)) {
    nextProfile = {
      ...nextProfile,
      authorStatus: "approved",
      isMainAuthor: true,
      approvedAt: nextProfile.approvedAt ?? now,
      approvedBy: nextProfile.approvedBy ?? email
    };
    await writeUserProfile(nextProfile);
    return { profile: nextProfile };
  }

  if (nextProfile.role === "author") {
    if (nextProfile.authorStatus === "pending_verification") {
      nextProfile = {
        ...nextProfile,
        authorStatus: "pending_approval",
        approvalRequestedAt: nextProfile.approvalRequestedAt ?? now
      };
      await writeUserProfile(nextProfile);
      return {
        profile: null,
        message:
          "Your email is verified. Your author request has been sent to the main author for approval.",
        shouldSignOut: true
      };
    }

    if (nextProfile.authorStatus === "pending_approval") {
      await writeUserProfile(nextProfile);
      return {
        profile: null,
        message: "Your author account is waiting for approval from the main author.",
        shouldSignOut: true
      };
    }

    if (nextProfile.authorStatus === "rejected") {
      await writeUserProfile(nextProfile);
      return {
        profile: null,
        message: "Your author request was declined. Contact the main author for review.",
        shouldSignOut: true
      };
    }
  }

  await writeUserProfile(nextProfile);
  return { profile: nextProfile };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const suppressUnverifiedLogoutRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setHydrated(true);
        return;
      }

      try {
        const result = await ensureAuthorizedProfile(firebaseUser);

        if (result.profile) {
          setUser(result.profile);
        } else {
          setUser(null);

          if (result.shouldSignOut && !suppressUnverifiedLogoutRef.current) {
            await firebaseSignOut(auth);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setHydrated(true);
      }
    });

    return () => unsubscribe();
  }, []);

  async function signIn(input: SignInInput) {
    const credential = await signInWithEmailAndPassword(auth, normalizeEmail(input.email), input.password);
    const result = await ensureAuthorizedProfile(credential.user, input.role);

    if (!result.profile) {
      await firebaseSignOut(auth);
      setUser(null);
      throw new Error(result.message ?? "Unable to sign in.");
    }

    setUser(result.profile);
    return result.profile;
  }

  async function signUp(input: SignInInput) {
    suppressUnverifiedLogoutRef.current = true;

    try {
      const cleanEmail = normalizeEmail(input.email);
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, input.password);
      const cleanName = fallbackName(input.name, cleanEmail);

      if (cleanName) {
        await updateProfile(credential.user, { displayName: cleanName });
      }

      const createdAt = new Date().toISOString();
      const authorStatus: AuthorApprovalStatus =
        input.role === "author"
          ? isMainAuthorEmail(cleanEmail)
            ? "approved"
            : "pending_verification"
          : "not_applicable";

      const profile = buildProfile({
        id: credential.user.uid,
        name: cleanName,
        email: cleanEmail,
        role: input.role,
        createdAt,
        updatedAt: createdAt,
        emailVerified: false,
        authorStatus,
        isMainAuthor: input.role === "author" && isMainAuthorEmail(cleanEmail),
        approvalRequestedAt: undefined,
        approvedAt:
          input.role === "author" && isMainAuthorEmail(cleanEmail) ? createdAt : undefined,
        approvedBy:
          input.role === "author" && isMainAuthorEmail(cleanEmail) ? cleanEmail : undefined
      });

      await writeUserProfile(profile);
      await sendEmailVerification(credential.user);
      await firebaseSignOut(auth);
      setUser(null);

      return profile;
    } finally {
      suppressUnverifiedLogoutRef.current = false;
    }
  }

  async function resendVerificationEmail(input: Pick<SignInInput, "email" | "password">) {
    suppressUnverifiedLogoutRef.current = true;

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizeEmail(input.email),
        input.password
      );

      await reload(credential.user);

      if (credential.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("This email is already verified. You can sign in now.");
      }

      await sendEmailVerification(credential.user);
      await firebaseSignOut(auth);
      setUser(null);
    } finally {
      suppressUnverifiedLogoutRef.current = false;
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
  }

  const isApprovedAuthor = user?.role === "author" && user.authorStatus === "approved";
  const isCurrentMainAuthor = Boolean(isApprovedAuthor && user?.isMainAuthor);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      signIn,
      signUp,
      resendVerificationEmail,
      signOut,
      isAuthor: Boolean(isApprovedAuthor),
      isUser: user?.role === "user",
      isMainAuthor: isCurrentMainAuthor,
      hasRole: (role) =>
        role === "author" ? Boolean(isApprovedAuthor) : user?.role === role
    }),
    [hydrated, isApprovedAuthor, isCurrentMainAuthor, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
