import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getConversations } from "@/lib/data/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const conversations = await getConversations(session.workspace?.id ?? null, 100);
  return NextResponse.json({ conversations });
}
