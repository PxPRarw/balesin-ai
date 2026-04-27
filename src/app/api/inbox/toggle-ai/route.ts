import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as {
    conversationId?: string;
    isAiActive?: boolean;
  } | null;
  if (!body?.conversationId || typeof body.isAiActive !== "boolean") {
    return NextResponse.json({ error: "Missing conversationId/isAiActive" }, { status: 400 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const res = await admin
    .from("conversations")
    .update({ is_ai_active: body.isAiActive, updated_at: new Date().toISOString() })
    .eq("id", body.conversationId)
    .eq("workspace_id", wsId);
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
