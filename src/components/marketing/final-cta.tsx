import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { Star, Squiggle, Burst } from "@/components/shared/stickers";

export async function FinalCta() {
  const { t } = await getT();
  return (
    <Section className="pb-32">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-brand)] p-10 sm:p-16 text-center shadow-cartoon-xl">
          <Star className="absolute top-6 left-8 h-12 w-12 wiggle" />
          <Burst className="absolute bottom-8 right-10 h-14 w-14 spin-slow" />
          <Squiggle className="absolute top-10 right-12 h-6 w-32 hidden sm:block" />

          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--color-brand-ink)]">
              {t.finalCta.title}
            </h2>
            <p className="mt-5 text-base sm:text-lg font-medium text-[var(--color-brand-ink)]/85 max-w-2xl mx-auto">
              {t.finalCta.subtitle}
            </p>
            <div className="mt-9 flex justify-center">
              <Link href="/signup">
                <Button size="xl" variant="yellow">
                  {t.finalCta.button}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
