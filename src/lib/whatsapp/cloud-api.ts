/**
 * Tiny wrapper around Meta's WhatsApp Cloud API.
 *
 * Auth: Bearer token from Meta Business Manager.
 * Phone Number ID: from Meta Developer console.
 */

const BASE_URL = "https://graph.facebook.com/v20.0";

export type WACloudConfig = {
  phoneNumberId: string;
  accessToken: string;
};

export type IncomingTextMessage = {
  from: string;
  text: string;
  messageId: string;
  timestamp: number;
  profileName?: string;
};

export function parseIncomingMessage(
  body: unknown,
): IncomingTextMessage | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const entry = (root.entry as Array<Record<string, unknown>>) ?? [];
  for (const e of entry) {
    const changes = (e.changes as Array<Record<string, unknown>>) ?? [];
    for (const c of changes) {
      const value = c.value as Record<string, unknown> | undefined;
      const messages = (value?.messages as Array<Record<string, unknown>>) ?? [];
      const contacts = (value?.contacts as Array<Record<string, unknown>>) ?? [];
      const m = messages[0];
      if (!m) continue;
      if (m.type !== "text") continue;
      const text = (m.text as { body?: string } | undefined)?.body;
      if (!text) continue;
      return {
        from: String(m.from),
        text,
        messageId: String(m.id),
        timestamp: Number(m.timestamp ?? Math.floor(Date.now() / 1000)),
        profileName:
          (contacts[0] as { profile?: { name?: string } } | undefined)?.profile
            ?.name ?? undefined,
      };
    }
  }
  return null;
}

export async function sendWhatsAppText(
  cfg: WACloudConfig,
  to: string,
  text: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cfg.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text, preview_url: false },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WA send failed: ${res.status} ${err}`);
  }
}
