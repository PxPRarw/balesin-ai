import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-20 sm:py-28", className)}
      {...props}
    />
  );
}

export function SectionHeader({
  eyebrow,
  eyebrowVariant = "yellow",
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  eyebrowVariant?: "yellow" | "pink" | "blue" | "accent" | "brand";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
}) {
  const eyebrowBg = {
    yellow: "bg-[var(--color-yellow)]",
    pink: "bg-[var(--color-pink)]",
    blue: "bg-[var(--color-blue)]",
    accent: "bg-[var(--color-accent)]",
    brand: "bg-[var(--color-brand)]",
  }[eyebrowVariant];

  return (
    <div
      className={cn(
        "mb-12 sm:mb-16 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-4 inline-block rounded-full border-2 border-[var(--color-foreground)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]",
            eyebrowBg,
          )}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--color-foreground)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 text-base sm:text-lg text-[var(--color-muted-fg)] leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
