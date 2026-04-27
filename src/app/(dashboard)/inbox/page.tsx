"use client";

import { useState } from "react";
import {
  Bot,
  CheckCheck,
  Filter,
  Search,
  Send,
  User2,
  Pause,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEMO_CONVERSATIONS,
  DEMO_MESSAGES,
  type DemoConversation,
} from "@/lib/demo/data";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [active, setActive] = useState<DemoConversation>(DEMO_CONVERSATIONS[1]);
  const [filter, setFilter] = useState<"all" | "ai" | "human" | "resolved">(
    "all",
  );
  const [aiOn, setAiOn] = useState(true);
  const [draft, setDraft] = useState("");

  const filtered = DEMO_CONVERSATIONS.filter(
    (c) => filter === "all" || c.status === filter,
  );

  const messages = DEMO_MESSAGES[active.id] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Inbox
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Live percakapan AI dengan customer kamu. Klik untuk ambil alih.
          </p>
        </div>
        <Badge variant="success">
          <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
          {DEMO_CONVERSATIONS.filter((c) => c.status === "ai").length} active
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="grid h-[calc(100vh-220px)] grid-cols-1 lg:grid-cols-[320px_1fr]">
          {/* List */}
          <div className="flex flex-col border-b border-[var(--color-border)] lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-3">
              <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 px-3 py-1.5 text-sm">
                <Search className="h-3.5 w-3.5 text-[var(--color-muted)]" />
                <span className="text-[var(--color-muted)]">Cari customer...</span>
              </div>
              <button
                aria-label="Filter"
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-1.5 text-[var(--color-muted-fg)]"
              >
                <Filter className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-[var(--color-border)] p-2 text-xs">
              {(["all", "ai", "human", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 capitalize transition-colors",
                    filter === f
                      ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      : "text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)]",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-[var(--color-border)] px-3 py-3 text-left transition-colors",
                      isActive
                        ? "bg-[var(--color-brand)]/8"
                        : "hover:bg-[var(--color-surface-2)]/40",
                    )}
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                        {c.avatar}
                      </div>
                      {c.unread > 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[9px] font-mono font-semibold text-[#051910]">
                          {c.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {c.customerName}
                        </span>
                        <span className="text-[10px] text-[var(--color-muted)]">
                          {c.lastTime}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-muted-fg)] truncate">
                        {c.lastMessage}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        {c.status === "ai" ? (
                          <Badge variant="default">
                            <Bot className="h-2.5 w-2.5" /> AI
                          </Badge>
                        ) : c.status === "human" ? (
                          <Badge variant="warning">
                            <User2 className="h-2.5 w-2.5" /> Human
                          </Badge>
                        ) : (
                          <Badge variant="muted">Resolved</Badge>
                        )}
                        {c.tag ? <Badge variant="muted">{c.tag}</Badge> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-col bg-[#0c1310]">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                {active.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{active.customerName}</div>
                <div className="text-xs text-[var(--color-muted-fg)]">
                  {active.customerPhone}
                </div>
              </div>
              <Button
                variant={aiOn ? "outline" : "primary"}
                size="sm"
                onClick={() => setAiOn((v) => !v)}
              >
                {aiOn ? (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pause AI
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Resume AI
                  </>
                )}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-2">
                {messages.length === 0 ? (
                  <div className="my-12 flex flex-col items-center text-center text-sm text-[var(--color-muted-fg)]">
                    <Bot className="mb-2 h-8 w-8 text-[var(--color-muted)]" />
                    Pilih percakapan dari kiri untuk lihat detail.
                  </div>
                ) : null}
                {messages.map((m) => {
                  const fromCustomer = m.role === "customer";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[80%]",
                        fromCustomer ? "self-start" : "self-end",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2 text-sm shadow",
                          fromCustomer
                            ? "rounded-bl-md bg-[#1f2c33] text-white"
                            : m.role === "ai"
                              ? "rounded-br-md bg-[#005c4b] text-white"
                              : "rounded-br-md bg-[var(--color-accent)] text-[#0a0e0c]",
                        )}
                      >
                        {m.role === "ai" ? (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
                            <Bot className="h-3 w-3" /> AI
                          </div>
                        ) : m.role === "agent" ? (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                            <User2 className="h-3 w-3" /> Agent
                          </div>
                        ) : null}
                        <p className="whitespace-pre-wrap leading-snug">
                          {m.content}
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                          {m.ts}
                          {!fromCustomer ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDraft("");
              }}
              className="flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  aiOn ? "Ketik untuk takeover dari AI..." : "Ketik pesan..."
                }
                className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-brand)]/50 focus-visible:outline-none"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={!draft.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
