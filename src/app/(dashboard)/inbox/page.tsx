import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import { getConversations } from "@/lib/data/queries";
import { InboxClient } from "@/components/inbox/inbox-client";

export const metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const session = await getSession();
  const wsId = session?.workspace?.id ?? null;
  const conversations = await getConversations(wsId, 100);
  const activeAi = conversations.filter((c) => c.status === "open" && c.is_ai_active).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Inbox</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Live percakapan AI dengan customer kamu. Klik untuk ambil alih.
          </p>
        </div>
        <Badge variant="success">
          <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
          {activeAi} active AI
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <InboxClient initialConversations={conversations} />
      </Card>
    </div>
  );
}
