import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { setDemoUser, clearDemoUser } from "@/lib/auth/demo-session";
import { registerUser, authenticateUser } from "@/lib/auth/user-store";
import { ensureWorkspaceForUser } from "@/lib/data/bootstrap";
import { sendWelcomeEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  mode: z.enum(["login", "signup"]),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  storeName: z.string().optional(),
});

const ERROR_COPY = {
  EMAIL_TAKEN: "Email ini sudah terdaftar. Login aja kalau itu akun kamu.",
  USER_NOT_FOUND:
    "Akun ini belum terdaftar. Mau daftar dulu? Klik 'Daftar gratis'.",
  INVALID_CREDENTIALS: "Password salah. Coba lagi ya.",
} as const;

function friendlySupabaseError(msg: string | undefined): string {
  if (!msg) return "Terjadi kesalahan, coba lagi ya.";
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials")) return ERROR_COPY.INVALID_CREDENTIALS;
  if (lower.includes("already registered") || lower.includes("user already")) return ERROR_COPY.EMAIL_TAKEN;
  if (lower.includes("email not confirmed")) return "Email belum diverifikasi. Cek inbox kamu (atau folder spam).";
  if (lower.includes("password") && lower.includes("weak")) return "Password terlalu lemah. Coba kombinasi yang lebih kuat.";
  if (lower.includes("rate")) return "Terlalu banyak percobaan. Coba lagi sebentar lagi.";
  return msg;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { email, password, storeName, mode } = parsed.data;

  // Try Supabase first.
  const supabase = await createSupabaseServer();
  const admin = getSupabaseAdmin();

  if (supabase) {
    if (mode === "signup") {
      if (!storeName || storeName.trim().length < 2) {
        return NextResponse.json(
          { error: "Nama toko minimal 2 karakter" },
          { status: 400 },
        );
      }
      const signUp = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: storeName, store_name: storeName },
        },
      });
      if (signUp.error || !signUp.data.user) {
        return NextResponse.json(
          { error: friendlySupabaseError(signUp.error?.message) },
          { status: 400 },
        );
      }

      // Auto-confirm email so user can login immediately (MVP UX).
      // We use the admin client to bypass the verification flow.
      if (admin && !signUp.data.user.email_confirmed_at) {
        await admin.auth.admin
          .updateUserById(signUp.data.user.id, { email_confirm: true })
          .catch(() => null);
      }

      // Sign in immediately to establish a session cookie. This step is what
      // makes the redirect-to-dashboard actually persist.
      if (!signUp.data.session) {
        const auto = await supabase.auth.signInWithPassword({ email, password });
        if (auto.error) {
          return NextResponse.json(
            { error: friendlySupabaseError(auto.error.message) },
            { status: 400 },
          );
        }
      }

      // Bootstrap workspace + profile (idempotent).
      const wsId = await ensureWorkspaceForUser(signUp.data.user.id, {
        email,
        storeName,
      });

      // Fire welcome email (non-blocking).
      void sendWelcomeEmail({ to: email, storeName });

      return NextResponse.json({
        ok: true,
        mode,
        userId: signUp.data.user.id,
        workspaceId: wsId,
        needsVerification: false,
      });
    }

    // mode === "login"
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error || !signIn.data.user) {
      return NextResponse.json(
        { error: friendlySupabaseError(signIn.error?.message) },
        { status: 401 },
      );
    }
    // Touch last_login_at (best-effort).
    if (admin) {
      await admin
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", signIn.data.user.id)
        .then(() => null, () => null);
    }
    // Make sure they have a workspace (handles users created before bootstrap existed).
    await ensureWorkspaceForUser(signIn.data.user.id, {
      email,
      storeName: (signIn.data.user.user_metadata?.store_name as string | undefined) ?? email.split("@")[0],
    }).catch(() => null);

    return NextResponse.json({ ok: true, mode });
  }

  // ---------------- Fallback: in-memory demo store ----------------
  if (mode === "signup") {
    if (!storeName || storeName.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama toko minimal 2 karakter" },
        { status: 400 },
      );
    }
    const result = registerUser({ email, password, storeName });
    if (!result.ok) {
      return NextResponse.json({ error: ERROR_COPY[result.error] }, { status: 409 });
    }
    await setDemoUser({ email: result.user.email, storeName: result.user.storeName, createdAt: result.user.createdAt });
    return NextResponse.json({ ok: true, mode });
  }

  const result = authenticateUser({ email, password });
  if (!result.ok) {
    return NextResponse.json({ error: ERROR_COPY[result.error] }, { status: 401 });
  }
  await setDemoUser({ email: result.user.email, storeName: result.user.storeName, createdAt: result.user.createdAt });
  return NextResponse.json({ ok: true, mode });
}

export async function DELETE() {
  const supabase = await createSupabaseServer();
  if (supabase) {
    await supabase.auth.signOut().catch(() => null);
  }
  await clearDemoUser();
  return NextResponse.json({ ok: true });
}
