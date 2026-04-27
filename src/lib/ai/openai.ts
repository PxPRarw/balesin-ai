import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateReply(
  messages: ChatMessage[],
  opts?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<string> {
  const client = getOpenAI();
  if (!client) {
    return fallbackReply(messages);
  }

  const completion = await client.chat.completions.create({
    model: opts?.model ?? DEFAULT_MODEL,
    messages,
    temperature: opts?.temperature ?? 0.6,
    max_tokens: opts?.maxTokens ?? 320,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    fallbackReply(messages)
  );
}

/**
 * Heuristic fallback used when no OPENAI_API_KEY is configured (e.g. in
 * preview deployments). Keeps the demo functional with realistic-looking
 * answers — but is intentionally simple so we make sure the real AI is wired up
 * when the key is available.
 */
function fallbackReply(messages: ChatMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const q = last.toLowerCase();
  const isEN = /[a-z]/.test(last) && !/(kak|gan|kk|gimana|ya|sih|ga|nggak)/i.test(last);

  if (/(hoodie|jaket|jacket)/.test(q)) {
    return isEN
      ? "Hi! Yes, our Classic Black Hoodie is in stock — 7 pcs left in size L, Rp 285,000. Free shipping in Jakarta today ✨ Want me to help you order?"
      : "Halo kak! Hoodie Classic Black masih ready, ukuran L sisa 7 pcs ya, harga Rp 285.000. Free ongkir Jabodetabek hari ini ✨ Mau dipesankan?";
  }
  if (/(harga|price)/.test(q)) {
    return isEN
      ? "Hoodie Rp 285k, Soft Knit Tee Rp 165k, Cargo Pants Rp 320k. Which one are you eyeing? 🛍️"
      : "Hoodie Rp 285rb, Soft Knit Tee Rp 165rb, Cargo Pants Rp 320rb kak. Yang mana yang lagi diliat? 🛍️";
  }
  if (/(kirim|ship|jne|surabaya|bandung|kota)/.test(q)) {
    return isEN
      ? "We use JNE/J&T/SiCepat — typically 1–4 working days depending on your city. COD also available with a Rp 5,000 admin fee."
      : "Kami pakai JNE/J&T/SiCepat ya kak, estimasi 1–4 hari kerja tergantung kota. COD juga bisa, biaya admin Rp 5.000.";
  }
  if (/(cod|bayar|payment|transfer)/.test(q)) {
    return isEN
      ? "We accept transfer (BCA/Mandiri/BRI/BNI), QRIS, GoPay/OVO/Dana/ShopeePay, credit card, and COD. Which works best for you?"
      : "Bisa transfer (BCA/Mandiri/BRI/BNI), QRIS, GoPay/OVO/Dana/ShopeePay, kartu kredit, dan COD juga ada kak. Enak yang mana?";
  }
  if (/(diskon|promo|discount|kode|code)/.test(q)) {
    return isEN
      ? "Use code NEWBIE10 for 10% off your first order (min. Rp 150,000). Orders above Rp 500,000 also get a free tote bag 🎁"
      : "Pakai kode NEWBIE10 buat 10% off di order pertama (min. Rp 150rb) ya kak. Order di atas Rp 500rb juga dapet free tote bag 🎁";
  }
  if (/(retur|return|refund)/.test(q)) {
    return isEN
      ? "We accept returns within 7 days for production defects, and we cover the return shipping. Just send a photo and we'll help right away."
      : "Bisa retur dalam 7 hari kak, kalau ada cacat produksi, ongkir retur kami yang tanggung. Kirim foto aja, langsung kami bantu.";
  }
  return isEN
    ? "Hi there 👋 Happy to help! Are you asking about a product, shipping, or payment?"
    : "Halo kak 👋 Aku bantu ya! Mau tanya soal produk, pengiriman, atau pembayaran?";
}
