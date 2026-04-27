import { cn } from "@/lib/utils";

export function Logo({
  className,
  textClassName,
  iconOnly = false,
}: {
  className?: string;
  textClassName?: string;
  iconOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-8 w-8" />
      {iconOnly ? null : (
        <span
          className={cn(
            "font-display text-xl font-extrabold tracking-tight text-[var(--color-foreground)]",
            textClassName,
          )}
        >
          Balesin<span className="text-[var(--color-brand-2)]">AI</span>
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="#25D366"
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <path
        d="M18 22c0-3 2.5-5.5 5.5-5.5h17c3 0 5.5 2.5 5.5 5.5v11c0 3-2.5 5.5-5.5 5.5h-7l-7.5 6.5v-6.5h-2.5c-3 0-5.5-2.5-5.5-5.5V22z"
        fill="white"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M27 28l3.5 3.5L37 23.5"
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
