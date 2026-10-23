"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Heart,
  ShoppingBag,
  Ruler,
  Sparkles,
  MessageCircle,
  Truck,
  RefreshCcw,
  ZoomIn,
  X,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BLUR_DATA_URL,
  type Product,
  type ProductSize,
} from "@/content/products";
import { recommendSize, sizeCharts } from "@/content/size-chart";
import { site } from "@/site.config";
import { useShop } from "@/components/providers/shop-provider";
import { ProductCard } from "@/components/ui/product-card";
import { store } from "@/lib/store";
import {
  buildWhatsAppUrl,
  formatDateTR,
  formatPrice,
  getProductPricing,
} from "@/lib/utils";

interface ProductDetailViewProps {
  slug: string;
  initialProduct: Product;
}

export function ProductDetailView({
  slug,
  initialProduct,
}: ProductDetailViewProps) {
  const searchParams = useSearchParams();
  const {
    products,
    campaign,
    addToCart,
    toggleFavorite,
    isFavorite,
    recentlyViewedIds,
    recordRecentlyViewed,
  } = useShop();

  // Canlı mağaza verisinden (panelde stok güncellenmişse) ürünü al
  const product = useMemo(
    () => products.find((p) => p.slug === slug) ?? initialProduct,
    [products, slug, initialProduct]
  );

  const initialColorFromUrl = searchParams.get("renk");
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (
      initialColorFromUrl &&
      product.colors.some((c) => c.name === initialColorFromUrl)
    ) {
      return initialColorFromUrl;
    }
    return product.colors[0]?.name ?? "";
  });

  const variantsForColor = useMemo(
    () => product.variants.filter((v) => v.color === selectedColor),
    [product.variants, selectedColor]
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const firstInStock = product.variants.find(
      (v) => v.color === (product.colors[0]?.name ?? "") && v.stock > 0
    );
    return firstInStock?.size ?? product.variants[0]?.size ?? "S";
  });

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [sizeModalTab, setSizeModalTab] = useState<"tablo" | "asistan">("tablo");

  // Bedenimi Bul aracı durumları
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(58);
  const [fitPreference, setFitPreference] = useState<"dar" | "normal" | "rahat">(
    "normal"
  );

  // Gelince Haber Ver formu durumu
  const [restockContact, setRestockContact] = useState("");
  const [restockSaved, setRestockSaved] = useState(false);

  useEffect(() => {
    recordRecentlyViewed(product.id);
  }, [product.id, recordRecentlyViewed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomModalOpen(false);
        setSizeModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const galleryImages = useMemo(
    () =>
      product.images[selectedColor] ??
      product.colors[0]?.images ??
      [],
    [product, selectedColor]
  );

  const selectedVariant = useMemo(
    () =>
      variantsForColor.find((v) => v.size === selectedSize) ??
      variantsForColor[0],
    [variantsForColor, selectedSize]
  );

  const pricing = getProductPricing(product, campaign);
  const fav = isFavorite(product.id);
  const chart = sizeCharts[product.category];
  const sizeRecommendation = useMemo(
    () =>
      recommendSize({
        heightCm,
        weightKg,
        fitPreference,
        productFit: product.fit,
      }),
    [heightCm, weightKg, fitPreference, product.fit]
  );

  const relatedProducts = useMemo(
    () =>
      products
        .filter((p) => product.related.includes(p.id) && p.id !== product.id)
        .slice(0, 4),
    [products, product]
  );

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .filter((id) => id !== product.id)
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    [recentlyViewedIds, product.id, products]
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        color: selectedColor,
        size: selectedVariant.size,
        sku: selectedVariant.sku,
        price: product.price,
        campaignPercent: product.campaignPercent,
        previousPrice30dLowest: product.previousPrice30dLowest,
        image: galleryImages[0] ?? "",
      },
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      true
    );
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockContact.trim() || !selectedVariant) return;
    store.createRestockRequest({
      productId: product.id,
      productName: product.name,
      sku: selectedVariant.sku,
      color: selectedColor,
      size: selectedVariant.size,
      contact: restockContact.trim(),
    });
    setRestockSaved(true);
    setRestockContact("");
  };

  const whatsappQuestionUrl = buildWhatsAppUrl(
    site.contact.whatsapp,
    `Merhaba ${site.name}, "${product.name}" (${selectedColor} - ${selectedSize} beden) ürünü hakkında bilgi almak istiyorum.`
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Sayfa konumu" className="mb-6 text-xs text-[#5C564F]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#1F1F1F] hover:underline">
              Ana Sayfa
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/koleksiyon/${product.category}`}
              className="hover:text-[#1F1F1F] hover:underline"
            >
              {product.categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[#1F1F1F]">{product.name}</li>
        </ol>
      </nav>

      {/* Ürün Üst Bölümü: Sol Galeri + Sağ Seçim & Detaylar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* SOL: Kaydırmalı & Yakınlaştırmalı Galeri (3:4 Oranlı) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            {/* Küçük Önizleme Sütunu (Masaüstü/Tablet) */}
            <div className="order-2 flex gap-2.5 overflow-x-auto sm:order-1 sm:col-span-2 sm:flex-col">
              {galleryImages.map((imgUrl, idx) => {
                const isActive = idx === activeImageIdx;
                return (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`${idx + 1}. ürün görselini göster`}
                    className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden border transition-opacity sm:w-full ${
                      isActive
                        ? "border-[#1F1F1F] opacity-100"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} - ${selectedColor} açı ${idx + 1}`}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Ana Görsel Çerçevesi */}
            <div className="order-1 sm:order-2 sm:col-span-10">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9E0]">
                <Image
                  src={galleryImages[activeImageIdx] ?? galleryImages[0]}
                  alt={`${product.name} — ${selectedColor}`}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  style={{ viewTransitionName: `product-image-${product.id}` }}
                  className="object-cover object-top"
                />

                {/* Galeri Önceki/Sonraki ve Yakınlaştırma Düğmeleri */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((i) =>
                          i === 0 ? galleryImages.length - 1 : i - 1
                        )
                      }
                      aria-label="Önceki görsel"
                      className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-[#FAF8F5]/90 text-[#1F1F1F] hover:bg-[#FAF8F5]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((i) =>
                          i === galleryImages.length - 1 ? 0 : i + 1
                        )
                      }
                      aria-label="Sonraki görsel"
                      className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-[#FAF8F5]/90 text-[#1F1F1F] hover:bg-[#FAF8F5]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setZoomScale(1.5);
                    setZoomModalOpen(true);
                  }}
                  aria-label="Görseli tam ekran yakınlaştır"
                  className="absolute right-3 bottom-3 inline-flex min-h-[40px] items-center gap-1.5 bg-[#FAF8F5]/95 px-3 text-xs font-medium text-[#1F1F1F] hover:bg-white"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  <span>Yakınlaştır</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: Ürün Başlığı, Fiyat, Renk/Beden Seçimi, Bedenimi Bul, WhatsApp */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#5C564F]">
                <span>{product.collection}</span>
                <span className="tabular-nums">SKU: {selectedVariant?.sku}</span>
              </div>

              <h1 className="font-heading mt-1.5 text-3xl leading-tight font-normal text-[#1F1F1F] sm:text-4xl">
                {product.name}
              </h1>

              {/* Fiyat Alanı (KDV Dahil ve Fiyat Etiketi Yönetmeliği Uyumlu) */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-medium text-[#1F1F1F]">
                  {formatPrice(pricing.finalPrice)}
                </span>
                {pricing.strikethroughPrice && (
                  <span className="text-base text-[#5C564F] line-through">
                    {formatPrice(pricing.strikethroughPrice)}
                  </span>
                )}
                {pricing.hasCampaign && pricing.campaignPercent && (
                  <span className="bg-[#9E3B32] px-2.5 py-0.5 text-xs font-medium text-white">
                    %{pricing.campaignPercent} Sezon İndirimi
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#5C564F]">
                KDV dahildir.{" "}
                {pricing.hasCampaign
                  ? `Kampanya bitiş tarihi: ${formatDateTR(campaign.endsAt)}`
                  : `${formatPrice(site.shipping.freeOver)} üzeri alışverişlerde kargo ücretsizdir.`}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-[#5C564F]">
              {product.description}
            </p>

            {/* Renk Seçimi */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1F1F1F]">
                  Renk: <span className="font-normal text-[#5C564F]">{selectedColor}</span>
                </span>
              </div>
              <div
                className="mt-2.5 flex flex-wrap gap-2.5"
                role="radiogroup"
                aria-label="Renk seçimi"
              >
                {product.colors.map((color) => {
                  const isSelected = color.name === selectedColor;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setActiveImageIdx(0);
                        setRestockSaved(false);
                      }}
                      className={`inline-flex min-h-[42px] items-center gap-2 border px-3.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                          : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Beden Seçimi + Beden Tablosu / Bedenimi Bul Tetikleyicileri */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-[#1F1F1F]">
                  Beden: <span className="font-normal text-[#5C564F]">{selectedSize}</span>
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSizeModalTab("tablo");
                      setSizeModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 font-medium text-[#1F1F1F] underline underline-offset-4 hover:text-[#B88A5A]"
                  >
                    <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Beden Tablosu</span>
                  </button>
                  {product.category !== "aksesuar" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSizeModalTab("asistan");
                        setSizeModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 font-medium text-[#B88A5A] underline underline-offset-4 hover:text-[#1F1F1F]"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Bedenimi Bul</span>
                    </button>
                  )}
                </div>
              </div>

              <div
                className="mt-2.5 grid grid-cols-5 gap-2"
                role="radiogroup"
                aria-label="Beden seçimi"
              >
                {variantsForColor.map((v) => {
                  const isOut = v.stock <= 0;
                  const isSelected = v.size === selectedSize;
                  return (
                    <button
                      key={v.sku}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setSelectedSize(v.size);
                        setRestockSaved(false);
                      }}
                      className={`relative flex min-h-[46px] flex-col items-center justify-center border text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                          : isOut
                            ? "border-[#E2D9CC] bg-[#EFE9E0]/60 text-[#5C564F] line-through"
                            : "border-[#E2D9CC] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#1F1F1F]"
                      }`}
                    >
                      <span>{v.size}</span>
                    </button>
                  );
                })}
              </div>

              {/* Gerçek Stok Uyarısı (Yalnız gerçek stok verisinden, 1 veya 2 kaldığında) */}
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 2 && (
                <p className="mt-2 text-xs font-medium text-[#9E3B32]">
                  Bu bedende son {selectedVariant.stock} ürün kaldı.
                </p>
              )}

              {/* Stokta Olmayan Beden İçin "Gelince Haber Ver" */}
              {selectedVariant && selectedVariant.stock <= 0 && (
                <div className="mt-3 border border-[#E2D9CC] bg-[#FAF8F5] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#1F1F1F]">
                    <Bell className="h-4 w-4 text-[#B88A5A]" aria-hidden="true" />
                    <span>
                      {selectedColor} — {selectedVariant.size} beden şu an tükendi. Stoğa girdiğinde haber verelim:
                    </span>
                  </div>
                  {restockSaved ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#596348]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Talebiniz kaydedildi. Ürün stoğa girdiğinde size bilgi vereceğiz.</span>
                    </p>
                  ) : (
                    <form onSubmit={handleRestockSubmit} className="mt-2.5 flex gap-2">
                      <input
                        type="text"
                        required
                        value={restockContact}
                        onChange={(e) => setRestockContact(e.target.value)}
                        placeholder="E-posta veya telefon numaranız"
                        aria-label="Gelince haber ver iletişim bilgisi"
                        className="min-h-[40px] flex-1 border border-[#E2D9CC] bg-white px-3 text-xs text-[#1F1F1F]"
                      />
                      <button
                        type="submit"
                        className="min-h-[40px] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] hover:bg-[#B88A5A]"
                      >
                        Gelince Haber Ver
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Ana Eylem Düğmeleri: Sepete Ekle + Favori + WhatsApp'tan Sor */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  onClick={handleAddToCart}
                  className="flex min-h-[52px] flex-1 items-center justify-center gap-2 bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A] disabled:cursor-not-allowed disabled:bg-[#5C564F]/40"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {!selectedVariant || selectedVariant.stock <= 0
                      ? "Bu Beden Tükendi"
                      : `Sepete Ekle — ${formatPrice(pricing.finalPrice)}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
                  aria-pressed={fav}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-[#1F1F1F] bg-[#FAF8F5] text-[#1F1F1F] hover:bg-[#EFE9E0]"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      fav ? "fill-[#9E3B32] text-[#9E3B32]" : "text-[#1F1F1F]"
                    }`}
                  />
                </button>
              </div>

              <a
                href={whatsappQuestionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[46px] w-full items-center justify-center gap-2 border border-[#1F1F1F]/30 bg-[#FAF8F5] px-4 text-xs font-medium text-[#1F1F1F] transition-colors hover:border-[#1F1F1F]"
              >
                <MessageCircle className="h-4 w-4 text-[#596348]" aria-hidden="true" />
                <span>
                  WhatsApp&apos;tan Sor ({product.name} · {selectedColor} · {selectedSize})
                </span>
              </a>
            </div>

            {/* Kumaş, Kalıp, Model Bilgisi, Bakım ve Kargo/İade Özeti */}
            <div className="divide-y divide-[#E2D9CC] border-t border-b border-[#E2D9CC] text-xs">
              <div className="py-3.5">
                <p className="font-medium text-[#1F1F1F]">Kalıp & Model Bilgisi</p>
                <p className="mt-1 text-[#5C564F]">
                  Kalıp:{" "}
                  <strong className="text-[#1F1F1F]">
                    {product.fit === "dar"
                      ? "Dar Kalıp"
                      : product.fit === "oversize"
                        ? "Oversize / Rahat Kalıp"
                        : "Tam (Normal) Kalıp"}
                  </strong>{" "}
                  · {product.modelInfo}
                </p>
              </div>

              <div className="py-3.5">
                <p className="font-medium text-[#1F1F1F]">Kumaş İçeriği</p>
                <p className="mt-1 text-[#5C564F]">{product.material}</p>
              </div>

              <div className="py-3.5">
                <p className="font-medium text-[#1F1F1F]">Bakım ve Yıkama Talimatı</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-[#5C564F]">
                  {product.care.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-3 py-3.5 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#B88A5A]" />
                  <div>
                    <p className="font-medium text-[#1F1F1F]">Kargo & Teslimat</p>
                    <p className="mt-0.5 text-[#5C564F]">
                      {site.shipping.dispatchDays} içinde {site.shipping.carrier} ile gönderilir. {formatPrice(site.shipping.freeOver)} üzeri ücretsiz, altı {formatPrice(site.shipping.fee)}.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-[#B88A5A]" />
                  <div>
                    <p className="font-medium text-[#1F1F1F]">İade & Değişim</p>
                    <p className="mt-0.5 text-[#5C564F]">
                      Teslimattan itibaren {site.returns.days} gün içinde koşulsuz cayma hakkı.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Örnek Müşteri Yorumları (Ticari Reklam Yönetmeliği gereği açıkça "Örnek yorum" ibareli) */}
      {product.sampleReviews && product.sampleReviews.length > 0 && (
        <section
          aria-labelledby="heading-urun-yorumlari"
          className="mt-16 border-t border-[#E2D9CC] pt-12"
        >
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2
                id="heading-urun-yorumlari"
                className="font-heading text-3xl font-normal text-[#1F1F1F]"
              >
                Değerlendirmeler
              </h2>
              <p className="mt-1 text-xs text-[#5C564F]">
                Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği uyarısı: Bu demo mağazada yer alan değerlendirmeler arayüz tanıtımı amacıyla <strong>&ldquo;Örnek yorum&rdquo;</strong> olarak işaretlenmiştir; canlı mağazada yalnızca doğrulanmış alıcıların yorumları yayınlanır.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.sampleReviews.map((rev) => (
              <article
                key={rev.id}
                className="border border-[#E2D9CC] bg-[#FAF8F5] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1F1F1F]">
                      {rev.author}
                    </span>
                    <span className="border border-[#B88A5A] bg-[#EFE9E0] px-2 py-0.5 text-[11px] font-medium text-[#1F1F1F]">
                      Örnek yorum
                    </span>
                  </div>
                  <span className="text-xs text-[#5C564F]">{rev.date}</span>
                </div>
                <p className="mt-2 text-xs text-[#5C564F]">
                  Satın alınan beden: <strong>{rev.sizePurchased}</strong> · Kalıp geri bildirimi:{" "}
                  <strong>{rev.fitFeedback}</strong>
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#1F1F1F]">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Benzer Ürünler */}
      {relatedProducts.length > 0 && (
        <section
          aria-labelledby="heading-benzer-urunler"
          className="mt-16 border-t border-[#E2D9CC] pt-12"
        >
          <h2
            id="heading-benzer-urunler"
            className="font-heading text-3xl font-normal text-[#1F1F1F]"
          >
            Kombininizi Tamamlayacak Benzer Parçalar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Son Bakılanlar */}
      {recentlyViewedProducts.length > 0 && (
        <section
          aria-labelledby="heading-son-bakilanlar"
          className="mt-16 border-t border-[#E2D9CC] pt-12"
        >
          <h2
            id="heading-son-bakilanlar"
            className="font-heading text-3xl font-normal text-[#1F1F1F]"
          >
            Son İncelediğiniz Ürünler
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {recentlyViewedProducts.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* MODAL 1: Beden Tablosu ve "Bedenimi Bul" Küçük Aracı */}
      <AnimatePresence>
        {sizeModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Beden tablosu ve beden öneri aracı"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setSizeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              className="relative z-10 max-h-[88dvh] w-full max-w-2xl overflow-y-auto bg-[#F7F3EE] p-6 text-[#1F1F1F] sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-[#E2D9CC] pb-4">
                <h2 className="font-heading text-2xl font-medium sm:text-3xl">
                  {chart.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(false)}
                  aria-label="Pencereyi kapat"
                  className="flex h-10 w-10 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sekmeler */}
              {product.category !== "aksesuar" && (
                <div className="mt-4 flex border-b border-[#E2D9CC]">
                  <button
                    type="button"
                    onClick={() => setSizeModalTab("tablo")}
                    className={`min-h-[42px] px-4 text-xs font-medium ${
                      sizeModalTab === "tablo"
                        ? "border-b-2 border-[#1F1F1F] text-[#1F1F1F]"
                        : "text-[#5C564F]"
                    }`}
                  >
                    Ölçü Tablosu (cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeModalTab("asistan")}
                    className={`min-h-[42px] px-4 text-xs font-medium ${
                      sizeModalTab === "asistan"
                        ? "border-b-2 border-[#1F1F1F] text-[#1F1F1F]"
                        : "text-[#5C564F]"
                    }`}
                  >
                    Bedenimi Bul (Boy / Kilo Önerisi)
                  </button>
                </div>
              )}

              {sizeModalTab === "tablo" ? (
                <div className="mt-5">
                  <p className="text-xs leading-relaxed text-[#5C564F]">
                    {chart.measurementNote}
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs tabular-nums">
                      <thead>
                        <tr className="border-b border-[#E2D9CC] bg-[#EFE9E0] text-[#1F1F1F]">
                          <th className="p-3 font-medium">Beden</th>
                          <th className="p-3 font-medium">Göğüs (cm)</th>
                          <th className="p-3 font-medium">Bel (cm)</th>
                          <th className="p-3 font-medium">Basen (cm)</th>
                          <th className="p-3 font-medium">Ürün Boyu (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2D9CC] bg-[#FAF8F5]">
                        {chart.rows.map((row) => (
                          <tr key={row.size}>
                            <td className="p-3 font-medium text-[#1F1F1F]">
                              {row.size}
                            </td>
                            <td className="p-3 text-[#5C564F]">{row.bust}</td>
                            <td className="p-3 text-[#5C564F]">{row.waist}</td>
                            <td className="p-3 text-[#5C564F]">{row.hip}</td>
                            <td className="p-3 text-[#5C564F]">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="calc-height"
                        className="block text-xs font-medium text-[#1F1F1F]"
                      >
                        Boyunuz (cm)
                      </label>
                      <input
                        id="calc-height"
                        type="number"
                        min={145}
                        max={195}
                        value={heightCm}
                        onChange={(e) =>
                          setHeightCm(Number(e.target.value) || 168)
                        }
                        className="mt-1.5 min-h-[42px] w-full border border-[#E2D9CC] bg-[#FAF8F5] px-3 text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="calc-weight"
                        className="block text-xs font-medium text-[#1F1F1F]"
                      >
                        Kilonuz (kg)
                      </label>
                      <input
                        id="calc-weight"
                        type="number"
                        min={40}
                        max={115}
                        value={weightKg}
                        onChange={(e) =>
                          setWeightKg(Number(e.target.value) || 58)
                        }
                        className="mt-1.5 min-h-[42px] w-full border border-[#E2D9CC] bg-[#FAF8F5] px-3 text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="calc-fit"
                        className="block text-xs font-medium text-[#1F1F1F]"
                      >
                        Duruş Tercihiniz
                      </label>
                      <select
                        id="calc-fit"
                        value={fitPreference}
                        onChange={(e) =>
                          setFitPreference(
                            e.target.value as "dar" | "normal" | "rahat"
                          )
                        }
                        className="mt-1.5 min-h-[42px] w-full border border-[#E2D9CC] bg-[#FAF8F5] px-3 text-xs"
                      >
                        <option value="dar">Vücuda Oturan (Dar)</option>
                        <option value="normal">Tam Kalıp (Normal)</option>
                        <option value="rahat">Dökümlü (Rahat)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-[#B88A5A] bg-[#FAF8F5] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#5C564F]">
                          Bu ürün için önerilen bedeniniz:
                        </span>
                        <p className="font-heading mt-0.5 text-3xl font-medium text-[#1F1F1F]">
                          {sizeRecommendation.recommended} Beden
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSize(sizeRecommendation.recommended);
                          setSizeModalOpen(false);
                        }}
                        className="min-h-[40px] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] hover:bg-[#B88A5A]"
                      >
                        {sizeRecommendation.recommended} Bedeni Seç
                      </button>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#5C564F]">
                      {sizeRecommendation.explanation}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Tam Ekran Görsel Yakınlaştırma (Pinch-to-Zoom & Zoom Ölçeği) */}
      <AnimatePresence>
        {zoomModalOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Yakınlaştırılmış ürün görseli"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => (s === 1 ? 1.6 : s === 1.6 ? 2.2 : 1))}
                  className="min-h-[40px] border border-white/30 px-3 text-xs font-medium"
                >
                  Yakınlaştırma: {zoomScale.toFixed(1)}x
                </button>
              </div>
              <button
                type="button"
                onClick={() => setZoomModalOpen(false)}
                aria-label="Yakınlaştırmayı kapat"
                className="flex h-11 w-11 items-center justify-center border border-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-auto p-4">
              <div
                className="relative aspect-[3/4] w-full max-w-lg transition-transform duration-200"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={galleryImages[activeImageIdx] ?? galleryImages[0]}
                  alt={`${product.name} yakınlaştırılmış görünüm`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
