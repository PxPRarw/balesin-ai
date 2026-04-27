import { DocPage, Callout } from "@/components/marketing/doc-page";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat & Ketentuan menggunakan layanan BalesinAI.",
};

export default async function TermsPage() {
  const { locale } = await getT();
  const isID = locale === "id";

  return (
    <DocPage
      eyebrow={isID ? "LEGAL · TOS" : "LEGAL · TOS"}
      eyebrowVariant="yellow"
      title={isID ? "Syarat & Ketentuan" : "Terms of Service"}
      highlight={isID ? "yang fair." : "that are fair."}
      intro={
        isID
          ? "Aturan main pakai BalesinAI. Kami nulis sependek mungkin biar kamu beneran baca, bukan cuma scroll."
          : "The rules of using BalesinAI. We've kept this as short as possible so you actually read it."
      }
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Legal" },
        { label: isID ? "Syarat & Ketentuan" : "Terms" },
      ]}
      updatedAt="27 April 2026"
    >
      <Callout variant="info" title={isID ? "TL;DR" : "TL;DR"}>
        <ul>
          <li>{isID ? "Pakai BalesinAI sesuai TOS WhatsApp & hukum yang berlaku." : "Use BalesinAI in line with WhatsApp's TOS and applicable law."}</li>
          <li>{isID ? "Kamu tetap pemilik isi pesan customer kamu — kami cuma proses buat ngejalanin layanan." : "You own your customer conversations — we only process them to operate the service."}</li>
          <li>{isID ? "Bayar tepat waktu, atau akun bakal di-suspend (bukan dihapus langsung)." : "Pay on time or your account gets suspended (not deleted)."}</li>
          <li>{isID ? "Cancel kapan aja. Refund pro-rata kalau kamu rasa BalesinAI gak worth it." : "Cancel anytime. Pro-rated refund if BalesinAI isn't worth it for you."}</li>
        </ul>
      </Callout>

      <h2 id="agreement">{isID ? "1. Persetujuan" : "1. Agreement"}</h2>
      <p>
        {isID
          ? "Dengan signup atau pakai BalesinAI (\"Layanan\"), kamu setuju ke Syarat & Ketentuan ini (\"Syarat\") dan "
          : 'By signing up or using BalesinAI ("Service"), you agree to these Terms and our '}
        <a href="/legal/privacy">{isID ? "Kebijakan Privasi" : "Privacy Policy"}</a>.{" "}
        {isID
          ? "Kalau kamu pakai atas nama perusahaan, kamu menjamin punya wewenang."
          : "If using on behalf of a company, you confirm you have authority to bind it."}
      </p>

      <h2 id="account">{isID ? "2. Akun" : "2. Your Account"}</h2>
      <ul>
        <li>{isID ? "Kamu wajib berusia minimum 18 tahun." : "You must be at least 18 years old."}</li>
        <li>{isID ? "Tanggung jawab kamu menjaga password & nomor WhatsApp. Notifikasi kami kalau ada akses tidak sah." : "You're responsible for protecting your password & WhatsApp number. Notify us of any unauthorized access."}</li>
        <li>{isID ? "1 akun BalesinAI = 1 entitas bisnis. Bikin akun terpisah untuk brand yang beda." : "1 BalesinAI account = 1 business entity. Use separate accounts for different brands."}</li>
      </ul>

      <h2 id="acceptable-use">
        {isID ? "3. Penggunaan yang Diizinkan" : "3. Acceptable Use"}
      </h2>
      <p>{isID ? "Kamu setuju TIDAK akan pakai BalesinAI untuk:" : "You agree NOT to use BalesinAI to:"}</p>
      <ul>
        <li>{isID ? "Spam, kirim pesan tanpa izin penerima, atau melanggar TOS WhatsApp/Meta." : "Spam, send messages without recipient consent, or violate WhatsApp/Meta's TOS."}</li>
        <li>{isID ? "Penipuan, phishing, scam, judi online, MLM yang menyesatkan." : "Fraud, phishing, scams, online gambling, deceptive MLM schemes."}</li>
        <li>{isID ? "Menjual produk ilegal (narkoba, senjata, barang palsu, konten dewasa tanpa izin, dll)." : "Sell illegal products (drugs, weapons, counterfeit goods, unlicensed adult content, etc)."}</li>
        <li>{isID ? "Mengganggu / menyerang infrastruktur kami (DDoS, scraping berlebihan, exploit)." : "Disrupt or attack our infrastructure (DDoS, abusive scraping, exploits)."}</li>
        <li>{isID ? "Reverse engineer atau jual ulang Layanan tanpa izin tertulis." : "Reverse engineer or resell the Service without written permission."}</li>
      </ul>
      <p>
        {isID
          ? "Pelanggaran berat = kami suspend / terminate akun langsung tanpa refund."
          : "Severe violations = immediate suspension or termination without refund."}
      </p>

      <h2 id="content">{isID ? "4. Konten Kamu" : "4. Your Content"}</h2>
      <p>
        {isID
          ? "Semua pesan customer, knowledge base, & branding tetap milik kamu sepenuhnya. Dengan upload ke BalesinAI, kamu kasih kami lisensi terbatas (non-eksklusif, sebatas perlu) buat ngejalanin layanan untuk kamu — tidak lebih dari itu."
          : "Customer messages, knowledge base content, and branding remain entirely yours. By uploading to BalesinAI you grant us a limited, non-exclusive license — only to the extent necessary to operate the service for you."}
      </p>

      <h2 id="ai-output">
        {isID ? "5. Hasil AI" : "5. AI-Generated Output"}
      </h2>
      <p>
        {isID
          ? "AI bisa salah. Kamu tetap tanggung jawab atas balasan yang dikirim ke customer kamu — gunakan fitur Live Inbox & batasan AI buat ngecek hal-hal sensitif (harga final, hukum, medis, finansial). BalesinAI tidak menjamin ketepatan setiap balasan AI."
          : "AI is fallible. You remain responsible for replies sent to your customers — use Live Inbox and guardrails for sensitive matters (final pricing, legal, medical, financial). BalesinAI doesn't warrant the correctness of every AI-generated reply."}
      </p>

      <h2 id="payment">{isID ? "6. Pembayaran" : "6. Payment"}</h2>
      <ul>
        <li>{isID ? "Harga di " : "Pricing at "}<a href="/pricing">/pricing</a>{isID ? ". Sudah termasuk pajak yang berlaku jika ditagih dari Indonesia." : ". Includes applicable Indonesian taxes when billed in IDR."}</li>
        <li>{isID ? "Billing bulanan, auto-renew sampai kamu cancel." : "Billed monthly, auto-renews until you cancel."}</li>
        <li>{isID ? "Telat bayar >7 hari = akun di-suspend (data dipertahankan 60 hari)." : "Late payment >7 days = account suspended (data retained 60 days)."}</li>
        <li>{isID ? "Refund: prorata sesuai sisa hari, diproses dalam 7 hari kerja." : "Refunds: pro-rated by remaining days, processed within 7 business days."}</li>
      </ul>

      <h2 id="termination">{isID ? "7. Pengakhiran" : "7. Termination"}</h2>
      <p>
        {isID
          ? "Kamu bisa cancel kapan aja di Settings. Kami juga bisa terminate akun kalau kamu melanggar §3 atau gagal bayar setelah notifikasi. Setelah terminate, data dihapus sesuai "
          : "You can cancel anytime from Settings. We may terminate accounts that violate §3 or fail to pay after notice. Upon termination, data is deleted per the "}
        <a href="/legal/privacy">{isID ? "Kebijakan Privasi" : "Privacy Policy"}</a>.
      </p>

      <h2 id="warranty">
        {isID ? "8. Disclaimer Garansi" : "8. Warranty Disclaimer"}
      </h2>
      <p>
        {isID
          ? 'Layanan disediakan "as is" sesuai praktik wajar. Kami berusaha 99.5%+ uptime tapi tidak menjamin tanpa interupsi atau bebas error 100%.'
          : 'The Service is provided "as is" with reasonable best efforts. We aim for 99.5%+ uptime but do not guarantee uninterrupted or error-free operation.'}
      </p>

      <h2 id="liability">
        {isID ? "9. Batasan Tanggung Jawab" : "9. Limitation of Liability"}
      </h2>
      <p>
        {isID
          ? "Kecuali untuk kelalaian berat atau kesengajaan, total tanggung jawab kami terhadap kamu dalam periode 12 bulan dibatasi maksimum biaya yang kamu bayarkan ke BalesinAI selama 12 bulan tersebut. Kami tidak bertanggung jawab atas kerugian tidak langsung (kehilangan profit, data, peluang)."
          : "Except for gross negligence or willful misconduct, our total liability to you over any 12-month period is capped at the amount you paid BalesinAI during that period. We aren't liable for indirect damages (lost profits, data, opportunity)."}
      </p>

      <h2 id="indemnity">
        {isID ? "10. Ganti Rugi" : "10. Indemnity"}
      </h2>
      <p>
        {isID
          ? "Kamu setuju mengganti rugi BalesinAI dari klaim pihak ketiga yang muncul akibat pelanggaran Syarat ini, terutama §3."
          : "You agree to indemnify BalesinAI from third-party claims arising from your breach of these Terms, especially §3."}
      </p>

      <h2 id="law">
        {isID ? "11. Hukum yang Berlaku" : "11. Governing Law"}
      </h2>
      <p>
        {isID
          ? "Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan secara musyawarah; kalau gagal, di Pengadilan Negeri Jakarta Selatan."
          : "These Terms are governed by the laws of the Republic of Indonesia. Disputes will first be resolved amicably; failing that, in South Jakarta District Court."}
      </p>

      <h2 id="changes">{isID ? "12. Perubahan" : "12. Changes"}</h2>
      <p>
        {isID
          ? "Kami bisa update Syarat ini. Perubahan material diumumkan via email & banner dashboard minimal 14 hari sebelum berlaku. Lanjut pakai Layanan setelah tanggal itu = setuju ke versi baru."
          : "We may update these Terms. Material changes will be announced by email and dashboard banner at least 14 days before taking effect. Continued use after that date = acceptance."}
      </p>

      <h2 id="contact">{isID ? "13. Kontak" : "13. Contact"}</h2>
      <p>
        {isID ? "Pertanyaan tentang Syarat: " : "Questions about these Terms: "}
        <a href="mailto:legal@balesin.ai">legal@balesin.ai</a>.
      </p>
    </DocPage>
  );
}
