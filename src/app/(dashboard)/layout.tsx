import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { getSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <DashboardShell
      user={{
        email: session.email,
        storeName: session.storeName,
        createdAt: 0,
      }}
      platformRole={session.platformRole}
      workspaceRole={session.workspaceRole}
    >
      {children}
    </DashboardShell>
  );
}
