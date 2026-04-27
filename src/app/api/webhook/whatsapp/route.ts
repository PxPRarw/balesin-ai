import { NextResponse } from "next/server";
import {
  parseIncomingMessage,
  sendWhatsAppText,
  type WACloudConfig,
} from "@/lib/whatsapp/cloud-api";
import { generateReply, type ChatMessage } from "@/lib/ai/openai";
import { buildDemoSystemPrompt } from "@/lib/ai/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Meta calls this endpoint with `?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`
 * during webhook verification. Echo the challenge back if the token matches.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

/**
 * Inbound message handler. We parse the WhatsApp Cloud API payload, ask the AI
 * to draft a reply, and send the reply back through the same Cloud API.
 *
 * In production this also persists the conversation in Supabase so the user
 * can see it in their Inbox dashboard.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = parseIncomingMessage(body);
  if (!incoming) {
    return NextResponse.json({ ok: true, reason: "non-text or status update" });
  }

  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const accessToken = process.env.WA_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) {
    console.warn("[wa webhook] received message but WA env vars not set");
    return NextResponse.json({ ok: true, queued: true });
  }

  const cfg: WACloudConfig = { phoneNumberId, accessToken };
  const isEnglish = !/[a-zA-Z]/.test(incoming.text)
    ? false
    : /\b(the|how|what|hi|hello|please|thanks)\b/i.test(incoming.text);
  const locale: "id" | "en" = isEnglish ? "en" : "id";

  const messages: ChatMessage[] = [
    { role: "system", content: buildDemoSystemPrompt(locale) },
    { role: "user", content: incoming.text },
  ];

  try {
    const reply = await generateReply(messages, { temperature: 0.6, maxTokens: 320 });
    await sendWhatsAppText(cfg, incoming.from, reply);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[wa webhook] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to handle message" },
      { status: 500 },
    );
  }
}
