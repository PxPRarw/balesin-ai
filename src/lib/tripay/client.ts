/**
 * Minimal Tripay client.
 *
 * Tripay is an Indonesian payment aggregator that supports QRIS, e-wallets,
 * VAs, retail (Indomaret/Alfamart), and credit cards. Closed-loop payments
 * are done via "Closed Transactions" — we POST to /transaction/create and
 * receive a checkout URL the customer follows.
 *
 * Docs: https://tripay.co.id/developer
 */

import { createHmac } from "node:crypto";

const BASE_URL =
  process.env.TRIPAY_MODE === "production"
    ? "https://tripay.co.id/api"
    : "https://tripay.co.id/api-sandbox";

type TripayCreateOpts = {
  method: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderItems: { name: string; price: number; quantity: number }[];
  merchantRef: string;
  returnUrl?: string;
  expiredInSeconds?: number;
};

export function isTripayConfigured() {
  return Boolean(
    process.env.TRIPAY_API_KEY &&
      process.env.TRIPAY_PRIVATE_KEY &&
      process.env.TRIPAY_MERCHANT_CODE,
  );
}

function buildSignature(merchantRef: string, amount: number) {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY!;
  const merchantCode = process.env.TRIPAY_MERCHANT_CODE!;
  return createHmac("sha256", privateKey)
    .update(merchantCode + merchantRef + amount)
    .digest("hex");
}

export function verifyCallbackSignature(rawBody: string, signature: string) {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY;
  if (!privateKey) return false;
  const expected = createHmac("sha256", privateKey).update(rawBody).digest("hex");
  return expected === signature;
}

export async function createTripayInvoice(opts: TripayCreateOpts) {
  if (!isTripayConfigured()) {
    throw new Error(
      "Tripay is not configured (set TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, TRIPAY_MERCHANT_CODE).",
    );
  }

  const merchantCode = process.env.TRIPAY_MERCHANT_CODE!;
  const apiKey = process.env.TRIPAY_API_KEY!;

  const payload = {
    method: opts.method,
    merchant_ref: opts.merchantRef,
    amount: opts.amount,
    customer_name: opts.customerName,
    customer_email: opts.customerEmail,
    customer_phone: opts.customerPhone,
    order_items: opts.orderItems,
    return_url: opts.returnUrl,
    expired_time:
      Math.floor(Date.now() / 1000) + (opts.expiredInSeconds ?? 60 * 60 * 24),
    signature: buildSignature(opts.merchantRef, opts.amount),
    merchant_code: merchantCode,
  };

  const res = await fetch(`${BASE_URL}/transaction/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tripay create failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    success: boolean;
    message?: string;
    data?: {
      reference: string;
      checkout_url: string;
      pay_url?: string;
      status: string;
      expired_time: number;
    };
  };

  if (!json.success || !json.data) {
    throw new Error(`Tripay create failed: ${json.message ?? "unknown"}`);
  }

  return json.data;
}
