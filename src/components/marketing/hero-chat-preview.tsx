"use client";

import { motion } from "framer-motion";
import { Bot, Check, CheckCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/dictionary";
import { Star, Burst } from "@/components/shared/stickers";

const SCRIPT_ID: { from: "user" | "ai"; text: string; time: string }[] = [
  { from: "user", text: "Halo kak, masih ada hoodie hitam ukuran L?", time: "10:24" },
  {
    from: "ai",
    text:
      "Halo kak! Iyaa Hoodie Classic Black ukuran L masih ready 7 pcs ✨ Harga Rp 285.000, free ongkir Jabodetabek hari ini. Mau aku bantu order?",
    time: "10:24",
  },
  { from: "user", text: "Bisa COD ga? Sama berapa lama sampe Surabaya?", time: "10:25" },
  {
    from: "ai",
    text:
      "Bisa kak! Untuk Surabaya kami pakai JNE/J&T, estimasi 2–3 hari kerja. COD juga available, biaya admin Rp 5.000 ya. Mau dipesankan sekarang? 🛍️",
    time: "10:25",
  },
];

const SCRIPT_EN: { from: "user" | "ai"; text: string; time: string }[] = [
  { from: "user", text: "Hi! Do you still have black hoodies in size L?", time: "10:24" },
  {
    from: "ai",
    text:
      "Hi! Yes, the Classic Black Hoodie in size L is still in stock — 7 pcs left ✨ Rp 285,000, free shipping in Jakarta area today. Want me to help you order?",
    time: "10:24",
  },
  { from: "user", text: "Can I do COD? And how long to ship to Surabaya?", time: "10:25" },
  {
    from: "ai",
    text:
      "Yes! For Surabaya we use JNE/J&T, ETA 2–3 working days. COD is available with a Rp 5,000 admin fee. Want me to place the order now? 🛍️",
    time: "10:25",
  },
];

export function HeroChatPreview({ locale }: { locale: Locale }) {
  const script = locale === "en" ? SCRIPT_EN : SCRIPT_ID;

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Decorative stickers around phone */}
      <Star className="absolute -top-6 -left-4 h-12 w-12 wiggle z-10" />
      <Burst className="absolute -bottom-4 -right-4 h-14 w-14 spin-slow z-10" />

      {/* Phone frame — chunky cartoon outline */}
      <div className="relative tilt-r rounded-[2rem] border-[3px] border-[var(--color-foreground)] bg-[#0d1410] p-3 shadow-[8px_8px_0_0_var(--color-foreground)]">
        {/* Notch */}
        <div className="mx-auto h-5 w-28 rounded-b-2xl bg-black" />

        {/* WhatsApp header */}
        <div className="mt-2 flex items-center gap-3 rounded-t-2xl bg-[#075e54] px-4 py-3 border-b-2 border-[var(--color-foreground)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-foreground)] border-2 border-[var(--color-foreground)]">
            <span className="font-display text-sm font-extrabold">M</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">
              Mode <span className="text-emerald-300">·</span> Fashion
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 pulse-dot" />
              {locale === "id" ? "online · auto-reply aktif" : "online · auto-reply on"}
            </div>
          </div>
          <Bot className="h-4 w-4 text-emerald-200" />
        </div>

        {/* Messages area — WhatsApp cream wallpaper */}
        <div className="relative h-[460px] overflow-hidden rounded-b-2xl wa-bg">
          <div className="flex flex-col gap-2 p-4">
            {script.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.6, duration: 0.4 }}
                className={
                  m.from === "user"
                    ? "self-start max-w-[85%]"
                    : "self-end max-w-[85%]"
                }
              >
                <div
                  className={
                    m.from === "ai"
                      ? "rounded-2xl rounded-br-md border-2 border-[var(--color-foreground)] bg-[#dcf8c6] px-3 py-2 text-sm text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]"
                      : "rounded-2xl rounded-bl-md border-2 border-[var(--color-foreground)] bg-white px-3 py-2 text-sm text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)]"
                  }
                >
                  {m.from === "ai" ? (
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[var(--color-brand-2)]">
                      <Bot className="h-3 w-3" /> BalesinAI
                    </div>
                  ) : null}
                  <p className="leading-snug">{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[var(--color-muted-fg)]">
                    {m.time}
                    {m.from === "ai" ? (
                      <CheckCheck className="h-3 w-3 text-[var(--color-blue-2)]" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: script.length * 0.6 + 0.2, duration: 0.4 }}
              className="self-end mt-1"
            >
              <div className="rounded-2xl rounded-bl-md border-2 border-[var(--color-foreground)] bg-white px-4 py-2.5 shadow-[2px_2px_0_0_var(--color-foreground)]">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/60 typing-dot" />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/60 typing-dot"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground)]/60 typing-dot"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating badge — response time */}
      <div className="absolute -right-6 top-16 hidden lg:flex flex-col items-center rounded-2xl border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] p-3 shadow-[3px_3px_0_0_var(--color-foreground)] tilt-r-2 float">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          {locale === "id" ? "Respons" : "Response"}
        </span>
        <span className="font-display text-2xl font-extrabold text-[var(--color-foreground)]">
          2.4s
        </span>
      </div>

      <div className="absolute -left-6 bottom-12 hidden lg:flex items-center gap-2 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-3 py-1.5 shadow-[3px_3px_0_0_var(--color-foreground)] tilt-l">
        <span className="h-2 w-2 rounded-full bg-[var(--color-foreground)] pulse-dot" />
        <span className="text-xs font-bold text-[var(--color-foreground)]">
          {locale === "id" ? "AI aktif 24/7" : "AI active 24/7"}
        </span>
      </div>
    </div>
  );
}
