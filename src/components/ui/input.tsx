import * as React from "react";
import { cn } from "@/lib/utils";

const baseInput =
  "flex w-full rounded-[var(--radius-lg)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] text-sm font-medium text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:shadow-[3px_3px_0_0_var(--color-foreground)] focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-60 transition-[transform,box-shadow]";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(baseInput, "h-11 px-4 py-2", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(baseInput, "min-h-[100px] px-4 py-3 resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
