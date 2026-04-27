"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Lock, User2, ArrowRight, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !storeName)) {
      toast.error("Tolong isi semua kolom dulu ya");
      return;
    }

    start(async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, email, password, storeName }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Terjadi kesalahan");
          return;
        }
        if (data.needsVerification) {
          setVerifyNotice(email);
          toast.success(
            "Akun dibuat! Cek email kamu untuk klik link verifikasi.",
          );
          return;
        }
        toast.success(
          mode === "signup"
            ? "Akun dibuat! Selamat datang di BalesinAI 🎉"
            : "Selamat datang kembali!",
        );
        // Hard navigation so the dashboard's RSC reads the freshly-set cookie.
        window.location.assign("/dashboard");
      } catch {
        toast.error("Tidak bisa menghubungi server");
      }
    });
  }

  if (verifyNotice) {
    return (
      <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] p-5 shadow-cartoon">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)]">
            <MailCheck className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold">Cek email kamu</h3>
            <p className="mt-1 text-sm font-medium">
              Kami kirim link verifikasi ke <b>{verifyNotice}</b>. Klik link-nya untuk aktifkan akun, terus balik ke sini buat login.
            </p>
            <p className="mt-2 text-xs text-[var(--color-muted-fg)]">
              Email gak masuk dalam 5 menit? Cek folder Spam / Promotions, atau coba signup ulang dengan email lain.
            </p>
            <button
              onClick={() => setVerifyNotice(null)}
              className="mt-3 text-xs font-bold underline decoration-4 decoration-[var(--color-foreground)]/40 underline-offset-2"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" ? (
        <Field
          label="Nama toko / brand"
          icon={<User2 className="h-4 w-4" />}
          input={
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Mode Atelier"
              autoComplete="organization"
              required
            />
          }
        />
      ) : null}

      <Field
        label="Email"
        icon={<Mail className="h-4 w-4" />}
        input={
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@brandkamu.com"
            autoComplete="email"
            required
          />
        }
      />

      <Field
        label="Password"
        icon={<Lock className="h-4 w-4" />}
        input={
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••• (min 6)"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
            required
          />
        }
      />

      <Button type="submit" loading={pending} size="lg" variant="primary" className="w-full">
        {mode === "signup" ? "Buat akun gratis 🎉" : "Masuk"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="text-center text-xs font-medium text-[var(--color-muted-fg)]">
        Dengan {mode === "signup" ? "mendaftar" : "masuk"}, kamu setuju dengan{" "}
        <a
          href="/legal/terms"
          className="font-bold text-[var(--color-foreground)] underline decoration-[var(--color-yellow)] decoration-4 underline-offset-2"
        >
          syarat & ketentuan
        </a>{" "}
        kami.
      </p>
    </form>
  );
}

function Field({
  label,
  icon,
  input,
}: {
  label: string;
  icon: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)]">
          {icon}
        </span>
        {label}
      </span>
      {input}
    </label>
  );
}
