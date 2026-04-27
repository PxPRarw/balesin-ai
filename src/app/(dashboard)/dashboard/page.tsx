import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Clock,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_ANALYTICS, DEMO_CONVERSATIONS } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Overview" };

export default function DashboardPage() {
  const a = DEMO_ANALYTICS;
  const stats = [
    {
      label: "Percakapan hari ini",
      value: a.conversationsToday.toLocaleString("id-ID"),
      change: a.conversationsTrend,
      suffix: "%",
      icon: MessageCircle,
    },
    {
      label: "Diselesaikan AI",
      value: `${a.aiResolvedPct}%`,
      sub: `${a.aiResolved}/${a.conversationsToday}`,
      change: 5,
      suffix: "%",
      icon: Bot,
    },
    {
      label: "Avg response time",
      value: `${a.avgResponseSec}s`,
      change: a.responseTrend,
      suffix: "s",
      reverse: true,
      icon: Clock,
    },
    {
      label: "Conversion rate",
      value: `${a.conversionRate}%`,
      change: a.conversionTrend,
      suffix: "%",
      icon: ShoppingBag,
    },
  ];

  const max = Math.max(...a.hourly);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Selamat pagi 👋 Berikut ringkasan performa AI kamu hari ini.
          </p>
        </div>
        <Badge variant="muted">
          <span>Update tiap 30s</span>
        </Badge>
      </div>

      {/* KPI cards */}
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
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-mono",
                    positive ? "text-[var(--color-brand)]" : "text-[var(--color-warning)]",
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
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-0.5 text-xs text-[var(--color-muted-fg)]">
                {s.label}
                {s.sub ? <span className="ml-1 text-[var(--color-muted)]">· {s.sub}</span> : null}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart + top queries */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Volume percakapan</h3>
              <p className="text-xs text-[var(--color-muted-fg)]">
                Per jam · 24 jam terakhir
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-[var(--color-brand)]">
              <TrendingUp className="h-3 w-3" />
              Peak 16:00 (24)
            </div>
          </div>

          <div className="mt-6 flex h-48 items-end gap-1">
            {a.hourly.map((h, i) => {
              const pct = (h / max) * 100;
              return (
                <div
                  key={i}
                  className="group relative flex-1"
                  title={`${i.toString().padStart(2, "0")}:00 — ${h} chat`}
                >
                  <div
                    className="rounded-t-md bg-gradient-to-t from-[var(--color-brand)] to-[var(--color-brand)]/40 transition-all duration-300 group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-accent)]/40"
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
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
            Yang paling sering ditanya customer
          </p>
          <div className="mt-4 space-y-3">
            {a.topQueries.map((q, i) => (
              <div key={q.q} className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--color-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="text-sm">{q.q}</div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)]"
                      style={{ width: `${(q.count / a.topQueries[0].count) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--color-muted-fg)]">
                  {q.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
          <div>
            <h3 className="text-sm font-semibold">Percakapan terbaru</h3>
            <p className="text-xs text-[var(--color-muted-fg)]">
              Live feed dari customer kamu
            </p>
          </div>
          <Badge variant="muted">Lihat semua →</Badge>
        </div>
        <div>
          {DEMO_CONVERSATIONS.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-3 last:border-b-0 hover:bg-[var(--color-surface-2)]/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {c.customerName}
                  </span>
                  {c.tag ? <Badge variant="muted">{c.tag}</Badge> : null}
                </div>
                <div className="text-xs text-[var(--color-muted-fg)] truncate">
                  {c.lastMessage}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-[var(--color-muted)]">
                  {c.lastTime}
                </span>
                {c.status === "ai" ? (
                  <Badge variant="default">
                    <Bot className="h-2.5 w-2.5" />
                    AI
                  </Badge>
                ) : c.status === "human" ? (
                  <Badge variant="warning">Human</Badge>
                ) : (
                  <Badge variant="muted">Resolved</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
