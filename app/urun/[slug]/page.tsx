import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/content/products";
import { site } from "@/site.config";
import { getProductPricing } from "@/lib/utils";
import { ProductDetailView } from "@/components/product/product-detail-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return { title: "Ürün Bulunamadı" };
  }

  const primaryImage = product.colors[0]?.images[0] ?? "";

  return {
    title: product.name,
    description: product.description,
    robots: site.demo
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage, width: 900, height: 1200, alt: product.name }] : ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${site.name}`,
      description: product.description,
      images: primaryImage ? [primaryImage] : ["/og-image.jpg"],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const pricing = getProductPricing(product, site.campaign);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirabutik-demo.ornek.com";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.colors.flatMap((c) => c.images),
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: pricing.finalPrice,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: site.seller.legalName,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoryLabel,
        item: `${baseUrl}/koleksiyon/${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${baseUrl}/urun/${product.slug}`,
      },
    ],
  };

  return (
    <>
      {/* demo: true iken JSON-LD üretilmez */}
      {!site.demo && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        </>
      )}

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-4 py-12 text-sm text-[#5C564F]">
            Ürün detayları yükleniyor...
          </div>
        }
      >
        <ProductDetailView slug={slug} initialProduct={product} />
      </Suspense>
    </>
  );
}
