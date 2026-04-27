/**
 * Data queries used by dashboards. All helpers return REAL data from
 * Supabase (no mock/dummy fallback). When the workspace has no data,
 * the UI must show an empty state, not fake data.
 */
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type WorkspaceKPIs = {
  messagesToday: number;
  messagesYesterday: number;
  conversationsToday: number;
  aiHandledPct: number;
  aiResolvedToday: number;
  avgResponseSeconds: number;
  conversionPct: number;
  unread: number;
};

const EMPTY_KPIS: WorkspaceKPIs = {
  messagesToday: 0,
  messagesYesterday: 0,
  conversationsToday: 0,
  aiHandledPct: 0,
  aiResolvedToday: 0,
  avgResponseSeconds: 0,
  conversionPct: 0,
  unread: 0,
};

export async function getWorkspaceKPIs(workspaceId: string | null): Promise<WorkspaceKPIs> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return EMPTY_KPIS;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const [todayRes, yesterdayRes, aiRes, convoTodayRes, resolvedTodayRes, unreadRes] =
    await Promise.all([
      admin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("created_at", todayStart.toISOString()),
      admin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("created_at", yesterdayStart.toISOString())
        .lt("created_at", todayStart.toISOString()),
      admin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("role", "ai")
        .gte("created_at", todayStart.toISOString()),
      admin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("last_message_at", todayStart.toISOString()),
      admin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "resolved")
        .gte("updated_at", todayStart.toISOString()),
      admin
        .from("conversations")
        .select("unread_count")
        .eq("workspace_id", workspaceId),
    ]);

  const today = todayRes.count ?? 0;
  const aiCount = aiRes.count ?? 0;
  const convoToday = convoTodayRes.count ?? 0;
  const resolvedToday = resolvedTodayRes.count ?? 0;
  const unread = (unreadRes.data ?? []).reduce(
    (sum: number, r: { unread_count?: number | null }) => sum + (r.unread_count ?? 0),
    0,
  );

  return {
    messagesToday: today,
    messagesYesterday: yesterdayRes.count ?? 0,
    conversationsToday: convoToday,
    aiHandledPct: today > 0 ? Math.round((aiCount / today) * 100) : 0,
    aiResolvedToday: resolvedToday,
    avgResponseSeconds: 0,
    conversionPct: 0,
    unread,
  };
}

/** Hourly message volume for the last 24h (24 buckets, oldest first). */
export async function getHourlyVolume(workspaceId: string | null): Promise<number[]> {
  const empty = Array(24).fill(0) as number[];
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return empty;

  const now = new Date();
  const start = new Date(now.getTime() - 24 * 3600 * 1000);
  const res = await admin
    .from("messages")
    .select("created_at")
    .eq("workspace_id", workspaceId)
    .gte("created_at", start.toISOString())
    .limit(5000);
  if (res.error || !res.data) return empty;

  const buckets = Array(24).fill(0) as number[];
  for (const row of res.data as { created_at: string }[]) {
    const t = new Date(row.created_at);
    const diffH = Math.floor((t.getTime() - start.getTime()) / 3600000);
    if (diffH >= 0 && diffH < 24) buckets[diffH] += 1;
  }
  return buckets;
}

