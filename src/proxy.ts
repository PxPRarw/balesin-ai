import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Lightweight middleware. We do *not* do role checks here (RSC layouts handle
 * those) — middleware just keeps Supabase auth cookies refreshed for both
 * dashboard and admin routes.
 */
export async function proxy(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(toSet) {
        for (const { name, value, options } of toSet) {
          res.cookies.set({ name, value, ...options });
        }
      },
    },
  });
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/webhook).*)",
  ],
};
