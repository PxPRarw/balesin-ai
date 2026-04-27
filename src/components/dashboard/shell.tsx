"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  Plug,
  Settings,
  LogOut,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  Crown,
  CreditCard,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DemoUser } from "@/lib/auth/demo-session";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  group?: string;
};

const USER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: Inbox, badge: "3" },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/connect", label: "Connect WhatsApp", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Workspace", icon: ShieldCheck, group: "Admin" },
  { href: "/admin/team", label: "Team", icon: Users, group: "Admin" },
  { href: "/admin/billing", label: "Billing", icon: CreditCard, group: "Admin" },
];

const SUPER_ADMIN_NAV: NavItem[] = [
  { href: "/super-admin", label: "Platform", icon: Crown, group: "Super Admin" },
];

export function DashboardShell({
  children,
  user,
  platformRole = "user",
  workspaceRole = null,
}: {
  children: React.ReactNode;
  user: DemoUser;
  platformRole?: "user" | "super_admin";
  workspaceRole?: "owner" | "admin" | "agent" | "viewer" | null;
}) {
  const showAdmin = workspaceRole === "owner" || workspaceRole === "admin" || platformRole === "super_admin";
  const showSuperAdmin = platformRole === "super_admin";
  const allNav: NavItem[] = [
    ...USER_NAV,
    ...(showAdmin ? ADMIN_NAV : []),
    ...(showSuperAdmin ? SUPER_ADMIN_NAV : []),
  ];
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Sampai jumpa! 👋");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r-2 border-[var(--color-foreground)] bg-[var(--color-paper)] transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b-2 border-[var(--color-foreground)] px-5 bg-[var(--color-yellow)]">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-3">
          {allNav.map((item, idx) => {
            const showGroupHeader = item.group && (idx === 0 || allNav[idx - 1].group !== item.group);
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <div key={item.href}>
                {showGroupHeader ? (
                  <div className="mt-3 mb-1 px-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-muted-fg)]">
                    {item.group}
                  </div>
                ) : null}
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border-2 px-3 py-2 text-sm font-bold transition-[transform,box-shadow]",
                  active
                    ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)] border-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--color-foreground)]"
                    : "border-transparent text-[var(--color-foreground)] hover:bg-[var(--color-paper-2)] hover:border-[var(--color-foreground)] hover:shadow-[3px_3px_0_0_var(--color-foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5",
                )}
              >
                <span className="inline-flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-foreground)]">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
              </div>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3 rounded-[var(--radius-xl)] border-2 border-[var(--color-foreground)] bg-[var(--color-pink)] p-4 shadow-cartoon">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
            <Sparkles className="h-3.5 w-3.5" />
            Free plan
          </div>
          <p className="mt-2 text-xs font-medium text-[var(--color-foreground)]/85">
            <span className="font-extrabold text-[var(--color-foreground)]">62</span>{" "}
            / 100 percakapan terpakai bulan ini
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper)]">
            <div className="h-full w-[62%] bg-[var(--color-brand)]" />
          </div>
          <Link
            href="/pricing"
            className="mt-3 block rounded-[var(--radius-md)] border-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] py-2 text-center text-xs font-extrabold text-[var(--color-foreground)] shadow-[2px_2px_0_0_var(--color-foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-foreground)] transition-[transform,box-shadow]"
          >
            Upgrade ke Pro 🚀
          </Link>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen ? (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        />
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-md border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-2 text-[var(--color-foreground)] lg:hidden"
          >
            <LogoMark className="h-5 w-5" />
          </button>

          <div className="hidden md:flex flex-1 items-center gap-2 max-w-md rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-4 py-2 text-sm">
            <Search className="h-4 w-4 text-[var(--color-foreground)]" />
            <span className="font-medium text-[var(--color-muted-fg)]">
              Cari percakapan, customer...
            </span>
            <kbd className="ml-auto rounded border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--color-foreground)]">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="default">
              <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
              AI aktif
            </Badge>
            <button
              aria-label="Notifications"
              className="relative rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] p-2 text-[var(--color-foreground)] hover:bg-[var(--color-yellow)]"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[var(--color-foreground)] bg-[var(--color-pink)]" />
            </button>
            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden bg-[var(--color-background)] p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function UserMenu({ user, onLogout }: { user: DemoUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-paper-2)] px-2 py-1.5 text-sm font-bold hover:bg-[var(--color-yellow)]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-foreground)] bg-[var(--color-brand)] font-display text-xs font-extrabold text-[var(--color-brand-ink)]">
          {user.storeName.slice(0, 2).toUpperCase()}
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate text-[var(--color-foreground)]">
          {user.storeName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[var(--color-foreground)]" />
      </button>

      {open ? (
        <>
          <button
            className="fixed inset-0 z-10"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-[var(--radius-lg)] border-2 border-[var(--color-foreground)] bg-[var(--color-paper)] shadow-cartoon-lg">
            <div className="border-b-2 border-[var(--color-foreground)] bg-[var(--color-yellow)] px-4 py-3">
              <div className="font-display text-sm font-extrabold text-[var(--color-foreground)]">
                {user.storeName}
              </div>
              <div className="text-xs font-medium text-[var(--color-foreground)]/75 truncate">
                {user.email}
              </div>
            </div>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-[var(--color-paper-2)]"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 border-t-2 border-[var(--color-foreground)] bg-[var(--color-pink)] px-4 py-2.5 text-sm font-extrabold text-[var(--color-foreground)] hover:bg-[var(--color-pink-2)]"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
