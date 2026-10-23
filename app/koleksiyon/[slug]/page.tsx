import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_INFO, type GarmentCategory } from "@/content/products";
import { site } from "@/site.config";
import { CollectionView } from "@/components/collection/collection-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: "tumu" },
    ...Object.keys(CATEGORY_INFO).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "tumu") {
    return {
      title: "Tüm Koleksiyon",
      description: `${site.name} tüm yeni sezon kadın giyim ve aksesuar koleksiyonu.`,
    };
  }
  const info = CATEGORY_INFO[slug as GarmentCategory];
  if (!info) {
    return { title: "Koleksiyon Bulunamadı" };
  }
  return {
    title: `${info.name} Koleksiyonu`,
    description: info.subtitle,
  };
}

export default async function CollectionSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const isValid = slug === "tumu" || slug in CATEGORY_INFO;
  if (!isValid) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-12 text-sm text-[#5C564F]">
          Koleksiyon yükleniyor...
        </div>
      }
    >
      <CollectionView categorySlug={slug} />
    </Suspense>
  );
}
