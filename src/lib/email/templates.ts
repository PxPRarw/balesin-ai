import { sendEmail, renderEmail, isEmailConfigured } from "./brevo";

export async function sendWelcomeEmail(opts: { to: string; storeName: string }) {
  if (!isEmailConfigured()) return { ok: false as const, error: "SMTP off" };
  const html = renderEmail({
    preheader: "Selamat datang di BalesinAI! Toko kamu sudah siap.",
    heading: `Halo ${opts.storeName} 👋`,
    body: `<p>Akun BalesinAI kamu udah aktif. Mulai connect WhatsApp & isi knowledge base biar AI bisa balesin customer 24/7 — pakai bahasa & tone toko kamu.</p>
<p style="font-weight:700;">Langkah berikutnya:</p>
<ol style="padding-left:20px;line-height:1.7;">
  <li>Buka dashboard, klik <b>Connect WhatsApp</b></li>
  <li>Tambah produk / FAQ di <b>Knowledge Base</b></li>
  <li>Tes balasan AI lewat <b>Inbox</b></li>
</ol>`,
    ctaLabel: "Buka Dashboard",
    ctaUrl: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : "https://balesin.ai/dashboard",
  });
  return sendEmail({
    to: opts.to,
    subject: "Selamat datang di BalesinAI 🎉",
    html,
    kind: "verification",
  });
}

export async function sendPaymentReceiptEmail(opts: {
  to: string;
  storeName: string;
  orderId: string;
  amount: number;
  plan: string;
  paidAt: string;
}) {
  if (!isEmailConfigured()) return { ok: false as const, error: "SMTP off" };
  const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
  const html = renderEmail({
    preheader: `Pembayaran ${fmt.format(opts.amount)} berhasil — ${opts.plan}`,
    heading: "Pembayaran berhasil 🎉",
    body: `<p>Terima kasih ${opts.storeName}, plan <b>${opts.plan}</b> kamu udah aktif.</p>
<table style="width:100%;border-collapse:collapse;margin-top:8px;">
  <tr><td style="padding:6px 0;color:#595447;">Order ID</td><td style="text-align:right;font-weight:700;">${opts.orderId}</td></tr>
  <tr><td style="padding:6px 0;color:#595447;">Jumlah</td><td style="text-align:right;font-weight:700;">${fmt.format(opts.amount)}</td></tr>
  <tr><td style="padding:6px 0;color:#595447;">Tanggal</td><td style="text-align:right;font-weight:700;">${opts.paidAt}</td></tr>
</table>`,
    ctaLabel: "Lihat Invoice",
    ctaUrl: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/billing`
      : "https://balesin.ai/admin/billing",
  });
  return sendEmail({ to: opts.to, subject: `Invoice ${opts.orderId} — Pembayaran berhasil`, html, kind: "transactional" });
}

export async function sendPasswordResetEmail(opts: { to: string; resetUrl: string }) {
  if (!isEmailConfigured()) return { ok: false as const, error: "SMTP off" };
  const html = renderEmail({
    preheader: "Reset password BalesinAI kamu",
    heading: "Reset password",
    body: `<p>Klik tombol di bawah buat reset password kamu. Link ini berlaku 1 jam. Kalau bukan kamu yang minta, abaikan email ini.</p>`,
    ctaLabel: "Reset Password",
    ctaUrl: opts.resetUrl,
  });
  return sendEmail({ to: opts.to, subject: "Reset password BalesinAI", html, kind: "verification" });
}
