import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["product", "faq", "promo", "policy", "misc"]);

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as {
    type?: string;
    title?: string;
    body?: string;
    is_active?: boolean;
  } | null;
  const type = body?.type ?? "misc";
  const title = body?.title?.trim();
  const content = body?.body?.trim();
  if (!title || !content)
    return NextResponse.json({ error: "title & body required" }, { status: 400 });
  if (!ALLOWED_TYPES.has(type))
    return NextResponse.json({ error: "invalid type" }, { status: 400 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const res = await admin
    .from("knowledge_entries")
    .insert({
      workspace_id: wsId,
      type,
      title,
      body: content,
      is_active: body?.is_active ?? true,
      created_by: session.userId,
    })
    .select("id, type, title, body, is_active, updated_at")
    .single();
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ entry: res.data });
}
