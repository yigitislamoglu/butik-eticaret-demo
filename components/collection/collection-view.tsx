"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import {
  CATEGORY_INFO,
  type GarmentCategory,
  type ProductFit,
  type ProductSize,
} from "@/content/products";
import { useShop } from "@/components/providers/shop-provider";
import { ProductCard } from "@/components/ui/product-card";
import { getProductPricing } from "@/lib/utils";

const ALL_SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "STD"];
const ALL_FITS: Array<{ value: ProductFit; label: string }> = [
  { value: "dar", label: "Dar Kalıp" },
  { value: "normal", label: "Normal (Tam) Kalıp" },
  { value: "oversize", label: "Oversize / Rahat" },
];
const PRICE_RANGES = [
  { id: "0-1500", label: "1.500 TL altı", min: 0, max: 1500 },
  { id: "1500-2500", label: "1.500 TL – 2.500 TL", min: 1500, max: 2500 },
  { id: "2500-99999", label: "2.500 TL ve üzeri", min: 2500, max: 99999 },
];

interface CollectionViewProps {
  categorySlug: string;
}

export function CollectionView({ categorySlug }: CollectionViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products, campaign } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL'den filtre durumunu oku
  const sort = searchParams.get("siralama") || "yeni";
  const selectedSizes = useMemo(
    () => (searchParams.get("beden")?.split(",").filter(Boolean) as ProductSize[]) || [],
    [searchParams]
  );
  const selectedColors = useMemo(
    () => searchParams.get("renk")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const selectedFit = (searchParams.get("kalip") as ProductFit | null) || null;
  const selectedPriceRange = searchParams.get("fiyat") || "";
  const onlyCampaign = searchParams.get("kampanya") === "1";

  useEffect(() => {
    if (!mobileFilterOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileFilterOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileFilterOpen]);

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (!val) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    }
    const qs = nextParams.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleMultiParam = (key: "beden" | "renk", value: string, currentList: string[]) => {
    const exists = currentList.includes(value);
    const next = exists
      ? currentList.filter((i) => i !== value)
      : [...currentList, value];
    updateUrlParams({ [key]: next.length > 0 ? next.join(",") : null });
  };

  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Kategoriye göre temel ürün havuzu
  const categoryProducts = useMemo(() => {
    if (categorySlug === "tumu") return products;
    return products.filter((p) => p.category === categorySlug);
  }, [products, categorySlug]);

  // Mevcut kategorideki benzersiz renk seçenekleri
  const availableColorsInCategory = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of categoryProducts) {
      for (const c of p.colors) {
        if (!map.has(c.name)) {
          map.set(c.name, c.hex);
        }
      }
    }
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [categoryProducts]);

  // Filtrelenmiş ve sıralanmış ürünler
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        const pricing = getProductPricing(product, campaign);

        if (onlyCampaign && !pricing.hasCampaign) {
          return false;
        }

        if (selectedFit && product.fit !== selectedFit) {
          return false;
        }

        if (selectedColors.length > 0) {
          const hasMatchingColor = product.colors.some((c) =>
            selectedColors.includes(c.name)
          );
          if (!hasMatchingColor) return false;
        }

        if (selectedSizes.length > 0) {
          // Seçilen bedende gerçek stok (>0) olan varyant kontrolü
          const hasStockInSize = product.variants.some(
            (v) => selectedSizes.includes(v.size) && v.stock > 0
          );
          if (!hasStockInSize) return false;
        }

        if (selectedPriceRange) {
          const rangeObj = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
          if (rangeObj) {
            if (pricing.finalPrice < rangeObj.min || pricing.finalPrice > rangeObj.max) {
              return false;
            }
          }
        }

        return true;
      })
      .toSorted((a, b) => {
        const priceA = getProductPricing(a, campaign).finalPrice;
        const priceB = getProductPricing(b, campaign).finalPrice;

        if (sort === "fiyat-artan") return priceA - priceB;
        if (sort === "fiyat-azalan") return priceB - priceA;
        if (sort === "cok-satan") {
          const aBest = a.tags.includes("cok-satan") ? 1 : 0;
          const bBest = b.tags.includes("cok-satan") ? 1 : 0;
          return bBest - aBest;
        }
        // varsayılan: "yeni"
        const aNew = a.tags.includes("yeni") ? 1 : 0;
        const bNew = b.tags.includes("yeni") ? 1 : 0;
        return bNew - aNew;
      });
  }, [
    categoryProducts,
    campaign,
    onlyCampaign,
    selectedFit,
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    sort,
  ]);

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    (selectedFit ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (onlyCampaign ? 1 : 0);

  const categoryInfo =
    categorySlug !== "tumu" && categorySlug in CATEGORY_INFO
      ? CATEGORY_INFO[categorySlug as GarmentCategory]
      : null;

  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Kampanyalı Ürünler */}
      <div className="border-b border-[#E2D9CC] pb-5">
        <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-[#1F1F1F]">
          <span>Yalnızca Kampanyalı Ürünler</span>
          <input
            type="checkbox"
            checked={onlyCampaign}
            onChange={(e) =>
              updateUrlParams({ kampanya: e.target.checked ? "1" : null })
            }
            className="h-4 w-4 accent-[#1F1F1F]"
          />
        </label>
      </div>

      {/* Beden Filtresi */}
      <div className="border-b border-[#E2D9CC] pb-5">
        <h3 className="text-xs font-medium text-[#5C564F]">Beden (Stokta Olanlar)</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {ALL_SIZES.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleMultiParam("beden", size, selectedSizes)}
                aria-pressed={active}
                className={`min-h-[40px] border text-xs font-medium transition-colors ${
                  active
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                    : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Renk Filtresi (Yalnız renge dayanmayan metin etiketiyle) */}
      <div className="border-b border-[#E2D9CC] pb-5">
        <h3 className="text-xs font-medium text-[#5C564F]">Renk</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableColorsInCategory.map((color) => {
            const active = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleMultiParam("renk", color.name, selectedColors)}
                aria-pressed={active}
                className={`inline-flex min-h-[38px] items-center gap-2 border px-3 text-xs transition-colors ${
                  active
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                    : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/20"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div className="border-b border-[#E2D9CC] pb-5">
        <h3 className="text-xs font-medium text-[#5C564F]">Fiyat Aralığı</h3>
        <div className="mt-3 space-y-2">
          {PRICE_RANGES.map((range) => {
            const active = selectedPriceRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() =>
                  updateUrlParams({ fiyat: active ? null : range.id })
                }
                aria-pressed={active}
                className={`flex min-h-[38px] w-full items-center justify-between border px-3 text-xs transition-colors ${
                  active
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                    : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                }`}
              >
                <span>{range.label}</span>
                {active && <span>Seçili</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kalıp Filtresi */}
      <div>
        <h3 className="text-xs font-medium text-[#5C564F]">Kalıp Kesimi</h3>
        <div className="mt-3 space-y-2">
          {ALL_FITS.map((fitItem) => {
            const active = selectedFit === fitItem.value;
            return (
              <button
                key={fitItem.value}
                type="button"
                onClick={() =>
                  updateUrlParams({ kalip: active ? null : fitItem.value })
                }
                aria-pressed={active}
                className={`flex min-h-[38px] w-full items-center justify-between border px-3 text-xs transition-colors ${
                  active
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                    : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                }`}
              >
                <span>{fitItem.label}</span>
                {active && <span>Seçili</span>}
              </button>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="flex min-h-[42px] w-full items-center justify-center gap-2 border border-[#9E3B32] bg-white px-4 text-xs font-medium text-[#9E3B32] hover:bg-[#9E3B32] hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Tüm Filtreleri Temizle ({activeFilterCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb & Başlık */}
      <nav aria-label="Sayfa konumu" className="text-xs text-[#5C564F]">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#1F1F1F] hover:underline">
              Ana Sayfa
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[#1F1F1F]">
            {categoryInfo ? categoryInfo.name : "Tüm Koleksiyon"}
          </li>
        </ol>
      </nav>

      <div className="mt-4 border-b border-[#E2D9CC] pb-6">
        <h1 className="font-heading text-4xl font-normal text-[#1F1F1F] sm:text-5xl">
          {categoryInfo ? categoryInfo.name : "Tüm Koleksiyon"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5C564F]">
          {categoryInfo
            ? categoryInfo.subtitle
            : "Mira Butik'in doğal keten, organik pamuk poplin, merinos triko ve zamansız dış giyim parçalarından oluşan 36 ürünlük tam seçkisi."}
        </p>

        {/* Kategori Hızlı Geçiş Sekmeleri */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/koleksiyon/tumu"
            className={`min-h-[38px] inline-flex items-center border px-3.5 text-xs font-medium transition-colors ${
              categorySlug === "tumu"
                ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
            }`}
          >
            Tümü ({products.length})
          </Link>
          {(Object.keys(CATEGORY_INFO) as GarmentCategory[]).map((cat) => {
            const info = CATEGORY_INFO[cat];
            const isCurrent = categorySlug === cat;
            return (
              <Link
                key={cat}
                href={`/koleksiyon/${cat}`}
                className={`min-h-[38px] inline-flex items-center border px-3.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                    : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                }`}
              >
                {info.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Üst Araç Çubuğu: Mobil Filtre Düğmesi, Sonuç Sayısı ve Sıralama */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            aria-expanded={mobileFilterOpen}
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#1F1F1F] bg-[#FAF8F5] px-4 text-xs font-medium text-[#1F1F1F] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>
              Filtrele {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </span>
          </button>

          <p className="tabular-nums text-xs text-[#5C564F]">
            Toplam <strong className="text-[#1F1F1F]">{filteredProducts.length}</strong> ürün listeleniyor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-[#5C564F]">
            Sıralama:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => updateUrlParams({ siralama: e.target.value })}
            className="min-h-[44px] border border-[#E2D9CC] bg-[#FAF8F5] px-3 text-xs font-medium text-[#1F1F1F]"
          >
            <option value="yeni">En Yeniler</option>
            <option value="cok-satan">Çok Satanlar</option>
            <option value="fiyat-artan">Fiyat: Artan</option>
            <option value="fiyat-azalan">Fiyat: Azalan</option>
          </select>
        </div>
      </div>

      {/* Aktif Filtre Etiketleri */}
      {activeFilterCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {onlyCampaign && (
            <button
              type="button"
              onClick={() => updateUrlParams({ kampanya: null })}
              className="inline-flex min-h-[32px] items-center gap-1.5 bg-[#EFE9E0] px-2.5 text-xs text-[#1F1F1F]"
            >
              <span>Kampanyalı</span>
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleMultiParam("beden", s, selectedSizes)}
              className="inline-flex min-h-[32px] items-center gap-1.5 bg-[#EFE9E0] px-2.5 text-xs text-[#1F1F1F]"
            >
              <span>Beden: {s}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleMultiParam("renk", c, selectedColors)}
              className="inline-flex min-h-[32px] items-center gap-1.5 bg-[#EFE9E0] px-2.5 text-xs text-[#1F1F1F]"
            >
              <span>Renk: {c}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedFit && (
            <button
              type="button"
              onClick={() => updateUrlParams({ kalip: null })}
              className="inline-flex min-h-[32px] items-center gap-1.5 bg-[#EFE9E0] px-2.5 text-xs text-[#1F1F1F]"
            >
              <span>Kalıp: {selectedFit}</span>
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedPriceRange && (
            <button
              type="button"
              onClick={() => updateUrlParams({ fiyat: null })}
              className="inline-flex min-h-[32px] items-center gap-1.5 bg-[#EFE9E0] px-2.5 text-xs text-[#1F1F1F]"
            >
              <span>
                Fiyat: {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label}
              </span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Ana İçerik: Sol Masaüstü Filtre Sütunu + Sağ Ürün Izgarası */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside
          aria-label="Ürün filtreleri"
          className="hidden lg:col-span-3 lg:block"
        >
          <div className="sticky top-28 border border-[#E2D9CC] bg-[#FAF8F5] p-5">
            <h2 className="font-heading mb-4 text-2xl font-medium text-[#1F1F1F]">
              Filtreler
            </h2>
            {renderFilterControls()}
          </div>
        </aside>

        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="border border-[#E2D9CC] bg-[#FAF8F5] px-6 py-16 text-center">
              <h2 className="font-heading text-3xl font-normal text-[#1F1F1F]">
                Seçtiğiniz filtrelere uygun ürün bulunamadı
              </h2>
              <p className="mt-2 text-sm text-[#5C564F]">
                Beden, renk veya fiyat aralığı filtrelerini daraltmış olabilirsiniz. Filtreleri sıfırlayarak tüm seçkiyi görüntüleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 inline-flex min-h-[46px] items-center gap-2 bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] hover:bg-[#B88A5A]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Filtreleri Temizle</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 6}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobil Alttan Açılan Filtre Paneli */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Ürün filtreleme paneli"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 flex max-h-[86dvh] flex-col bg-[#F7F3EE] text-[#1F1F1F]"
            >
              <div className="flex items-center justify-between border-b border-[#E2D9CC] px-5 py-4">
                <h2 className="font-heading text-2xl font-medium">
                  Filtrele ({filteredProducts.length} Ürün)
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Filtre panelini kapat"
                  className="flex h-11 w-11 items-center justify-center text-[#1F1F1F]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {renderFilterControls()}
              </div>

              <div className="border-t border-[#E2D9CC] bg-[#FAF8F5] p-4">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="min-h-[48px] w-full bg-[#1F1F1F] text-sm font-medium text-[#F7F3EE]"
                >
                  Sonuçları Göster ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
