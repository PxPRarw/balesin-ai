import {
  BookOpen,
  FileText,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Edit3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_KB_ENTRIES } from "@/lib/demo/data";

export const metadata = { title: "Knowledge Base" };

export default function KnowledgePage() {
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
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Upload file
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Tambah entri
          </Button>
        </div>
      </div>

      {/* AI Status */}
      <Card className="border-[var(--color-brand)]/30 bg-gradient-to-br from-[var(--color-brand)]/5 to-[var(--color-accent)]/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">AI siap melayani customer</div>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Knowledge base kamu sudah dipelajari AI. Tingkat coverage:{" "}
              <span className="font-mono font-semibold text-[var(--color-brand)]">
                94%
              </span>
              .
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full w-[94%] bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)]" />
            </div>
          </div>
          <Badge variant="success">Online</Badge>
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total entri" value={DEMO_KB_ENTRIES.length} icon={BookOpen} />
        <StatCard
          label="Item terindeks"
          value={DEMO_KB_ENTRIES.reduce((s, e) => s + e.items, 0)}
          icon={FileText}
        />
        <StatCard label="Dipelajari AI" value="94%" icon={Sparkles} />
      </div>

      {/* Entries list */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
          <div>
            <h3 className="text-sm font-semibold">Entri Knowledge Base</h3>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Klik untuk edit atau lihat detail
            </p>
          </div>
        </div>
        <div>
          {DEMO_KB_ENTRIES.map((kb) => (
            <div
              key={kb.id}
              className="group flex items-center gap-4 border-b border-[var(--color-border)] p-5 last:border-b-0 hover:bg-[var(--color-surface-2)]/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-[var(--color-brand)]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kb.title}</span>
                  <Badge variant="muted">{kb.type}</Badge>
                </div>
                <div className="text-xs text-[var(--color-muted-fg)]">
                  {kb.items} item · diperbarui {kb.updated}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" aria-label="Edit">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-[var(--color-danger)]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
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
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-[var(--color-muted-fg)]">{label}</div>
    </Card>
  );
}