/** Top customer questions today (simple heuristic — first 4 words of customer messages). */
export async function getTopQueries(
  workspaceId: string | null,
  limit = 5,
): Promise<{ q: string; count: number }[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const res = await admin
    .from("messages")
    .select("body")
    .eq("workspace_id", workspaceId)
    .eq("role", "customer")
    .gte("created_at", since.toISOString())
    .limit(2000);
  if (res.error || !res.data) return [];

  const tally = new Map<string, number>();
  for (const m of res.data as { body: string }[]) {
    const cleaned = (m.body ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .trim();
    if (cleaned.length < 4) continue;
    const phrase = cleaned.split(/\s+/).slice(0, 4).join(" ");
    if (!phrase) continue;
    tally.set(phrase, (tally.get(phrase) ?? 0) + 1);
  }
  return Array.from(tally.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([q, count]) => ({ q, count }));
}

// ---------- conversations ----------

export type ConversationRow = {
  id: string;
  customer_phone: string;
  customer_name: string | null;
  last_message_at: string;
  status: "open" | "resolved" | "snoozed" | "spam";
  is_ai_active: boolean;
  unread_count: number;
  preview?: string | null;
};

export async function getConversations(
  workspaceId: string | null,
  limit = 50,
): Promise<ConversationRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("conversations")
    .select("id, customer_phone, customer_name, last_message_at, status, is_ai_active, unread_count")
    .eq("workspace_id", workspaceId)
    .order("last_message_at", { ascending: false })
    .limit(limit);
  if (res.error || !res.data) return [];

  // Attach last message preview for each conversation.
  const ids = res.data.map((c) => c.id as string);
  const previewMap = new Map<string, string>();
  if (ids.length > 0) {
    const previews = await admin
      .from("messages")
      .select("conversation_id, body, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false })
      .limit(ids.length * 3);
    if (previews.data) {
      for (const m of previews.data as {
        conversation_id: string;
        body: string;
      }[]) {
        if (!previewMap.has(m.conversation_id)) {
          previewMap.set(m.conversation_id, m.body);
        }
      }
    }
  }

  return res.data.map((row): ConversationRow => ({
    id: row.id as string,
    customer_phone: row.customer_phone as string,
    customer_name: (row.customer_name as string | null) ?? null,
    last_message_at: row.last_message_at as string,
    status: row.status as ConversationRow["status"],
    is_ai_active: row.is_ai_active as boolean,
    unread_count: (row.unread_count as number | null) ?? 0,
    preview: previewMap.get(row.id as string) ?? null,
  }));
}

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: "customer" | "ai" | "admin" | "system";
  body: string;
  created_at: string;
};

export async function getConversationMessages(
  workspaceId: string | null,
  conversationId: string,
  limit = 200,
): Promise<MessageRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("messages")
    .select("id, conversation_id, role, body, created_at")
    .eq("workspace_id", workspaceId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (res.error || !res.data) return [];
  return res.data as MessageRow[];
}

// ---------- knowledge ----------

export type KnowledgeRow = {
  id: string;
  type: "product" | "faq" | "promo" | "policy" | "misc";
  title: string;
  body: string;
  is_active: boolean;
  updated_at: string;
};

export async function getKnowledge(
  workspaceId: string | null,
): Promise<KnowledgeRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("knowledge_entries")
    .select("id, type, title, body, is_active, updated_at")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });
  if (res.error || !res.data) return [];
  return res.data as KnowledgeRow[];
}

// ---------- subscription / billing ----------

export type SubscriptionRow = {
  id: string;
  plan: "free" | "pro" | "business";
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  amount_idr: number;
  current_period_end: string | null;
};

export async function getSubscription(workspaceId: string | null): Promise<SubscriptionRow> {
  const fallback: SubscriptionRow = {
    id: "",
    plan: "free",
    status: "trialing",
    amount_idr: 0,
    current_period_end: null,
  };
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return fallback;
  const res = await admin
    .from("subscriptions")
    .select("id, plan, status, amount_idr, current_period_end")
    .eq("workspace_id", workspaceId)
    .maybeSingle();
  if (res.error || !res.data) return fallback;
  return res.data as SubscriptionRow;
}

export type PaymentRow = {
  id: string;
  order_id: string;
  amount_idr: number;
  total_amount_idr: number;
  status: "pending" | "paid" | "expired" | "failed" | "refunded";
  paid_at: string | null;
  created_at: string;
};

export async function getPayments(
  workspaceId: string | null,
  limit = 30,
): Promise<PaymentRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("payments")
    .select("id, order_id, amount_idr, total_amount_idr, status, paid_at, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (res.error || !res.data) return [];
  return res.data as PaymentRow[];
}

// ---------- team / members ----------

export type MemberRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "admin" | "agent" | "viewer";
  accepted_at: string | null;
  created_at: string;
};

export async function getWorkspaceMembers(
  workspaceId: string | null,
): Promise<MemberRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("workspace_members")
    .select("user_id, role, accepted_at, created_at, profiles:user_id(email, full_name)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });
  if (res.error || !res.data) return [];
  return res.data.map((row): MemberRow => {
    const p = row.profiles as
      | { email: string; full_name: string | null }
      | { email: string; full_name: string | null }[]
      | null;
    const profile = Array.isArray(p) ? p[0] : p;
    return {
      user_id: row.user_id as string,
      email: profile?.email ?? "—",
      full_name: profile?.full_name ?? null,
      role: row.role as MemberRow["role"],
      accepted_at: (row.accepted_at as string | null) ?? null,
      created_at: row.created_at as string,
    };
  });
}

