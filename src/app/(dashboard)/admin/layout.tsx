import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  // Allow workspace owner/admin OR platform super_admin
  const allowed =
    session.workspaceRole === "owner" ||
    session.workspaceRole === "admin" ||
    session.platformRole === "super_admin";
  if (!allowed) redirect("/dashboard");

  return <>{children}</>;
}
