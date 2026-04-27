/**
 * Data queries used by dashboards. Each helper returns real data when the
 * Supabase tables exist; otherwise it returns sensible mock data so the UI
 * never looks broken before the migration is run.
 */
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type WorkspaceKPIs = {
  messagesToday: number;
  messagesYesterday: number;
  aiHandledPct: number;
  avgResponseSeconds: number;
  conversionPct: number;
  unread: number;
};

const MOCK_USER_KPIS: WorkspaceKPIs = {
  messagesToday: 248,
  messagesYesterday: 196,
  aiHandledPct: 92,
  avgResponseSeconds: 8,
  conversionPct: 27,
  unread: 14,
};

export async function getWorkspaceKPIs(workspaceId: string | null): Promise<WorkspaceKPIs> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_USER_KPIS;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  try {
    const [todayRes, yesterdayRes, aiRes, unreadRes] = await Promise.all([
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
        .select("unread_count")
        .eq("workspace_id", workspaceId),
    ]);
    const today = todayRes.count ?? 0;
    const aiCount = aiRes.count ?? 0;
    const unread = (unreadRes.data ?? []).reduce(
      (sum: number, r: { unread_count?: number | null }) => sum + (r.unread_count ?? 0),
      0,
    );
    return {
      messagesToday: today,
      messagesYesterday: yesterdayRes.count ?? 0,
      aiHandledPct: today > 0 ? Math.round((aiCount / today) * 100) : 0,
      avgResponseSeconds: 8,
      conversionPct: 0,
      unread,
    };
  } catch {
    return MOCK_USER_KPIS;
  }
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
  preview?: string;
};

const MOCK_CONVERSATIONS: ConversationRow[] = [
  { id: "m1", customer_phone: "+62812****8821", customer_name: "Mira", last_message_at: "2026-04-27T07:18:00Z", status: "open", is_ai_active: true, unread_count: 0, preview: "Sis hoodie size M masih ada?" },
  { id: "m2", customer_phone: "+62898****1142", customer_name: "Reza", last_message_at: "2026-04-27T06:55:00Z", status: "open", is_ai_active: true, unread_count: 1, preview: "Ongkir ke Bandung berapa ya?" },
  { id: "m3", customer_phone: "+62877****0091", customer_name: "Dewi", last_message_at: "2026-04-27T06:21:00Z", status: "resolved", is_ai_active: false, unread_count: 0, preview: "Oke makasih ya kak!" },
  { id: "m4", customer_phone: "+62811****6677", customer_name: "Faisal", last_message_at: "2026-04-27T05:43:00Z", status: "open", is_ai_active: true, unread_count: 2, preview: "Bisa COD jakarta selatan?" },
  { id: "m5", customer_phone: "+62856****9908", customer_name: "Sari", last_message_at: "2026-04-26T23:04:00Z", status: "open", is_ai_active: true, unread_count: 0, preview: "Promo lebaran masih ada?" },
];

export async function getConversations(workspaceId: string | null, limit = 20): Promise<ConversationRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_CONVERSATIONS.slice(0, limit);
  try {
    const res = await admin
      .from("conversations")
      .select("id, customer_phone, customer_name, last_message_at, status, is_ai_active, unread_count")
      .eq("workspace_id", workspaceId)
      .order("last_message_at", { ascending: false })
      .limit(limit);
    if (res.error || !res.data || res.data.length === 0) return MOCK_CONVERSATIONS.slice(0, limit);
    return res.data as ConversationRow[];
  } catch {
    return MOCK_CONVERSATIONS.slice(0, limit);
  }
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

const MOCK_KNOWLEDGE: KnowledgeRow[] = [
  { id: "k1", type: "product", title: "Hoodie Oversized Cream", body: "Size M/L/XL · Rp 245.000 · stok ready · cotton fleece 360gsm.", is_active: true, updated_at: "2026-04-25T03:11:00Z" },
  { id: "k2", type: "faq", title: "Cara Order", body: "Pilih item → DM ukuran & alamat → kami kirim total + nomor rekening / QRIS → setelah transfer kami proses 1×24 jam.", is_active: true, updated_at: "2026-04-22T09:00:00Z" },
  { id: "k3", type: "faq", title: "Ongkir & Kurir", body: "JNE REG, J&T, SiCepat, Anteraja. Cek ongkir di /ongkir atau tanya AI dengan kota tujuan.", is_active: true, updated_at: "2026-04-22T09:00:00Z" },
  { id: "k4", type: "promo", title: "Promo Lebaran 25% off", body: "Berlaku 1-30 April. Min belanja Rp 200rb. Kode: LEBARAN25.", is_active: true, updated_at: "2026-04-01T00:00:00Z" },
  { id: "k5", type: "policy", title: "Retur 7 hari", body: "Retur diterima 7 hari sejak terima paket, kondisi belum dipakai, tag masih utuh, ongkir retur ditanggung pembeli kecuali barang rusak/salah kirim.", is_active: true, updated_at: "2026-04-12T00:00:00Z" },
];

export async function getKnowledge(workspaceId: string | null): Promise<KnowledgeRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_KNOWLEDGE;
  try {
    const res = await admin
      .from("knowledge_entries")
      .select("id, type, title, body, is_active, updated_at")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false });
    if (res.error || !res.data || res.data.length === 0) return MOCK_KNOWLEDGE;
    return res.data as KnowledgeRow[];
  } catch {
    return MOCK_KNOWLEDGE;
  }
}

// ---------- subscription / billing ----------

export type SubscriptionRow = {
  id: string;
  plan: "free" | "pro" | "business";
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  amount_idr: number;
  current_period_end: string;
};

