import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/shared/logo";
import { getT } from "@/lib/i18n/server";

export async function MarketingFooter() {
  const { t } = await getT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)]">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm font-medium text-[var(--color-muted-fg)] leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)] px-3 py-1.5 text-xs font-bold text-[var(--color-brand-ink)] shadow-[2px_2px_0_0_var(--color-foreground)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-foreground)] pulse-dot" />
              All systems operational
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-wider mb-3 text-[var(--color-foreground)]">
              {t.footer.product}
            </h4>
            <ul className="space-y-2 text-sm font-medium text-[var(--color-muted-fg)]">
              <li>
                <a href="#features" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-yellow)] decoration-4">
                  {t.footer.links.features}
                </a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-pink)] decoration-4">
                  {t.footer.links.pricing}
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-blue)] decoration-4">
                  {t.footer.links.docs}
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-accent)] decoration-4">
                  {t.footer.links.api}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-wider mb-3 text-[var(--color-foreground)]">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm font-medium text-[var(--color-muted-fg)]">
              <li>
                <Link href="/legal/privacy" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-yellow)] decoration-4">
                  {t.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-pink)] decoration-4">
                  {t.footer.links.terms}
                </Link>
              </li>
              <li>
                <Link href="/legal/security" className="hover:text-[var(--color-foreground)] hover:underline decoration-[var(--color-blue)] decoration-4">
                  {t.footer.links.security}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t-2 border-[var(--color-foreground)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-[var(--color-foreground)]/70">
            © {year} BalesinAI. {t.footer.copyright}.
          </p>
          <p className="text-xs font-semibold text-[var(--color-foreground)]/70">
            Built with <span className="text-[var(--color-pink-2)]">♥</span>{" "}
            for olshop & UMKM Indonesia.
          </p>
        </div>
      </Container>
    </footer>
  );
}
