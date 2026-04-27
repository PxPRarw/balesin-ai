import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQ } from "@/components/marketing/faq";
import { getT } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pricing" };

const COMPARE_ROWS_ID = [
  ["Percakapan AI / bulan", "100", "5.000", "Unlimited"],
  ["Nomor WhatsApp", "1", "3", "Unlimited"],
  ["Knowledge base", "10 entri", "Unlimited", "Unlimited"],
  ["Live Inbox + Takeover", "✓", "✓", "✓"],
  ["Persona AI custom", "✗", "✓", "✓"],
  ["Multi-bahasa otomatis", "✓", "✓", "✓"],
  ["Analytics export (CSV/PDF)", "✗", "✓", "✓"],
  ["Multi-tim + role permission", "✗", "✗", "✓"],
  ["API access", "✗", "✗", "✓"],
  ["Custom integration", "✗", "✗", "✓"],
  ["Support", "Komunitas", "Chat (prioritas)", "Dedicated manager"],
  ["SLA uptime", "—", "99.5%", "99.9%"],
];

const COMPARE_ROWS_EN = [
  ["AI conversations / month", "100", "5,000", "Unlimited"],
  ["WhatsApp numbers", "1", "3", "Unlimited"],
  ["Knowledge base", "10 entries", "Unlimited", "Unlimited"],
  ["Live inbox + takeover", "✓", "✓", "✓"],
  ["Custom AI persona", "✗", "✓", "✓"],
  ["Auto multi-language", "✓", "✓", "✓"],
  ["Analytics export (CSV/PDF)", "✗", "✓", "✓"],
  ["Multi-team + role permissions", "✗", "✗", "✓"],
  ["API access", "✗", "✗", "✓"],
  ["Custom integrations", "✗", "✗", "✓"],
  ["Support", "Community", "Priority chat", "Dedicated manager"],
  ["SLA uptime", "—", "99.5%", "99.9%"],
];

const TIER_BG = [
  "bg-[var(--color-paper)]",
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-paper)]",
];

export default async function PricingPage() {
  const { locale, t } = await getT();
  const rows = locale === "en" ? COMPARE_ROWS_EN : COMPARE_ROWS_ID;

  return (
    <>
      <Section className="pb-12">
        <Container>
          <SectionHeader
            eyebrow="PRICING"
            eyebrowVariant="pink"
            title={
              <>
                {t.pricing.title}
                <span className="text-gradient-brand">{t.pricing.titleHl}</span>
              </>
            }
            subtitle={t.pricing.subtitle}
          />

          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-1 text-xs font-bold shadow-cartoon-sm">
              <button className="rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)] px-4 py-1.5 text-[var(--color-brand-ink)] shadow-[2px_2px_0_0_var(--color-foreground)]">
                Monthly
              </button>
              <button className="px-4 py-1.5 text-[var(--color-muted-fg)]">
                Yearly{" "}
                <span className="ml-1 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--color-foreground)]">
                  −20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
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
                  {"priceUSD" in tier && tier.priceUSD ? (
                    <div className="mt-1 text-xs font-bold text-[var(--color-foreground)]/65">
                      ≈ {tier.priceUSD} / {t.pricing.monthly}
                    </div>
                  ) : null}
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
                    {i === 2 ? (
                      <a href="mailto:hello@balesin.ai" className="block">
                        <Button variant="secondary" size="lg" className="w-full">
                          {t.pricing.ctaBiz}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Link
                        href={i === 1 ? "/signup?plan=pro" : "/signup"}
                        className="block"
                      >
                        <Button
                          variant={isMid ? "primary" : "secondary"}
                          size="lg"
                          className="w-full"
                        >
                          {isMid ? t.pricing.ctaPro : t.pricing.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment methods */}
          <div className="mt-12 rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-blue)] p-6 shadow-cartoon">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-extrabold text-[var(--color-foreground)]">
                  {locale === "id"
                    ? "Metode pembayaran 💳"
                    : "Payment methods 💳"}
                </h4>
                <p className="text-xs font-semibold text-[var(--color-foreground)]/80">
                  {locale === "id"
                    ? "Untuk customer Indonesia, semua via KlikQRIS (QRIS dynamic, aman, instan)."
                    : "For Indonesian customers, all payments via KlikQRIS (dynamic QRIS, secure, instant)."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  "QRIS",
                  "GoPay",
                  "OVO",
                  "Dana",
                  "ShopeePay",
                  "LinkAja",
                  "BCA",
                  "Mandiri",
                  "BRI",
                  "BNI",
                ].map((m) => (
                  <Badge key={m} variant="muted">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-lg)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-3 text-xs font-medium text-[var(--color-foreground)]">
              <span className="text-base">🌍</span>
              <span>
                {locale === "id"
                  ? "Pelanggan luar negeri? "
                  : "International customer? "}
                <a
                  href="mailto:hello@balesin.ai"
                  className="font-bold text-[var(--color-foreground)] underline decoration-[var(--color-pink)] decoration-4 underline-offset-2"
                >
                  hello@balesin.ai
                </a>
                {locale === "id"
                  ? " — kami kirim invoice via Wise/PayPal."
                  : " — we'll send an invoice via Wise/PayPal."}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Feature comparison */}
      <Section className="pt-0">
        <Container>
          <h2 className="mb-8 text-center font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            {locale === "id" ? "Bandingkan plan" : "Compare plans"}
          </h2>
          <div className="overflow-x-auto rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shadow-cartoon-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] text-left">
                  <th className="px-5 py-4 font-display font-extrabold text-[var(--color-foreground)]">
                    {locale === "id" ? "Fitur" : "Feature"}
                  </th>
                  <th className="px-5 py-4 font-display font-extrabold text-[var(--color-foreground)]">
                    Starter
                  </th>
                  <th className="px-5 py-4 font-display font-extrabold text-[var(--color-foreground)]">
                    Pro ⭐
                  </th>
                  <th className="px-5 py-4 font-display font-extrabold text-[var(--color-foreground)]">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr
                    key={r[0]}
                    className={cn(
                      "border-b-2 border-[var(--color-foreground)]/15 last:border-b-0",
                      ri % 2 === 1 ? "bg-[var(--color-paper-2)]" : "",
                    )}
                  >
                    {r.map((cell, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-5 py-3",
                          i === 0
                            ? "font-bold text-[var(--color-foreground)]"
                            : "font-semibold text-[var(--color-foreground)]/85",
                        )}
                      >
                        {cell === "✓" ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)]">
                            <Check className="h-3 w-3 text-[var(--color-brand-ink)]" />
                          </span>
                        ) : cell === "✗" ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-foreground)]/40 bg-[var(--color-paper-2)]">
                            <X className="h-3 w-3 text-[var(--color-muted)]" />
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <FAQ t={t} />
    </>
  );
}
