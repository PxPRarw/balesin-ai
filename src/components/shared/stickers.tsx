/**
 * Cartoon decoration stickers (SVG). Scatter around hero / sections for vibe.
 * All shapes use --color-foreground for outline so they match the brand.
 */
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function Star({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M32 4l7.5 18.5L59 25l-14.5 13L48 58 32 47.5 16 58l3.5-20L5 25l19.5-2.5L32 4z"
        fill="#FFD93D"
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 30"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M2 15 Q 12 2 22 15 T 42 15 T 62 15 T 82 15 T 102 15"
        stroke="#FF6B9D"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({ className, color = "#A78BFA" }: Props & { color?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M52 8c14 0 32 6 38 22s-2 30-12 40-26 22-42 16S8 60 6 44 18 12 32 8s12 0 20 0z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3.5"
      />
    </svg>
  );
}

export function Burst({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M32 4l5 14 14-7-7 14 14 5-14 5 7 14-14-7-5 14-5-14-14 7 7-14L4 32l14-5-7-14 14 7 5-14z"
        fill="#FF8C42"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Heart({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 56"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M32 50C8 36 4 22 4 16 4 9 9 4 16 4c6 0 11 4 16 10 5-6 10-10 16-10 7 0 12 5 12 12 0 6-4 20-28 34z"
        fill="#FF6B9D"
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Lightning({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 56"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M18 4L4 30h10L8 52l20-28H18l4-20z"
        fill="#FFD93D"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dots({ className }: Props) {
  return (
    <svg
      viewBox="0 0 80 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (i % 6) * 14 + 6;
        const y = Math.floor(i / 6) * 16 + 8;
        return <circle key={i} cx={x} cy={y} r={2.5} fill="#1a1a1a" />;
      })}
    </svg>
  );
}

export function Underline({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 16"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <path
        d="M2 10 Q 50 0 100 8 T 198 6"
        stroke="#FFD93D"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
