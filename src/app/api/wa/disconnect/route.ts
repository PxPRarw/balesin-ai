import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { stopWASession } from "@/lib/whatsapp/baileys";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });
  await stopWASession(wsId);
  const admin = getSupabaseAdmin();
  if (admin) {
    await admin
      .from("wa_connections")
      .upsert(
        {
          workspace_id: wsId,
          status: "disconnected",
          display_phone: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id" },
      )
      .then(() => null, () => null);
  }
  return NextResponse.json({ ok: true });
}
