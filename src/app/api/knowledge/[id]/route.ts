import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["product", "faq", "promo", "policy", "misc"]);

type Params = { id: string };

export async function PATCH(req: NextRequest, ctx: { params: Promise<Params> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as {
    type?: string;
    title?: string;
    body?: string;
    is_active?: boolean;
  } | null;
  if (!body) return NextResponse.json({ error: "Empty body" }, { status: 400 });
  if (body.type && !ALLOWED_TYPES.has(body.type))
    return NextResponse.json({ error: "invalid type" }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.type) update.type = body.type;
  if (typeof body.title === "string") update.title = body.title.trim();
  if (typeof body.body === "string") update.body = body.body.trim();
  if (typeof body.is_active === "boolean") update.is_active = body.is_active;

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const res = await admin
    .from("knowledge_entries")
    .update(update)
    .eq("id", id)
    .eq("workspace_id", wsId)
    .select("id, type, title, body, is_active, updated_at")
    .single();
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ entry: res.data });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<Params> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  const res = await admin
    .from("knowledge_entries")
    .delete()
    .eq("id", id)
    .eq("workspace_id", wsId);
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
