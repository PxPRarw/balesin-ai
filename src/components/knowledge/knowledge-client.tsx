"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  FileText,
  Plus,
  Sparkles,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";

type Entry = {
  id: string;
  type: "product" | "faq" | "promo" | "policy" | "misc";
  title: string;
  body: string;
  is_active: boolean;
  updated_at: string;
};

const TYPE_OPTIONS: Entry["type"][] = ["faq", "product", "promo", "policy", "misc"];

function formatRel(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

export function KnowledgeClient({ initial }: { initial: Entry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  function openNew() {
    setEditing({
      id: "",
      type: "faq",
      title: "",
      body: "",
      is_active: true,
      updated_at: new Date().toISOString(),
    });
    setShowForm(true);
  }
  function openEdit(e: Entry) {
    setEditing(e);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function saveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title.trim() || !editing.body.trim()) {
      alert("Title & body wajib diisi.");
      return;
    }
    setBusy(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/knowledge" : `/api/knowledge/${editing.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: editing.type,
          title: editing.title,
          body: editing.body,
          is_active: editing.is_active,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Gagal: ${err.error ?? res.statusText}`);
        return;
      }
      const data = (await res.json()) as { entry: Entry };
      setEntries((prev) =>
        isNew ? [data.entry, ...prev] : prev.map((p) => (p.id === data.entry.id ? data.entry : p)),
      );
      closeForm();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Hapus entri ini? AI gak akan pakai info ini lagi.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Gagal hapus: ${err.error ?? res.statusText}`);
        return;
      }
      setEntries((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Latih AI dengan info toko kamu — produk, harga, FAQ, kebijakan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            Tambah entri
          </Button>
        </div>
      </div>

      <Card className="border-[var(--color-brand)]/30 bg-gradient-to-br from-[var(--color-brand)]/5 to-[var(--color-accent)]/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">
              {entries.length === 0
                ? "Belum ada knowledge — AI bakal pakai jawaban generic"
                : `${entries.filter((e) => e.is_active).length} entri aktif siap dipakai AI`}
            </div>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Makin banyak knowledge, makin akurat AI jawab customer kamu.
            </p>
          </div>
          <Badge variant={entries.length > 0 ? "success" : "muted"}>
            {entries.length > 0 ? "Online" : "Empty"}
          </Badge>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total entri" value={entries.length} icon={BookOpen} />
        <StatCard
          label="Aktif"
          value={entries.filter((e) => e.is_active).length}
          icon={FileText}
        />
        <StatCard
          label="Tipe terbanyak"
          value={mostCommonType(entries) ?? "—"}
          icon={Sparkles}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
          <div>
            <h3 className="text-sm font-semibold">Entri Knowledge Base</h3>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Klik entri untuk edit. AI akan auto-pelajari setelah disimpan.
            </p>
          </div>
        </div>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Sparkles className="h-6 w-6 text-[var(--color-muted)]" />
            <div className="text-sm font-medium">Belum ada entri</div>
            <div className="max-w-[420px] text-xs text-[var(--color-muted-fg)]">
              Tambah info produk, FAQ, kebijakan retur, ongkir, dll biar AI bisa
              jawab spesifik.
            </div>
            <Button onClick={openNew} variant="outline" className="mt-2">
              <Plus className="h-4 w-4" /> Tambah entri pertama
            </Button>
          </div>
        ) : (
          <div>
            {entries.map((kb) => (
              <div
                key={kb.id}
                className="group flex items-start gap-4 border-b border-[var(--color-border)] p-5 last:border-b-0 hover:bg-[var(--color-surface-2)]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-[var(--color-brand)]">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{kb.title}</span>
                    <Badge variant="muted">{kb.type}</Badge>
                    {!kb.is_active ? <Badge variant="warning">paused</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-muted-fg)] line-clamp-2">
                    {kb.body}
                  </p>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">
                    diperbarui {formatRel(kb.updated_at)}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => openEdit(kb)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => deleteEntry(kb.id)}
                    disabled={busy}
                  >
                    <Trash2 className="h-4 w-4 text-[var(--color-danger)]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showForm && editing ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing.id ? "Edit entri" : "Tambah entri"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeForm} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={saveEntry} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Tipe</label>
                <select
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value as Entry["type"] })
                  }
                  className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:border-[var(--color-brand)]/50 focus-visible:outline-none"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Judul</label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="cth: Stok hoodie XL navy"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Isi (yang AI pakai untuk jawab)
                </label>
                <Textarea
                  rows={6}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  placeholder={
                    "cth: Hoodie navy XL ready 8 pcs, harga Rp 285rb, free ongkir Jabodetabek hari ini."
                  }
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                />
                Aktif (AI pakai entri ini)
              </label>
              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Batal
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Menyimpan..." : editing.id ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-[var(--color-muted-fg)]">{label}</div>
    </Card>
  );
}

function mostCommonType(entries: Entry[]): string | null {
  if (entries.length === 0) return null;
  const tally = new Map<string, number>();
  for (const e of entries) tally.set(e.type, (tally.get(e.type) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
