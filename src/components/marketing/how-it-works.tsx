import { Container, Section, SectionHeader } from "@/components/ui/container";
import { getT } from "@/lib/i18n/server";

const STEP_COLORS = [
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-pink)]",
  "bg-[var(--color-blue)]",
];
const TILTS = ["tilt-l", "", "tilt-r"];

export async function HowItWorks() {
  const { t } = await getT();

  return (
    <Section id="how" className="relative">
      <Container>
        <SectionHeader
          eyebrow="HOW IT WORKS"
          eyebrowVariant="blue"
          title={
            <>
              {t.how.title}
              <span className="text-gradient-brand">{t.how.titleHl}</span>
            </>
          }
          subtitle={t.how.subtitle}
        />

        <div className="relative grid gap-6 lg:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <div
              key={s.n}
              className={`relative rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-7 shadow-cartoon press-cartoon-lg ${TILTS[i]}`}
            >
              {/* Big number badge */}
              <div
                className={`absolute -top-5 -left-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] ${STEP_COLORS[i]} font-display text-xl font-extrabold text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)]`}
              >
                {s.n}
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted-fg)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
