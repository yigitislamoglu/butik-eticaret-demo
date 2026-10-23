"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { ProductCard } from "@/components/ui/product-card";
import { normalizeTurkish } from "@/lib/utils";

const SUGGESTED_TERMS = [
  "gomlek",
  "keten elbise",
  "trenckot",
  "palazzo pantolon",
  "merinos hirka",
  "saten etek",
  "deri kemer",
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const { products } = useShop();

  const results = useMemo(() => {
    const normalized = normalizeTurkish(query);
    if (!normalized) return products;

    return products.filter((p) => {
      const haystack = normalizeTurkish(
        `${p.name} ${p.categoryLabel} ${p.collection} ${p.material} ${p.description} ${p.colors
          .map((c) => c.name)
          .join(" ")}`
      );
      return haystack.includes(normalized);
    });
  }, [products, query]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-normal text-[#1F1F1F] sm:text-5xl">
          Koleksiyonda Ara
        </h1>
        <p className="mt-2 text-sm text-[#5C564F]">
          Türkçe karakter duyarlılığı olmadan ürün adı, kumaş cinsi veya renk ile arama yapabilirsiniz (ör. &ldquo;gomlek&rdquo; yazdığınızda &ldquo;Gömlek&rdquo; sonuçları listelenir).
        </p>

        <div className="relative mt-6">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#5C564F]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, kumaş veya kategori yazın (ör. gomlek, keten, trenckot)..."
            aria-label="Koleksiyonda ara"
            className="min-h-[52px] w-full border border-[#1F1F1F] bg-[#FAF8F5] pr-4 pl-12 text-base text-[#1F1F1F]"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#5C564F]">Önerilen aramalar:</span>
          {SUGGESTED_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="border border-[#E2D9CC] bg-[#FAF8F5] px-2.5 py-1 text-xs text-[#1F1F1F] hover:border-[#1F1F1F]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-[#E2D9CC] pt-8">
        <p className="text-xs text-[#5C564F]">
          {query.trim() ? (
            <>
              &ldquo;<strong className="text-[#1F1F1F]">{query}</strong>&rdquo; araması için{" "}
              <strong className="tabular-nums text-[#1F1F1F]">{results.length}</strong> sonuç bulundu.
            </>
          ) : (
            <>Tüm koleksiyon ({results.length} ürün) gösteriliyor.</>
          )}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 border border-[#E2D9CC] bg-[#FAF8F5] p-12 text-center">
            <h2 className="font-heading text-3xl font-normal text-[#1F1F1F]">
              Aradığınız ifadeyle eşleşen ürün bulunamadı
            </h2>
            <p className="mt-2 text-sm text-[#5C564F]">
              Farklı bir anahtar kelime deneyebilir veya kategori vitrinimize göz atabilirsiniz.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setQuery("")}
                className="min-h-[44px] bg-[#1F1F1F] px-5 text-xs font-medium text-[#F7F3EE]"
              >
                Aramayı Temizle
              </button>
              <Link
                href="/koleksiyon/tumu"
                className="inline-flex min-h-[44px] items-center border border-[#1F1F1F] px-5 text-xs font-medium text-[#1F1F1F]"
              >
                Tüm Koleksiyon
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-12 text-sm text-[#5C564F]">
          Arama sayfası yükleniyor...
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
