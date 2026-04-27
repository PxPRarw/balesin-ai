import { Container, Section } from "@/components/ui/container";
import { DocPage, DocCard, Callout } from "@/components/marketing/doc-page";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Dokumentasi",
  description:
    "Panduan setup BalesinAI: connect WhatsApp Cloud API, kelola knowledge base, persona AI, billing, dan banyak lagi.",
};

export default async function DocsIndexPage() {
  const { locale } = await getT();
  const isID = locale === "id";

  return (
    <>
      <DocPage
        eyebrow={isID ? "DOKUMENTASI" : "DOCUMENTATION"}
        eyebrowVariant="blue"
        title={isID ? "Belajar BalesinAI" : "Learn BalesinAI"}
        highlight={isID ? "dari nol sampai jago." : "from zero to pro."}
        intro={
          isID
            ? "Panduan langkah-demi-langkah pakai BalesinAI buat olshop & UMKM kamu. Dari connect WhatsApp resmi sampai bikin AI yang bener-bener kedengeran kayak admin toko kamu."
            : "Step-by-step guides for getting BalesinAI working for your store. From connecting the official WhatsApp Cloud API to making the AI sound like your real shop admin."
        }
        crumbs={[
          { href: "/", label: isID ? "Home" : "Home" },
          { label: isID ? "Dokumentasi" : "Docs" },
        ]}
        updatedAt="27 April 2026"
      >
        <p>
          {isID
            ? "Panduan ini disusun supaya kamu bisa go-live dalam <strong>kurang dari 30 menit</strong>. Ikuti urutannya kalau kamu baru pertama kali setup, atau langsung loncat ke section yang kamu butuhin via menu di bawah."
            : "These guides are designed so you can be live in under 30 minutes. Follow them in order for first-time setup, or jump straight to the topic you need."}
        </p>
      </DocPage>

      {/* Topic cards */}
      <Section className="pt-0 pb-24">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DocCard
              href="/docs#getting-started"
              title={isID ? "Mulai Cepat" : "Quick Start"}
              desc={
                isID
                  ? "Setup akun, connect WhatsApp, kirim balasan AI pertama kamu."
                  : "Sign up, connect WhatsApp, send your first AI reply."
              }
              emoji="🚀"
              bg="bg-[var(--color-yellow)]"
            />
            <DocCard
              href="/docs#connect-wa"
              title={isID ? "Connect WhatsApp" : "Connect WhatsApp"}
              desc={
                isID
                  ? "Wizard 4 step pakai WhatsApp Cloud API resmi Meta."
                  : "4-step wizard using Meta's official WhatsApp Cloud API."
              }
              emoji="🔌"
              bg="bg-[var(--color-brand)]"
            />
            <DocCard
              href="/docs#knowledge"
              title="Knowledge Base"
              desc={
                isID
                  ? "Upload daftar produk, FAQ, harga, & jam operasional."
                  : "Upload your product catalog, FAQ, pricing & opening hours."
              }
              emoji="📚"
              bg="bg-[var(--color-pink)]"
            />
            <DocCard
              href="/docs#persona"
              title={isID ? "Persona AI" : "AI Persona"}
              desc={
                isID
                  ? "Atur nada, gaya bahasa, & batasan AI biar kayak admin toko kamu."
                  : "Tune the tone, vocabulary & guardrails so it sounds like you."
              }
              emoji="🎭"
              bg="bg-[var(--color-blue)]"
            />
            <DocCard
              href="/docs#inbox"
              title={isID ? "Live Inbox & Takeover" : "Live Inbox & Takeover"}
              desc={
                isID
                  ? "Pantau semua chat real-time, ambil alih kapan aja."
                  : "Monitor every chat in real-time, take over whenever you want."
              }
              emoji="💬"
              bg="bg-[var(--color-accent)]"
            />
            <DocCard
              href="/docs#analytics"
              title="Analytics"
              desc={
                isID
                  ? "Berapa pesan dijawab, response time, top pertanyaan."
                  : "Messages handled, response time, top customer questions."
              }
              emoji="📈"
              bg="bg-[var(--color-orange)]"
            />
            <DocCard
              href="/docs/api"
              title="API Reference"
              desc={
                isID
                  ? "REST API + Webhooks (Pro & Business plan)."
                  : "REST API + webhooks (Pro & Business plans)."
              }
              emoji="⚡"
              bg="bg-[var(--color-paper)]"
            />
            <DocCard
              href="/docs#billing"
              title="Billing & Plan"
              desc={
                isID
                  ? "Upgrade, downgrade, invoice, refund — semua via Tripay."
                  : "Upgrade, downgrade, invoices, refunds — all via Tripay."
              }
              emoji="💳"
              bg="bg-[var(--color-paper)]"
            />
            <DocCard
              href="mailto:hello@balesin.ai"
              title={isID ? "Butuh bantuan?" : "Need help?"}
              desc={
                isID
                  ? "Tim kami balas <2 jam pada hari kerja. Kirim email aja."
                  : "Our team replies in <2 hours on business days. Just email us."
              }
              emoji="🤝"
              bg="bg-[var(--color-paper-2)]"
              external
            />
          </div>
        </Container>
      </Section>

      {/* Inline detailed content */}
      <Section className="pt-0 pb-24">
        <Container>
          <article className="prose-cartoon mx-auto max-w-3xl">
            <h2 id="getting-started">{isID ? "Mulai Cepat" : "Quick Start"}</h2>
            <p>
              {isID
                ? "Setup pertama biasanya selesai dalam 15–30 menit. Pastikan kamu udah punya:"
                : "First-time setup usually takes 15–30 minutes. Make sure you have:"}
            </p>
            <ul>
              <li>
                {isID
                  ? "Akun Meta Business yang udah verified (gratis di "
                  : "A verified Meta Business account (free at "}
                <a
                  href="https://business.facebook.com"
                  target="_blank"
                  rel="noopener"
                >
                  business.facebook.com
                </a>
                ).
              </li>
              <li>
                {isID
                  ? "Nomor WhatsApp khusus bisnis yang BELUM dipakai di app WhatsApp/WhatsApp Business biasa."
                  : "A dedicated WhatsApp business number that is NOT yet used inside the WhatsApp or WhatsApp Business app."}
              </li>
              <li>
                {isID
                  ? "Daftar produk + FAQ + harga (bisa CSV, Google Sheet, atau ditik manual)."
                  : "Your product list + FAQ + pricing (CSV, Google Sheet, or typed manually)."}
              </li>
            </ul>
            <ol>
              <li>
                <strong>{isID ? "Daftar akun" : "Create your account"}</strong>{" "}
                — {isID ? "di " : "at "}
                <a href="/signup">/signup</a>
                {isID
                  ? ". Free plan dapet 100 percakapan/bulan, gak butuh kartu kredit."
                  : ". Free plan gets 100 conversations/month, no card required."}
              </li>
              <li>
                <strong>{isID ? "Connect WhatsApp" : "Connect WhatsApp"}</strong>{" "}
                —{" "}
                {isID
                  ? "ikuti wizard 4 step di "
                  : "follow the 4-step wizard at "}
                <a href="/connect">/connect</a>{" "}
                {isID
                  ? "(lihat section di bawah buat detail Cloud API)."
                  : "(see Cloud API section below for details)."}
              </li>
              <li>
                <strong>{isID ? "Isi Knowledge Base" : "Fill in Knowledge Base"}</strong>{" "}
                —{" "}
                {isID
                  ? "minimal 10 entri (produk, harga, ongkir, jam buka)."
                  : "at least 10 entries (products, pricing, shipping, hours)."}
              </li>
              <li>
                <strong>{isID ? "Atur persona AI" : "Tune AI persona"}</strong>{" "}
                —{" "}
                {isID
                  ? "pilih nada bahasa (formal/santai), batasan, & jam aktif."
                  : "set tone (formal/casual), guardrails, and active hours."}
              </li>
              <li>
                <strong>{isID ? "Test & go-live" : "Test & go-live"}</strong> —{" "}
                {isID
                  ? "kirim chat ke nomor kamu sendiri, lihat AI bales, lalu publish."
                  : "send a chat to your own number, watch the AI reply, then publish."}
              </li>
            </ol>

            <Callout variant="tip" title={isID ? "Tips" : "Tip"}>
              {isID
                ? "Saran kuat: connect WhatsApp dulu pakai nomor sandbox/test dari Meta sebelum pakai nomor production. Free, dan bisa kamu test 100% flow-nya tanpa risiko ke nomor utama."
                : "Strongly recommended: first connect using Meta's sandbox test number before using your production number. It's free and lets you test 100% of the flow risk-free."}
            </Callout>

            <h2 id="connect-wa">{isID ? "Connect WhatsApp" : "Connect WhatsApp"}</h2>
            <p>
              {isID
                ? "BalesinAI <strong>cuma pakai WhatsApp Cloud API resmi dari Meta</strong>. Itu artinya 100% legal, gak akan kena ban, dan support official template message + interactive button. Wizard kami nge-handle semua langkah teknis berikut:"
                : "BalesinAI <strong>only uses Meta's official WhatsApp Cloud API</strong>. That means it's 100% legal, ban-proof, and supports official template messages and interactive buttons. Our wizard handles every technical step below:"}
            </p>
            <ol>
              <li>
                {isID
                  ? "Login ke "
                  : "Sign in to "}
                <a
                  href="https://developers.facebook.com"
                  target="_blank"
                  rel="noopener"
                >
                  developers.facebook.com
                </a>{" "}
                {isID
                  ? "& bikin app tipe Business."
                  : "and create a Business app."}
              </li>
              <li>
                {isID
                  ? "Add product → WhatsApp → ikuti wizard, copy "
                  : "Add product → WhatsApp → follow the wizard, copy "}
                <code>Phone Number ID</code>, <code>WABA ID</code>,{" "}
                {isID ? "& " : "and "}
                <code>permanent token</code>.
              </li>
              <li>
                {isID
                  ? "Paste 3 nilai itu ke "
                  : "Paste those 3 values into "}
                <a href="/connect">/connect</a>{" "}
                {isID
                  ? "step 3, klik Verify."
                  : "step 3, click Verify."}
              </li>
              <li>
                {isID
                  ? "Setup webhook URL: "
                  : "Set webhook URL to: "}
                <code>https://your-domain.com/api/webhook/whatsapp</code>{" "}
                {isID
                  ? "(otomatis dikasih). Subscribe ke "
                  : "(generated automatically). Subscribe to "}
                <code>messages</code>.
              </li>
              <li>
                {isID
                  ? "Selesai. Kirim chat tes — AI bakal bales pake knowledge base kamu."
                  : "Done. Send a test chat — AI will reply using your knowledge base."}
              </li>
            </ol>
            <Callout variant="warn" title={isID ? "Penting" : "Important"}>
              {isID
                ? "Jangan pakai automation tools yang nempel ke WhatsApp Business app biasa (mis. WPP-Connect, Baileys, dll). Itu unofficial, melanggar TOS WhatsApp, dan akun bisa kena ban permanen. BalesinAI cuma pakai jalur resmi."
                : "Never use unofficial automation that hooks into the WhatsApp Business app (WPP-Connect, Baileys, etc.). They violate WhatsApp's TOS and your number can get permanently banned. BalesinAI uses the official path only."}
            </Callout>

            <h2 id="knowledge">{isID ? "Knowledge Base" : "Knowledge Base"}</h2>
            <p>
              {isID
                ? "Knowledge Base adalah otaknya AI kamu. Tiap entri adalah satu fakta yang bisa dipakai AI buat jawab. Format yang didukung:"
                : "The Knowledge Base is your AI's brain. Each entry is one fact the AI can use to answer. Supported formats:"}
            </p>
            <ul>
              <li>
                <strong>{isID ? "Produk" : "Product"}</strong> —{" "}
                {isID
                  ? "nama, harga, varian, stok, link checkout."
                  : "name, price, variants, stock, checkout link."}
              </li>
              <li>
                <strong>FAQ</strong> —{" "}
                {isID
                  ? "pertanyaan + jawaban. Misal “gimana cara order?”."
                  : "question + answer pairs."}
              </li>
              <li>
                <strong>{isID ? "Promo" : "Promotion"}</strong> —{" "}
                {isID
                  ? "kode promo + syarat + tanggal kadaluarsa."
                  : "promo code + conditions + expiry date."}
              </li>
              <li>
                <strong>{isID ? "Kebijakan" : "Policy"}</strong> —{" "}
                {isID
                  ? "ongkir, retur, garansi, jam operasional."
                  : "shipping, returns, warranty, hours."}
              </li>
            </ul>
            <p>
              {isID
                ? "Kamu bisa upload via CSV, paste link Google Sheet, atau input manual di "
                : "You can upload via CSV, paste a Google Sheet link, or input manually at "}
              <a href="/knowledge">/knowledge</a>.
            </p>

            <h2 id="persona">{isID ? "Persona AI" : "AI Persona"}</h2>
            <p>
              {isID
                ? "Persona ngatur 'siapa' AI ngomongnya. Setting yang tersedia di "
                : "Persona controls who the AI sounds like. Available settings at "}
              <a href="/settings">/settings</a>:
            </p>
            <ul>
              <li>
                <strong>{isID ? "Nada bahasa" : "Tone"}</strong>:{" "}
                {isID
                  ? "Santai (default untuk olshop), Formal, Energetic, atau custom."
                  : "Casual (default for online stores), Formal, Energetic, or custom."}
              </li>
              <li>
                <strong>{isID ? "Bahasa utama" : "Primary language"}</strong>:{" "}
                {isID
                  ? "auto-detect dari pesan customer."
                  : "auto-detected from incoming message."}
              </li>
              <li>
                <strong>{isID ? "Sapaan" : "Greeting"}</strong>:{" "}
                {isID
                  ? "“Halo kak”, “Selamat datang di [toko]”, dst."
                  : "“Hi there”, “Welcome to [store]”, etc."}
              </li>
              <li>
                <strong>{isID ? "Batasan" : "Guardrails"}</strong>:{" "}
                {isID
                  ? "kapan AI harus stop bales & oper ke admin manusia (mis. customer marah, request refund, dll)."
                  : "when AI should stop and hand over to a human (angry customer, refund requests, etc)."}
              </li>
            </ul>

            <h2 id="inbox">{isID ? "Live Inbox & Takeover" : "Live Inbox & Takeover"}</h2>
            <p>
              {isID
                ? "Semua percakapan AI dengan customer kelihatan real-time di "
                : "All AI ↔ customer conversations are visible in real-time at "}
              <a href="/inbox">/inbox</a>.{" "}
              {isID
                ? "Kalau AI jawab kurang oke, klik Takeover — AI auto-mute, kamu langsung yang bales. Begitu kamu klik Resume, AI ambil alih lagi."
                : "If AI's reply is off, click Takeover — AI auto-mutes and you reply manually. Click Resume to give control back."}
            </p>

            <h2 id="analytics">{isID ? "Analytics" : "Analytics"}</h2>
            <p>
              {isID
                ? "Dashboard nampilin: total pesan masuk, pesan dijawab AI, average response time, top 10 pertanyaan, dan conversion rate (kalau kamu hubungin checkout link). Pro & Business plan bisa export ke CSV/PDF."
                : "Dashboard shows: total messages, AI-handled messages, average response time, top 10 questions, and conversion rate (when you link checkout URLs). Pro & Business can export to CSV/PDF."}
            </p>

            <h2 id="billing">Billing & Plan</h2>
            <p>
              {isID
                ? "Pembayaran lokal Indonesia via "
                : "Indonesian payments via "}
              <a href="https://tripay.co.id" target="_blank" rel="noopener">
                Tripay
              </a>{" "}
              (QRIS, GoPay, OVO, Dana, ShopeePay, VA semua bank, retail Indomaret/Alfamart).{" "}
              {isID
                ? "Pelanggan luar Indonesia: kirim email ke "
                : "International customers: email "}
              <a href="mailto:hello@balesin.ai">hello@balesin.ai</a>{" "}
              {isID
                ? "buat invoice manual via Wise/PayPal."
                : "for a manual Wise/PayPal invoice."}
            </p>
            <p>
              {isID
                ? "Upgrade & downgrade efektif segera, di-prorate sesuai sisa hari. Cancel kapan aja — fitur tetep aktif sampai akhir periode billing."
                : "Upgrade & downgrade take effect immediately and are pro-rated. Cancel anytime — features stay active until the end of your billing period."}
            </p>
          </article>
        </Container>
      </Section>
    </>
  );
}
