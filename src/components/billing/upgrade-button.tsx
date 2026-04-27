"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Plan = "pro" | "business";

type Result = {
  ok: true;
  orderId: string;
  signature: string;
  qrisUrl: string;
  qrisImage: string;
  totalAmount: number;
  expiredAt: string;
  plan: Plan;
};

export function UpgradeButton({
  plan,
  children,
  variant = "primary",
  className,
}: {
  plan: Plan;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "secondary";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<Result | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState<null | "paid" | "expired" | "pending">(null);

  async function start() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Gagal create transaksi");
        return;
      }
      setModal(data as Result);
      pollStatus(data.orderId);
    } catch {
      toast.error("Gagal hubungi server");
    } finally {
      setLoading(false);
    }
  }

  async function pollStatus(orderId: string) {
    setPaying(true);
    const startedAt = Date.now();
    const poll = async () => {
      try {
        const r = await fetch(`/api/payment/status/${orderId}`, { cache: "no-store" });
        const j = await r.json();
        if (j.status === "PAID" || j.status === "SUCCESS") {
          setPaid("paid");
          setPaying(false);
          toast.success("Pembayaran berhasil! Plan kamu udah aktif 🎉");
          setTimeout(() => {
            setModal(null);
            window.location.reload();
          }, 2000);
          return;
        }
        if (j.status === "EXPIRED" || j.status === "FAILED") {
          setPaid("expired");
          setPaying(false);
          toast.error("Pembayaran expired. Coba lagi ya.");
          return;
        }
        if (Date.now() - startedAt < 15 * 60_000) {
          setTimeout(poll, 4000);
        } else {
          setPaying(false);
        }
      } catch {
        if (Date.now() - startedAt < 15 * 60_000) setTimeout(poll, 6000);
      }
    };
    poll();
  }

  return (
    <>
      <Button onClick={start} loading={loading} variant={variant} className={className}>
        {children}
      </Button>
      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shadow-cartoon-lg">
            <div className="flex items-center justify-between border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] px-5 py-3">
              <div className="font-display text-lg font-extrabold">Bayar via QRIS</div>
              <button
                onClick={() => setModal(null)}
                className="rounded border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-2 py-1 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-[var(--color-muted-fg)]">
                Scan QR di bawah pakai GoPay, OVO, DANA, ShopeePay, LinkAja, atau apps mobile banking.
              </p>
              <div className="mt-4 flex items-center justify-center rounded-[var(--radius-lg)] border-2 border-[var(--color-foreground)] bg-white p-4">
                {modal.qrisImage ? (
                  <Image
                    src={modal.qrisImage}
                    alt="QRIS"
                    width={280}
                    height={280}
                    unoptimized
                    className="h-[280px] w-[280px] object-contain"
                  />
                ) : (
                  <Image
                    src={modal.qrisUrl}
                    alt="QRIS"
                    width={280}
                    height={280}
                    unoptimized
                    className="h-[280px] w-[280px] object-contain"
                  />
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">Total</div>
                  <div className="font-display text-xl font-extrabold">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(modal.totalAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">Order ID</div>
                  <code className="block truncate text-[11px] font-mono">{modal.orderId}</code>
                </div>
              </div>
              <div className="mt-4 rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-3 text-xs">
                {paid === "paid" ? (
                  <span className="font-bold text-[var(--color-brand)]">✓ Pembayaran terkonfirmasi! Plan kamu aktif.</span>
                ) : paid === "expired" ? (
                  <span className="font-bold text-[var(--color-warning)]">⏱ Transaksi expired. Coba lagi ya.</span>
                ) : paying ? (
                  <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-[var(--color-brand)] pulse-dot" /> Menunggu pembayaran… (auto-detect)</span>
                ) : (
                  <span>Status: PENDING</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
