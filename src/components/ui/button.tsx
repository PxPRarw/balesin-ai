import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] font-semibold transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-yellow)]/60 disabled:pointer-events-none disabled:opacity-60 cursor-pointer border-2 border-[var(--color-foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand)] text-[var(--color-brand-ink)] shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        accent:
          "bg-[var(--color-pink)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        yellow:
          "bg-[var(--color-yellow)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        secondary:
          "bg-[var(--color-paper)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        outline:
          "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-paper)] shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        ghost:
          "border-transparent shadow-none text-[var(--color-foreground)] hover:bg-[var(--color-paper-2)] hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
        destructive:
          "bg-[var(--color-danger)] text-white shadow-[3px_3px_0_0_var(--color-foreground)] hover:shadow-[5px_5px_0_0_var(--color-foreground)] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
        link: "border-transparent shadow-none text-[var(--color-foreground)] underline decoration-[var(--color-yellow)] decoration-4 underline-offset-4 hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
