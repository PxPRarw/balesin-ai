import Link from "next/link";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-8 shadow-cartoon-xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            Coba <span className="marker-yellow">BalesinAI</span> gratis
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--color-muted-fg)]">
            100 percakapan AI/bulan gratis selamanya. Tanpa kartu kredit.
          </p>
        </div>
        <AuthForm mode="signup" />
        <div className="mt-6 text-center text-sm font-medium text-[var(--color-muted-fg)]">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-[var(--color-foreground)] underline decoration-[var(--color-pink)] decoration-4 underline-offset-2"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
