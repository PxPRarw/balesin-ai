import Link from "next/link";
import { ShieldCheck, Users, CreditCard, Activity, ArrowRight, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import {
  getWorkspaceMembers,
  getSubscription,
  getAuditLogs,
  getPayments,
} from "@/lib/data/queries";

export const metadata = { title: "Admin · Workspace" };

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
}

export default async function AdminWorkspacePage() {
  const session = await getSession();
  const wsId = session?.workspace?.id ?? null;

  const [members, sub, audits, payments] = await Promise.all([
    getWorkspaceMembers(wsId),
    getSubscription(wsId),
    getAuditLogs(wsId, 8),
    getPayments(wsId, 5),
  ]);

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.total_amount_idr, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <Badge variant="yellow">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
            </Badge>
            <Badge variant="muted">{session?.workspace?.name ?? "Workspace"}</Badge>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Workspace overview
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Manage tim, billing, dan setting tingkat workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Anggota tim" value={String(members.length)} icon={Users} accent="bg-[var(--color-blue)]" href="/admin/team" />
        <KpiCard label="Plan aktif" value={PLAN_LABEL[sub.plan] ?? sub.plan} sub={sub.status} icon={Workflow} accent="bg-[var(--color-pink)]" href="/admin/billing" />
        <KpiCard label="Total pembayaran" value={formatIDR(totalRevenue)} icon={CreditCard} accent="bg-[var(--color-yellow)]" href="/admin/billing" />
        <KpiCard label="Audit terbaru" value={String(audits.length)} sub="event 7 hari" icon={Activity} accent="bg-[var(--color-brand)] text-[var(--color-brand-ink)]" href="#audit" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5" id="audit">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold">Audit log terbaru</h2>
              <p className="text-xs text-[var(--color-muted-fg)]">
                Semua aksi yang ngubah data ke-track di sini.
              </p>
            </div>
          </div>
          <ul className="mt-4 divide-y-2 divide-[var(--color-foreground)]/10">
            {audits.map((a) => (
              <li key={a.id} className="py-3 flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] font-display text-xs font-extrabold">
                  {a.actor_email?.slice(0, 2).toUpperCase() ?? "??"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="rounded border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-1.5 py-0.5 text-[11px] font-mono">
                      {a.action}
                    </code>
                    <span className="text-xs text-[var(--color-muted-fg)]">
                      {a.actor_email ?? "system"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted-fg)] mt-0.5 truncate">
                    {a.target_type ? `${a.target_type}#${a.target_id ?? "?"}` : "—"}
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--color-muted-fg)] whitespace-nowrap">
                  {relativeTime(a.created_at)}
                </span>
              </li>
            ))}
            {audits.length === 0 ? (
              <li className="py-6 text-center text-sm text-[var(--color-muted-fg)]">Belum ada aktivitas.</li>
            ) : null}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-lg font-extrabold">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <ActionLink href="/admin/team" label="Invite anggota tim" desc="Tambah admin/agent ke workspace" />
            <ActionLink href="/admin/billing" label="Kelola subscription" desc="Lihat plan & history pembayaran" />
            <ActionLink href="/settings" label="Brand & persona AI" desc="Atur tone, bahasa, jam aktif" />
            <ActionLink href="/connect" label="Connect WhatsApp" desc="Scan QR & manage nomor" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Users;
  accent: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-5 hover:-translate-y-0.5 hover:shadow-cartoon-lg transition-[transform,box-shadow]">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="mt-3 text-2xl font-display font-extrabold tracking-tight">{value}</div>
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">
          {label} {sub ? <span className="text-[var(--color-muted-fg)]/70">· {sub}</span> : null}
        </div>
      </Card>
    </Link>
  );
}

function ActionLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-3 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-foreground)] transition-[transform,box-shadow]"
    >
      <div>
        <div className="font-bold">{label}</div>
        <div className="text-xs text-[var(--color-muted-fg)]">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}
