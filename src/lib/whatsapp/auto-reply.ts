import OpenAI from "openai";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  sendWAMessage,
  type IncomingMessage,
} from "./baileys";

let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (openaiClient) return openaiClient;
  if (!process.env.OPENAI_API_KEY) return null;
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

const FALLBACK_REPLY =
  "Hai 👋 makasih udah chat ya. Admin lagi sibuk, balesin bentar lagi. Kalau soal harga, stok, atau pengiriman, tulis langsung pertanyaannya biar dibantu cepat.\n\n— BalesinAI";

type Persona = {
  name?: string;
  tone?: string;
  greeting?: string;
  language?: string;
  system_prompt?: string;
  handover_keywords?: string;
};

async function getKnowledgeContext(workspaceId: string): Promise<{
  storeName: string | null;
  persona: Persona;
  entries: Array<{ title: string | null; body: string | null; type?: string | null }>;
}> {
  const admin = getSupabaseAdmin();
  if (!admin) return { storeName: null, persona: {}, entries: [] };

  const [{ data: ws }, { data: entries }] = await Promise.all([
    admin
      .from("workspaces")
      .select("name, store_name, ai_persona")
      .eq("id", workspaceId)
      .maybeSingle(),
    admin
      .from("knowledge_entries")
      .select("title, body, type")
      .eq("workspace_id", workspaceId)
      .eq("is_active", true)
      .limit(40),
  ]);

  const wsRow = ws as { name: string; store_name: string | null; ai_persona: Persona | null } | null;
  return {
    storeName: wsRow?.store_name ?? wsRow?.name ?? null,
    persona: wsRow?.ai_persona ?? {},
    entries: (entries ?? []) as Array<{ title: string | null; body: string | null; type?: string | null }>,
  };
}

function shouldHandover(persona: Persona, incoming: string): boolean {
  const raw = persona.handover_keywords;
  if (!raw) return false;
  const kws = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (kws.length === 0) return false;
  const lower = incoming.toLowerCase();
  return kws.some((k) => lower.includes(k));
}

/**
 * Generate a reply using OpenAI gpt-4o-mini grounded on the workspace's
 * knowledge base. Falls back to a generic message when OPENAI_API_KEY is
 * not configured or the call fails.
 */
