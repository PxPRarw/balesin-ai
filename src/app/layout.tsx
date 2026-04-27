import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://balesin-ai.vercel.app",
  ),
  title: {
    default: "BalesinAI — Auto-reply WhatsApp pakai AI buat olshop & UMKM",
    template: "%s · BalesinAI",
  },
  description:
    "AI yang balesin chat WhatsApp customer kamu otomatis 24/7. Pakai WhatsApp Cloud API resmi Meta. Aman, legal, scalable.",
  keywords: [
    "WhatsApp AI",
    "auto reply WhatsApp",
    "chatbot WhatsApp",
    "AI olshop",
    "UMKM Indonesia",
    "WhatsApp Cloud API",
    "BalesinAI",
  ],
  openGraph: {
    type: "website",
    title: "BalesinAI — Auto-reply WhatsApp pakai AI",
    description:
      "AI yang balesin chat WhatsApp customer kamu otomatis 24/7. Mulai gratis.",
    siteName: "BalesinAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BalesinAI — Auto-reply WhatsApp pakai AI",
    description:
      "AI yang balesin chat WhatsApp customer kamu otomatis 24/7. Mulai gratis.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#fff8e7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        {children}
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-paper)",
              border: "2px solid var(--color-foreground)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "4px 4px 0 0 var(--color-foreground)",
              color: "var(--color-foreground)",
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
