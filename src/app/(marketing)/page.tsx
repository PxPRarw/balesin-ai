import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Demo } from "@/components/marketing/demo";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { FAQ } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { getT } from "@/lib/i18n/server";

export default async function HomePage() {
  const { locale, t } = await getT();
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Demo locale={locale} t={t} />
      <Testimonials />
      <PricingPreview />
      <FAQ t={t} />
      <FinalCta />
    </>
  );
}
