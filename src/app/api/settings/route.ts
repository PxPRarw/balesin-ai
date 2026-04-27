import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    store_name?: string;
    primary_locale?: string;
    ai_persona?: {
      name?: string;
      tone?: string;
      greeting?: string;
      language?: string;
      system_prompt?: string;
      handover_keywords?: string;
    };
  } | null;
  if (!body) return NextResponse.json({ error: "Empty body" }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.name === "string") update.name = body.name.trim();
  if (typeof body.store_name === "string") update.store_name = body.store_name.trim();
  if (typeof body.primary_locale === "string")
    update.primary_locale = body.primary_locale;
  if (body.ai_persona && typeof body.ai_persona === "object")
    update.ai_persona = body.ai_persona;

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const res = await admin
    .from("workspaces")
    .update(update)
    .eq("id", wsId)
    .select("id, name, store_name, primary_locale, ai_persona")
    .single();
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ workspace: res.data });
}
