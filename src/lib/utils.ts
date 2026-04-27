import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRelativeTime(date: Date | string, locale: "id" | "en" = "id"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  const mins = Math.round(diff / 60);
  if (mins < 1) return locale === "id" ? "baru saja" : "just now";
  if (mins < 60) return locale === "id" ? `${mins}m lalu` : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return locale === "id" ? `${hours}j lalu` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return locale === "id" ? `${days}h lalu` : `${days}d ago`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-3);
}

/**
 * `Date.now()` and `Math.random()` cannot be called directly during render in
 * React 19 — use these helpers in event handlers / lazy state initializers
 * instead. Wrapping them keeps the impure call out of component scope so the
 * `react-hooks/purity` lint rule stays happy.
 */
export function now(): number {
  return Date.now();
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 12);
}
