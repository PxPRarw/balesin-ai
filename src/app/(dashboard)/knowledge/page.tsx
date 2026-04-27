import { getSession } from "@/lib/auth/session";
import { getKnowledge } from "@/lib/data/queries";
import { KnowledgeClient } from "@/components/knowledge/knowledge-client";

export const metadata = { title: "Knowledge Base" };
export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const session = await getSession();
  const wsId = session?.workspace?.id ?? null;
  const entries = await getKnowledge(wsId);
  return <KnowledgeClient initial={entries} />;
}
