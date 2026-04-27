import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, Globe, Bell } from "lucide-react";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Atur persona AI, bahasa, dan preferensi notifikasi.
        </p>
      </div>

      <SettingsCard
        icon={<Bot className="h-5 w-5" />}
        title="Persona AI"
        description="Atur gaya bahasa AI biar match dengan brand voice kamu."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama AI">
            <Input defaultValue="Mode Atelier Assistant" />
          </Field>
          <Field label="Gaya bahasa">
            <select
              defaultValue="casual"
              className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:border-[var(--color-brand)]/50 focus-visible:outline-none"
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual / Friendly</option>
              <option value="genz">Gen-Z / Jaksel</option>
              <option value="custom">Custom</option>
            </select>
          </Field>
        </div>
        <Field label="System prompt tambahan (opsional)">
          <Textarea
            rows={4}
            placeholder="Misal: Selalu sebut diri sebagai 'mimin', jangan promosi produk dari brand lain, dst."
          />
        </Field>
      </SettingsCard>

      <SettingsCard
        icon={<Globe className="h-5 w-5" />}
        title="Bahasa"
        description="AI otomatis deteksi bahasa customer. Set default kalau perlu."
      >
        <div className="flex flex-wrap gap-2">
          {["Indonesia (default)", "English", "Auto-detect ✨"].map((l) => (
            <Badge key={l} variant={l.includes("default") ? "default" : "muted"}>
              {l}
            </Badge>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<Sparkles className="h-5 w-5" />}
        title="Auto-handover ke human"
        description="Trigger AI untuk otomatis serahkan ke admin manusia kalau customer pakai keyword tertentu."
      >
        <Field label="Keywords (pisahkan dengan koma)">
          <Input defaultValue="komplain, refund, retur, marah, kecewa, manusia, admin" />
        </Field>
        <p className="text-xs text-[var(--color-muted-fg)]">
          Saat customer pakai keyword ini, AI akan langsung pause & kasih notif ke
          dashboard.
        </p>
      </SettingsCard>

      <SettingsCard
        icon={<Bell className="h-5 w-5" />}
        title="Notifikasi"
        description="Pilih kapan kamu mau dapat notifikasi."
      >
        {[
          { label: "Customer pakai keyword auto-handover", on: true },
          { label: "AI gagal jawab (out of context)", on: true },
          { label: "Volume harian di atas threshold", on: false },
          { label: "Limit percakapan plan tercapai", on: true },
        ].map((n) => (
          <div
            key={n.label}
            className="flex items-center justify-between border-t border-[var(--color-border)] py-3 first:border-t-0"
          >
            <span className="text-sm">{n.label}</span>
            <span
              className={
                n.on
                  ? "relative h-5 w-9 rounded-full bg-[var(--color-brand)] transition-colors"
                  : "relative h-5 w-9 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              }
            >
              <span
                className={
                  n.on
                    ? "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white"
                    : "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--color-muted)]"
                }
              />
            </span>
          </div>
        ))}
      </SettingsCard>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset</Button>
        <Button>Simpan perubahan</Button>
      </div>
    </div>
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
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-[var(--color-muted-fg)]">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--color-muted-fg)]">
        {label}
      </span>
      {children}
    </label>
  );
}
