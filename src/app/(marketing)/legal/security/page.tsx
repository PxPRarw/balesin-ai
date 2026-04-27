import { DocPage, Callout } from "@/components/marketing/doc-page";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Keamanan",
  description:
    "Bagaimana BalesinAI melindungi data kamu — encryption, akses, infrastruktur, dan disclosure.",
};

export default async function SecurityPage() {
  const { locale } = await getT();
  const isID = locale === "id";

  return (
    <DocPage
      eyebrow={isID ? "LEGAL · KEAMANAN" : "LEGAL · SECURITY"}
      eyebrowVariant="brand"
      title={isID ? "Keamanan" : "Security"}
      highlight={isID ? "yang dibangun serius." : "we take seriously."}
      intro={
        isID
          ? "Halaman ini transparan tentang gimana kami melindungi data kamu — encryption, akses, infrastruktur, & cara lapor kerentanan."
          : "How we protect your data — encryption, access control, infrastructure, and how to report vulnerabilities."
      }
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Legal" },
        { label: isID ? "Keamanan" : "Security" },
      ]}
      updatedAt="27 April 2026"
    >
      <Callout variant="ok" title={isID ? "Standar Kami" : "Our Standards"}>
        <ul>
          <li>{isID ? "TLS 1.2+ di semua koneksi." : "TLS 1.2+ on all connections."}</li>
          <li>{isID ? "AES-256 encryption at-rest untuk data sensitif." : "AES-256 encryption at-rest for sensitive data."}</li>
          <li>{isID ? "Password di-hash dengan PBKDF2 (60.000 iterasi) + salt unik." : "Passwords PBKDF2-hashed (60,000 iterations) with unique salts."}</li>
          <li>{isID ? "Akses internal: least-privilege + 2FA wajib + audit log." : "Internal access: least-privilege + mandatory 2FA + audit log."}</li>
        </ul>
      </Callout>

      <h2 id="infra">{isID ? "Infrastruktur" : "Infrastructure"}</h2>
      <p>
        {isID
          ? "BalesinAI dijalankan di Vercel (region Singapore/US) untuk layer aplikasi dan Supabase (region Singapore) untuk database & auth. Keduanya provider tier-1 dengan sertifikasi SOC 2 Type II, ISO 27001, GDPR-ready, dan default DDoS protection di edge."
          : "BalesinAI runs on Vercel (Singapore/US regions) for the app layer and Supabase (Singapore) for database & auth. Both are tier-1 providers with SOC 2 Type II, ISO 27001, GDPR-ready, and default edge DDoS protection."}
      </p>

      <h2 id="encryption">{isID ? "Enkripsi" : "Encryption"}</h2>
      <ul>
        <li>{isID ? "In transit: TLS 1.2 minimum, TLS 1.3 prefered, dengan modern cipher suites." : "In transit: TLS 1.2 minimum, TLS 1.3 preferred, with modern cipher suites."}</li>
        <li>{isID ? "At rest: AES-256-GCM untuk database & object storage." : "At rest: AES-256-GCM for database & object storage."}</li>
        <li>{isID ? "Secret (API keys, webhook signing) disimpan di vault terpisah, di-rotate berkala." : "Secrets (API keys, webhook signing) live in a dedicated vault and are rotated periodically."}</li>
      </ul>

      <h2 id="auth">{isID ? "Autentikasi" : "Authentication"}</h2>
      <ul>
        <li>{isID ? "Password user: PBKDF2-SHA256, 60.000 iterasi, 16-byte random salt unik per user. Password kamu tidak pernah disimpan dalam bentuk plaintext atau reversible." : "User passwords: PBKDF2-SHA256, 60,000 iterations, unique 16-byte random salt. Never stored as plaintext or in any reversible form."}</li>
        <li>{isID ? "Session cookie: HttpOnly, SameSite=Lax, Secure di production." : "Session cookies: HttpOnly, SameSite=Lax, Secure in production."}</li>
        <li>{isID ? "Optional 2FA via TOTP (Google Authenticator, 1Password, Authy) untuk semua plan." : "Optional 2FA via TOTP (Google Authenticator, 1Password, Authy) on all plans."}</li>
        <li>{isID ? "API key: prefix bsi_live_ / bsi_test_, rotatable kapan aja, scoped per workspace." : "API keys: prefixed bsi_live_ / bsi_test_, rotatable anytime, scoped per workspace."}</li>
      </ul>

      <h2 id="access">{isID ? "Kontrol Akses Internal" : "Internal Access Control"}</h2>
      <ul>
        <li>{isID ? "Least-privilege: cuma engineer on-call yang punya akses production database, dan setiap akses dicatat." : "Least-privilege: only on-call engineers may access the production database, every access is logged."}</li>
        <li>{isID ? "2FA wajib di semua tool (GitHub, Vercel, Supabase, OpenAI, Tripay, email)." : "Mandatory 2FA on every tool (GitHub, Vercel, Supabase, OpenAI, Tripay, email)."}</li>
        <li>{isID ? "Code review wajib untuk semua perubahan ke production. CI menjalankan lint, typecheck, & build pada setiap PR." : "Mandatory code review on every production change. CI runs lint, typecheck & build on every PR."}</li>
      </ul>

      <h2 id="data-handling">
        {isID ? "Penanganan Data Pelanggan" : "Customer Data Handling"}
      </h2>
      <ul>
        <li>{isID ? "Pesan customer kamu di-isolasi per workspace dengan row-level security di database." : "Your customer messages are isolated per workspace with row-level security in the database."}</li>
        <li>{isID ? "Backup terenkripsi otomatis, rotasi 35 hari." : "Encrypted automated backups, 35-day rotation."}</li>
        <li>{isID ? "Logs aplikasi: PII (email, nama, isi pesan) di-redact otomatis sebelum ditulis ke log." : "Application logs: PII (email, names, message bodies) automatically redacted before writing."}</li>
        <li>{isID ? "Model AI tidak training pakai pesan kamu — context dikirim ke OpenAI API yang menurut kebijakannya tidak dipakai untuk training." : "AI models don't train on your messages — context is sent to OpenAI's API which, per their policy, isn't used for training."}</li>
      </ul>

      <h2 id="monitoring">
        {isID ? "Monitoring & Incident Response" : "Monitoring & Incident Response"}
      </h2>
      <p>
        {isID
          ? "Kami pakai monitoring 24/7 untuk error rate, latency, dan anomali traffic. Kalau ada incident yang menyebabkan unauthorized access ke data customer, kami janji:"
          : "We monitor errors, latency, and traffic anomalies 24/7. If an incident causes unauthorized access to customer data, we commit to:"}
      </p>
      <ul>
        <li>{isID ? "Notifikasi pelanggan terdampak dalam 72 jam." : "Notify affected customers within 72 hours."}</li>
        <li>{isID ? "Postmortem publik dalam 14 hari, dengan timeline + root cause + langkah perbaikan." : "Public postmortem within 14 days, with timeline + root cause + remediation."}</li>
        <li>{isID ? "Lapor ke otoritas terkait sesuai kewajiban UU PDP." : "Report to applicable authorities per UU PDP obligations."}</li>
      </ul>

      <h2 id="compliance">{isID ? "Kepatuhan" : "Compliance"}</h2>
      <ul>
        <li>{isID ? "UU 27/2022 Pelindungan Data Pribadi (Indonesia) — kami beroperasi sesuai prinsip-prinsip UU PDP." : "Indonesia's UU PDP 27/2022 (Personal Data Protection Act) — we follow its principles."}</li>
        <li>GDPR (EU) — DPA available on request.</li>
        <li>{isID ? "WhatsApp Cloud API (Meta) — kami mematuhi Business Messaging Policy & Commerce Policy Meta." : "WhatsApp Cloud API (Meta) — we follow Meta's Business Messaging & Commerce policies."}</li>
        <li>{isID ? "PCI: kami TIDAK menyimpan data kartu kredit. Semua pembayaran ditangani Tripay (PCI DSS compliant)." : "PCI: we do NOT store card data. Payments are handled by Tripay (PCI DSS compliant)."}</li>
      </ul>

      <h2 id="disclosure">
        {isID ? "Lapor Kerentanan (Responsible Disclosure)" : "Responsible Disclosure"}
      </h2>
      <p>
        {isID
          ? "Kalau kamu menemukan kerentanan keamanan, mohon laporkan ke "
          : "If you find a security vulnerability, please report it to "}
        <a href="mailto:security@balesin.ai">security@balesin.ai</a>.{" "}
        {isID
          ? "Kami janji:"
          : "We commit to:"}
      </p>
      <ol>
        <li>{isID ? "Konfirmasi penerimaan dalam 48 jam kerja." : "Acknowledge receipt within 48 business hours."}</li>
        <li>{isID ? "Update progress mingguan sampai issue di-resolve." : "Weekly progress updates until resolved."}</li>
        <li>{isID ? "Tidak menuntut hukum peneliti yang melapor dengan itikad baik." : "No legal action against researchers reporting in good faith."}</li>
        <li>{isID ? "Bounty (sukarela, $50–$2.000) untuk laporan valid yang severity-nya impactful." : "Voluntary bounty ($50–$2,000) for valid, impactful reports."}</li>
      </ol>
      <p>
        {isID
          ? "Jangan akses data orang lain, jangan run automated scanner agresif, jangan denial-of-service-in production. Sandbox tersedia atas permintaan."
          : "Please don't access others' data, don't run aggressive automated scanners, and don't perform denial-of-service against production. Sandbox available on request."}
      </p>

      <Callout variant="warn" title={isID ? "Yang BUKAN kewenangan kami" : "Out of scope"}>
        {isID
          ? "Issue di vendor pihak ketiga (Vercel, Supabase, OpenAI, Meta, Tripay) silakan laporkan ke program disclosure mereka masing-masing."
          : "Issues in our third-party vendors (Vercel, Supabase, OpenAI, Meta, Tripay) — please report to their respective disclosure programs."}
      </Callout>
    </DocPage>
  );
}
