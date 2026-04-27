import Link from "next/link";
import { CreditCard, ShieldCheck, ArrowRight, Receipt, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { getSubscription, getPayments, type PaymentRow } from "@/lib/data/queries";

export const metadata = { title: "Admin · Billing" };

const PLAN_PRICE: Record<string, number> = {
  free: 0,
  pro: 99000,
  business: 249000,
};

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};

const STATUS_BADGE: Record<PaymentRow["status"], { variant: "default" | "yellow" | "muted" | "danger"; label: string; icon: typeof CheckCircle2 }> = {
  paid: { variant: "default", label: "Paid", icon: CheckCircle2 },
  pending: { variant: "yellow", label: "Pending", icon: Clock },
  expired: { variant: "muted", label: "Expired", icon: XCircle },
  failed: { variant: "danger", label: "Failed", icon: XCircle },
  refunded: { variant: "muted", label: "Refunded", icon: XCircle },
};

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default async function AdminBillingPage() {
  const session = await getSession();
  const wsId = session?.workspace?.id ?? null;
  const [sub, payments] = await Promise.all([
    getSubscription(wsId),
    getPayments(wsId, 30),
  ]);

  const periodEnd = new Date(sub.current_period_end);
  const daysLeft = Math.max(0, Math.floor((periodEnd.getTime() - new Date().getTime()) / 86400_000));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge variant="yellow">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
        </Badge>
        <h1 className="mt-2 text-2xl sm:text-3xl font-display font-extrabold tracking-tight">Billing</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Kelola subscription, lihat invoice, dan upgrade plan kapan aja.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b-2 border-[var(--color-foreground)] bg-[var(--color-brand)] px-6 py-5 text-[var(--color-brand-ink)]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest opacity-80">Plan aktif</div>
                <div className="font-display text-3xl font-extrabold">{PLAN_LABEL[sub.plan] ?? sub.plan}</div>
              </div>
              <Badge variant="muted">{sub.status}</Badge>
            </div>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <Stat label="Harga / bulan" value={formatIDR(PLAN_PRICE[sub.plan] ?? 0)} />
            <Stat label="Berakhir" value={periodEnd.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} />
            <Stat label="Sisa" value={`${daysLeft} hari`} />
          </div>
          <div className="flex flex-wrap gap-3 border-t-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-6">
            <Link href="/pricing">
              <Button variant="primary">
                Upgrade plan <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline">Cancel subscription</Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)]">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold">Payment method</h2>
              <p className="text-xs text-[var(--color-muted-fg)]">QRIS via KlikQRIS</p>
            </div>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">QRIS Dynamic</div>
                <div className="font-display font-extrabold">Scan & bayar setiap perpanjangan</div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted-fg)]">
            Mendukung GoPay, OVO, DANA, LinkAja, ShopeePay, & semua bank QRIS.
          </p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-5 py-3">
          <Receipt className="h-4 w-4" />
          <h2 className="font-display text-base font-extrabold">History pembayaran</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-paper-2)] text-left">
              <tr>
                <Th>Order ID</Th>
                <Th>Tanggal</Th>
                <Th>Jumlah</Th>
                <Th>Status</Th>
                <Th className="text-right">Invoice</Th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[var(--color-muted-fg)]">
                    Belum ada pembayaran.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const meta = STATUS_BADGE[p.status];
                  const Icon = meta.icon;
                  return (
                    <tr key={p.id} className="border-t-2 border-[var(--color-foreground)]/10 hover:bg-[var(--color-paper-2)]/50">
                      <Td>
                        <code className="rounded border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-1.5 py-0.5 text-[11px] font-mono">
                          {p.order_id}
                        </code>
                      </Td>
                      <Td className="text-xs text-[var(--color-muted-fg)]">
                        {new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </Td>
                      <Td className="font-bold">{formatIDR(p.total_amount_idr)}</Td>
                      <Td>
                        <Badge variant={meta.variant}>
                          <Icon className="h-3 w-3" /> {meta.label}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <button className="rounded-md border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-2 py-1 text-xs font-bold hover:bg-[var(--color-yellow)]">
                          Download
                        </button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">{label}</div>
      <div className="mt-1 font-display text-xl font-extrabold">{value}</div>
    </div>
  );
}
function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-foreground)] ${className ?? ""}`}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}
