import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getConversationMessages } from "@/lib/data/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId)
    return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
  const messages = await getConversationMessages(
    session.workspace?.id ?? null,
    conversationId,
    300,
  );
  return NextResponse.json({ messages });
}
