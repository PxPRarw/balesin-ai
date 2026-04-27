import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { LangToggle } from "@/components/shared/lang-toggle";
import { getT } from "@/lib/i18n/server";

export async function MarketingNav() {
  const { locale, t } = await getT();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--color-foreground)] bg-[var(--color-background)]">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="BalesinAI home" className="hover:rotate-[-2deg] transition-transform">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <a
              href="#features"
              className="rounded-full px-3 py-1.5 hover:bg-[var(--color-yellow)] transition-colors"
            >
              {t.nav.features}
            </a>
            <a
              href="#how"
              className="rounded-full px-3 py-1.5 hover:bg-[var(--color-pink)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {t.nav.howItWorks}
            </a>
            <Link
              href="/pricing"
              className="rounded-full px-3 py-1.5 hover:bg-[var(--color-blue)] transition-colors"
            >
              {t.nav.pricing}
            </Link>
            <a
              href="#faq"
              className="rounded-full px-3 py-1.5 hover:bg-[var(--color-accent)] transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LangToggle current={locale} />
          <Link href="/login" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              {t.nav.login}
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              {t.nav.signup}
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
