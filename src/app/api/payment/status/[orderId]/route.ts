import { NextResponse } from "next/server";
import { getQrisStatus, isKlikQrisConfigured } from "@/lib/klikqris/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await ctx.params;
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  if (!isKlikQrisConfigured()) {
    return NextResponse.json({ error: "KlikQRIS not configured" }, { status: 503 });
  }
  const result = await getQrisStatus(orderId);
  if (!result.status) {
    return NextResponse.json({ error: result.message ?? "Failed" }, { status: 502 });
  }

  // Sync to DB if status changed.
  const admin = getSupabaseAdmin();
  if (admin) {
    const upper = (result.data.status ?? "").toUpperCase();
    const mapped =
      upper === "PAID" || upper === "SUCCESS"
        ? "paid"
        : upper === "EXPIRED"
          ? "expired"
          : upper === "FAILED"
            ? "failed"
            : "pending";
    await admin
      .from("payments")
      .update({ status: mapped, paid_at: mapped === "paid" ? result.data.paid_at : null })
      .eq("order_id", orderId);
  }

  return NextResponse.json({
    ok: true,
    orderId,
    status: result.data.status,
    paidAt: result.data.paid_at,
    totalAmount: Number(result.data.total_amount),
  });
}
