/**
 * Workspace bootstrap helpers.
 *
 * On signup we ensure the user has:
 *   1. a profile row (the SQL trigger usually creates it; we double-check)
 *   2. a workspace (created with sensible defaults, slug from email)
 *   3. a workspace_members row with role=owner
 *   4. a default subscription row (free plan)
 *
 * All operations are idempotent.
 */
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

/** Returns workspace_id, or null if Supabase isn't configured / migration not run. */
export async function ensureWorkspaceForUser(
  userId: string,
  data: { email: string; storeName: string },
): Promise<string | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  // 1. Profile (in case trigger isn't installed yet).
  const platformRole = data.email === "kekeakt77@gmail.com" ? "super_admin" : "user";
  const profileUpsert = await admin
    .from("profiles")
    .upsert(
      { id: userId, email: data.email, full_name: data.storeName, platform_role: platformRole },
      { onConflict: "id", ignoreDuplicates: false },
    )
    .select("id")
    .maybeSingle();
  if (profileUpsert.error) {
    // Likely the migration hasn't been run — bail gracefully.
    return null;
  }

  // 2. Already has a workspace?
  const existing = await admin
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (existing.data?.workspace_id) return existing.data.workspace_id as string;

  // 3. Create a new workspace.
  const baseSlug = slugify(data.storeName) || slugify(data.email.split("@")[0]) || "workspace";
  const slug = `${baseSlug}-${randomSuffix()}`;

  const wsInsert = await admin
    .from("workspaces")
    .insert({
      slug,
      name: data.storeName,
      store_name: data.storeName,
      owner_id: userId,
      primary_locale: "id",
    })
    .select("id")
    .single();
  if (wsInsert.error || !wsInsert.data) return null;
  const wsId = wsInsert.data.id as string;

  // 4. Add as owner member.
  await admin
    .from("workspace_members")
    .insert({ workspace_id: wsId, user_id: userId, role: "owner", accepted_at: new Date().toISOString() });

  // 5. Default free subscription.
  await admin.from("subscriptions").insert({
    workspace_id: wsId,
    plan: "free",
    status: "trialing",
    amount_idr: 0,
  });

  // 6. Audit.
  await admin.from("audit_logs").insert({
    workspace_id: wsId,
    actor_id: userId,
    actor_email: data.email,
    action: "workspace.created",
    target_type: "workspace",
    target_id: wsId,
    metadata: { source: "signup" },
  });

  return wsId;
}
