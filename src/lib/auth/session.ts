/**
 * Unified session helpers — uses Supabase Auth when configured, falls back to
 * the in-memory demo store otherwise. Server-only.
 */
import { cookies } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getDemoUser, type DemoUser } from "@/lib/auth/demo-session";

export type PlatformRole = "user" | "super_admin";
export type WorkspaceRole = "owner" | "admin" | "agent" | "viewer";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  platform_role: PlatformRole;
  is_banned: boolean;
};

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  store_name: string | null;
  logo_url: string | null;
  primary_locale: string;
  is_suspended: boolean;
  owner_id: string;
};

export type SessionContext = {
  source: "supabase" | "demo";
  email: string;
  storeName: string;
  /** Supabase auth user id (uuid) when source=supabase. Otherwise email. */
  userId: string;
  platformRole: PlatformRole;
  profile: Profile | null;
  workspace: Workspace | null;
  workspaceRole: WorkspaceRole | null;
};

/** Returns the current session context or null if not signed in. */
export async function getSession(): Promise<SessionContext | null> {
  const supabase = await createSupabaseServer();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (user?.email) {
      const admin = getSupabaseAdmin();
      let profile: Profile | null = null;
      let workspace: Workspace | null = null;
      let workspaceRole: WorkspaceRole | null = null;

      if (admin) {
        const profRes = await admin
          .from("profiles")
          .select("id,email,full_name,avatar_url,platform_role,is_banned")
          .eq("id", user.id)
          .maybeSingle();
        profile = (profRes.data as Profile | null) ?? null;

        // Find any workspace the user is a member of (prefer owned).
        const wmRes = await admin
          .from("workspace_members")
          .select("workspace_id, role, workspaces:workspace_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1);
        const row = wmRes.data?.[0];
        if (row && Array.isArray(row.workspaces) === false && row.workspaces) {
          workspace = row.workspaces as unknown as Workspace;
          workspaceRole = row.role as WorkspaceRole;
        }
      }

      const fallbackPlatformRole: PlatformRole =
        user.email === "kekeakt77@gmail.com" ? "super_admin" : "user";

      return {
        source: "supabase",
        email: user.email,
        storeName:
          (workspace?.store_name ?? workspace?.name) ||
          (user.user_metadata?.full_name as string | undefined) ||
          user.email.split("@")[0],
        userId: user.id,
        platformRole: profile?.platform_role ?? fallbackPlatformRole,
        profile,
        workspace,
        workspaceRole,
      };
    }
  }

  // demo fallback
  const demo = await getDemoUser();
  if (demo) {
    return {
      source: "demo",
      email: demo.email,
      storeName: demo.storeName,
      userId: demo.email,
      platformRole:
        demo.email === "kekeakt77@gmail.com" ? "super_admin" : "user",
      profile: null,
      workspace: null,
      workspaceRole: null,
    };
  }

  return null;
}

export async function clearAllSessions() {
  const supabase = await createSupabaseServer();
  if (supabase) {
    await supabase.auth.signOut().catch(() => null);
  }
  const store = await cookies();
  store.delete("balesin_demo_session");
}

/** Compatibility shim returning the legacy DemoUser shape. */
export async function getCurrentUser(): Promise<DemoUser | null> {
  const s = await getSession();
  if (!s) return null;
  return {
    email: s.email,
    storeName: s.storeName,
    createdAt: 0,
  };
}