async function generateReply(
  workspaceId: string,
  incoming: string,
  customerName?: string,
): Promise<{ text: string; handover: boolean }> {
  const ai = getOpenAI();
  const { storeName, persona, entries } = await getKnowledgeContext(workspaceId);
  const handover = shouldHandover(persona, incoming);
  if (handover) {
    return {
      text: `Halo${customerName ? ` kak ${customerName}` : " kak"}, sebentar ya — admin akan langsung bantu kamu di sini. 🙏\n\n— ${storeName ?? "Toko"}`,
      handover: true,
    };
  }

  // No OpenAI key — heuristic substring fallback.
  if (!ai) {
    const lower = incoming.toLowerCase();
    const ranked = entries
      .map((row) => {
        const haystack = `${row.title ?? ""} ${row.body ?? ""}`.toLowerCase();
        const tokens = lower.split(/\s+/).filter((t) => t.length >= 3);
        let score = 0;
        for (const t of tokens) if (haystack.includes(t)) score++;
        return { row, score };
      })
      .sort((a, b) => b.score - a.score);
    if (ranked[0]?.score && ranked[0].score >= 1) {
      const { title, body } = ranked[0].row;
      return {
        text: `${body ?? title}\n\n— dibalas otomatis oleh BalesinAI`,
        handover: false,
      };
    }
    return { text: FALLBACK_REPLY, handover: false };
  }

  const knowledge = entries
    .map(
      (e, i) =>
        `${i + 1}. [${e.type ?? "misc"}] ${e.title ?? "(tanpa judul)"}\n${e.body ?? ""}`,
    )
    .join("\n\n")
    .slice(0, 6000);

  const toneHint =
    persona.tone === "formal"
      ? "Tone: formal sopan, gunakan 'Anda'."
      : persona.tone === "genz"
        ? "Tone: gaul Jaksel, casual, slang Indo natural (anjir, gaspol jangan, max 1 emoji)."
        : "Tone: ramah & kasual khas seller olshop Indo (boleh 'kak', 'sis', 'min').";

  const aiName = persona.name?.trim() || storeName || "BalesinAI";
  const greetingHint = persona.greeting ? `Sapaan default: "${persona.greeting}".` : "";
  const extraSystem = persona.system_prompt?.trim()
    ? `\nInstruksi tambahan dari pemilik toko:\n${persona.system_prompt.trim()}`
    : "";

  const systemPrompt = `Kamu adalah ${aiName}, asisten customer service untuk toko "${storeName ?? "BalesinAI"}".
${toneHint} Pakai bahasa Indonesia natural, bukan formal kaku. ${greetingHint}
Jangan janji yang tidak ada di knowledge. Kalau ditanya hal di luar knowledge, bilang "nanti dicek admin ya kak" — jangan ngarang.
Reply singkat (max 3 kalimat) dan to-the-point.${extraSystem}

Knowledge base toko (gunakan ini sebagai sumber jawaban):
${knowledge || "(belum ada knowledge base — jawab seramah mungkin & redirect ke admin manusia)"}

Tanda tangan reply: tutup dengan "— ${storeName ?? "Toko"} 🤖" di baris baru terakhir.`;

  try {
    const completion = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 280,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: customerName
            ? `Customer (${customerName}): ${incoming}`
            : `Customer: ${incoming}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return {
      text: text && text.length > 0 ? text : FALLBACK_REPLY,
      handover: false,
    };
  } catch (e) {
    console.error("OpenAI auto-reply failed:", e instanceof Error ? e.message : e);
    return { text: FALLBACK_REPLY, handover: false };
  }
}

/** Persist incoming message + outgoing reply to DB. */
async function persistConversation(
  msg: IncomingMessage,
  replyText: string | null,
  handover: boolean,
): Promise<{ conversationId: string | null; aiPaused: boolean }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { conversationId: null, aiPaused: false };

  // Find or create conversation by (workspace_id, customer_phone).
  const customerPhone = msg.fromNumber;
  const { data: existing } = await admin
    .from("conversations")
    .select("id, is_ai_active, unread_count")
    .eq("workspace_id", msg.workspaceId)
    .eq("customer_phone", customerPhone)
    .maybeSingle();

  let convoId: string | null = (existing?.id as string | undefined) ?? null;
  let aiActive = (existing?.is_ai_active as boolean | undefined) ?? true;
  const prevUnread = (existing?.unread_count as number | undefined) ?? 0;

  if (!convoId) {
    const { data: created } = await admin
      .from("conversations")
      .insert({
        workspace_id: msg.workspaceId,
        customer_phone: customerPhone,
        customer_name: msg.pushName ?? customerPhone,
        last_message_at: new Date().toISOString(),
        unread_count: 1,
        is_ai_active: !handover,
      })
      .select("id, is_ai_active")
      .single();
    convoId = (created?.id as string | undefined) ?? null;
    aiActive = (created?.is_ai_active as boolean | undefined) ?? true;
  } else {
    const update: Record<string, unknown> = {
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_count: prevUnread + 1,
    };
    if (handover) {
      update.is_ai_active = false;
      aiActive = false;
    }
    await admin.from("conversations").update(update).eq("id", convoId);
  }
  if (!convoId) return { conversationId: null, aiPaused: !aiActive };

  const inserts: Record<string, unknown>[] = [
    {
      workspace_id: msg.workspaceId,
      conversation_id: convoId,
      role: "customer",
      body: msg.text,
      wa_message_id: msg.messageId,
      created_at: new Date(msg.timestamp * 1000).toISOString(),
    },
  ];
  if (replyText && aiActive) {
    inserts.push({
      workspace_id: msg.workspaceId,
      conversation_id: convoId,
      role: "ai",
      body: replyText,
      created_at: new Date().toISOString(),
    });
  } else if (replyText && handover) {
    inserts.push({
      workspace_id: msg.workspaceId,
      conversation_id: convoId,
      role: "system",
      body: replyText,
      meta: { handover: true },
      created_at: new Date().toISOString(),
    });
  }

  await admin.from("messages").insert(inserts);
  return { conversationId: convoId, aiPaused: !aiActive };
}

export async function handleIncomingWA(msg: IncomingMessage): Promise<void> {
  const { text: reply, handover } = await generateReply(
    msg.workspaceId,
    msg.text,
    msg.pushName,
  );
  const { aiPaused } = await persistConversation(msg, reply, handover);
  // Only auto-send when AI is active for this conversation. If admin manually
  // paused or handover keyword triggered, skip auto-reply (admin will respond).
  if (handover) {
    // still send the courteous "admin akan bantu" handover text once
    await sendWAMessage(msg.workspaceId, msg.fromJid, reply).catch(() => null);
    return;
  }
  if (!aiPaused) {
    await sendWAMessage(msg.workspaceId, msg.fromJid, reply).catch(() => null);
  }
}
