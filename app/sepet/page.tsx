"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Tag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { formatPrice, getProductPricing } from "@/lib/utils";
import { BLUR_DATA_URL, type ProductSize } from "@/content/products";
import { site } from "@/site.config";

export default function CartPage() {
  const {
    products,
    campaign,
    cartItems,
    couponCode,
    setCouponCode,
    getTotals,
    removeFromCart,
    updateQuantity,
    updateItemVariant,
  } = useShop();

  const [couponInput, setCouponInput] = useState(couponCode);
  const totals = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponCode(couponInput.trim().toUpperCase());
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-[#E2D9CC] pb-6">
        <h1 className="font-heading text-4xl font-normal text-[#1F1F1F] sm:text-5xl">
          Alışveriş Sepeti ({totals.itemCount})
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-10 border border-[#E2D9CC] bg-[#FAF8F5] px-6 py-16 text-center">
          <ShoppingBag className="mx-auto h-11 w-11 text-[#5C564F]" strokeWidth={1.25} />
          <h2 className="font-heading mt-4 text-3xl font-normal text-[#1F1F1F]">
            Sepetinizde ürün bulunmuyor
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5C564F]">
            Sezon seçkimizdeki doğal keten elbiseler, gömlekler ve dış giyim parçalarını inceleyerek alışverişe başlayabilirsiniz.
          </p>
          <Link
            href="/koleksiyon/tumu"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 bg-[#1F1F1F] px-7 text-sm font-medium text-[#F7F3EE] hover:bg-[#B88A5A]"
          >
            <span>Koleksiyonu İncele</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Sol: Sepet Kalemleri */}
          <div className="lg:col-span-8">
            {/* Ücretsiz Kargo Çubuğu */}
            <div className="mb-6 border border-[#E2D9CC] bg-[#FAF8F5] p-4">
              <div className="flex items-center gap-2 text-sm text-[#1F1F1F]">
                <Truck className="h-4 w-4 text-[#B88A5A]" aria-hidden="true" />
                {totals.isFreeShipping ? (
                  <span className="font-medium">
                    Siparişiniz ücretsiz kargo limitini ({formatPrice(totals.freeShippingThreshold)}) geçti!
                  </span>
                ) : (
                  <span>
                    Ücretsiz kargo için sepetinize{" "}
                    <strong className="tabular-nums">
                      {formatPrice(totals.freeShippingRemaining)}
                    </strong>{" "}
                    değerinde daha ürün ekleyebilirsiniz.
                  </span>
                )}
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden bg-[#E2D9CC]">
                <div
                  className="h-full bg-[#B88A5A] transition-all duration-300"
                  style={{ width: `${totals.freeShippingProgress}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-[#E2D9CC] border-t border-b border-[#E2D9CC]">
              {cartItems.map((item) => {
                const fullProduct = products.find((p) => p.id === item.productId);
                const pricing = getProductPricing(item, campaign);
                const availableColors = fullProduct?.colors ?? [];
                const availableSizes =
                  fullProduct?.variants.filter(
                    (v) => v.color === item.color && v.stock > 0
                  ) ?? [];

                return (
                  <article
                    key={item.sku}
                    className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center"
                  >
                    <Link
                      href={`/urun/${item.slug}`}
                      className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-[#EFE9E0] sm:w-28"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="space-y-2">
                        <Link
                          href={`/urun/${item.slug}`}
                          className="text-base font-medium text-[#1F1F1F] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#5C564F]">SKU: {item.sku}</p>

                        {/* Varyant Seçiciler */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <label className="flex items-center gap-1.5 text-[#5C564F]">
                            <span>Renk:</span>
                            <select
                              aria-label={`${item.name} renk seçimi`}
                              value={item.color}
                              onChange={(e) =>
                                updateItemVariant(
                                  item.sku,
                                  e.target.value,
                                  item.size
                                )
                              }
                              className="min-h-[34px] border border-[#E2D9CC] bg-[#FAF8F5] px-2 text-xs text-[#1F1F1F]"
                            >
                              {availableColors.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="flex items-center gap-1.5 text-[#5C564F]">
                            <span>Beden:</span>
                            <select
                              aria-label={`${item.name} beden seçimi`}
                              value={item.size}
                              onChange={(e) =>
                                updateItemVariant(
                                  item.sku,
                                  item.color,
                                  e.target.value as ProductSize
                                )
                              }
                              className="min-h-[34px] border border-[#E2D9CC] bg-[#FAF8F5] px-2 text-xs text-[#1F1F1F]"
                            >
                              {availableSizes.map((v) => (
                                <option key={v.sku} value={v.size}>
                                  {v.size}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="flex items-center border border-[#E2D9CC] bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.sku, item.quantity - 1)
                            }
                            aria-label="Adet azalt"
                            className="flex h-10 w-10 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="tabular-nums w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.sku, item.quantity + 1)
                            }
                            aria-label="Adet artır"
                            className="flex h-10 w-10 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="tabular-nums min-w-[100px] text-right">
                          <div className="text-base font-medium text-[#1F1F1F]">
                            {formatPrice(pricing.finalPrice * item.quantity)}
                          </div>
                          {pricing.strikethroughPrice && (
                            <div className="text-xs text-[#5C564F] line-through">
                              {formatPrice(pricing.strikethroughPrice * item.quantity)}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.sku)}
                          aria-label={`${item.name} ürününü sepetten sil`}
                          className="flex h-10 w-10 items-center justify-center text-[#5C564F] hover:text-[#9E3B32]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Sağ: Sipariş Özeti ve İndirim Kodu */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 border border-[#E2D9CC] bg-[#FAF8F5] p-6">
              <h2 className="font-heading text-2xl font-medium text-[#1F1F1F]">
                Sipariş Özeti
              </h2>

              <form onSubmit={handleApplyCoupon} className="mt-5">
                <label
                  htmlFor="cart-page-coupon"
                  className="mb-1.5 flex items-center justify-between text-xs text-[#5C564F]"
                >
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    İndirim Kodu (Demo: <strong>MIRA10</strong>)
                  </span>
                  {totals.appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponCode("");
                        setCouponInput("");
                      }}
                      className="text-[#9E3B32] underline"
                    >
                      Kaldır
                    </button>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-page-coupon"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="MIRA10"
                    className="min-h-[44px] flex-1 border border-[#E2D9CC] bg-white px-3 text-sm uppercase"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] hover:bg-[#B88A5A]"
                  >
                    Uygula
                  </button>
                </div>
                {totals.couponError && (
                  <p role="alert" className="mt-1.5 text-xs text-[#9E3B32]">
                    {totals.couponError}
                  </p>
                )}
                {totals.appliedCoupon && (
                  <p className="mt-1.5 text-xs text-[#596348]">
                    {totals.appliedCoupon.code} (%
                    {totals.appliedCoupon.discountPercent}) indirimi uygulandı.
                  </p>
                )}
              </form>

              <dl className="mt-6 space-y-2.5 border-t border-[#E2D9CC] pt-4 text-sm tabular-nums">
                <div className="flex justify-between text-[#5C564F]">
                  <dt>Ara Toplam</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#9E3B32]">
                    <dt>İndirim Kodu ({totals.appliedCoupon?.code})</dt>
                    <dd>-{formatPrice(totals.couponDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-[#5C564F]">
                  <dt>Kargo Ücreti ({site.shipping.carrier})</dt>
                  <dd>
                    {totals.shippingFee === 0
                      ? "Ücretsiz"
                      : formatPrice(totals.shippingFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-[#E2D9CC] pt-3 text-base font-medium text-[#1F1F1F]">
                  <dt>Genel Toplam (KDV Dahil)</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              <p className="mt-2 text-xs text-[#5C564F]">
                Fiyatlara %10 tekstil KDV dahildir. Kapıda ödeme seçilirse ödeme adımında +{formatPrice(site.payment.cashOnDelivery.fee)} tahsilat hizmet bedeli eklenir.
              </p>

              <Link
                href="/odeme"
                className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
              >
                <span>Ödeme Adımına Geç</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#5C564F]">
                <ShieldCheck className="h-4 w-4 text-[#B88A5A]" aria-hidden="true" />
                <span>{site.returns.days} gün içinde koşulsuz iade güvencesi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
