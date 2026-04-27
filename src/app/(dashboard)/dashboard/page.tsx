import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Clock,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import {
  getWorkspaceKPIs,
  getHourlyVolume,
  getTopQueries,
  getConversations,
} from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function trendPct(today: number, yesterday: number): number {
  if (yesterday === 0) return today > 0 ? 100 : 0;
  return Math.round(((today - yesterday) / yesterday) * 100);
}

export default async function DashboardPage() {
  const session = await getSession();
  const wsId = session?.workspace?.id ?? null;

  const [kpis, hourly, top, recent] = await Promise.all([
    getWorkspaceKPIs(wsId),
    getHourlyVolume(wsId),
    getTopQueries(wsId, 5),
    getConversations(wsId, 5),
  ]);

  const trend = trendPct(kpis.conversationsToday, 0);
  const stats = [
    {
      label: "Percakapan hari ini",
      value: kpis.conversationsToday.toLocaleString("id-ID"),
      change: trend,
      suffix: "%",
      icon: MessageCircle,
    },
    {
      label: "Diselesaikan AI",
      value: `${kpis.aiHandledPct}%`,
      sub: `${kpis.aiResolvedToday}/${kpis.conversationsToday}`,
      change: 0,
      suffix: "%",
      icon: Bot,
    },
    {
      label: "Avg response time",
      value: kpis.avgResponseSeconds > 0 ? `${kpis.avgResponseSeconds}s` : "—",
      change: 0,
      suffix: "s",
      reverse: true,
      icon: Clock,
    },
    {
      label: "Belum dibalas",
      value: kpis.unread.toLocaleString("id-ID"),
      change: 0,
      suffix: "",
      icon: ShoppingBag,
    },
  ];

  const max = Math.max(1, ...hourly);
  const peakIdx = hourly.indexOf(max);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Hai {session?.profile?.full_name ?? "kak"} 👋 ringkasan performa AI workspace kamu.
          </p>
        </div>
        <Badge variant="muted">
          <span>Live data dari Supabase</span>
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const positive = s.reverse ? s.change <= 0 : s.change >= 0;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                  <Icon className="h-4 w-4" />
                </div>
                {s.change !== 0 ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-mono",
                      positive
                        ? "text-[var(--color-brand)]"
                        : "text-[var(--color-warning)]",
                    )}
                  >
                    {positive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(s.change)}
                    {s.suffix}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-0.5 text-xs text-[var(--color-muted-fg)]">
                {s.label}
                {s.sub ? (
                  <span className="ml-1 text-[var(--color-muted)]">· {s.sub}</span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Volume percakapan</h3>
              <p className="text-xs text-[var(--color-muted-fg)]">
                Per jam · 24 jam terakhir
              </p>
            </div>
            {kpis.messagesToday > 0 ? (
              <div className="inline-flex items-center gap-1 text-xs text-[var(--color-brand)]">
                <TrendingUp className="h-3 w-3" />
                Peak {String(peakIdx).padStart(2, "0")}:00 ({max})
              </div>
            ) : null}
          </div>

          {hourly.every((v) => v === 0) ? (
            <div className="mt-6 flex h-48 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] text-center">
              <div className="px-6 py-4 text-xs text-[var(--color-muted-fg)]">
                Belum ada pesan dalam 24 jam terakhir.
                <br />
                Connect WhatsApp di <Link className="font-bold underline" href="/connect">/connect</Link> & coba kirim pesan dari nomor lain.
              </div>
            </div>
          ) : (
            <div className="mt-6 flex h-48 items-end gap-1">
              {hourly.map((h, i) => {
                const pct = (h / max) * 100;
                return (
                  <div
                    key={i}
                    className="group relative flex-1"
                    title={`${i.toString().padStart(2, "0")}:00 — ${h} pesan`}
                  >
                    <div
                      className="rounded-t-md bg-gradient-to-t from-[var(--color-brand)] to-[var(--color-brand)]/40"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-2 flex justify-between text-[10px] text-[var(--color-muted)]">
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>23</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold">Top pertanyaan</h3>
          <p className="text-xs text-[var(--color-muted-fg)]">
            Yang paling sering ditanya customer (7 hari)
          </p>
          {top.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-muted-fg)]">
              Belum ada data. Pertanyaan customer akan tampil di sini setelah AI mulai jalan.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {top.map((q, i) => (
                <div key={q.q} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm truncate">{q.q}</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)]"
                        style={{ width: `${(q.count / top[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-muted-fg)]">
                    {q.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
          <div>
            <h3 className="text-sm font-semibold">Percakapan terbaru</h3>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Live feed dari customer kamu
            </p>
          </div>
          <Link
            href="/inbox"
            className="text-xs font-bold underline decoration-2 decoration-[var(--color-yellow)] underline-offset-2"
          >
            Lihat semua →
          </Link>
        </div>
        <div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <Sparkles className="h-6 w-6 text-[var(--color-muted)]" />
              <div className="text-sm font-medium">Belum ada percakapan</div>
              <div className="max-w-[420px] text-xs text-[var(--color-muted-fg)]">
                Begitu kamu connect nomor WhatsApp dan ada chat masuk, AI auto-balas dan log-nya muncul di sini.
              </div>
              <Link
                href="/connect"
                className="mt-2 text-xs font-bold underline decoration-2 decoration-[var(--color-yellow)] underline-offset-2"
              >
                Connect WhatsApp →
              </Link>
            </div>
          ) : (
            recent.map((c) => {
              const initials = (c.customer_name ?? c.customer_phone)
                .split(/\s+/)
                .map((s) => s[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <Link
                  key={c.id}
                  href={`/inbox?c=${c.id}`}
                  className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-3 last:border-b-0 hover:bg-[var(--color-surface-2)]/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                    {initials || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {c.customer_name ?? c.customer_phone}
                      </span>
                      {c.unread_count > 0 ? (
                        <Badge variant="warning">{c.unread_count} new</Badge>
                      ) : null}
                    </div>
                    <div className="text-xs text-[var(--color-muted-fg)] truncate">
                      {c.preview ?? "—"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {formatRelative(c.last_message_at)}
                    </span>
                    {c.status === "resolved" ? (
                      <Badge variant="muted">Resolved</Badge>
                    ) : c.is_ai_active ? (
                      <Badge variant="default">
                        <Bot className="h-2.5 w-2.5" /> AI
                      </Badge>
                    ) : (
                      <Badge variant="warning">Human</Badge>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
