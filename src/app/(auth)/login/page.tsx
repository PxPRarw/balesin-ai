import Link from "next/link";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-8 shadow-cartoon-xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            Welcome <span className="marker-yellow">back!</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--color-muted-fg)]">
            Masuk ke dashboard BalesinAI kamu.
          </p>
        </div>
        <AuthForm mode="login" />
        <div className="mt-6 text-center text-sm font-medium text-[var(--color-muted-fg)]">
          Belum punya akun?{" "}
          <Link
            href="/signup"
            className="font-bold text-[var(--color-foreground)] underline decoration-[var(--color-pink)] decoration-4 underline-offset-2"
          >
            Daftar gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
