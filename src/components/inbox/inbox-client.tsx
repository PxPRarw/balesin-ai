"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCheck,
  Filter,
  Pause,
  Play,
  Search,
  Send,
  User2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Conv = {
  id: string;
  customer_phone: string;
  customer_name: string | null;
  last_message_at: string;
  status: "open" | "resolved" | "snoozed" | "spam";
  is_ai_active: boolean;
  unread_count: number;
  preview?: string | null;
};

type Msg = {
  id: string;
  conversation_id: string;
  role: "customer" | "ai" | "admin" | "system";
  body: string;
  created_at: string;
};

type Filter = "all" | "ai" | "human" | "resolved";

function timeShort(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initialsOf(c: Conv): string {
  const src = c.customer_name ?? c.customer_phone;
  return (
    src
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function InboxClient({ initialConversations }: { initialConversations: Conv[] }) {
  const [conversations, setConversations] = useState<Conv[]>(initialConversations);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [togglingAi, setTogglingAi] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (filter === "ai" && !(c.status === "open" && c.is_ai_active)) return false;
      if (filter === "human" && !(c.status === "open" && !c.is_ai_active)) return false;
      if (filter === "resolved" && c.status !== "resolved") return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${c.customer_name ?? ""} ${c.customer_phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [conversations, filter, search]);

  const refreshConversations = useCallback(async () => {
    const res = await fetch("/api/inbox/conversations", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { conversations: Conv[] };
    setConversations(data.conversations);
  }, []);

  const refreshMessages = useCallback(async (id: string | null) => {
    if (!id) {
      setMessages([]);
      return;
    }
    const res = await fetch(
      `/api/inbox/messages?conversationId=${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return;
    const data = (await res.json()) as { messages: Msg[] };
    setMessages(data.messages);
  }, []);

  // Fetch messages whenever the user selects a different conversation, and
  // poll periodically for new messages. setState happens inside the async
  // refresh fns rather than synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await refreshMessages(activeId);
    };
    void run();
    const t = setInterval(() => {
      void refreshConversations();
      if (activeId) void refreshMessages(activeId);
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [activeId, refreshConversations, refreshMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/inbox/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text: draft.trim() }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Gagal kirim: ${err.error ?? res.statusText}`);
        return;
      }
      setDraft("");
      await refreshMessages(activeId);
      await refreshConversations();
    } finally {
      setSending(false);
    }
  }

  async function handleToggleAi() {
    if (!active) return;
    setTogglingAi(true);
    try {
      const res = await fetch("/api/inbox/toggle-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversationId: active.id,
          isAiActive: !active.is_ai_active,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Gagal: ${err.error ?? res.statusText}`);
        return;
      }
      await refreshConversations();
    } finally {
      setTogglingAi(false);
    }
  }

  return (
    <div className="grid h-[calc(100vh-220px)] grid-cols-1 lg:grid-cols-[320px_1fr]">
      {/* List */}
      <div className="flex flex-col border-b border-[var(--color-border)] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-3">
          <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 px-3 py-1.5 text-sm">
            <Search className="h-3.5 w-3.5 text-[var(--color-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari customer..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
            />
          </div>
          <button
            type="button"
            aria-label="Filter"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-1.5 text-[var(--color-muted-fg)]"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex gap-1 border-b border-[var(--color-border)] p-2 text-xs">
          {(["all", "ai", "human", "resolved"] as const).map((f) => (
            <button
              type="button"
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Sparkles className="h-6 w-6 text-[var(--color-muted)]" />
              <div className="text-sm font-medium">Belum ada percakapan</div>
              <div className="text-xs text-[var(--color-muted-fg)]">
                Connect WhatsApp di /connect & coba kirim pesan dari nomor lain.
              </div>
            </div>
          ) : (
            filtered.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-[var(--color-border)] px-3 py-3 text-left transition-colors",
                    isActive
                      ? "bg-[var(--color-brand)]/8"
                      : "hover:bg-[var(--color-surface-2)]/40",
                  )}
                >
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                      {initialsOf(c)}
                    </div>
                    {c.unread_count > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[9px] font-mono font-semibold text-[#051910]">
                        {c.unread_count}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">
                        {c.customer_name ?? c.customer_phone}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        {timeShort(c.last_message_at)}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-muted-fg)] truncate">
                      {c.preview ?? "—"}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {c.status === "resolved" ? (
                        <Badge variant="muted">Resolved</Badge>
                      ) : c.is_ai_active ? (
                        <Badge variant="default">
                          <Bot className="h-2.5 w-2.5" /> AI
                        </Badge>
                      ) : (
                        <Badge variant="warning">
                          <User2 className="h-2.5 w-2.5" /> Human
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-col bg-[#0c1310]">
        {!active ? (
          <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-muted-fg)]">
            <div className="flex flex-col items-center gap-2">
              <Bot className="h-8 w-8 text-[var(--color-muted)]" />
              Pilih percakapan dari kiri.
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] font-mono text-xs font-semibold text-[#051910]">
                {initialsOf(active)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {active.customer_name ?? active.customer_phone}
                </div>
                <div className="text-xs text-[var(--color-muted-fg)]">
                  {active.customer_phone}
                </div>
              </div>
              <Button
                variant={active.is_ai_active ? "outline" : "primary"}
                size="sm"
                onClick={handleToggleAi}
                disabled={togglingAi}
              >
                {active.is_ai_active ? (
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

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-2">
                {messages.length === 0 ? (
                  <div className="my-12 flex flex-col items-center text-center text-sm text-[var(--color-muted-fg)]">
                    <Bot className="mb-2 h-8 w-8 text-[var(--color-muted)]" />
                    Belum ada pesan di percakapan ini.
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
                        ) : m.role === "admin" ? (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                            <User2 className="h-3 w-3" /> Admin
                          </div>
                        ) : null}
                        <p className="whitespace-pre-wrap leading-snug">{m.body}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                          {clock(m.created_at)}
                          {!fromCustomer ? <CheckCheck className="h-3 w-3" /> : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  active.is_ai_active
                    ? "Ketik untuk takeover dari AI..."
                    : "Ketik pesan..."
                }
                className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-brand)]/50 focus-visible:outline-none"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={!draft.trim() || sending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
