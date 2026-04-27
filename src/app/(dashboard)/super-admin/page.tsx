import Link from "next/link";
import { Crown, Users, Building2, CreditCard, MessageCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getPlatformStats,
  getAllWorkspaces,
  getAllUsers,
} from "@/lib/data/queries";

export const metadata = { title: "Super Admin" };

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminPage() {
  const [stats, workspaces, users] = await Promise.all([
    getPlatformStats(),
    getAllWorkspaces(20),
    getAllUsers(20),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="pink">
            <Crown className="h-3.5 w-3.5" /> Super Admin
          </Badge>
          <h1 className="mt-2 text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Platform overview
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Stats global BalesinAI: workspaces, users, revenue, traffic.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total workspaces" value={stats.workspacesTotal.toLocaleString("id-ID")} icon={Building2} accent="bg-[var(--color-yellow)]" />
        <KpiCard label="Total users" value={stats.usersTotal.toLocaleString("id-ID")} icon={Users} accent="bg-[var(--color-pink)]" />
        <KpiCard label="MRR" value={formatIDR(stats.mrrIdr)} sub={`${stats.paidWorkspaces} paid`} icon={CreditCard} accent="bg-[var(--color-brand)] text-[var(--color-brand-ink)]" />
        <KpiCard label="Pesan 7 hari" value={stats.messagesLast7d.toLocaleString("id-ID")} icon={MessageCircle} accent="bg-[var(--color-blue)]" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] px-5 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <h2 className="font-display text-base font-extrabold">Workspaces ({workspaces.length})</h2>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-xs font-bold underline">
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-paper-2)] text-left">
              <tr>
                <Th>Nama</Th>
                <Th>Owner</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
                <Th>Dibuat</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {workspaces.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[var(--color-muted-fg)]">
                    Belum ada workspace selain milik kamu sendiri.
                  </td>
                </tr>
              ) : (
                workspaces.map((w) => (
                  <tr key={w.id} className="border-t-2 border-[var(--color-foreground)]/10 hover:bg-[var(--color-paper-2)]/50">
                    <Td>
                      <div className="font-bold">{w.name}</div>
                      <div className="text-[11px] font-mono text-[var(--color-muted-fg)]">{w.slug}</div>
                    </Td>
                    <Td className="text-xs text-[var(--color-muted-fg)] font-mono">{w.owner_email ?? "—"}</Td>
                    <Td>
                      <Badge variant={w.plan === "free" ? "muted" : w.plan === "pro" ? "yellow" : "default"}>
                        {w.plan}
                      </Badge>
                    </Td>
                    <Td>
                      {w.is_suspended ? (
                        <Badge variant="danger">
                          <ShieldAlert className="h-3 w-3" /> Suspended
                        </Badge>
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-brand)]">Active</span>
                      )}
                    </Td>
                    <Td className="text-xs text-[var(--color-muted-fg)]">
                      {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </Td>
                    <Td className="text-right">
                      <button className="rounded-md border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-2 py-1 text-xs font-bold hover:bg-[var(--color-pink)]">
                        {w.is_suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-5 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <h2 className="font-display text-base font-extrabold">Users ({users.length})</h2>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-xs font-bold underline">
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-paper-2)] text-left">
              <tr>
                <Th>Email</Th>
                <Th>Nama</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last login</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[var(--color-muted-fg)]">
                    Belum ada user.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t-2 border-[var(--color-foreground)]/10 hover:bg-[var(--color-paper-2)]/50">
                    <Td className="font-mono text-xs">{u.email}</Td>
                    <Td className="font-bold">{u.full_name ?? "—"}</Td>
                    <Td>
                      <Badge variant={u.platform_role === "super_admin" ? "pink" : "muted"}>
                        {u.platform_role === "super_admin" ? <><Crown className="h-3 w-3" /> Super Admin</> : "User"}
                      </Badge>
                    </Td>
                    <Td>
                      {u.is_banned ? (
                        <Badge variant="danger">Banned</Badge>
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-brand)]">Active</span>
                      )}
                    </Td>
                    <Td className="text-xs text-[var(--color-muted-fg)]">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                    </Td>
                    <Td className="text-right">
                      <button className="rounded-md border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-2 py-1 text-xs font-bold hover:bg-[var(--color-pink)]">
                        {u.is_banned ? "Unban" : "Ban"}
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub?: string; icon: typeof Users; accent: string }) {
  return (
    <Card className="p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-display font-extrabold tracking-tight">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">
        {label} {sub ? <span className="text-[var(--color-muted-fg)]/70">· {sub}</span> : null}
      </div>
    </Card>
  );
}
function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-foreground)] ${className ?? ""}`}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}
