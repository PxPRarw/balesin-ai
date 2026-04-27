/**
 * KlikQRIS API client.
 *
 * Docs (per dashboard provided):
 *   POST /api/qris/create               → create dynamic QRIS
 *   GET  /api/qris/status/{order_id}    → check status manually
 *   GET  /api/qris/history?page=N       → list history
 *   Webhook receives JSON when status changes (PAID / EXPIRED).
 *
 * All calls require headers: x-api-key, id_merchant.
 */

const BASE_URL = process.env.KLIKQRIS_BASE_URL ?? "https://klikqris.com/api";

export type CreateInput = {
  orderId: string;
  amount: number;
  keterangan?: string;
};

export type KlikQrisStatus = "PENDING" | "PAID" | "SUCCESS" | "EXPIRED" | "FAILED";

export type CreateResponseData = {
  order_id: string;
  nama_toko: string;
  tanggal: string;
  total_amount: string;
  amount: string;
  amount_uniq: string;
  status: KlikQrisStatus;
  qris_url: string;
  qris_image: string;
  expired_at: string;
  signature: string;
  keterangan: string | null;
  expired_menit: string;
  redirect_url: string;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
};

export type StatusResponseData = Omit<CreateResponseData, "qris_image"> & {
  qris_image: string | null;
};

export type ApiSuccess<T> = { status: true; message?: string; data: T };
export type ApiFail = { status: false; message: string };

function authHeaders(): Record<string, string> | null {
  const apiKey = process.env.KLIKQRIS_API_KEY;
  const merchant = process.env.KLIKQRIS_MERCHANT_ID;
  if (!apiKey || !merchant) return null;
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    id_merchant: merchant,
  };
}

export function isKlikQrisConfigured(): boolean {
  return Boolean(process.env.KLIKQRIS_API_KEY && process.env.KLIKQRIS_MERCHANT_ID);
}

export async function createQrisTransaction(
  input: CreateInput,
): Promise<ApiSuccess<CreateResponseData> | ApiFail> {
  const h = authHeaders();
  if (!h) return { status: false, message: "KlikQRIS not configured" };
  const body = {
    order_id: input.orderId,
    amount: input.amount,
    id_merchant: Number(process.env.KLIKQRIS_MERCHANT_ID),
    keterangan: input.keterangan ?? "BalesinAI subscription",
  };
  try {
    const res = await fetch(`${BASE_URL}/qris/create`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as
      | ApiSuccess<CreateResponseData>
      | ApiFail;
    return json;
  } catch (e) {
    return { status: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function getQrisStatus(
  orderId: string,
): Promise<ApiSuccess<StatusResponseData> | ApiFail> {
  const h = authHeaders();
  if (!h) return { status: false, message: "KlikQRIS not configured" };
  try {
    const res = await fetch(
      `${BASE_URL}/qris/status/${encodeURIComponent(orderId)}`,
      { method: "GET", headers: h },
    );
    return (await res.json().catch(() => ({}))) as
      | ApiSuccess<StatusResponseData>
      | ApiFail;
  } catch (e) {
    return { status: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export type HistoryItem = {
  order_id: string;
  created_at: string;
  total_amount: string;
  status: KlikQrisStatus;
  type?: string;
  keterangan?: string;
  via: string;
};

export type HistoryResponse = {
  current_page: number;
  data: HistoryItem[];
  first_page_url?: string;
  next_page_url: string | null;
  per_page: number;
  total: number;
};

export async function getQrisHistory(
  page = 1,
): Promise<ApiSuccess<HistoryResponse> | ApiFail> {
  const h = authHeaders();
  if (!h) return { status: false, message: "KlikQRIS not configured" };
  try {
    const res = await fetch(`${BASE_URL}/qris/history?page=${page}`, {
      method: "GET",
      headers: h,
    });
    return (await res.json().catch(() => ({}))) as
      | ApiSuccess<HistoryResponse>
      | ApiFail;
  } catch (e) {
    return { status: false, message: e instanceof Error ? e.message : String(e) };
  }
}

/** Webhook payload shape that KlikQRIS POSTs to our endpoint. */
export type WebhookPayload = {
  order_id: string;
  status: KlikQrisStatus;
  amount: number;
  total_amount: number;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
  keterangan?: string;
  direct_url?: string;
  signature: string;
};

/** Generate a deterministic order id for a workspace's subscription payment. */
export function makeOrderId(prefix = "BSI"): string {
  const ts = Date.now();
  const rnd = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${ts}-${rnd}`;
}
