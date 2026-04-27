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

async function getKnowledgeContext(workspaceId: string): Promise<{
  storeName: string | null;
  entries: Array<{ title: string | null; content: string | null }>;
}> {
  const admin = getSupabaseAdmin();
  if (!admin) return { storeName: null, entries: [] };

  const [{ data: ws }, { data: entries }] = await Promise.all([
    admin.from("workspaces").select("name").eq("id", workspaceId).maybeSingle(),
    admin
      .from("knowledge_entries")
      .select("title, content")
      .eq("workspace_id", workspaceId)
      .limit(40),
  ]);

  return {
    storeName: (ws as { name: string } | null)?.name ?? null,
    entries: (entries ?? []) as Array<{ title: string | null; content: string | null }>,
  };
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
): Promise<string> {
  const ai = getOpenAI();
  const { storeName, entries } = await getKnowledgeContext(workspaceId);

  // No OpenAI key — heuristic substring fallback.
  if (!ai) {
    const lower = incoming.toLowerCase();
    const ranked = entries
      .map((row) => {
        const haystack = `${row.title ?? ""} ${row.content ?? ""}`.toLowerCase();
        const tokens = lower.split(/\s+/).filter((t) => t.length >= 3);
        let score = 0;
        for (const t of tokens) if (haystack.includes(t)) score++;
        return { row, score };
      })
      .sort((a, b) => b.score - a.score);
    if (ranked[0]?.score && ranked[0].score >= 1) {
      const { title, content } = ranked[0].row;
      return `${content ?? title}\n\n— dibalas otomatis oleh BalesinAI`;
    }
    return FALLBACK_REPLY;
  }

  const knowledge = entries
    .map((e, i) => `${i + 1}. ${e.title ?? "(tanpa judul)"}\n${e.content ?? ""}`)
    .join("\n\n")
    .slice(0, 6000);

  const systemPrompt = `Kamu adalah asisten customer service untuk toko "${storeName ?? "BalesinAI"}". 
Tone: ramah, kasual, friendly khas seller olshop Indonesia. Pakai bahasa Indonesia yang natural (boleh "kak", "kakak", "min", "sis"), bukan formal kaku. 
Jangan janji yang tidak ada di knowledge. Kalau ditanya hal di luar knowledge, bilang "nanti dicek admin ya kak" — jangan ngarang.
Reply singkat (max 3 kalimat) dan to-the-point.

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
    return text && text.length > 0 ? text : FALLBACK_REPLY;
  } catch (e) {
    console.error("OpenAI auto-reply failed:", e instanceof Error ? e.message : e);
    return FALLBACK_REPLY;
  }
}

/** Persist incoming message + outgoing reply to DB. */
async function persistConversation(
  msg: IncomingMessage,
  replyText: string | null,
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  // Find or create conversation by (workspace_id, customer_phone).
  const customerPhone = msg.fromNumber;
  const { data: existing } = await admin
    .from("conversations")
    .select("id")
    .eq("workspace_id", msg.workspaceId)
    .eq("customer_phone", customerPhone)
    .maybeSingle();

  let convoId: string | null = existing?.id ?? null;
  if (!convoId) {
    const { data: created } = await admin
      .from("conversations")
      .insert({
        workspace_id: msg.workspaceId,
        customer_phone: customerPhone,
        customer_name: msg.pushName ?? customerPhone,
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    convoId = created?.id ?? null;
  } else {
    await admin
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", convoId);
  }
  if (!convoId) return;

  await admin.from("messages").insert([
    {
      workspace_id: msg.workspaceId,
      conversation_id: convoId,
      role: "customer",
      body: msg.text,
      wa_message_id: msg.messageId,
      created_at: new Date(msg.timestamp * 1000).toISOString(),
    },
    ...(replyText
      ? [
          {
            workspace_id: msg.workspaceId,
            conversation_id: convoId,
            role: "ai",
            body: replyText,
            created_at: new Date().toISOString(),
          },
        ]
      : []),
  ]);
}

export async function handleIncomingWA(msg: IncomingMessage): Promise<void> {
  const reply = await generateReply(msg.workspaceId, msg.text, msg.pushName);
  await persistConversation(msg, reply);
  if (reply) {
    await sendWAMessage(msg.workspaceId, msg.fromJid, reply);
  }
}
