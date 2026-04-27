import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getWASessionStatus } from "@/lib/whatsapp/baileys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const wsId = session.workspace?.id;
  if (!wsId) return NextResponse.json({ error: "No workspace" }, { status: 400 });
  const status = getWASessionStatus(wsId);
  return NextResponse.json(status);
}
