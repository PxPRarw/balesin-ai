"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Bot, Globe, Sparkles, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Persona = {
  name?: string;
  tone?: string;
  greeting?: string;
  language?: string;
  system_prompt?: string;
  handover_keywords?: string;
};

type Initial = {
  name: string;
  store_name: string;
  primary_locale: string;
  ai_persona: Persona;
};

const TONE_OPTIONS: { value: string; label: string }[] = [
  { value: "casual", label: "Casual / Friendly" },
  { value: "formal", label: "Formal" },
  { value: "genz", label: "Gen-Z / Jaksel" },
  { value: "custom", label: "Custom" },
];

const LANG_OPTIONS = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
  { value: "auto", label: "Auto-detect ✨" },
];

export function SettingsClient({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function setPersona(patch: Partial<Persona>) {
    setForm((f) => ({ ...f, ai_persona: { ...f.ai_persona, ...patch } }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          store_name: form.store_name,
          primary_locale: form.primary_locale,
          ai_persona: form.ai_persona,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Gagal: ${err.error ?? res.statusText}`);
        return;
      }
      setSavedAt(Date.now());
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setForm(initial);
    setSavedAt(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Atur persona AI, bahasa, dan handover.
          </p>
        </div>
        {savedAt ? <Badge variant="success">Tersimpan</Badge> : null}
      </div>

      <SettingsCard
        icon={<Store className="h-5 w-5" />}
        title="Identitas toko"
        description="Nama yang muncul di balasan AI dan dashboard."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama workspace">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth: Mode Atelier"
            />
          </Field>
          <Field label="Nama toko (untuk customer)">
            <Input
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              placeholder="cth: Mode Atelier Official"
            />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<Bot className="h-5 w-5" />}
        title="Persona AI"
        description="Atur gaya bahasa AI biar match brand voice kamu."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama AI">
            <Input
              value={form.ai_persona.name ?? ""}
              onChange={(e) => setPersona({ name: e.target.value })}
              placeholder="cth: Mimin"
            />
          </Field>
          <Field label="Gaya bahasa">
            <select
              value={form.ai_persona.tone ?? "casual"}
              onChange={(e) => setPersona({ tone: e.target.value })}
              className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:border-[var(--color-brand)]/50 focus-visible:outline-none"
            >
              {TONE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Sapaan default">
          <Input
            value={form.ai_persona.greeting ?? ""}
            onChange={(e) => setPersona({ greeting: e.target.value })}
            placeholder="cth: Halo kak!"
          />
        </Field>
        <Field label="System prompt tambahan (opsional)">
          <Textarea
            rows={4}
            value={form.ai_persona.system_prompt ?? ""}
            onChange={(e) => setPersona({ system_prompt: e.target.value })}
            placeholder="Misal: Selalu sebut diri sebagai 'mimin', jangan promosi brand lain, dst."
          />
        </Field>
      </SettingsCard>

      <SettingsCard
        icon={<Globe className="h-5 w-5" />}
        title="Bahasa default"
        description="AI auto-detect bahasa customer. Set default kalau perlu."
      >
        <div className="flex flex-wrap gap-2">
          {LANG_OPTIONS.map((l) => {
            const active = form.primary_locale === l.value;
            return (
              <button
                type="button"
                key={l.value}
                onClick={() => setForm({ ...form, primary_locale: l.value })}
                className="rounded-full border-2 border-[var(--color-foreground)] px-3 py-1 text-xs font-bold transition-all"
                style={{
                  background: active ? "var(--color-yellow)" : "transparent",
                  boxShadow: active ? "2px 2px 0 0 var(--color-foreground)" : "none",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<Sparkles className="h-5 w-5" />}
        title="Auto-handover ke human"
        description="Pas customer pakai keyword ini, AI auto-pause + admin di-notif."
      >
        <Field label="Keywords (pisahkan koma)">
          <Input
            value={form.ai_persona.handover_keywords ?? ""}
            onChange={(e) => setPersona({ handover_keywords: e.target.value })}
            placeholder="komplain, refund, retur, marah, kecewa, manusia, admin"
          />
        </Field>
      </SettingsCard>

      <SettingsCard
        icon={<Bell className="h-5 w-5" />}
        title="Notifikasi"
        description="Pilih kapan kamu mau dapat notifikasi (segera dirilis)."
      >
        <p className="text-xs text-[var(--color-muted-fg)]">
          Konfigurasi notifikasi akan tersedia di update berikutnya.
        </p>
      </SettingsCard>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan perubahan"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-[var(--color-muted-fg)]">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </Card>
  );
}
