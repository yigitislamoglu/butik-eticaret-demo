"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { formatPrice, getProductPricing, normalizeTurkish } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/content/products";

const QUICK_SEARCH_TERMS = [
  "Keten Elbise",
  "Gömlek",
  "Palazzo Pantolon",
  "Trençkot",
  "Merinos Hırka",
  "İpek Fular",
];

export function SearchModal() {
  const router = useRouter();
  const { products, campaign, isSearchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  const matchingProducts = useMemo(() => {
    const normalizedQuery = normalizeTurkish(query);
    if (!normalizedQuery) return products.slice(0, 4);

    return products
      .filter((p) => {
        const haystack = normalizeTurkish(
          `${p.name} ${p.categoryLabel} ${p.collection} ${p.material} ${p.description} ${p.colors
            .map((c) => c.name)
            .join(" ")}`
        );
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [products, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Ürün arama"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={() => setSearchOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 border-b border-[#E2D9CC] bg-[#F7F3EE] px-4 py-6 text-[#1F1F1F] sm:px-8"
          >
            <div className="mx-auto max-w-4xl">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-3.5 h-5 w-5 text-[#5C564F]"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün, kumaş veya kategori arayın (ör. gomlek, keten elbise, trenckot)..."
                  aria-label="Ürün, kumaş veya kategori arayın"
                  className="min-h-[52px] w-full border border-[#1F1F1F] bg-[#FAF8F5] pr-24 pl-11 text-base text-[#1F1F1F] placeholder:text-[#5C564F]"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="px-2 py-1 text-xs text-[#5C564F] hover:text-[#1F1F1F]"
                    >
                      Temizle
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Aramayı kapat"
                    className="flex h-10 w-10 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Hızlı Arama Terimleri */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#5C564F]">Popüler aramalar:</span>
                {QUICK_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-[#E2D9CC] bg-[#FAF8F5] px-2.5 py-1 text-xs text-[#1F1F1F] transition-colors hover:border-[#1F1F1F]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Anlık Öneriler */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-medium text-[#5C564F]">
                    {query.trim()
                      ? `"${query}" için anlık sonuçlar (${matchingProducts.length})`
                      : "Öne Çıkan Seçkiler"}
                  </h3>
                  {query.trim() && (
                    <Link
                      href={`/arama?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-1 text-xs font-medium text-[#1F1F1F] underline"
                    >
                      <span>Tüm sonuçları gör</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                {matchingProducts.length === 0 ? (
                  <div className="border border-[#E2D9CC] bg-[#FAF8F5] p-6 text-center">
                    <p className="text-sm text-[#1F1F1F]">
                      &ldquo;{query}&rdquo; aramasıyla eşleşen bir ürün bulunamadı.
                    </p>
                    <p className="mt-1 text-xs text-[#5C564F]">
                      Farklı bir anahtar kelime deneyebilir veya tüm koleksiyona göz atabilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {matchingProducts.slice(0, 4).map((product) => {
                      const pricing = getProductPricing(product, campaign);
                      const img = product.colors[0]?.images[0] ?? "";
                      return (
                        <Link
                          key={product.id}
                          href={`/urun/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex flex-col bg-[#FAF8F5] p-2 transition-colors hover:bg-[#EFE9E0]"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9E0]">
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              placeholder="blur"
                              blurDataURL={BLUR_DATA_URL}
                              sizes="(max-width: 640px) 45vw, 180px"
                              className="object-cover"
                            />
                          </div>
                          <span className="mt-2 line-clamp-1 text-xs font-medium text-[#1F1F1F] group-hover:underline">
                            {product.name}
                          </span>
                          <span className="tabular-nums mt-0.5 text-xs text-[#5C564F]">
                            {formatPrice(pricing.finalPrice)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
