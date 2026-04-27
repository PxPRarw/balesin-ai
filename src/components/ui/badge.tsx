import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-foreground)] px-2.5 py-0.5 text-xs font-bold whitespace-nowrap shadow-[2px_2px_0_0_var(--color-foreground)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-brand)] text-[var(--color-brand-ink)]",
        muted: "bg-[var(--color-paper)] text-[var(--color-foreground)]",
        accent: "bg-[var(--color-accent)] text-[var(--color-foreground)]",
        yellow: "bg-[var(--color-yellow)] text-[var(--color-foreground)]",
        pink: "bg-[var(--color-pink)] text-[var(--color-foreground)]",
        blue: "bg-[var(--color-blue)] text-[var(--color-foreground)]",
        success: "bg-[var(--color-brand)] text-[var(--color-brand-ink)]",
        warning: "bg-[var(--color-yellow)] text-[var(--color-foreground)]",
        danger: "bg-[var(--color-danger)] text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
