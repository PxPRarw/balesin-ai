"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  QrCode,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Power,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type WAState = "idle" | "connecting" | "qr" | "connected" | "disconnected";

type StatusResponse = {
  state: WAState;
  qrDataUrl: string | null;
  phoneNumber: string | null;
  lastError?: string | null;
};

export function WaConnectClient() {
  const [status, setStatus] = useState<StatusResponse>({
    state: "idle",
    qrDataUrl: null,
    phoneNumber: null,
    lastError: null,
  });
  const [busy, setBusy] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/wa/status", { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as StatusResponse;
      setStatus(data);
    } catch {
      // ignore transient
    }
  }, []);

  // Poll while connecting/qr; stop once connected/disconnected/idle.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const polling = status.state === "connecting" || status.state === "qr";
    if (polling && !pollTimer.current) {
      pollTimer.current = setInterval(fetchStatus, 2000);
    }
    if (!polling && pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    return () => {
      if (pollTimer.current && !polling) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };
  }, [status.state, fetchStatus]);

  async function handleConnect() {
    setBusy(true);
    try {
      const r = await fetch("/api/wa/connect", { method: "POST" });
      const data = await r.json();
      if (!r.ok) {
        toast.error(data.error ?? "Gagal start session");
        return;
      }
      setStatus(data);
      toast.success("Session dimulai — QR sebentar lagi muncul");
    } catch {
      toast.error("Tidak bisa hubungi server");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect() {
    setBusy(true);
    try {
      const r = await fetch("/api/wa/disconnect", { method: "POST" });
      if (!r.ok) {
        toast.error("Gagal disconnect");
        return;
      }
      toast.success("Nomor disconnect");
      await fetchStatus();
    } finally {
      setBusy(false);
    }
  }

  const stateLabel: Record<WAState, { label: string; variant: "muted" | "success" | "pink" }> = {
    idle: { label: "Belum terhubung", variant: "muted" },
    connecting: { label: "Connecting…", variant: "pink" },
    qr: { label: "Scan QR di HP", variant: "pink" },
    connected: { label: "Terhubung", variant: "success" },
    disconnected: { label: "Disconnected", variant: "muted" },
  };

  const isConnected = status.state === "connected";
  const showQr = status.state === "qr" && status.qrDataUrl;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center gap-3 border-b-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-5 py-3">
        <Phone className="h-4 w-4" />
        <h2 className="font-display text-base font-extrabold">Nomor WhatsApp</h2>
        <div className="ml-auto">
          <Badge variant={stateLabel[status.state].variant}>
            {stateLabel[status.state].label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto_1fr] items-center">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">
            Step 1
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold">
            {isConnected ? "Nomor sudah aktif" : "Buka WhatsApp di HP"}
          </h3>
          {isConnected ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-brand)]/15 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-2)]" />
                  <div>
                    <div className="font-bold">+{status.phoneNumber}</div>
                    <div className="text-xs text-[var(--color-muted-fg)]">
                      AI siap balas chat masuk otomatis.
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                loading={busy}
              >
                <Power className="h-4 w-4" /> Disconnect nomor
              </Button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-[var(--color-muted-fg)]">
                Di HP yang ada nomor toko kamu:
              </p>
              <ol className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] text-[10px] font-extrabold">
                    1
                  </span>
                  <span>
                    Buka <b>WhatsApp</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] text-[10px] font-extrabold">
                    2
                  </span>
                  <span>
                    Tap menu <b>⋮</b> → <b>Linked devices</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] text-[10px] font-extrabold">
                    3
                  </span>
                  <span>
                    Tap <b>Link a device</b> → scan QR di samping
                  </span>
                </li>
              </ol>
            </>
          )}
        </div>

        <div className="hidden md:block w-px self-stretch bg-[var(--color-foreground)]/15" />

        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">
            Step 2 — Scan QR
          </div>
          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="relative aspect-square w-full max-w-[260px] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-foreground)] bg-[var(--color-paper-2)] flex items-center justify-center overflow-hidden">
              {showQr ? (
                <Image
                  src={status.qrDataUrl as string}
                  alt="WhatsApp QR"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              ) : status.state === "connecting" ? (
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted-fg)]" />
                  <p className="text-xs text-[var(--color-muted-fg)] font-medium">
                    Connecting ke WhatsApp…
                  </p>
                </div>
              ) : isConnected ? (
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <CheckCircle2 className="h-12 w-12 text-[var(--color-brand-2)]" />
                  <p className="text-xs font-bold">Sudah terhubung</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-6">
                  <QrCode className="h-12 w-12 text-[var(--color-muted-fg)]" />
                  <p className="text-xs text-[var(--color-muted-fg)] font-medium">
                    Klik <b>Generate QR</b> buat mulai. Pastikan WA Web di HP-mu kebuka.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConnect}
                    loading={busy}
                  >
                    <RefreshCw className="h-4 w-4" /> Generate QR
                  </Button>
                </div>
              )}
            </div>
            {status.state === "qr" ? (
              <p className="text-xs text-center text-[var(--color-muted-fg)] max-w-[260px]">
                QR refresh otomatis tiap ~20 detik. Kalau gagal, klik <b>Generate QR</b> lagi.
              </p>
            ) : null}
            {status.lastError ? (
              <p className="text-xs text-center text-[var(--color-pink-ink)] max-w-[260px]">
                {status.lastError}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