// ---------- audit ----------

export type AuditRow = {
  id: number;
  action: string;
  actor_email: string | null;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function getAuditLogs(
  workspaceId: string | null,
  limit = 30,
): Promise<AuditRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return [];
  const res = await admin
    .from("audit_logs")
    .select("id, action, actor_email, target_type, target_id, metadata, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (res.error || !res.data) return [];
  return res.data as AuditRow[];
}

// ---------- workspace settings ----------

export type WorkspaceSettings = {
  id: string;
  name: string;
  store_name: string | null;
  primary_locale: string;
  ai_persona: {
    tone?: string;
    greeting?: string;
    language?: string;
    name?: string;
    system_prompt?: string;
    handover_keywords?: string;
  };
};

export async function getWorkspaceSettings(
  workspaceId: string | null,
): Promise<WorkspaceSettings | null> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return null;
  const res = await admin
    .from("workspaces")
    .select("id, name, store_name, primary_locale, ai_persona")
    .eq("id", workspaceId)
    .maybeSingle();
  if (res.error || !res.data) return null;
  return res.data as WorkspaceSettings;
}

// ---------- super admin ----------

export type PlatformStats = {
  workspacesTotal: number;
  usersTotal: number;
  paidWorkspaces: number;
  mrrIdr: number;
  messagesLast7d: number;
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const fallback: PlatformStats = {
    workspacesTotal: 0,
    usersTotal: 0,
    paidWorkspaces: 0,
    mrrIdr: 0,
    messagesLast7d: 0,
  };
  const admin = getSupabaseAdmin();
  if (!admin) return fallback;
  const since = new Date(Date.now() - 7 * 86400_000).toISOString();
  const [ws, users, paid, msgs, subs] = await Promise.all([
    admin.from("workspaces").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .neq("plan", "free")
      .eq("status", "active"),
    admin
      .from("messages")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    admin.from("subscriptions").select("amount_idr").eq("status", "active"),
  ]);
  const mrr = (subs.data ?? []).reduce(
    (sum: number, r: { amount_idr?: number | null }) => sum + (r.amount_idr ?? 0),
    0,
  );
  return {
    workspacesTotal: ws.count ?? 0,
    usersTotal: users.count ?? 0,
    paidWorkspaces: paid.count ?? 0,
    mrrIdr: mrr,
    messagesLast7d: msgs.count ?? 0,
  };
}

export type WorkspaceListRow = {
  id: string;
  name: string;
  slug: string;
  owner_email: string | null;
  plan: "free" | "pro" | "business";
  is_suspended: boolean;
  created_at: string;
};

export async function getAllWorkspaces(limit = 50): Promise<WorkspaceListRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const res = await admin
    .from("workspaces")
    .select(`
      id, name, slug, is_suspended, created_at,
      owner:owner_id(email),
      subscriptions(plan)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (res.error || !res.data) return [];
  return res.data.map((row): WorkspaceListRow => {
    const owner = (row as unknown as { owner: { email: string } | { email: string }[] | null }).owner;
    const subs = (row as unknown as { subscriptions: { plan: string }[] | null }).subscriptions;
    const subList = Array.isArray(subs) ? subs : [];
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      owner_email: Array.isArray(owner) ? owner[0]?.email ?? null : owner?.email ?? null,
      plan: ((subList[0]?.plan as WorkspaceListRow["plan"]) ?? "free"),
      is_suspended: row.is_suspended as boolean,
      created_at: row.created_at as string,
    };
  });
}

export type AllUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  platform_role: "user" | "super_admin";
  is_banned: boolean;
  last_login_at: string | null;
  created_at: string;
};

export async function getAllUsers(limit = 100): Promise<AllUserRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const res = await admin
    .from("profiles")
    .select("id, email, full_name, platform_role, is_banned, last_login_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (res.error || !res.data) return [];
  return res.data as AllUserRow[];
}
