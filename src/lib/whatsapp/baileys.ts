/**
 * Baileys WhatsApp session manager (singleton).
 *
 * IMPORTANT: this module keeps an in-process Map of WA sockets keyed by
 * workspace id. It WILL NOT work on stateless serverless platforms (Vercel
 * default Lambda). For production deployment, run this on a long-lived
 * Node host (Fly.io, Railway, Render, fly volumes, your own VM).
 *
 * For local dev / Devin VM, this works out of the box.
 */
import path from "node:path";
import fs from "node:fs/promises";
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  type WASocket,
  type ConnectionState,
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import { Boom } from "@hapi/boom";

export type WAState =
  | "idle"
  | "connecting"
  | "qr"
  | "connected"
  | "disconnected";

type SessionEntry = {
  workspaceId: string;
  sock: WASocket | null;
  state: WAState;
  qrDataUrl: string | null;
  qrText: string | null;
  phoneNumber: string | null;
  lastError: string | null;
  startedAt: number;
  onMessage?: (m: IncomingMessage) => Promise<void> | void;
};

export type IncomingMessage = {
  workspaceId: string;
  fromJid: string;
  fromNumber: string;
  text: string;
  messageId: string;
  timestamp: number;
  pushName?: string;
};

const sessions = new Map<string, SessionEntry>();

const SESSIONS_ROOT = process.env.WA_SESSIONS_DIR
  ? path.resolve(process.env.WA_SESSIONS_DIR)
  : path.resolve(process.cwd(), ".wa-sessions");

function authDir(workspaceId: string) {
  // Sanitize workspaceId for filesystem.
  const safe = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(SESSIONS_ROOT, safe);
}

const baileysLogger = pino({ level: "warn" });

async function spawnSocket(entry: SessionEntry): Promise<void> {
  const wsId = entry.workspaceId;
  await fs.mkdir(authDir(wsId), { recursive: true });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- Baileys helper, not a React hook
  const { state, saveCreds } = await useMultiFileAuthState(authDir(wsId));
  const { version } = await fetchLatestBaileysVersion().catch(() => ({
    version: [2, 3000, 0] as [number, number, number],
  }));

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: baileysLogger,
    browser: ["BalesinAI", "Chrome", "1.0.0"],
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });
  entry.sock = sock;
  entry.state = "connecting";
  entry.lastError = null;

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (u: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr) {
      entry.qrText = qr;
      entry.state = "qr";
      try {
        entry.qrDataUrl = await QRCode.toDataURL(qr, {
          margin: 1,
          width: 320,
        });
      } catch {
        entry.qrDataUrl = null;
      }
    }
    if (connection === "open") {
      entry.state = "connected";
      entry.qrDataUrl = null;
      entry.qrText = null;
      const me = sock.user?.id ?? "";
      // Baileys returns id like "62812xxxx:xx@s.whatsapp.net"
      const num = me.split(":")[0]?.split("@")[0] ?? null;
      entry.phoneNumber = num;
    }
    if (connection === "close") {
      const code = (lastDisconnect?.error as Boom | undefined)?.output
        ?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;
      entry.state = loggedOut ? "disconnected" : "connecting";
      entry.lastError = lastDisconnect?.error?.message ?? null;
      if (!loggedOut) {
        // auto-reconnect
        setTimeout(() => {
          spawnSocket(entry).catch((e) => {
            entry.state = "disconnected";
            entry.lastError = e instanceof Error ? e.message : String(e);
          });
        }, 1500);
      } else {
        // logged out — wipe session files so QR appears again next connect
        try {
          await fs.rm(authDir(wsId), { recursive: true, force: true });
        } catch {
          // ignore
        }
        entry.sock = null;
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const m of messages) {
      if (!m.message || m.key.fromMe) continue;
      const fromJid = m.key.remoteJid ?? "";
      // Skip groups + status broadcasts for MVP.
      if (fromJid.endsWith("@g.us") || fromJid === "status@broadcast") continue;
      const fromNumber = fromJid.split("@")[0] ?? fromJid;
      const text =
        m.message.conversation ??
        m.message.extendedTextMessage?.text ??
        m.message.imageMessage?.caption ??
        m.message.videoMessage?.caption ??
        "";
      if (!text) continue;
      const incoming: IncomingMessage = {
        workspaceId: wsId,
        fromJid,
        fromNumber,
        text,
        messageId: m.key.id ?? "",
        timestamp: (m.messageTimestamp as number | undefined) ?? Date.now() / 1000,
        pushName: m.pushName ?? undefined,
      };
      try {
        await entry.onMessage?.(incoming);
      } catch (e) {
        baileysLogger.warn(
          { err: e instanceof Error ? e.message : String(e) },
          "onMessage handler threw",
        );
      }
    }
  });
}

export async function startWASession(
  workspaceId: string,
  onMessage?: (m: IncomingMessage) => Promise<void> | void,
): Promise<{ state: WAState; qrDataUrl: string | null; phoneNumber: string | null }> {
  let entry = sessions.get(workspaceId);
  if (!entry) {
    entry = {
      workspaceId,
      sock: null,
      state: "idle",
      qrDataUrl: null,
      qrText: null,
      phoneNumber: null,
      lastError: null,
      startedAt: Date.now(),
      onMessage,
    };
    sessions.set(workspaceId, entry);
  } else if (onMessage) {
    entry.onMessage = onMessage;
  }
  if (entry.state === "connected") {
    return {
      state: entry.state,
      qrDataUrl: null,
      phoneNumber: entry.phoneNumber,
    };
  }
  if (!entry.sock || entry.state === "idle" || entry.state === "disconnected") {
    await spawnSocket(entry);
  }
  return {
    state: entry.state,
    qrDataUrl: entry.qrDataUrl,
    phoneNumber: entry.phoneNumber,
  };
}

export function getWASessionStatus(workspaceId: string): {
  state: WAState;
  qrDataUrl: string | null;
  phoneNumber: string | null;
  lastError: string | null;
} {
  const entry = sessions.get(workspaceId);
  if (!entry) {
    return { state: "idle", qrDataUrl: null, phoneNumber: null, lastError: null };
  }
  return {
    state: entry.state,
    qrDataUrl: entry.qrDataUrl,
    phoneNumber: entry.phoneNumber,
    lastError: entry.lastError,
  };
}

export async function stopWASession(workspaceId: string): Promise<void> {
  const entry = sessions.get(workspaceId);
  if (!entry) return;
  try {
    await entry.sock?.logout();
  } catch {
    // best effort
  }
  try {
    entry.sock?.end(undefined);
  } catch {
    // best effort
  }
  try {
    await fs.rm(authDir(workspaceId), { recursive: true, force: true });
  } catch {
    // ignore
  }
  entry.state = "disconnected";
  entry.qrDataUrl = null;
  entry.qrText = null;
  entry.phoneNumber = null;
  entry.sock = null;
}

export async function sendWAMessage(
  workspaceId: string,
  toJid: string,
  text: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const entry = sessions.get(workspaceId);
  if (!entry || entry.state !== "connected" || !entry.sock) {
    return { ok: false, error: "WA not connected" };
  }
  try {
    await entry.sock.sendMessage(toJid, { text });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
