import type { MetadataRoute } from "next";
import { products, CATEGORY_INFO } from "@/content/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirabutik-demo.ornek.com";
  const now = new Date();

  const staticRoutes = [
    "",
    "/koleksiyon/tumu",
    "/arama",
    "/favoriler",
    "/sepet",
    "/siparis-takip",
    "/iade-talebi",
    "/hakkimizda",
    "/iletisim",
    "/sss",
    "/kargo-ve-teslimat",
    "/iade-ve-degisim",
    "/mesafeli-satis-sozlesmesi",
    "/on-bilgilendirme-formu",
    "/kvkk",
    "/cerez-politikasi",
    "/gizlilik",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryRoutes = Object.keys(CATEGORY_INFO).map((cat) => ({
    url: `${baseUrl}/koleksiyon/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/urun/${p.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
