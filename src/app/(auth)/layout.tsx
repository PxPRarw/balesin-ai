import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Star, Heart } from "@/components/shared/stickers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b-2 border-[var(--color-foreground)] bg-[var(--color-background)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Home" className="hover:rotate-[-2deg] transition-transform">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm font-bold text-[var(--color-foreground)] underline decoration-[var(--color-yellow)] decoration-4 underline-offset-4 hover:decoration-[var(--color-pink)]"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="relative flex flex-1 items-center justify-center px-4 py-12">
        {/* Floating decorations */}
        <Star className="absolute top-12 left-[8%] h-12 w-12 wiggle hidden md:block" />
        <Heart className="absolute bottom-16 right-[10%] h-10 w-10 float hidden md:block" />
        {children}
      </main>
    </div>
  );
}
