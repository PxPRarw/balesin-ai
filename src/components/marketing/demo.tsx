"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send, Bot, RefreshCw, CheckCheck, Sparkles } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, now } from "@/lib/utils";
import type { Dict, Locale } from "@/lib/i18n/dictionary";

type Msg = { role: "user" | "assistant"; content: string; ts: number };

function buildInitialAssistant(locale: Locale): Msg {
  return {
    role: "assistant",
    content:
      locale === "id"
        ? "Halo kak 👋 Aku admin Mode Atelier (powered by BalesinAI). Mau tanya produk, harga, atau ongkir? Coba aja!"
        : "Hi there 👋 I'm the assistant for Mode Atelier (powered by BalesinAI). Ask me about products, prices, or shipping — go ahead!",
    ts: now(),
  };
}

export function Demo({ locale, t }: { locale: Locale; t: Dict }) {
  const [messages, setMessages] = useState<Msg[]>(() => [
    buildInitialAssistant(locale),
  ]);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const next: Msg[] = [
      ...messages,
      { role: "user", content: trimmed, ts: now() },
    ];
    setMessages(next);
    setDraft("");
    setThinking(true);

    startTransition(async () => {
      try {
        const res = await fetch("/api/chat/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = (await res.json()) as { reply?: string; error?: string };
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply!, ts: now() },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                locale === "id"
                  ? "Maaf kak, lagi ada gangguan kecil. Coba lagi sebentar ya."
                  : "Sorry, slight hiccup on my end. Please try again in a moment.",
              ts: now(),
            },
          ]);
        }
      } finally {
        setThinking(false);
      }
    });
  }

  function reset() {
    setMessages([buildInitialAssistant(locale)]);
    setDraft("");
  }

  return (
    <Section id="demo" className="relative bg-[var(--color-blue-soft)] border-y-2 border-[var(--color-foreground)]">
      <Container>
        <SectionHeader
          eyebrow={locale === "id" ? "DEMO LIVE" : "LIVE DEMO"}
          eyebrowVariant="pink"
          title={
            <>
              {t.demo.title}
              <span className="text-gradient-fun">{t.demo.titleHl}</span>
            </>
          }
          subtitle={t.demo.subtitle}
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Side panel — examples */}
          <div className="space-y-4">
            <div className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] p-5 shadow-cartoon">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
                <Sparkles className="h-3.5 w-3.5" />
                {t.demo.try}
              </div>
              <div className="mt-3 space-y-2">
                {t.demo.examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => send(ex)}
                    disabled={thinking || pending}
                    className="group flex w-full items-start gap-2 rounded-[var(--radius-lg)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-3.5 py-2.5 text-left text-sm font-medium text-[var(--color-foreground)] press-cartoon shadow-[2px_2px_0_0_var(--color-foreground)] disabled:opacity-50"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-pink)] text-[10px] font-extrabold text-[var(--color-foreground)]">
                      ↗
                    </span>
                    <span>{ex}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-5 text-sm font-medium text-[var(--color-muted-fg)] leading-relaxed shadow-cartoon">
              <Badge variant="accent" className="mb-2">
                Demo store: Mode Atelier
              </Badge>
              <p>{t.demo.poweredBy}</p>
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shadow-cartoon-lg">
            {/* Header — WhatsApp-style */}
            <div className="flex items-center gap-3 border-b-2 border-[var(--color-foreground)] bg-[#075e54] px-5 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] font-display text-sm font-extrabold text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]">
                MA
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold flex items-center gap-2 text-white">
                  Mode Atelier
                  <Bot className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 pulse-dot" />
                  {locale === "id"
                    ? "online · BalesinAI sedang aktif"
                    : "online · BalesinAI active"}
                </div>
              </div>
              <button
                onClick={reset}
                aria-label="Reset"
                className="rounded-full border-2 border-white/30 p-1.5 text-white hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages — WhatsApp cream wallpaper */}
            <div ref={scrollRef} className="h-[440px] overflow-y-auto wa-bg p-4">
              <div className="flex flex-col gap-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%]",
                      m.role === "user" ? "self-start" : "self-end",
                    )}
                  >
                    <div
                      className={cn(
                        "border-2 border-[var(--color-foreground)] px-3.5 py-2 text-sm shadow-[2px_2px_0_0_var(--color-foreground)]",
                        m.role === "user"
                          ? "rounded-2xl rounded-bl-md bg-white text-[var(--color-foreground)]"
                          : "rounded-2xl rounded-br-md bg-[#dcf8c6] text-[var(--color-foreground)]",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-2)]">
                          <Bot className="h-3 w-3" /> AI
                        </div>
                      ) : null}
                      <p className="whitespace-pre-wrap leading-snug">{m.content}</p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[var(--color-muted-fg)]" suppressHydrationWarning>
                        {new Date(m.ts).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                        {m.role === "assistant" ? (
                          <CheckCheck className="h-3 w-3 text-[var(--color-blue-2)]" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}

                {thinking ? (
                  <div className="self-end mt-1">
                    <div className="rounded-2xl rounded-br-md border-2 border-[var(--color-foreground)] bg-[#dcf8c6] px-4 py-2.5 shadow-[2px_2px_0_0_var(--color-foreground)]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-2)]">
                          {t.demo.thinking}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/70 typing-dot" />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/70 typing-dot"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/70 typing-dot"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.demo.placeholder}
                className="flex-1 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-4 py-2.5 text-sm font-medium placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:shadow-[2px_2px_0_0_var(--color-foreground)] focus-visible:-translate-x-[1px] focus-visible:-translate-y-[1px] transition-[transform,box-shadow]"
                aria-label="Message"
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 rounded-full"
                disabled={!draft.trim() || thinking}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
