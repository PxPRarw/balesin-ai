import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDemoSystemPrompt } from "@/lib/ai/demo-store";
import { generateReply, type ChatMessage } from "@/lib/ai/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  locale: z.enum(["id", "en"]).default("id"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { locale, messages } = parsed.data;
  const system = buildDemoSystemPrompt(locale);

  const chatMessages: ChatMessage[] = [
    { role: "system", content: system },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const reply = await generateReply(chatMessages, {
      temperature: 0.6,
      maxTokens: 320,
    });
    return NextResponse.json({ reply, demo: !process.env.OPENAI_API_KEY });
  } catch (err) {
    console.error("[chat/demo] error", err);
    return NextResponse.json(
      { error: "AI service is busy. Please try again." },
      { status: 502 },
    );
  }
}
