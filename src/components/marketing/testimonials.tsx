import { Container, Section, SectionHeader } from "@/components/ui/container";
import { Star } from "lucide-react";
import { getT } from "@/lib/i18n/server";

const TESTIMONIALS_ID = [
  {
    name: "Riska Wulandari",
    role: "Owner, @modeststyle.id",
    quote:
      "Dulu CS-an gua telat bales bisa 6-8 jam, banyak customer kabur ke kompetitor. Pakai BalesinAI, semua keharangkep dan gua bisa fokus produksi. ROI bulan pertama udah balik.",
  },
  {
    name: "Bagus Pradana",
    role: "Founder, KopiKita",
    quote:
      "Kami punya 4 outlet dengan WA berbeda. BalesinAI manage semuanya dari 1 dashboard. Conversion order naik 38% gara-gara respons cepet 24 jam.",
  },
  {
    name: "Anggi & Reza",
    role: "@homecare.local",
    quote:
      "AI-nya nyambung banget sama bahasa customer kami yang santai. Bahkan kadang temen kami pikir itu kami yang bales 😅. Worth it banget.",
  },
];

const TESTIMONIALS_EN = [
  {
    name: "Riska Wulandari",
    role: "Owner, @modeststyle.id",
    quote:
      "We used to take 6-8 hours to reply, losing tons of customers to competitors. With BalesinAI, every chat is captured and I can focus on production. ROI in month one.",
  },
  {
    name: "Bagus Pradana",
    role: "Founder, KopiKita",
    quote:
      "We run 4 outlets on different WhatsApp numbers. BalesinAI manages all of them from one dashboard. Conversion is up 38% thanks to instant 24/7 replies.",
  },
  {
    name: "Anggi & Reza",
    role: "@homecare.local",
    quote:
      "The AI nails our casual brand voice. Sometimes our friends think we're the ones replying 😅. Absolutely worth it.",
  },
];

const CARD_BG = [
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-blue)]",
  "bg-[var(--color-pink)]",
];
const TILTS = ["tilt-l-2", "tilt-r", "tilt-l"];
const AVATAR_BG = [
  "bg-[var(--color-pink)]",
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-accent)]",
];

export async function Testimonials() {
  const { locale, t } = await getT();
  const items = locale === "en" ? TESTIMONIALS_EN : TESTIMONIALS_ID;

  return (
    <Section className="relative">
      <Container>
        <SectionHeader
          eyebrow={locale === "id" ? "TESTIMONI" : "TESTIMONIALS"}
          eyebrowVariant="brand"
          title={
            <>
              {t.testimonials.title}
              <span className="text-gradient-brand">{t.testimonials.titleHl}</span>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((tt, i) => (
            <div
              key={tt.name}
              className={`relative rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] ${CARD_BG[i]} p-6 shadow-cartoon ${TILTS[i]} press-cartoon-lg`}
            >
              <div className="flex gap-0.5 text-[var(--color-foreground)]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed font-medium text-[var(--color-foreground)]">
                &ldquo;{tt.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t-2 border-[var(--color-foreground)] pt-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] ${AVATAR_BG[i]} font-display text-sm font-extrabold text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]`}
                >
                  {tt.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-foreground)]">
                    {tt.name}
                  </div>
                  <div className="text-xs text-[var(--color-foreground)]/70">
                    {tt.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
