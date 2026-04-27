import { DocPage, Callout } from "@/components/marketing/doc-page";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "API Reference",
  description:
    "REST API & webhook reference untuk BalesinAI Pro & Business plan.",
};

export default async function ApiDocsPage() {
  const { locale } = await getT();
  const isID = locale === "id";

  return (
    <DocPage
      eyebrow="API REFERENCE"
      eyebrowVariant="accent"
      title={isID ? "API BalesinAI" : "BalesinAI API"}
      highlight={isID ? "buat developer." : "for developers."}
      intro={
        isID
          ? "REST API + webhooks buat integrasi BalesinAI ke sistem kamu. Tersedia di plan Pro & Business. Auth pakai bearer token, JSON only, rate limit 60 req/min per workspace."
          : "REST API + webhooks to integrate BalesinAI into your stack. Available on Pro & Business plans. Bearer token auth, JSON only, rate limit 60 req/min per workspace."
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/docs", label: isID ? "Dokumentasi" : "Docs" },
        { label: "API" },
      ]}
      updatedAt="27 April 2026"
    >
      <p>
        <strong>{isID ? "Base URL" : "Base URL"}:</strong>
      </p>
      <pre>
        <code>https://api.balesin.ai/v1</code>
      </pre>

      <Callout variant="info" title={isID ? "Authentication" : "Authentication"}>
        {isID
          ? "Bikin API key di "
          : "Create your API key at "}
        <a href="/settings">/settings</a>{" "}
        {isID
          ? "→ tab API. Setiap request wajib include header berikut:"
          : "→ API tab. Every request must include the following header:"}
        <pre className="!mt-3 !mb-0">
          <code>Authorization: Bearer bsi_live_xxxxxxxxxxxxxxxxxxxx</code>
        </pre>
      </Callout>

      <h2 id="quick-example">{isID ? "Contoh Cepat" : "Quick Example"}</h2>
      <p>
        {isID
          ? "Kirim pesan WhatsApp out-of-the-blue ke customer (memerlukan template message yang udah di-approve Meta):"
          : "Send a proactive WhatsApp message to a customer (requires a Meta-approved template):"}
      </p>
      <pre>
        <code>{`curl https://api.balesin.ai/v1/messages \\
  -H "Authorization: Bearer $BALESIN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+6281234567890",
    "template": "order_shipped",
    "variables": {
      "name": "Budi",
      "tracking": "JNE-1234567"
    }
  }'`}</code>
      </pre>

      <h2 id="endpoints">Endpoints</h2>

      <h3 id="messages-send">POST /messages</h3>
      <p>
        {isID
          ? "Kirim pesan ke customer. Bisa pakai template (untuk inisiasi) atau free-text (di dalam 24h customer service window)."
          : "Send a message to a customer. Use template (for outbound) or free-text (inside the 24h customer service window)."}
      </p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>{isID ? "Keterangan" : "Description"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>to</code>
            </td>
            <td>string</td>
            <td>
              {isID
                ? "Nomor WhatsApp tujuan, format E.164 (mis. +6281xxx)."
                : "Recipient WhatsApp number in E.164 format."}
            </td>
          </tr>
          <tr>
            <td>
              <code>template</code>
            </td>
            <td>string?</td>
            <td>
              {isID
                ? "Nama template Meta yang udah approved."
                : "Approved Meta template name."}
            </td>
          </tr>
          <tr>
            <td>
              <code>text</code>
            </td>
            <td>string?</td>
            <td>
              {isID
                ? "Pesan plain-text (cuma valid di dalam 24h window)."
                : "Plain-text message (only valid inside 24h window)."}
            </td>
          </tr>
          <tr>
            <td>
              <code>variables</code>
            </td>
            <td>object?</td>
            <td>
              {isID
                ? "Pasangan key-value buat fill template."
                : "Key-value pairs to fill the template."}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 id="conversations-list">GET /conversations</h3>
      <p>
        {isID
          ? "List percakapan terbaru. Mendukung filter & pagination."
          : "List recent conversations. Supports filtering & pagination."}
      </p>
      <pre>
        <code>{`GET /v1/conversations?status=open&limit=20&cursor=cur_abc`}</code>
      </pre>

      <h3 id="kb-upsert">POST /knowledge</h3>
      <p>
        {isID
          ? "Tambah atau update entri knowledge base. Idempotent via field "
          : "Insert or update a knowledge base entry. Idempotent via "}
        <code>external_id</code>.
      </p>
      <pre>
        <code>{`POST /v1/knowledge
{
  "external_id": "sku-123",
  "type": "product",
  "title": "Hoodie Oversize Cream",
  "body": "Harga Rp 249.000. Bahan fleece premium 280gsm. Size S/M/L/XL.",
  "metadata": { "price_idr": 249000, "stock": 42 }
}`}</code>
      </pre>

      <h2 id="webhooks">Webhooks</h2>
      <p>
        {isID
          ? "Subscribe ke event dari workspace kamu. Set URL di "
          : "Subscribe to workspace events. Set the URL at "}
        <a href="/settings">/settings</a>{" "}
        {isID ? "→ Webhooks." : "→ Webhooks."}{" "}
        {isID
          ? "Kami kirim POST JSON yang ditandatangani via header "
          : "We POST signed JSON via "}
        <code>X-Balesin-Signature</code>{" "}
        (HMAC-SHA256).
      </p>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>{isID ? "Trigger" : "When it fires"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>message.received</code>
            </td>
            <td>
              {isID
                ? "Customer kirim pesan ke kamu."
                : "Customer sent you a message."}
            </td>
          </tr>
          <tr>
            <td>
              <code>message.sent</code>
            </td>
            <td>
              {isID
                ? "AI atau admin balas customer."
                : "AI or admin replied to a customer."}
            </td>
          </tr>
          <tr>
            <td>
              <code>conversation.handover</code>
            </td>
            <td>
              {isID
                ? "AI di-mute, ada admin manusia ambil alih."
                : "AI was muted, a human took over."}
            </td>
          </tr>
          <tr>
            <td>
              <code>conversation.closed</code>
            </td>
            <td>
              {isID
                ? "Percakapan ditandai selesai."
                : "Conversation marked closed."}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="rate-limits">Rate limits</h2>
      <p>
        {isID
          ? "Default 60 request/menit per workspace. Kalau lewat, response 429 dengan header "
          : "Default 60 req/min per workspace. Exceeding returns 429 with "}
        <code>Retry-After</code>{" "}
        {isID
          ? "(detik). Business plan bisa minta limit lebih tinggi via support."
          : "in seconds. Business customers can request higher limits via support."}
      </p>

      <h2 id="errors">Errors</h2>
      <p>
        {isID
          ? "Semua error pakai format JSON konsisten:"
          : "All errors follow a consistent JSON shape:"}
      </p>
      <pre>
        <code>{`{
  "error": {
    "code": "invalid_template",
    "message": "Template 'order_shipped' is not approved by Meta.",
    "param": "template"
  }
}`}</code>
      </pre>

      <Callout variant="ok" title={isID ? "SDK & Postman" : "SDKs & Postman"}>
        {isID
          ? "SDK resmi (TypeScript & Python) + Postman collection lagi kami kerjain. Mau early access? "
          : "Official SDKs (TypeScript & Python) + a Postman collection are being prepared. Want early access? "}
        <a href="mailto:dev@balesin.ai">dev@balesin.ai</a>.
      </Callout>
    </DocPage>
  );
}
