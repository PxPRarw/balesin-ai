import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { HeroChatPreview } from "./hero-chat-preview";
import { Underline, Heart, Lightning } from "@/components/shared/stickers";

export async function Hero() {
  const { locale, t } = await getT();

  return (
    <section className="relative overflow-hidden pb-16 sm:pb-24">
      {/* Floating decorative stickers */}
      <Heart className="absolute top-10 right-[8%] h-10 w-10 hidden md:block float opacity-90" />
      <Lightning className="absolute top-32 left-[6%] h-12 w-8 hidden md:block wiggle opacity-90" />

      <Container className="relative pt-12 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Left */}
          <div>
            <Badge variant="yellow">
              <Sparkles className="h-3 w-3" />
              {t.hero.badge}
            </Badge>

            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-[var(--color-foreground)]">
              {t.hero.titleA}
              <span className="relative inline-block">
                <span className="relative z-10 marker-yellow">
                  {t.hero.titleB}
                </span>
                <Underline className="absolute -bottom-3 left-0 right-0 h-3 w-full" />
              </span>
              {t.hero.titleC}
            </h1>

            <p className="mt-7 max-w-xl text-base sm:text-lg text-[var(--color-muted-fg)] leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#demo">
                <Button size="xl" variant="primary">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how">
                <Button size="xl" variant="secondary">
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-3 py-1.5 text-xs font-semibold shadow-[2px_2px_0_0_var(--color-foreground)]">
              <span className="text-base">🛡️</span>
              {t.hero.trust}
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 max-w-md text-sm">
              {(locale === "id"
                ? [
                    "Setup 5 menit",
                    "Tanpa kartu kredit",
                    "Bahasa ID & EN",
                    "Anti banned",
                  ]
                : [
                    "5-minute setup",
                    "No credit card",
                    "ID & EN supported",
                    "Ban-proof",
                  ]
              ).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-medium text-[var(--color-foreground)]"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)]">
                    <Check className="h-3 w-3 text-[var(--color-brand-ink)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — phone preview */}
          <div className="relative">
            <HeroChatPreview locale={locale} />
          </div>
        </div>

        {/* Metrics strip — cartoon card */}
        <div className="relative mt-16 sm:mt-24 grid grid-cols-2 sm:grid-cols-4 rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shadow-cartoon-lg overflow-hidden">
          {[
            { v: "1.2M+", l: t.metrics.replied, bg: "bg-[var(--color-yellow)]" },
            { v: "320+", l: t.metrics.stores, bg: "bg-[var(--color-pink)]" },
            { v: "99.9%", l: t.metrics.uptime, bg: "bg-[var(--color-blue)]" },
            { v: "2.4s", l: t.metrics.response, bg: "bg-[var(--color-accent)]" },
          ].map((m, i, arr) => (
            <div
              key={m.l}
              className={`${m.bg} px-4 py-6 sm:py-7 text-center ${
                i < arr.length - 1
                  ? "border-r-2 border-[var(--color-foreground)]"
                  : ""
              } ${
                i < 2 ? "border-b-2 sm:border-b-0 border-[var(--color-foreground)]" : ""
              } ${i === 0 || i === 2 ? "border-r-2 sm:border-r-2" : ""}`}
            >
              <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                {m.v}
              </div>
              <div className="mt-1 text-xs sm:text-sm font-semibold text-[var(--color-foreground)]/80">
                {m.l}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
