import { DocPage, Callout } from "@/components/marketing/doc-page";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi BalesinAI — bagaimana kami mengumpulkan, menggunakan, dan melindungi data kamu.",
};

export default async function PrivacyPage() {
  const { locale } = await getT();
  const isID = locale === "id";

  return (
    <DocPage
      eyebrow={isID ? "LEGAL · PRIVASI" : "LEGAL · PRIVACY"}
      eyebrowVariant="pink"
      title={isID ? "Kebijakan Privasi" : "Privacy Policy"}
      highlight={isID ? "yang manusiawi." : "made human."}
      intro={
        isID
          ? "Kami percaya privasi itu hak. Halaman ini menjelaskan data apa aja yang kami kumpul, kenapa, & gimana kamu bisa kontrol. Disusun supaya jujur dan dipahami orang non-hukum."
          : "We believe privacy is a right. This page explains exactly what data we collect, why, and how you stay in control — written in plain language."
      }
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Legal" },
        { label: isID ? "Privasi" : "Privacy" },
      ]}
      updatedAt="27 April 2026"
    >
      <Callout variant="info" title={isID ? "Ringkasan Cepat" : "Quick Summary"}>
        <ul>
          <li>
            {isID
              ? "Kami simpan data akun (email, nama toko) & isi percakapan WhatsApp kamu hanya buat ngejalanin layanan."
              : "We store account data (email, store name) and your WhatsApp conversations only to operate the service."}
          </li>
          <li>
            {isID
              ? "Kami TIDAK pernah jual data kamu ke pihak ketiga. Titik."
              : "We NEVER sell your data to third parties. Period."}
          </li>
          <li>
            {isID
              ? "Pesan customer di-encrypt at-rest (AES-256). Akses dibatasi & di-audit."
              : "Customer messages are encrypted at-rest (AES-256). Access is restricted and audited."}
          </li>
          <li>
            {isID
              ? "Kamu bisa minta export atau hapus data kapan aja di Settings."
              : "You can export or delete your data anytime from Settings."}
          </li>
        </ul>
      </Callout>

      <h2 id="who">{isID ? "1. Siapa Kami" : "1. Who We Are"}</h2>
      <p>
        {isID
          ? "BalesinAI dijalanin oleh tim independen yang berbasis di Indonesia. Untuk pertanyaan privasi atau permintaan akses data, kontak kami di "
          : "BalesinAI is operated by an independent Indonesia-based team. For privacy questions or data access requests, reach us at "}
        <a href="mailto:privacy@balesin.ai">privacy@balesin.ai</a>.
      </p>

      <h2 id="data-collected">
        {isID ? "2. Data yang Kami Kumpulkan" : "2. Data We Collect"}
      </h2>
      <h3>{isID ? "2.1 Data akun" : "2.1 Account data"}</h3>
      <ul>
        <li>{isID ? "Email & nama toko (saat signup)." : "Email & store name (at signup)."}</li>
        <li>
          {isID
            ? "Password (di-hash dengan PBKDF2 + salt unik per user; kami tidak pernah lihat password kamu)."
            : "Password (PBKDF2-hashed with a unique salt per user; we never see your password)."}
        </li>
        <li>
          {isID
            ? "Metadata pembayaran dari Tripay (4 digit kartu / nama VA, gak ada nomor kartu lengkap)."
            : "Payment metadata from Tripay (last 4 digits / VA name, no full card numbers)."}
        </li>
      </ul>
      <h3>{isID ? "2.2 Data percakapan" : "2.2 Conversation data"}</h3>
      <ul>
        <li>
          {isID
            ? "Isi pesan WhatsApp masuk dan respon AI. Kami pakai untuk: (1) menjawab customer kamu real-time, (2) memberi kamu Live Inbox & analytics, (3) meningkatkan kualitas AI khusus untuk workspace kamu."
            : "Inbound WhatsApp messages and AI responses. We use this to: (1) reply to your customers in real-time, (2) give you Live Inbox & analytics, (3) improve AI quality scoped only to your workspace."}
        </li>
        <li>
          {isID
            ? "Knowledge base (produk, FAQ, harga, dll yang kamu upload sendiri)."
            : "Knowledge base content you upload yourself (products, FAQs, pricing, etc)."}
        </li>
      </ul>
      <h3>{isID ? "2.3 Data teknis" : "2.3 Technical data"}</h3>
      <ul>
        <li>
          {isID
            ? "IP address, user-agent, log error & request — disimpan max 90 hari buat security/debugging."
            : "IP address, user-agent, error & request logs — kept ≤90 days for security & debugging."}
        </li>
      </ul>

      <h2 id="how-we-use">
        {isID ? "3. Bagaimana Data Dipakai" : "3. How We Use Data"}
      </h2>
      <ul>
        <li>{isID ? "Menjalankan & mengamankan layanan." : "Operating and securing the service."}</li>
        <li>
          {isID
            ? "Menghasilkan jawaban AI — kami kirim relevant context ke OpenAI di belakang layar (lihat §5)."
            : "Generating AI replies — we send relevant context to OpenAI in the background (see §5)."}
        </li>
        <li>
          {isID
            ? "Komunikasi penting (notifikasi billing, perubahan layanan, security alert)."
            : "Important communications (billing, service changes, security alerts)."}
        </li>
        <li>
          {isID
            ? "Analytics agregat & anonim untuk improve produk."
            : "Aggregate, anonymized analytics to improve the product."}
        </li>
      </ul>
      <p>
        <strong>
          {isID
            ? "Yang TIDAK kami lakukan:"
            : "What we don't do:"}
        </strong>{" "}
        {isID
          ? "menjual data, training model AI publik pakai pesan kamu, atau memberi data ke pengiklan."
          : "we don't sell data, train public AI models with your messages, or share data with advertisers."}
      </p>

      <h2 id="sharing">{isID ? "4. Pembagian Data" : "4. Data Sharing"}</h2>
      <p>
        {isID
          ? "Kami cuma berbagi data dengan sub-processor yang strictly diperlukan buat layanan ini jalan:"
          : "We only share data with sub-processors that are strictly necessary for the service:"}
      </p>
      <table>
        <thead>
          <tr>
            <th>{isID ? "Pihak" : "Party"}</th>
            <th>{isID ? "Tujuan" : "Purpose"}</th>
            <th>{isID ? "Lokasi" : "Location"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vercel</td>
            <td>{isID ? "Hosting aplikasi" : "Application hosting"}</td>
            <td>Singapore / US</td>
          </tr>
          <tr>
            <td>Supabase</td>
            <td>{isID ? "Database & auth" : "Database & auth"}</td>
            <td>Singapore</td>
          </tr>
          <tr>
            <td>OpenAI</td>
            <td>{isID ? "Generative AI" : "Generative AI"}</td>
            <td>US</td>
          </tr>
          <tr>
            <td>Meta WhatsApp Cloud API</td>
            <td>{isID ? "Pengiriman pesan WA" : "WhatsApp message delivery"}</td>
            <td>{isID ? "Global" : "Global"}</td>
          </tr>
          <tr>
            <td>Tripay</td>
            <td>{isID ? "Pembayaran (IDR)" : "Payments (IDR)"}</td>
            <td>Indonesia</td>
          </tr>
        </tbody>
      </table>

      <h2 id="ai-providers">
        {isID ? "5. Soal OpenAI & AI Provider" : "5. About OpenAI & AI Providers"}
      </h2>
      <p>
        {isID
          ? "Buat tiap balasan, kami kirim ke OpenAI: (a) potongan knowledge base kamu yang relevan, (b) pesan customer terakhir, (c) sedikit konteks percakapan. Berdasarkan kebijakan API OpenAI yang berlaku, data API tidak dipakai untuk training model OpenAI dan dihapus dari sistem mereka dalam waktu maksimal 30 hari."
          : "For each reply, we send OpenAI: (a) relevant snippets of your knowledge base, (b) the latest customer message, (c) a small conversation window. Per OpenAI's current API policy, API data is not used to train OpenAI models and is purged from their systems within at most 30 days."}
      </p>

      <h2 id="security">{isID ? "6. Keamanan" : "6. Security"}</h2>
      <p>
        {isID
          ? "Lihat halaman "
          : "See the dedicated "}
        <a href="/legal/security">{isID ? "Keamanan" : "Security"}</a>{" "}
        {isID ? "untuk detail lengkap." : "page for full details."}
      </p>

      <h2 id="rights">{isID ? "7. Hak Kamu" : "7. Your Rights"}</h2>
      <p>
        {isID
          ? "Sesuai UU 27/2022 tentang Pelindungan Data Pribadi (UU PDP) dan, bagi pengguna di EU, GDPR, kamu berhak untuk:"
          : "Under Indonesia's Personal Data Protection Act (UU PDP 27/2022) and, for EU users, GDPR, you have the right to:"}
      </p>
      <ul>
        <li>
          <strong>{isID ? "Akses" : "Access"}</strong> —{" "}
          {isID
            ? "minta salinan semua data kamu."
            : "request a copy of all your data."}
        </li>
        <li>
          <strong>{isID ? "Koreksi" : "Correction"}</strong> —{" "}
          {isID
            ? "memperbaiki data yang salah."
            : "fix data that's incorrect."}
        </li>
        <li>
          <strong>{isID ? "Penghapusan" : "Deletion"}</strong> —{" "}
          {isID
            ? "menghapus akun & data terkait. Permintaan diproses dalam 14 hari."
            : "delete your account and related data. Processed within 14 days."}
        </li>
        <li>
          <strong>{isID ? "Portabilitas" : "Portability"}</strong> —{" "}
          {isID
            ? "export percakapan & knowledge base ke CSV/JSON."
            : "export conversations & knowledge base to CSV/JSON."}
        </li>
        <li>
          <strong>{isID ? "Penolakan" : "Objection"}</strong> —{" "}
          {isID
            ? "menolak pemrosesan tertentu (mis. komunikasi marketing)."
            : "object to specific processing (e.g. marketing communications)."}
        </li>
      </ul>
      <p>
        {isID
          ? "Buat ngeksekusi hak ini, email "
          : "To exercise these rights, email "}
        <a href="mailto:privacy@balesin.ai">privacy@balesin.ai</a>{" "}
        {isID ? "atau buka Settings → Data." : "or visit Settings → Data."}
      </p>

      <h2 id="retention">{isID ? "8. Retensi Data" : "8. Data Retention"}</h2>
      <ul>
        <li>
          {isID ? "Akun aktif: data dipertahankan selama akun aktif." : "Active accounts: kept for as long as the account is active."}
        </li>
        <li>
          {isID
            ? "Setelah akun dihapus: semua data utama dihapus dalam 14 hari, kecuali yang wajib disimpan oleh hukum (mis. invoice ≤10 tahun)."
            : "After deletion: primary data removed within 14 days, except what we're legally required to keep (e.g. invoices ≤10 years)."}
        </li>
        <li>
          {isID
            ? "Backup terenkripsi auto-rotasi, max 35 hari."
            : "Encrypted backups auto-rotate, ≤35 days."}
        </li>
      </ul>

      <h2 id="cookies">{isID ? "9. Cookies" : "9. Cookies"}</h2>
      <p>
        {isID
          ? "Kami pakai cookie minimal: "
          : "We use minimal cookies: "}
        <code>balesin_demo_session</code>{" "}
        {isID ? "(login session)," : "(login session),"}{" "}
        <code>balesin_locale</code>{" "}
        {isID
          ? "(preferensi bahasa). Tidak ada cookie tracking iklan dari pihak ketiga."
          : "(language preference). No third-party ad-tracking cookies."}
      </p>

      <h2 id="kids">{isID ? "10. Anak-Anak" : "10. Children"}</h2>
      <p>
        {isID
          ? "Layanan ini tidak ditujukan untuk pengguna di bawah 18 tahun."
          : "This service is not intended for users under 18 years old."}
      </p>

      <h2 id="changes">{isID ? "11. Perubahan" : "11. Changes"}</h2>
      <p>
        {isID
          ? "Kalau kebijakan ini berubah secara material, kami kasih tau via email & banner di dashboard minimal 14 hari sebelum berlaku."
          : "If this policy changes materially, we'll notify you by email and dashboard banner at least 14 days before it takes effect."}
      </p>

      <h2 id="contact">{isID ? "12. Kontak" : "12. Contact"}</h2>
      <p>
        {isID ? "Pertanyaan privasi: " : "Privacy questions: "}
        <a href="mailto:privacy@balesin.ai">privacy@balesin.ai</a>
        {isID
          ? ". Untuk laporan keamanan, lihat "
          : ". For security disclosures, see "}
        <a href="/legal/security">/legal/security</a>.
      </p>
    </DocPage>
  );
}
