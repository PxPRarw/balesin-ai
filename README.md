# BalesinAI

WhatsApp auto-reply AI SaaS untuk UMKM Indonesia.
Stack: Next.js 16 (App Router) · Supabase · Baileys · OpenAI · Brevo · KlikQRIS.

---

## Setup cepat (Replit / lokal)

### 1. Install dependencies

```bash
pnpm install         # disarankan
# atau: npm install
```

### 2. Environment variables (`.env.local`)

```env
# --- Supabase ---
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
# Opsional: koneksi langsung psql untuk debug
SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# --- OpenAI (auto-reply AI) ---
OPENAI_API_KEY=sk-...

# --- Brevo SMTP (transactional email) ---
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=<your brevo login>
BREVO_SMTP_PASSWORD=<your brevo smtp key>
BREVO_FROM_EMAIL=transaction@yourdomain
BREVO_FROM_NAME=BalesinAI

# --- KlikQRIS (payment) ---
KLIKQRIS_API_KEY=<api key>
KLIKQRIS_MERCHANT_ID=<merchant id>
KLIKQRIS_BASE_URL=https://klikqris.com/api

# --- Auto-confirm signup (skip email verify untuk MVP) ---
AUTO_CONFIRM_SIGNUP=true
```

### 3. Run migration di Supabase SQL Editor

Buka https://supabase.com/dashboard/project/<your-ref>/sql/new
→ paste isi `supabase/migrations/0001_init.sql` → Run.

### 4. Paste cartoon email templates ke Supabase Auth

Buka https://supabase.com/dashboard/project/<your-ref>/auth/templates
→ untuk tiap tab di bawah, paste isi file HTML yang sesuai → Save:

| Tab dashboard | File |
|---|---|
| Confirm signup | `supabase/email-templates/CONFIRM_SIGNUP.html` |
| Reset Password | `supabase/email-templates/RESET_PASSWORD.html` |
| Magic Link | `supabase/email-templates/MAGIC_LINK.html` |
| Change Email Address | `supabase/email-templates/CHANGE_EMAIL.html` |

### 5. Jalankan dev server

```bash
pnpm dev
```

→ buka http://localhost:3000

---

## Fitur

- 3-tier dashboard: **User** (toko), **Admin** (workspace), **Super Admin** (platform)
- Auth real Supabase (signup/login + auto-confirm untuk MVP)
- Inbox live: percakapan + pesan real-time, takeover dari AI
- Knowledge base CRUD (FAQ / produk / promo / kebijakan)
- AI persona settings (tone, nama, sapaan, prompt tambahan, handover keywords)
- Connect WhatsApp via Baileys (gratis, self-host) dengan QR scan
- Auto-reply pakai OpenAI gpt-4o-mini, grounded ke knowledge base
- KlikQRIS payment + webhook + Snap modal
- Brevo email transactional (welcome, payment receipt, password reset)

## Catatan production

- **Baileys** butuh long-running Node process. Vercel serverless ❌. Pakai
  Railway / Fly.io / Replit Always-On / VPS untuk WA workspace.
- Direct paste ke Replit: pastikan run command-nya `pnpm dev` dan port `3000`.

## Struktur

```
src/app/(marketing)        Public pages (/, /pricing, /docs, /legal/*)
src/app/(auth)             Login + signup
src/app/(dashboard)        Authed app (/dashboard, /inbox, /knowledge, ...)
src/app/api/*              REST endpoints (auth, inbox, kb, settings, wa, ...)
src/components/*           React components (UI + page-level clients)
src/lib/*                  Server libs (auth, data, supabase, brevo, klikqris,
                           whatsapp/baileys + auto-reply)
supabase/migrations/       DB schema
supabase/email-templates/  Cartoon HTML email templates
```
