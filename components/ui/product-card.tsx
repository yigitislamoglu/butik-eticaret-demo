"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { BLUR_DATA_URL, type Product, type ProductSize } from "@/content/products";
import { formatPrice, getProductPricing } from "@/lib/utils";
import { useShop } from "@/components/providers/shop-provider";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { campaign, addToCart, toggleFavorite, isFavorite } = useShop();
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name ?? ""
  );
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [justAddedSize, setJustAddedSize] = useState<ProductSize | null>(null);

  const pricing = getProductPricing(product, campaign);
  const fav = isFavorite(product.id);

  const colorImages =
    product.images[selectedColor] ??
    product.colors[0]?.images ??
    [];
  const primaryImg = colorImages[0] ?? "";
  const secondaryImg = colorImages[1] ?? primaryImg;

  const variantsForColor = product.variants.filter(
    (v) => v.color === selectedColor
  );
  const totalProductStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isCompletelyOutOfStock = totalProductStock === 0;

  const handleQuickAddSize = (
    e: React.MouseEvent<HTMLButtonElement>,
    size: ProductSize,
    sku: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        color: selectedColor,
        size,
        sku,
        price: product.price,
        campaignPercent: product.campaignPercent,
        previousPrice30dLowest: product.previousPrice30dLowest,
        image: primaryImg,
      },
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      true
    );
    setJustAddedSize(size);
    setTimeout(() => {
      setJustAddedSize(null);
      setSizePickerOpen(false);
    }, 900);
  };

  return (
    <article className="group relative flex flex-col">
      {/* 3:4 Görsel Çerçevesi */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9E0]"
        onMouseEnter={() => setShowSecondImage(true)}
        onMouseLeave={() => {
          setShowSecondImage(false);
          setSizePickerOpen(false);
        }}
      >
        <Link
          href={`/urun/${product.slug}?renk=${encodeURIComponent(selectedColor)}`}
          className="block h-full w-full focus-visible:outline-offset-[-2px]"
          aria-label={`${product.name} — ${selectedColor} detay sayfasına git`}
        >
          <Image
            src={showSecondImage ? secondaryImg : primaryImg}
            alt={`${product.name} - ${selectedColor}`}
            fill
            priority={priority}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ viewTransitionName: `product-image-${product.id}` }}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Sol üst durum bilgisi — sahte rozet yok, yalnızca gerçek veri */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {isCompletelyOutOfStock ? (
            <span className="bg-[#1F1F1F] px-2.5 py-1 text-xs font-medium tracking-wide text-[#F7F3EE]">
              Tükendi
            </span>
          ) : pricing.hasCampaign && pricing.campaignPercent ? (
            <span className="bg-[#9E3B32] px-2.5 py-1 text-xs font-medium text-white">
              %{pricing.campaignPercent} İndirim
            </span>
          ) : product.tags.includes("yeni") ? (
            <span className="bg-[#FAF8F5]/95 px-2.5 py-1 text-xs font-medium text-[#1F1F1F]">
              Yeni Sezon
            </span>
          ) : null}
        </div>

        {/* Sağ üst Favori ve İkinci Görsel Dokunmatik Düğmesi */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label={
              fav
                ? `${product.name} ürününü favorilerden çıkar`
                : `${product.name} ürününü favorilere ekle`
            }
            aria-pressed={fav}
            className="flex h-11 w-11 items-center justify-center bg-[#FAF8F5]/90 text-[#1F1F1F] transition-colors hover:bg-[#FAF8F5] active:scale-95"
          >
            <Heart
              className={`h-4 w-4 ${
                fav ? "fill-[#9E3B32] text-[#9E3B32]" : "text-[#1F1F1F]"
              }`}
            />
          </button>
        </div>

        {/* Hızlı Sepete Ekle & Beden Seçimi Katmanı */}
        {!isCompletelyOutOfStock && (
          <div className="absolute inset-x-2.5 bottom-2.5 z-10">
            {sizePickerOpen ? (
              <div
                className="bg-[#FAF8F5] p-2.5 text-[#1F1F1F]"
                role="group"
                aria-label={`${product.name} hızlı beden seçimi`}
              >
                <div className="mb-1.5 flex items-center justify-between text-xs text-[#5C564F]">
                  <span>Beden seçin ({selectedColor})</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSizePickerOpen(false);
                    }}
                    className="px-1.5 py-0.5 text-xs text-[#1F1F1F] underline"
                  >
                    Kapat
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {variantsForColor.map((v) => {
                    const out = v.stock <= 0;
                    const added = justAddedSize === v.size;
                    return (
                      <button
                        key={v.sku}
                        type="button"
                        disabled={out}
                        onClick={(e) => handleQuickAddSize(e, v.size, v.sku)}
                        aria-label={`${v.size} beden ${
                          out ? "stokta yok" : "sepete ekle"
                        }`}
                        className={`flex min-h-[38px] items-center justify-center border text-xs font-medium transition-colors ${
                          added
                            ? "border-[#1F1F1F] bg-[#1F1F1F] text-[#F7F3EE]"
                            : out
                              ? "cursor-not-allowed border-[#E2D9CC] bg-[#F7F3EE] text-[#5C564F]/50 line-through"
                              : "border-[#E2D9CC] bg-white text-[#1F1F1F] hover:border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-[#F7F3EE]"
                        }`}
                      >
                        {added ? <Check className="h-3.5 w-3.5" /> : v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-1.5">
                {colorImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSecondImage((s) => !s);
                    }}
                    aria-label={`${product.name} diğer açı görselini göster`}
                    className="flex min-h-[40px] items-center justify-center bg-[#FAF8F5]/90 px-2.5 text-xs font-medium text-[#1F1F1F] sm:hidden"
                  >
                    {showSecondImage ? "1/2" : "2/2"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSizePickerOpen(true);
                  }}
                  aria-expanded={sizePickerOpen}
                  className="ml-auto flex min-h-[40px] w-full items-center justify-center gap-1.5 bg-[#FAF8F5]/95 px-3 py-2 text-xs font-medium text-[#1F1F1F] transition-opacity duration-200 hover:bg-[#1F1F1F] hover:text-[#F7F3EE] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sepete ekle</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ürün Bilgileri */}
      <div className="mt-3 flex flex-1 flex-col justify-between gap-1.5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[#5C564F]">{product.categoryLabel}</span>
            {/* Renk Noktaları — yalnız renge dayanmayan erişilebilir etiketle */}
            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label={`${product.name} renk seçenekleri`}
            >
              {product.colors.map((c) => {
                const isSelected = c.name === selectedColor;
                return (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Renk: ${c.name}`}
                    title={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      setShowSecondImage(false);
                    }}
                    className={`relative flex h-6 w-6 items-center justify-center rounded-full transition-transform ${
                      isSelected ? " ring-1 ring-[#1F1F1F] ring-offset-1" : ""
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            href={`/urun/${product.slug}?renk=${encodeURIComponent(selectedColor)}`}
            className="mt-0.5 block text-[15px] leading-snug font-normal text-[#1F1F1F] hover:underline"
          >
            {product.name}
          </Link>
        </div>

        {/* Fiyat Satırı — Fiyat Etiketi Yönetmeliği uyumlu */}
        <div className="mt-1 flex flex-wrap items-baseline gap-2 tabular-nums">
          <span className="text-[15px] font-medium text-[#1F1F1F]">
            {formatPrice(pricing.finalPrice)}
          </span>
          {pricing.strikethroughPrice ? (
            <span
              className="text-xs text-[#5C564F] line-through"
              title="Son 30 günün en düşük fiyatı"
            >
              {formatPrice(pricing.strikethroughPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
