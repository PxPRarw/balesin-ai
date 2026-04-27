import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendWAMessage } from "@/lib/whatsapp/baileys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as {
    conversationId?: string;
    text?: string;
  } | null;
  const conversationId = body?.conversationId;
  const text = body?.text?.trim();
  if (!conversationId || !text)
    return NextResponse.json({ error: "Missing conversationId or text" }, { status: 400 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  // Look up the conversation to get the customer phone (jid).
  const conv = await admin
    .from("conversations")
    .select("id, customer_phone, is_ai_active")
    .eq("workspace_id", wsId)
    .eq("id", conversationId)
    .maybeSingle();
  if (conv.error || !conv.data) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const phone = (conv.data.customer_phone as string).replace(/\D+/g, "");
  const jid = `${phone}@s.whatsapp.net`;

  const result = await sendWAMessage(wsId, jid, text);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "send failed" },
      { status: 502 },
    );
  }

  // Persist as admin message.
  await admin.from("messages").insert({
    workspace_id: wsId,
    conversation_id: conversationId,
    role: "admin",
    body: text,
    meta: { sender_id: session.userId, sender_email: session.email },
  });

  await admin
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return NextResponse.json({ ok: true });
}
