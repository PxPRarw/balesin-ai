import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { WebhookPayload } from "@/lib/klikqris/client";
import { sendPaymentReceiptEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * KlikQRIS webhook handler.
 *
 * Receives JSON when transaction status changes (PAID / EXPIRED).
 * Validates signature against the one we stored when creating the transaction.
 * Idempotent: ignores notifications for orders already PAID.
 */
export async function POST(req: Request) {
  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = payload.order_id;
  const incomingStatus = payload.status?.toUpperCase();
  if (!orderId || !incomingStatus) {
    return NextResponse.json({ error: "Missing order_id or status" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    // We still ack 200 so KlikQRIS doesn't retry forever, but log the issue.
    console.error("[klikqris webhook] DB not configured");
    return NextResponse.json({ ok: true, note: "db-not-configured" });
  }

  const existing = await admin
    .from("payments")
    .select("id, workspace_id, plan, amount_idr, total_amount_idr, status, signature, order_id, workspaces:workspace_id(name), profiles:workspace_id(*)")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existing.error || !existing.data) {
    console.warn("[klikqris webhook] order not found", orderId);
    // Ack to prevent retries, but record nothing.
    return NextResponse.json({ ok: true, note: "order-not-found" });
  }

  // Idempotency: if already PAID/SUCCESS, no-op.
  if (existing.data.status === "paid") {
    return NextResponse.json({ ok: true, note: "already-paid" });
  }

  // Signature double-security check.
  if (existing.data.signature && payload.signature && existing.data.signature !== payload.signature) {
    console.warn("[klikqris webhook] signature mismatch", { orderId });
    return NextResponse.json({ error: "Signature mismatch" }, { status: 401 });
  }

  const newStatus =
    incomingStatus === "PAID" || incomingStatus === "SUCCESS"
      ? "paid"
      : incomingStatus === "EXPIRED"
        ? "expired"
        : incomingStatus === "FAILED"
          ? "failed"
          : "pending";

  const updateRes = await admin
    .from("payments")
    .update({
      status: newStatus,
      paid_at: newStatus === "paid" ? new Date(payload.payment_date ?? Date.now()).toISOString() : null,
      raw_webhook: payload,
    })
    .eq("order_id", orderId);

  if (updateRes.error) {
    console.error("[klikqris webhook] update failed", updateRes.error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  // On PAID: activate subscription.
  if (newStatus === "paid") {
    const wsId = existing.data.workspace_id as string;
    const plan = (existing.data as { plan?: string }).plan as "pro" | "business" | undefined;
    if (plan) {
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      await admin
        .from("subscriptions")
        .upsert(
          {
            workspace_id: wsId,
            plan,
            status: "active",
            amount_idr: existing.data.amount_idr ?? 0,
            current_period_end: periodEnd.toISOString(),
          },
          { onConflict: "workspace_id" },
        );
    }
    await admin.from("audit_logs").insert({
      workspace_id: wsId,
      actor_id: null,
      actor_email: "system@klikqris",
      action: "payment.paid",
      target_type: "payment",
      target_id: orderId,
      metadata: { amount: payload.amount, total: payload.total_amount },
    });

    // Best-effort receipt email — find workspace owner email.
    try {
      const owner = await admin
        .from("workspaces")
        .select("name, owner:owner_id(email, full_name)")
        .eq("id", wsId)
        .maybeSingle();
      const ownerData = owner.data as { name: string; owner: { email: string; full_name: string | null } | null } | null;
      if (ownerData?.owner?.email) {
        void sendPaymentReceiptEmail({
          to: ownerData.owner.email,
          storeName: ownerData.name,
          orderId,
          amount: existing.data.total_amount_idr ?? payload.total_amount,
          plan: plan ?? "pro",
          paidAt: new Date(payload.payment_date ?? Date.now()).toLocaleString("id-ID"),
        });
      }
    } catch (e) {
      console.warn("[klikqris webhook] receipt email failed", e);
    }
  }

  return NextResponse.json({ ok: true, orderId, status: newStatus });
}