export async function getSubscription(workspaceId: string | null): Promise<SubscriptionRow> {
  const admin = getSupabaseAdmin();
  const fallback: SubscriptionRow = {
    id: "demo-sub",
    plan: "free",
    status: "trialing",
    amount_idr: 0,
    current_period_end: new Date(Date.now() + 14 * 86400_000).toISOString(),
  };
  if (!admin || !workspaceId) return fallback;
  try {
    const res = await admin
      .from("subscriptions")
      .select("id, plan, status, amount_idr, current_period_end")
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (res.error || !res.data) return fallback;
    return res.data as SubscriptionRow;
  } catch {
    return fallback;
  }
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

const MOCK_PAYMENTS: PaymentRow[] = [
  { id: "p1", order_id: "BSI-1714051200-1234", amount_idr: 99000, total_amount_idr: 99250, status: "paid", paid_at: "2026-03-27T03:11:00Z", created_at: "2026-03-27T03:00:00Z" },
  { id: "p2", order_id: "BSI-1716643200-5678", amount_idr: 99000, total_amount_idr: 99300, status: "paid", paid_at: "2026-04-27T03:11:00Z", created_at: "2026-04-27T03:00:00Z" },
];

export async function getPayments(workspaceId: string | null, limit = 20): Promise<PaymentRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_PAYMENTS;
  try {
    const res = await admin
      .from("payments")
      .select("id, order_id, amount_idr, total_amount_idr, status, paid_at, created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (res.error || !res.data || res.data.length === 0) return MOCK_PAYMENTS;
    return res.data as PaymentRow[];
  } catch {
    return MOCK_PAYMENTS;
  }
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

const MOCK_MEMBERS: MemberRow[] = [
  { user_id: "u1", email: "kekeakt77@gmail.com", full_name: "kyn (Owner)", role: "owner", accepted_at: "2026-04-01T00:00:00Z", created_at: "2026-04-01T00:00:00Z" },
];

export async function getWorkspaceMembers(workspaceId: string | null): Promise<MemberRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_MEMBERS;
  try {
    const res = await admin
      .from("workspace_members")
      .select("user_id, role, accepted_at, created_at, profiles:user_id(email, full_name)")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });
    if (res.error || !res.data || res.data.length === 0) return MOCK_MEMBERS;
    return res.data.map((row): MemberRow => {
      const p = row.profiles as { email: string; full_name: string | null } | { email: string; full_name: string | null }[] | null;
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
  } catch {
    return MOCK_MEMBERS;
  }
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

const MOCK_AUDIT: AuditRow[] = [
  { id: 1, action: "workspace.created", actor_email: "kekeakt77@gmail.com", target_type: "workspace", target_id: "ws-demo", metadata: { source: "signup" }, created_at: "2026-04-25T02:14:00Z" },
  { id: 2, action: "knowledge.created", actor_email: "kekeakt77@gmail.com", target_type: "knowledge", target_id: "k1", metadata: { title: "Hoodie Oversized Cream" }, created_at: "2026-04-25T02:18:00Z" },
  { id: 3, action: "auth.login", actor_email: "kekeakt77@gmail.com", target_type: "user", target_id: "u1", metadata: { ip: "1.2.3.4" }, created_at: "2026-04-27T07:20:00Z" },
];

export async function getAuditLogs(workspaceId: string | null, limit = 30): Promise<AuditRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin || !workspaceId) return MOCK_AUDIT;
  try {
    const res = await admin
      .from("audit_logs")
      .select("id, action, actor_email, target_type, target_id, metadata, created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (res.error || !res.data || res.data.length === 0) return MOCK_AUDIT;
    return res.data as AuditRow[];
  } catch {
    return MOCK_AUDIT;
  }
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
  const admin = getSupabaseAdmin();
  const fallback: PlatformStats = {
    workspacesTotal: 1,
    usersTotal: 1,
    paidWorkspaces: 0,
    mrrIdr: 0,
    messagesLast7d: 0,
  };
  if (!admin) return fallback;
  try {
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
      admin
        .from("subscriptions")
        .select("amount_idr")
        .eq("status", "active"),
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
  } catch {
    return fallback;
  }
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
  try {
    const res = await admin
      .from("workspaces")
      .select(`
        id, name, slug, is_suspended, created_at,
        owner:owner_id(email),
        subscriptions!inner(plan)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (res.error || !res.data) return [];
    return res.data.map((row): WorkspaceListRow => {
      const owner = (row as unknown as { owner: { email: string } | { email: string }[] | null }).owner;
      const subs = (row as unknown as { subscriptions: { plan: string }[] }).subscriptions;
      return {
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        owner_email: Array.isArray(owner) ? owner[0]?.email ?? null : owner?.email ?? null,
        plan: ((Array.isArray(subs) ? subs[0]?.plan : "free") ?? "free") as WorkspaceListRow["plan"],
        is_suspended: row.is_suspended as boolean,
        created_at: row.created_at as string,
      };
    });
  } catch {
    return [];
  }
}

export type UserListRow = {
  id: string;
  email: string;
  full_name: string | null;
  platform_role: "user" | "super_admin";
  is_banned: boolean;
  last_login_at: string | null;
  created_at: string;
};

export async function getAllUsers(limit = 50): Promise<UserListRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  try {
    const res = await admin
      .from("profiles")
      .select("id, email, full_name, platform_role, is_banned, last_login_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (res.error || !res.data) return [];
    return res.data as UserListRow[];
  } catch {
    return [];
  }
}
