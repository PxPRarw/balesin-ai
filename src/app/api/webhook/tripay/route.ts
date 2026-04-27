import { NextResponse } from "next/server";
import { verifyCallbackSignature } from "@/lib/tripay/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-callback-signature") ?? "";

  if (!verifyCallbackSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: {
    reference?: string;
    merchant_ref?: string;
    status?: "PAID" | "EXPIRED" | "FAILED" | "REFUND";
    amount?: number;
    paid_at?: number;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[tripay webhook]", body);
  // TODO: persist subscription state in Supabase based on body.merchant_ref
  // This is the wiring point — once Supabase is configured, mark the user's
  // plan as active and bump expiration.

  return NextResponse.json({ ok: true });
}
