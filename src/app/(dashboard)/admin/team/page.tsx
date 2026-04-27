import { Users, Mail, ShieldCheck, Eye, Bot, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/auth/session";
import { getWorkspaceMembers, type MemberRow } from "@/lib/data/queries";

export const metadata = { title: "Admin · Team" };

const ROLE_BADGE: Record<MemberRow["role"], { variant: "default" | "yellow" | "blue" | "muted" | "pink"; label: string; icon: typeof ShieldCheck }> = {
  owner: { variant: "default", label: "Owner", icon: ShieldCheck },
  admin: { variant: "yellow", label: "Admin", icon: ShieldCheck },
  agent: { variant: "blue", label: "Agent", icon: Bot },
  viewer: { variant: "muted", label: "Viewer", icon: Eye },
};

export default async function AdminTeamPage() {
  const session = await getSession();
  const members = await getWorkspaceMembers(session?.workspace?.id ?? null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge variant="yellow">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
        </Badge>
        <h1 className="mt-2 text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
          Tim
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Invite admin, agent, atau viewer ke workspace kamu.
        </p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-pink)]">
            <UserPlus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold">Invite anggota baru</h2>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Mereka akan dapat email invite dengan link untuk join workspace ini.
            </p>
          </div>
        </div>
        <form className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_auto]" action="/api/admin/team/invite" method="post">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-fg)] pointer-events-none" />
            <Input name="email" type="email" placeholder="orang@brand.com" className="pl-9" required />
          </div>
          <select
            name="role"
            defaultValue="agent"
            className="rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_0_var(--color-foreground)]"
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
          <Button type="submit" variant="primary">Kirim invite</Button>
        </form>
        <p className="mt-2 text-xs text-[var(--color-muted-fg)]">
          Tip: <b>Admin</b> bisa atur billing & invite. <b>Agent</b> bisa balas chat & edit knowledge. <b>Viewer</b> cuma read-only.
        </p>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] px-5 py-3">
          <Users className="h-4 w-4" />
          <h2 className="font-display text-base font-extrabold">
            Anggota workspace ({members.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-paper-2)] text-left">
              <tr>
                <Th>Nama</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Bergabung</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const meta = ROLE_BADGE[m.role];
                const Icon = meta.icon;
                return (
                  <tr key={m.user_id} className="border-t-2 border-[var(--color-foreground)]/10 hover:bg-[var(--color-paper-2)]/50">
                    <Td>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)] text-[var(--color-brand-ink)] font-display text-xs font-extrabold">
                          {(m.full_name ?? m.email).slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-bold">{m.full_name ?? "—"}</span>
                      </div>
                    </Td>
                    <Td className="text-[var(--color-muted-fg)] font-mono text-xs">{m.email}</Td>
                    <Td>
                      <Badge variant={meta.variant}>
                        <Icon className="h-3 w-3" /> {meta.label}
                      </Badge>
                    </Td>
                    <Td>
                      {m.accepted_at ? (
                        <span className="text-xs font-bold text-[var(--color-brand)]">Aktif</span>
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-warning)]">Pending</span>
                      )}
                    </Td>
                    <Td className="text-xs text-[var(--color-muted-fg)]">
                      {new Date(m.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </Td>
                    <Td className="text-right">
                      <button className="rounded-md border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-2 py-1 text-xs font-bold hover:bg-[var(--color-pink)]" disabled={m.role === "owner"}>
                        {m.role === "owner" ? "—" : "Hapus"}
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-foreground)] ${className ?? ""}`}>
      {children}
    </th>
  );
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}
