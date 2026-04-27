/**
 * Lightweight demo session: when Supabase is not configured, we still let
 * users explore the dashboard via a signed-ish cookie. This is *only* for
 * showcase/demo flows; production uses real Supabase auth.
 */
import { cookies } from "next/headers";

export const DEMO_SESSION_COOKIE = "balesin_demo_session";

export type DemoUser = {
  email: string;
  storeName: string;
  createdAt: number;
};

export async function getDemoUser(): Promise<DemoUser | null> {
  const store = await cookies();
  const v = store.get(DEMO_SESSION_COOKIE)?.value;
  if (!v) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(v)) as DemoUser;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setDemoUser(user: DemoUser) {
  const store = await cookies();
  store.set({
    name: DEMO_SESSION_COOKIE,
    value: encodeURIComponent(JSON.stringify(user)),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: false,
  });
}

export async function clearDemoUser() {
  const store = await cookies();
  store.delete(DEMO_SESSION_COOKIE);
}
