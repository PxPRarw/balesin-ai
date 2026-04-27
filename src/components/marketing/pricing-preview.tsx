import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

const TIER_BG = [
  "bg-[var(--color-paper)]",
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-paper)]",
];

export async function PricingPreview() {
  const { t } = await getT();

  return (
    <Section id="pricing" className="relative bg-[var(--color-paper-2)] border-y-2 border-[var(--color-foreground)]">
      <Container>
        <SectionHeader
          eyebrow="PRICING"
          eyebrowVariant="accent"
          title={
            <>
              {t.pricing.title}
              <span className="text-gradient-brand">{t.pricing.titleHl}</span>
            </>
          }
          subtitle={t.pricing.subtitle}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {t.pricing.tiers.map((tier, i) => {
            const isMid = i === 1;
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] p-7 transition-transform",
                  TIER_BG[i],
                  isMid
                    ? "shadow-cartoon-xl scale-[1.03] z-10"
                    : "shadow-cartoon press-cartoon-lg",
                )}
              >
                {isMid ? (
                  <Badge
                    variant="pink"
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    ⭐ {t.pricing.mostPopular}
                  </Badge>
                ) : null}
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
                  {tier.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                    {tier.price}
                  </span>
                  {tier.price !== "Gratis" && tier.price !== "Free" ? (
                    <span className="text-sm font-semibold text-[var(--color-foreground)]/70">
                      / {t.pricing.monthly}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--color-foreground)]/80">
                  {tier.desc}
                </p>

                <ul className="mt-6 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)]">
                        <Check className="h-3 w-3 text-[var(--color-brand-ink)]" />
                      </span>
                      <span className="font-medium text-[var(--color-foreground)]">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 pt-6 border-t-2 border-[var(--color-foreground)]">
                  <Link href="/pricing" className="block">
                    <Button
                      variant={isMid ? "primary" : "secondary"}
                      size="lg"
                      className="w-full"
                    >
                      {i === 2
                        ? t.pricing.ctaBiz
                        : isMid
                        ? t.pricing.ctaPro
                        : t.pricing.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
