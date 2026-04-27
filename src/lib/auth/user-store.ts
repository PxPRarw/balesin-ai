/**
 * In-memory user store for demo / dev mode (when Supabase isn't configured).
 *
 * Persists for the lifetime of a single Node.js process. Good enough to let
 * users actually test the signup → logout → login flow in dev / preview.
 *
 * Production should swap this for Supabase auth (see `lib/supabase/server.ts`).
 *
 * Passwords are hashed with PBKDF2 (Node built-in). We never store plaintext.
 */
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

export type StoredUser = {
  id: string;
  email: string;
  storeName: string;
  passwordHash: string; // "salt:hash"
  createdAt: number;
};

declare global {
  var __balesinUsers: Map<string, StoredUser> | undefined;
}

function getStore(): Map<string, StoredUser> {
  if (!globalThis.__balesinUsers) {
    globalThis.__balesinUsers = new Map();
  }
  return globalThis.__balesinUsers;
}

function hashPassword(password: string, salt?: string): string {
  const useSalt = salt ?? randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, useSalt, 60_000, 32, "sha256").toString(
    "hex",
  );
  return `${useSalt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = pbkdf2Sync(password, salt, 60_000, 32, "sha256").toString(
    "hex",
  );
  try {
    return timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export type AuthError =
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND";

export type AuthResult =
  | { ok: true; user: { id: string; email: string; storeName: string; createdAt: number } }
  | { ok: false; error: AuthError };

export function registerUser(input: {
  email: string;
  password: string;
  storeName: string;
}): AuthResult {
  const store = getStore();
  const key = input.email.toLowerCase().trim();
  if (store.has(key)) {
    return { ok: false, error: "EMAIL_TAKEN" };
  }
  const user: StoredUser = {
    id: `u_${randomBytes(8).toString("hex")}`,
    email: key,
    storeName: input.storeName.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: Date.now(),
  };
  store.set(key, user);
  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      storeName: user.storeName,
      createdAt: user.createdAt,
    },
  };
}

export function authenticateUser(input: {
  email: string;
  password: string;
}): AuthResult {
  const store = getStore();
  const key = input.email.toLowerCase().trim();
  const user = store.get(key);
  if (!user) return { ok: false, error: "USER_NOT_FOUND" };
  if (!verifyPassword(input.password, user.passwordHash)) {
    return { ok: false, error: "INVALID_CREDENTIALS" };
  }
  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      storeName: user.storeName,
      createdAt: user.createdAt,
    },
  };
}

export function userCount(): number {
  return getStore().size;
}
