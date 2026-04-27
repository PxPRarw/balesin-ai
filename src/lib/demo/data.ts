/**
 * Pre-baked demo data so the dashboard looks alive even without real Supabase
 * data. Used as a fallback in dashboard pages.
 */

export type DemoConversation = {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: "ai" | "human" | "resolved";
  tag?: string;
};

export type DemoMessage = {
  id: string;
  conversationId: string;
  role: "customer" | "ai" | "agent";
  content: string;
  ts: string;
};

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "c-1",
    customerName: "Rina Maharani",
    customerPhone: "+62 812-3456-7890",
    avatar: "RM",
    lastMessage: "Oke kak, aku transfer sekarang ya 🙏",
    lastTime: "2m",
    unread: 0,
    status: "ai",
    tag: "Order",
  },
  {
    id: "c-2",
    customerName: "Faisal Akbar",
    customerPhone: "+62 856-1122-3344",
    avatar: "FA",
    lastMessage: "Stok hoodie navy ukuran XL masih ada gak?",
    lastTime: "5m",
    unread: 2,
    status: "ai",
    tag: "Stock",
  },
  {
    id: "c-3",
    customerName: "Diana W.",
    customerPhone: "+62 877-9988-7766",
    avatar: "DW",
    lastMessage: "Aku mau komplain pesanan kemarin, kak.",
    lastTime: "12m",
    unread: 1,
    status: "human",
    tag: "Complaint",
  },
  {
    id: "c-4",
    customerName: "Bagus & Co.",
    customerPhone: "+62 813-5566-7788",
    avatar: "BC",
    lastMessage: "Reseller bisa dapet harga khusus kah?",
    lastTime: "32m",
    unread: 0,
    status: "ai",
    tag: "Reseller",
  },
  {
    id: "c-5",
    customerName: "Putri Anjani",
    customerPhone: "+62 821-4433-1122",
    avatar: "PA",
    lastMessage: "Sip makasih kak, ditunggu paketnya 🙌",
    lastTime: "1h",
    unread: 0,
    status: "resolved",
  },
  {
    id: "c-6",
    customerName: "Iqbal Pratama",
    customerPhone: "+62 815-6677-8899",
    avatar: "IP",
    lastMessage: "Berapa lama kirim ke Makassar ya?",
    lastTime: "1h",
    unread: 0,
    status: "ai",
    tag: "Shipping",
  },
  {
    id: "c-7",
    customerName: "Mira S.",
    customerPhone: "+62 822-1199-2233",
    avatar: "MS",
    lastMessage: "Kalau pakai kode NEWBIE10 minimal berapa kak?",
    lastTime: "2h",
    unread: 0,
    status: "ai",
    tag: "Promo",
  },
  {
    id: "c-8",
    customerName: "Reza Aditya",
    customerPhone: "+62 818-7766-5544",
    avatar: "RA",
    lastMessage: "Sizing chart-nya bisa dishare gak?",
    lastTime: "3h",
    unread: 0,
    status: "resolved",
  },
];

export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  "c-2": [
    {
      id: "m1",
      conversationId: "c-2",
      role: "customer",
      content: "Halo kak, mau tanya hoodie navy ukuran XL masih ready gak ya?",
      ts: "10:24",
    },
    {
      id: "m2",
      conversationId: "c-2",
      role: "ai",
      content:
        "Halo kak Faisal! Untuk Hoodie Classic Navy ukuran XL ready 4 pcs ya. Harga Rp 285.000, free ongkir Jabodetabek hari ini ✨ Mau dipesankan?",
      ts: "10:24",
    },
    {
      id: "m3",
      conversationId: "c-2",
      role: "customer",
      content: "Sizing chart-nya gimana? Aku biasa ukuran L tapi pengen yg longgar",
      ts: "10:25",
    },
    {
      id: "m4",
      conversationId: "c-2",
      role: "ai",
      content:
        "Hoodie kami oversize fit kak — kalau biasanya pakai L dan suka model longgar, XL pas banget. Lebar dada 60cm, panjang 72cm ya. Mau aku siapin?",
      ts: "10:25",
    },
  ],
  "c-3": [
    {
      id: "m1",
      conversationId: "c-3",
      role: "customer",
      content:
        "Aku mau komplain pesanan kemarin, kak. Hoodie yg dikirim ada noda di lengannya 😔",
      ts: "10:12",
    },
    {
      id: "m2",
      conversationId: "c-3",
      role: "ai",
      content:
        "Aduh, mohon maaf banget ya kak Diana 🙏 Boleh share foto noda nya ke sini? Kami akan langsung proses retur, ongkir balik kami yang tanggung.",
      ts: "10:12",
    },
    {
      id: "m3",
      conversationId: "c-3",
      role: "customer",
      content: "Ini fotonya 📷",
      ts: "10:13",
    },
    {
      id: "m4",
      conversationId: "c-3",
      role: "ai",
      content:
        "Terima kasih fotonya kak. Saya sudah teruskan ke admin untuk follow up langsung ya, dalam 5 menit akan dichat ulang dari nomor yang sama.",
      ts: "10:13",
    },
  ],
};

export const DEMO_KB_ENTRIES = [
  {
    id: "kb-1",
    title: "Daftar produk & harga",
    type: "Catalog",
    items: 24,
    updated: "2 jam lalu",
  },
  {
    id: "kb-2",
    title: "Sizing chart hoodie & tee",
    type: "FAQ",
    items: 6,
    updated: "1 hari lalu",
  },
  {
    id: "kb-3",
    title: "Kebijakan retur & garansi",
    type: "Policy",
    items: 4,
    updated: "3 hari lalu",
  },
  {
    id: "kb-4",
    title: "Promo & kode diskon aktif",
    type: "Promo",
    items: 3,
    updated: "1 jam lalu",
  },
  {
    id: "kb-5",
    title: "Cara pemesanan & pembayaran",
    type: "FAQ",
    items: 8,
    updated: "5 hari lalu",
  },
  {
    id: "kb-6",
    title: "Estimasi & ongkir per kota",
    type: "Shipping",
    items: 14,
    updated: "1 hari lalu",
  },
];

export const DEMO_ANALYTICS = {
  conversationsToday: 184,
  conversationsTrend: 12,
  aiResolved: 162,
  aiResolvedPct: 88,
  avgResponseSec: 2.4,
  responseTrend: -0.3,
  conversionRate: 31.2,
  conversionTrend: 4.1,
  hourly: [
    4, 3, 2, 1, 1, 2, 5, 8, 11, 14, 16, 18, 21, 19, 17, 22, 24, 20, 16, 12, 9, 7, 6, 5,
  ],
  topQueries: [
    { q: "Stok ukuran L", count: 42 },
    { q: "Ongkir ke Surabaya", count: 31 },
    { q: "COD bisa?", count: 28 },
    { q: "Diskon hari ini", count: 24 },
    { q: "Sizing chart", count: 19 },
  ],
};
