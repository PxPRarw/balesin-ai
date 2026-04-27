import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * RLS-respecting Supabase client bound to the current user's auth cookies.
 * Use this in server components / server actions / route handlers that should
 * act *as the user* (e.g. listing conversations, updating settings).
 */
export async function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            store.set(name, value, options);
          }
        } catch {
          /* read-only context (server components without an action) */
        }
      },
    },
  });
}

export const isSupabaseServerConfigured = () =>
  Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY),
  );
