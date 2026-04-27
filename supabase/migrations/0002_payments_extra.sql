-- Add columns used by KlikQRIS checkout/webhook code (idempotent).

alter table public.payments
  add column if not exists provider text,
  add column if not exists plan plan_tier,
  add column if not exists qris_image text;

-- The original migration named these qris_expired_at + klikqris_signature;
-- mirror them as the names the runtime expects.
alter table public.payments
  add column if not exists signature text,
  add column if not exists expired_at timestamptz;

-- Backfill for existing rows.
update public.payments
  set signature = klikqris_signature
  where signature is null and klikqris_signature is not null;

update public.payments
  set expired_at = qris_expired_at
  where expired_at is null and qris_expired_at is not null;
