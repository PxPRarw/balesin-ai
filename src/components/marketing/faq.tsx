"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n/dictionary";

export function FAQ({ t }: { t: Dict }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="relative">
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          eyebrowVariant="yellow"
          title={
            <>
              {t.faq.title}
              <span className="text-gradient-brand">{t.faq.titleHl}</span>
            </>
          }
        />

        <div className="space-y-4">
          {t.faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-[var(--radius-xl)] border-2 border-[var(--color-foreground)] transition-shadow",
                  expanded
                    ? "bg-[var(--color-yellow)] shadow-cartoon-lg"
                    : "bg-[var(--color-paper)] shadow-cartoon hover:shadow-cartoon-lg",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  aria-expanded={expanded}
                >
                  <span className="font-display text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] transition-transform duration-300",
                      expanded && "rotate-180 bg-[var(--color-pink)]",
                    )}
                  >
                    <ChevronDown className="h-4 w-4 text-[var(--color-foreground)]" />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm font-medium text-[var(--color-foreground)]/85 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
