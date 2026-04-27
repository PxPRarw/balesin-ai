export type Locale = "id" | "en";

export const LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";

export const dictionary = {
  id: {
    nav: {
      features: "Fitur",
      howItWorks: "Cara Kerja",
      pricing: "Harga",
      docs: "Dokumentasi",
      login: "Masuk",
      signup: "Coba Gratis",
      dashboard: "Dashboard",
    },
    hero: {
      badge: "Auto-reply WhatsApp pakai AI",
      titleA: "Olshop kamu ",
      titleB: "balesin sendiri",
      titleC: ", 24/7 tanpa lelah.",
      subtitle:
        "BalesinAI bales chat WhatsApp customer kamu otomatis pakai AI yang tahu produk, harga, dan SOP toko kamu. Customer puas, kamu tidur nyenyak.",
      ctaPrimary: "Coba Demo Gratis",
      ctaSecondary: "Lihat Cara Kerja",
      trust: "100% legal pakai WhatsApp Cloud API resmi Meta",
    },
    metrics: {
      replied: "pesan dijawab",
      stores: "toko aktif",
      uptime: "uptime",
      response: "rata-rata respons",
    },
    features: {
      title: "Fitur yang ",
      titleHl: "bikin olshop naik kelas",
      subtitle: "Semua yang kamu butuh untuk customer service modern, dalam satu dashboard.",
      items: [
        {
          title: "AI Tahu Produk Kamu",
          desc: "Upload katalog, FAQ, harga, atau syarat & ketentuan. AI baca semua dan jawab customer dengan info akurat — bukan halusinasi.",
        },
        {
          title: "WhatsApp Cloud API Resmi",
          desc: "Integrasi langsung dengan API resmi Meta. Aman dari banned, scalable, dan gratis 1.000 percakapan per bulan dari Meta.",
        },
        {
          title: "Live Inbox + Takeover",
          desc: "Lihat semua percakapan AI dengan customer real-time. Mau ambil alih chat? Tinggal klik, AI berhenti otomatis.",
        },
        {
          title: "Persona AI Custom",
          desc: "Atur gaya bahasa AI: formal, santai, bahasa gaul Jaksel, atau bahasa daerah. Sesuai vibe brand kamu.",
        },
        {
          title: "Multi-bahasa Otomatis",
          desc: "AI deteksi bahasa customer dan jawab pakai bahasa yang sama. Bahasa Indonesia, Inggris, atau campur — semua bisa.",
        },
        {
          title: "Analytics Lengkap",
          desc: "Pesan dijawab, response time, peak hour, kata kunci paling sering ditanya. Data buat keputusan bisnis yang lebih cerdas.",
        },
      ],
    },
    how: {
      title: "Cara kerjanya ",
      titleHl: "simpel banget",
      subtitle: "Dari daftar sampai AI bales customer pertama: kurang dari 10 menit.",
      steps: [
        {
          n: "01",
          title: "Daftar & Connect WhatsApp",
          desc: "Sign up gratis, connect nomor WhatsApp Business kamu lewat WhatsApp Cloud API resmi Meta. Kami pandu step-by-step.",
        },
        {
          n: "02",
          title: "Latih AI dengan Data Toko",
          desc: "Upload katalog, FAQ, harga, jam operasional. Atau ketik manual. AI langsung paham toko kamu dalam hitungan detik.",
        },
        {
          n: "03",
          title: "AI Mulai Balesin Customer",
          desc: "Customer chat WA, AI bales otomatis 24/7. Kamu pantau dari dashboard, ambil alih kapan aja kalau perlu.",
        },
      ],
    },
    demo: {
      title: "Coba Sendiri ",
      titleHl: "Sekarang",
      subtitle: "Ini AI BalesinAI versi demo. Pura-pura kamu customer yang nanya ke olshop fashion. Chat aja!",
      placeholder: "Ketik pertanyaan kamu...",
      try: "Coba pertanyaan ini:",
      examples: [
        "Halo kak, masih ada stok hoodie warna hitam ukuran L?",
        "Berapa lama pengiriman ke Surabaya?",
        "Bisa COD ga?",
        "Ada diskon gak?",
      ],
      thinking: "AI sedang mengetik...",
      poweredBy: "Demo ini pakai AI yang sama persis dengan production. Hasil real.",
    },
    testimonials: {
      title: "Olshop yang udah ",
      titleHl: "lepas dari ribetnya bales chat",
    },
    pricing: {
      title: "Harga ",
      titleHl: "transparan",
      subtitle: "Mulai gratis. Upgrade kalau udah berasa untungnya.",
      monthly: "per bulan",
      cta: "Mulai Sekarang",
      ctaPro: "Pilih Pro",
      ctaBiz: "Hubungi Sales",
      mostPopular: "Paling Laku",
      tiers: [
        {
          name: "Starter",
          price: "Gratis",
          desc: "Cocok buat coba-coba & toko kecil",
          features: [
            "100 percakapan AI/bulan",
            "1 nomor WhatsApp",
            "Knowledge base sampai 10 entri",
            "Analytics dasar",
            "Support komunitas",
          ],
        },
        {
          name: "Pro",
          price: "Rp 199rb",
          priceUSD: "$14",
          desc: "Buat olshop & UMKM yang lagi growing",
          features: [
            "5.000 percakapan AI/bulan",
            "3 nomor WhatsApp",
            "Knowledge base unlimited",
            "Analytics lengkap + export",
            "Persona AI custom",
            "Live inbox + takeover",
            "Support prioritas (chat)",
          ],
        },
        {
          name: "Business",
          price: "Rp 799rb",
          priceUSD: "$59",
          desc: "Buat brand serius dengan volume tinggi",
          features: [
            "Unlimited percakapan AI",
            "Unlimited nomor WhatsApp",
            "Multi-tim + role permission",
            "API access",
            "Custom integration (Shopee, Tokopedia, Shopify)",
            "Dedicated success manager",
            "SLA 99.9% uptime",
          ],
        },
      ],
    },
    faq: {
      title: "Pertanyaan ",
      titleHl: "yang sering ditanya",
      items: [
        {
          q: "Apakah ini legal? Akun WA saya aman dari banned?",
          a: "100% legal. Kami pakai WhatsApp Cloud API resmi dari Meta — bukan unofficial library kayak Baileys atau whatsapp-web.js. Akun bisnis kamu aman, gak akan diblokir Meta karena kamu memang pakai cara yang direkomendasikan mereka.",
        },
        {
          q: "AI-nya pintar gak? Suka halu gak?",
          a: "AI kami pakai retrieval-augmented generation — jadi dia cuma jawab berdasarkan knowledge base yang kamu kasih. Kalau ada pertanyaan di luar konteks, dia bilang 'maaf, saya kurang tahu' dan tag percakapan untuk kamu ambil alih.",
        },
        {
          q: "Berapa cepat respons AI-nya?",
          a: "Rata-rata 2-4 detik dari customer kirim chat sampai AI bales. Lebih cepat dari mayoritas CS manusia, dan tetep terasa natural (bukan robot kaku).",
        },
        {
          q: "Bisa pakai untuk lebih dari 1 toko?",
          a: "Bisa. Plan Pro support 3 nomor WhatsApp, plan Business unlimited. Setiap nomor punya knowledge base & persona terpisah.",
        },
        {
          q: "Gimana kalau AI salah jawab?",
          a: "Kamu bisa pantau semua percakapan dari Live Inbox dan ambil alih kapan saja. Setiap chat yang kamu intervensi dipakai untuk improve AI ke depannya. Plus, kamu bisa set kata kunci tertentu yang langsung di-handover ke manusia (misal 'komplain', 'refund').",
        },
        {
          q: "Saya gak ngerti teknis, bisa setup sendiri?",
          a: "Bisa banget. Onboarding wizard kami pandu kamu step-by-step, bahkan ada video tutorial bahasa Indonesia. Kalau stuck, tim support kami bantu setup gratis di plan Pro & Business.",
        },
      ],
    },
    finalCta: {
      title: "Berhenti capek balesin chat satu-satu.",
      subtitle: "Mulai gratis hari ini. Tanpa kartu kredit. Setup 5 menit.",
      button: "Coba BalesinAI Gratis",
    },
    footer: {
      tagline: "Auto-reply WhatsApp pakai AI buat olshop & UMKM Indonesia.",
      product: "Produk",
      company: "Perusahaan",
      legal: "Legal",
      links: {
        features: "Fitur",
        pricing: "Harga",
        docs: "Dokumentasi",
        api: "API",
        about: "Tentang Kami",
        blog: "Blog",
        contact: "Kontak",
        careers: "Karir",
        privacy: "Kebijakan Privasi",
        terms: "Syarat & Ketentuan",
        security: "Keamanan",
      },
      copyright: "Hak cipta dilindungi",
    },
  },
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it works",
      pricing: "Pricing",
      docs: "Docs",
      login: "Sign in",
      signup: "Try free",
      dashboard: "Dashboard",
    },
    hero: {
      badge: "AI-powered WhatsApp auto-reply",
      titleA: "Your store ",
      titleB: "replies itself",
      titleC: ", 24/7 — never tired.",
      subtitle:
        "BalesinAI replies to your WhatsApp customers automatically with AI that knows your products, prices, and policies. Customers happy, you finally sleep.",
      ctaPrimary: "Try free demo",
      ctaSecondary: "See how it works",
      trust: "100% legal — built on Meta's official WhatsApp Cloud API",
    },
    metrics: {
      replied: "messages replied",
      stores: "active stores",
      uptime: "uptime",
      response: "avg response",
    },
    features: {
      title: "Features that ",
      titleHl: "level up your store",
      subtitle: "Everything you need for modern customer service, in one dashboard.",
      items: [
        {
          title: "AI knows your products",
          desc: "Upload your catalog, FAQ, prices, or T&Cs. The AI reads everything and replies with accurate info — no hallucinations.",
        },
        {
          title: "Official WhatsApp Cloud API",
          desc: "Direct integration with Meta's official API. Ban-proof, scalable, and Meta gives you 1,000 free conversations per month.",
        },
        {
          title: "Live inbox + takeover",
          desc: "See all AI conversations with customers in real-time. Want to take over? One click, AI steps aside automatically.",
        },
        {
          title: "Custom AI persona",
          desc: "Set the AI's tone: formal, casual, Gen-Z, or your local dialect. Match your brand vibe perfectly.",
        },
        {
          title: "Auto multi-language",
          desc: "AI detects the customer's language and replies in the same one. Indonesian, English, or mixed — all handled.",
        },
        {
          title: "Full analytics",
          desc: "Replies, response time, peak hours, top queries. Data-driven decisions for a smarter business.",
        },
      ],
    },
    how: {
      title: "How it works — ",
      titleHl: "stupidly simple",
      subtitle: "From signup to AI replying your first customer: under 10 minutes.",
      steps: [
        {
          n: "01",
          title: "Sign up & connect WhatsApp",
          desc: "Free signup, connect your WhatsApp Business number via Meta's official Cloud API. We guide you step-by-step.",
        },
        {
          n: "02",
          title: "Train the AI on your store",
          desc: "Upload your catalog, FAQ, prices, hours. Or just type. The AI understands your store within seconds.",
        },
        {
          n: "03",
          title: "AI starts replying customers",
          desc: "Customers chat on WhatsApp, AI replies 24/7. You watch from the dashboard, take over anytime if needed.",
        },
      ],
    },
    demo: {
      title: "Try it ",
      titleHl: "right now",
      subtitle: "This is the real BalesinAI in demo mode. Pretend you're a customer asking a fashion store. Chat away!",
      placeholder: "Type your question...",
      try: "Try asking:",
      examples: [
        "Hi, do you still have black hoodies in size L?",
        "How long is shipping to Surabaya?",
        "Do you accept cash on delivery?",
        "Any discount available?",
      ],
      thinking: "AI is typing...",
      poweredBy: "This demo uses the same AI as production. Real results.",
    },
    testimonials: {
      title: "Stores that ",
      titleHl: "stopped drowning in chats",
    },
    pricing: {
      title: "Transparent ",
      titleHl: "pricing",
      subtitle: "Start free. Upgrade when you feel the value.",
      monthly: "per month",
      cta: "Get started",
      ctaPro: "Choose Pro",
      ctaBiz: "Contact sales",
      mostPopular: "Most popular",
      tiers: [
        {
          name: "Starter",
          price: "Free",
          desc: "Perfect for trying it out & tiny stores",
          features: [
            "100 AI conversations/month",
            "1 WhatsApp number",
            "Knowledge base up to 10 entries",
            "Basic analytics",
            "Community support",
          ],
        },
        {
          name: "Pro",
          price: "$14",
          priceUSD: "Rp 199k",
          desc: "For growing stores & SMBs",
          features: [
            "5,000 AI conversations/month",
            "3 WhatsApp numbers",
            "Unlimited knowledge base",
            "Full analytics + export",
            "Custom AI persona",
            "Live inbox + takeover",
            "Priority chat support",
          ],
        },
        {
          name: "Business",
          price: "$59",
          priceUSD: "Rp 799k",
          desc: "For serious brands with volume",
          features: [
            "Unlimited AI conversations",
            "Unlimited WhatsApp numbers",
            "Multi-team + roles",
            "API access",
            "Custom integrations (Shopify, etc)",
            "Dedicated success manager",
            "99.9% uptime SLA",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently ",
      titleHl: "asked questions",
      items: [
        {
          q: "Is this legal? Will my WA account get banned?",
          a: "100% legal. We use Meta's official WhatsApp Cloud API — not unofficial libraries like Baileys or whatsapp-web.js. Your business account is safe; Meta literally recommends this approach.",
        },
        {
          q: "Is the AI smart? Does it hallucinate?",
          a: "Our AI uses retrieval-augmented generation — it only replies based on the knowledge base you provide. If a question is out of context, it says 'sorry, I'm not sure' and tags the conversation for you to take over.",
        },
        {
          q: "How fast is the AI?",
          a: "Average 2-4 seconds from customer message to AI reply. Faster than most human CS, while still feeling natural.",
        },
        {
          q: "Can I use it for more than one store?",
          a: "Yes. Pro supports 3 WhatsApp numbers, Business is unlimited. Each number has its own knowledge base and persona.",
        },
        {
          q: "What if the AI gets it wrong?",
          a: "You can monitor all conversations from the Live Inbox and take over anytime. Every intervention helps improve the AI. You can also set keywords that trigger immediate human handover (e.g. 'refund', 'complaint').",
        },
        {
          q: "I'm not technical — can I set this up myself?",
          a: "Definitely. Our onboarding wizard guides you step-by-step. If you get stuck, our support team helps for free on Pro & Business plans.",
        },
      ],
    },
    finalCta: {
      title: "Stop replying chats one by one.",
      subtitle: "Start free today. No credit card. 5-minute setup.",
      button: "Try BalesinAI free",
    },
    footer: {
      tagline: "AI-powered WhatsApp auto-reply for stores & SMBs.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      links: {
        features: "Features",
        pricing: "Pricing",
        docs: "Docs",
        api: "API",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        careers: "Careers",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        security: "Security",
      },
      copyright: "All rights reserved",
    },
  },
} as const;

export type Dict = (typeof dictionary)[Locale];

export function getDict(locale: Locale): Dict {
  return dictionary[locale] ?? dictionary[DEFAULT_LOCALE];
}
