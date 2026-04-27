"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

export function LangToggle({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function setLocale(next: Locale) {
    if (next === current || pending) return;
    start(() => {
      document.cookie = `balesin_locale=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] p-0.5 text-xs font-bold shadow-[2px_2px_0_0_var(--color-foreground)]",
        pending && "opacity-70",
      )}
      role="group"
      aria-label="Language"
    >
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            "px-3 py-1 rounded-full uppercase tracking-wider transition-colors",
            current === l
              ? "bg-[var(--color-yellow)] text-[var(--color-foreground)]"
              : "text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)]",
          )}
          aria-pressed={current === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
