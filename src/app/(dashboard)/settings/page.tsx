import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getWorkspaceSettings } from "@/lib/data/queries";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const wsId = session.workspace?.id ?? null;
  const ws = await getWorkspaceSettings(wsId);

  const initial = {
    name: ws?.name ?? session.workspace?.name ?? "",
    store_name: ws?.store_name ?? session.workspace?.store_name ?? "",
    primary_locale: ws?.primary_locale ?? "id",
    ai_persona: ws?.ai_persona ?? {
      tone: "casual",
      greeting: "Halo kak!",
      language: "auto",
    },
  };

  return <SettingsClient initial={initial} />;
}
