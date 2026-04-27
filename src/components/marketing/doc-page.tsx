import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Star, Burst, Lightning } from "@/components/shared/stickers";
import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

export function DocPage({
  eyebrow,
  eyebrowVariant = "yellow",
  title,
  highlight,
  intro,
  updatedAt,
  crumbs,
  children,
}: {
  eyebrow?: string;
  eyebrowVariant?: "yellow" | "pink" | "blue" | "accent" | "brand";
  title: string;
  highlight?: string;
  intro?: React.ReactNode;
  updatedAt?: string;
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  const eyebrowBg = {
    yellow: "bg-[var(--color-yellow)]",
    pink: "bg-[var(--color-pink)]",
    blue: "bg-[var(--color-blue)]",
    accent: "bg-[var(--color-accent)]",
    brand: "bg-[var(--color-brand)]",
  }[eyebrowVariant];

  return (
    <>
      <Section className="pt-14 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <Star className="absolute left-[6%] top-12 h-10 w-10 wiggle" />
          <Burst className="absolute right-[8%] top-24 h-12 w-12 spin-slow" />
          <Lightning className="absolute right-[24%] bottom-6 h-10 w-10 hidden md:block float" />
        </div>
        <Container className="relative">
          {crumbs && crumbs.length ? (
            <nav className="mb-5 flex items-center gap-1 text-xs font-bold text-[var(--color-foreground)]/70">
              {crumbs.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-foreground)] hover:bg-[var(--color-yellow)]"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 ? (
                    <ChevronRight className="h-3.5 w-3.5 text-[var(--color-foreground)]/50" />
                  ) : null}
                </span>
              ))}
            </nav>
          ) : null}

          {eyebrow ? (
            <div
              className={cn(
                "mb-4 inline-block rounded-full border-2 border-[var(--color-foreground)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]",
                eyebrowBg,
              )}
            >
              {eyebrow}
            </div>
          ) : null}

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--color-foreground)] max-w-4xl">
            {title}
            {highlight ? (
              <>
                {" "}
                <span className="marker-yellow">{highlight}</span>
              </>
            ) : null}
          </h1>

          {intro ? (
            <div className="mt-5 max-w-2xl text-base sm:text-lg font-medium text-[var(--color-muted-fg)] leading-relaxed">
              {intro}
            </div>
          ) : null}

          {updatedAt ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] pulse-dot" />
              Terakhir diupdate · {updatedAt}
            </div>
          ) : null}
        </Container>
      </Section>

      <Section className="pt-0 pb-24">
        <Container>
          <article className="prose-cartoon mx-auto max-w-3xl">{children}</article>
        </Container>
      </Section>
    </>
  );
}

/**
 * Simple "callout" panel for tips / warnings inside doc pages.
 */
export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warn" | "ok" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const cls = {
    info: "bg-[var(--color-blue)]",
    warn: "bg-[var(--color-orange)]",
    ok: "bg-[var(--color-brand)] text-[var(--color-brand-ink)]",
    tip: "bg-[var(--color-yellow)]",
  }[variant];
  const emoji = { info: "ℹ️", warn: "⚠️", ok: "✅", tip: "💡" }[variant];
  return (
    <div
      className={cn(
        "my-6 rounded-[var(--radius-xl)] border-2 border-[var(--color-foreground)] p-5 shadow-cartoon",
        cls,
      )}
    >
      <div className="mb-1 flex items-center gap-2 font-display text-base font-extrabold">
        <span>{emoji}</span>
        {title}
      </div>
      <div className="text-sm font-medium leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * Reusable "card" used in doc landing pages to link to sub-pages.
 */
export function DocCard({
  href,
  title,
  desc,
  emoji,
  bg = "bg-[var(--color-paper)]",
  external,
}: {
  href: string;
  title: string;
  desc: string;
  emoji: string;
  bg?: string;
  external?: boolean;
}) {
  const Inner = (
    <div
      className={cn(
        "group flex h-full flex-col rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] p-5 shadow-cartoon press-cartoon",
        bg,
      )}
    >
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] text-2xl shadow-[2px_2px_0_0_var(--color-foreground)]">
        {emoji}
      </div>
      <h3 className="font-display text-lg font-extrabold leading-tight text-[var(--color-foreground)]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm font-medium text-[var(--color-foreground)]/75 leading-relaxed">
        {desc}
      </p>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[var(--color-foreground)]">
        Baca selengkapnya
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className="block">
        {Inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block">
      {Inner}
    </Link>
  );
}
