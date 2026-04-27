import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { startWASession } from "@/lib/whatsapp/baileys";
import { handleIncomingWA } from "@/lib/whatsapp/auto-reply";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const result = await startWASession(wsId, handleIncomingWA);

  // Best-effort: mark wa_connections row.
  const admin = getSupabaseAdmin();
  if (admin) {
    const status = result.state === "qr" ? "pending" : result.state;
    await admin
      .from("wa_connections")
      .upsert(
        {
          workspace_id: wsId,
          status,
          display_phone: result.phoneNumber,
          connected_at: result.state === "connected" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id" },
      )
      .then(() => null, () => null);
  }

  return NextResponse.json(result);
}
