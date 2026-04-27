import { Container, Section, SectionHeader } from "@/components/ui/container";
import {
  BookOpen,
  ShieldCheck,
  Inbox,
  Sparkles,
  Languages,
  BarChart3,
} from "lucide-react";
import { getT } from "@/lib/i18n/server";

const ICONS = [BookOpen, ShieldCheck, Inbox, Sparkles, Languages, BarChart3];
const CARD_COLORS = [
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-pink)]",
  "bg-[var(--color-blue)]",
  "bg-[var(--color-accent)]",
  "bg-[var(--color-brand)]",
  "bg-[var(--color-orange)]",
];
const TILTS = ["tilt-l", "tilt-r", "", "tilt-r", "tilt-l", ""];

export async function Features() {
  const { t } = await getT();

  return (
    <Section id="features" className="relative bg-paper border-y-2 border-[var(--color-foreground)]">
      <Container>
        <SectionHeader
          eyebrow="FEATURES"
          eyebrowVariant="pink"
          title={
            <>
              {t.features.title}
              <span className="text-gradient-fun">{t.features.titleHl}</span>
            </>
          }
          subtitle={t.features.subtitle}
        />

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f, i) => {
            const Icon = ICONS[i] ?? Sparkles;
            const bg = CARD_COLORS[i % CARD_COLORS.length];
            const tilt = TILTS[i % TILTS.length];
            return (
              <div
                key={f.title}
                className={`group relative rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] ${bg} p-6 shadow-cartoon press-cartoon-lg ${tilt} hover:tilt-r-2 transition-transform`}
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-foreground)]/85 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
