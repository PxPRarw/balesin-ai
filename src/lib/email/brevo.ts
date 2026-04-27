import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cached) return cached;
  const host = process.env.BREVO_SMTP_HOST;
  const port = Number(process.env.BREVO_SMTP_PORT ?? 587);
  const user = process.env.BREVO_SMTP_LOGIN;
  const pass = process.env.BREVO_SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

export type EmailKind = "verification" | "transactional";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  kind?: EmailKind;
  /** Override sender display name. */
  fromName?: string;
};

export type SendEmailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

function senderFor(kind: EmailKind): string {
  if (kind === "verification") {
    return (
      process.env.BREVO_SENDER_VERIFICATION ??
      process.env.BREVO_SENDER_TRANSACTIONAL ??
      "no-reply@balesin.ai"
    );
  }
  return (
    process.env.BREVO_SENDER_TRANSACTIONAL ??
    process.env.BREVO_SENDER_VERIFICATION ??
    "no-reply@balesin.ai"
  );
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const t = getTransport();
  if (!t) return { ok: false, error: "SMTP not configured" };
  const kind = input.kind ?? "transactional";
  const fromAddr = senderFor(kind);
  const fromName = input.fromName ?? "BalesinAI";
  try {
    const info = await t.sendMail({
      from: `"${fromName}" <${fromAddr}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? input.html.replace(/<[^>]+>/g, " "),
    });
    return { ok: true, messageId: info.messageId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.BREVO_SMTP_HOST &&
      process.env.BREVO_SMTP_LOGIN &&
      process.env.BREVO_SMTP_PASSWORD,
  );
}

/** Render a cartoon-themed transactional email (HTML). */
export function renderEmail(opts: {
  preheader?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}): string {
  const cta = opts.ctaLabel && opts.ctaUrl
    ? `<a href="${opts.ctaUrl}" style="display:inline-block;background:#25d366;color:#051910;font-weight:800;text-decoration:none;padding:14px 22px;border:2px solid #1a1a1a;border-radius:14px;box-shadow:4px 4px 0 0 #1a1a1a;">${opts.ctaLabel}</a>`
    : "";
  return `<!doctype html>
<html><body style="margin:0;background:#fff8e7;font-family:system-ui,Segoe UI,sans-serif;color:#1a1a1a;">
${opts.preheader ? `<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${opts.preheader}</span>` : ""}
<div style="max-width:560px;margin:32px auto;padding:0 16px;">
  <div style="border:2px solid #1a1a1a;background:#ffffff;border-radius:18px;box-shadow:6px 6px 0 0 #1a1a1a;padding:26px 24px;">
    <div style="display:inline-block;background:#ffd93d;border:2px solid #1a1a1a;border-radius:9999px;padding:4px 10px;font-weight:800;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;box-shadow:2px 2px 0 0 #1a1a1a;">BalesinAI</div>
    <h1 style="font-size:28px;line-height:1.15;margin:14px 0 10px;font-weight:800;">${opts.heading}</h1>
    <div style="font-size:15px;line-height:1.6;font-weight:500;">${opts.body}</div>
    ${cta ? `<div style="margin-top:18px;">${cta}</div>` : ""}
  </div>
  <p style="text-align:center;margin-top:18px;font-size:12px;color:#595447;">© BalesinAI · Auto-reply WhatsApp pakai AI buat olshop & UMKM Indonesia.</p>
</div>
</body></html>`;
}
