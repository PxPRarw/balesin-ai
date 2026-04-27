import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { WaConnectClient } from "@/components/connect/wa-connect-client";

export const metadata = { title: "Connect WhatsApp" };

const BEST_PRACTICES = [
  { ok: true, title: "Pakai nomor khusus bisnis", desc: "Jangan pakai nomor pribadi atau nomor lama yang belum lama dipakai. Beli nomor baru khusus toko." },
  { ok: true, title: "Hangatkan nomor 1-2 minggu", desc: "Sebelum massive use, kirim/terima chat manual dulu, save kontak, ada profile picture & status." },
  { ok: true, title: "Reply natural, jangan blast", desc: "BalesinAI emang reply per-chat masuk, bukan broadcast massal. Aman selama kamu gak pakai fitur blast." },
  { ok: false, title: "Hindari template berulang persis sama", desc: "AI kami nge-randomize wording — tapi kalau kamu pakai template manual yang sama persis ke 100 orang, risk tinggi." },
  { ok: false, title: "Jangan add kontak massal", desc: "Hindari import 1000+ nomor sekaligus. WhatsApp deteksi pattern bot dari unsaved contacts spike." },
];

export default function ConnectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
          Connect WhatsApp
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Hubungkan nomor WhatsApp Business kamu — scan QR sekali, AI langsung balas customer 24/7.
        </p>
      </div>

      {/* BAN-RISK WARNING — top priority */}
      <Card className="overflow-hidden p-0 border-[var(--color-warning)]">
        <div className="flex items-start gap-3 border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] px-5 py-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shrink-0">
            <AlertTriangle className="h-4 w-4 text-[var(--color-foreground)]" />
          </span>
          <div className="flex-1">
            <div className="font-display text-base font-extrabold text-[var(--color-foreground)]">
              ⚠️ Penting: ada risiko ban dari WhatsApp
            </div>
            <p className="text-sm font-medium text-[var(--color-foreground)]/85">
              BalesinAI pakai integrasi <b>unofficial</b> (Baileys self-host, gratis) — bukan WhatsApp Cloud API resmi Meta. Lebih cepat & gak perlu verifikasi 1-7 hari, tapi <b>WhatsApp bisa banned nomor kamu</b> kalau detect pola otomasi mencurigakan.
            </p>
          </div>
        </div>
        <div className="px-5 py-4 text-sm">
          <div className="font-extrabold uppercase tracking-wider text-xs mb-2 text-[var(--color-muted-fg)]">Mitigasi risiko:</div>
          <ul className="space-y-2">
            {BEST_PRACTICES.map((bp) => (
              <li key={bp.title} className="flex items-start gap-2">
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] mt-0.5 ${
                    bp.ok ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]" : "bg-[var(--color-pink)] text-[var(--color-foreground)]"
                  }`}
                >
                  {bp.ok ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                </span>
                <div>
                  <div className="font-bold">{bp.title}</div>
                  <div className="text-xs text-[var(--color-muted-fg)]">{bp.desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-3 text-xs">
            💡 <b>Mau zero-risk?</b> Upgrade ke plan <b>Business</b> (nanti) — kita bisa bantu setup WhatsApp Cloud API resmi Meta. Verifikasi 1-7 hari tapi 100% aman dari ban.
          </div>
        </div>
      </Card>

      <WaConnectClient />

      {/* Info: Cloud API alternative */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-blue)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base font-extrabold">Mau pakai WhatsApp Cloud API resmi?</h3>
            <p className="mt-1 text-sm text-[var(--color-muted-fg)]">
              Untuk brand yang gak boleh ada risiko ban (B2B, finance, healthcare), kita support setup via Meta Business resmi. Gratis 1.000 percakapan/bulan dari Meta, butuh verifikasi 1-7 hari.
            </p>
            <a
              href="mailto:hello@balesin.ai?subject=Setup%20WhatsApp%20Cloud%20API"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline decoration-4 decoration-[var(--color-yellow)] underline-offset-2"
            >
              Kontak tim untuk setup Cloud API <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
