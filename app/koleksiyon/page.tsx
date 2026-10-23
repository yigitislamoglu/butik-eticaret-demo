import React, { Suspense } from "react";
import type { Metadata } from "next";
import { site } from "@/site.config";
import { CollectionView } from "@/components/collection/collection-view";

export const metadata: Metadata = {
  title: "Tüm Koleksiyon",
  description: `${site.name} tüm yeni sezon kadın giyim ve aksesuar koleksiyonu.`,
};

export default function CollectionIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-12 text-sm text-[#5C564F]">
          Koleksiyon yükleniyor...
        </div>
      }
    >
      <CollectionView categorySlug="tumu" />
    </Suspense>
  );
}
