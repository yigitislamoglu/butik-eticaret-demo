import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";
import { ShopProvider } from "@/components/providers/shop-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchModal } from "@/components/layout/search-modal";
import { CookieBanner } from "@/components/layout/cookie-banner";

const headingFont = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-heading",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://butik-eticaret-demo.yigitislamoglu.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: `${site.name}: ${site.tagline}. Doğal keten elbiseler, poplin gömlekler, yüksek bel pantolonlar ve zamansız dış giyim koleksiyonu.`,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: site.demo
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: `${site.name}: ${site.tagline}. Yeni sezon butik kadın giyim seçkisi.`,
    siteName: site.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: `${site.name}: ${site.tagline}. Yeni sezon butik kadın giyim seçkisi.`,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.seller.legalName,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: "Adana",
      addressCountry: "TR",
    },
  };

  const dynamicBrandStyles = {
    "--bg": site.colors.cream,
    "--ink": site.colors.primary,
    "--accent": site.colors.accent,
    "--sale": site.colors.sale,
  } as React.CSSProperties;

  return (
    <html
      lang="tr"
      className={`${headingFont.variable} ${bodyFont.variable}`}
      style={dynamicBrandStyles}
    >
      <body className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--ink)] antialiased">
        <a
          href="#ana-icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#1F1F1F] focus:px-4 focus:py-2.5 focus:text-sm focus:text-[#F7F3EE]"
        >
          Ana içeriğe atla
        </a>

        {/* demo: true iken JSON-LD üretilmez */}
        {!site.demo && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
        )}

        <ShopProvider>
          <Header />
          <main id="ana-icerik" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <CookieBanner />
        </ShopProvider>
      </body>
    </html>
  );
}
