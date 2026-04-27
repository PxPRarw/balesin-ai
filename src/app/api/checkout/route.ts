import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createQrisTransaction,
  isKlikQrisConfigured,
  makeOrderId,
} from "@/lib/klikqris/client";
import { getSession } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAN_PRICES = {
  pro: { monthly: 99_000, name: "BalesinAI Pro" },
  business: { monthly: 249_000, name: "BalesinAI Business" },
} as const;

const Schema = z.object({
  plan: z.enum(["pro", "business"]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!isKlikQrisConfigured()) {
    return NextResponse.json(
      { error: "KlikQRIS belum dikonfigurasi (set KLIKQRIS_API_KEY + KLIKQRIS_MERCHANT_ID)" },
      { status: 503 },
    );
  }

  const plan = PLAN_PRICES[parsed.data.plan];
  const orderId = makeOrderId("BSI");

  const result = await createQrisTransaction({
    orderId,
    amount: plan.monthly,
    keterangan: `${plan.name} - ${session.email}`,
  });

  if (!result.status) {
    return NextResponse.json(
      { error: result.message ?? "Gagal create transaksi" },
      { status: 502 },
    );
  }

  // Persist to DB.
  const admin = getSupabaseAdmin();
  if (admin && session.workspace) {
    const totalAmount = Number(result.data.total_amount);
    await admin.from("payments").insert({
      workspace_id: session.workspace.id,
      order_id: orderId,
      provider: "klikqris",
      plan: parsed.data.plan,
      amount_idr: plan.monthly,
      total_amount_idr: Number.isFinite(totalAmount) ? Math.round(totalAmount) : plan.monthly,
      status: "pending",
      qris_url: result.data.qris_url,
      qris_image: result.data.qris_image,
      signature: result.data.signature,
      expired_at: result.data.expired_at,
      raw_response: result.data,
    });
    await admin.from("audit_logs").insert({
      workspace_id: session.workspace.id,
      actor_id: session.userId,
      actor_email: session.email,
      action: "payment.created",
      target_type: "payment",
      target_id: orderId,
      metadata: { plan: parsed.data.plan, amount: plan.monthly },
    });
  }

  return NextResponse.json({
    ok: true,
    orderId,
    signature: result.data.signature,
    qrisUrl: result.data.qris_url,
    qrisImage: result.data.qris_image,
    totalAmount: Number(result.data.total_amount),
    expiredAt: result.data.expired_at,
    plan: parsed.data.plan,
  });
}
