"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { formatPrice, getProductPricing } from "@/lib/utils";
import { BLUR_DATA_URL, type ProductSize } from "@/content/products";

export function CartDrawer() {
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
    isCartDrawerOpen,
    setCartDrawerOpen,
  } = useShop();

  const [couponInput, setCouponInput] = useState(couponCode);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const totals = getTotals();

  useEffect(() => {
    setCouponInput(couponCode);
  }, [couponCode]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponCode(couponInput.trim().toUpperCase());
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Alışveriş sepeti"
        >
          {/* Arka Plan Karartma */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/45"
            onClick={() => setCartDrawerOpen(false)}
          />

          {/* Yay (Spring) Hareketli Yan Sepet Paneli */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 flex h-full w-full max-w-md flex-col bg-[#F7F3EE] text-[#1F1F1F]"
          >
            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-[#E2D9CC] px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <h2 className="font-heading text-2xl font-medium">
                  Sepetiniz ({totals.itemCount})
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Sepet panelini kapat"
                className="flex h-11 w-11 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ücretsiz Kargo İlerleme Çubuğu */}
            <div className="border-b border-[#E2D9CC] bg-[#EFE9E0]/70 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#1F1F1F]">
                <Truck className="h-4 w-4 text-[#B88A5A]" aria-hidden="true" />
                {totals.itemCount === 0 ? (
                  <span>
                    {formatPrice(totals.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir.
                  </span>
                ) : totals.isFreeShipping ? (
                  <span>Tebrikler, siparişinizde ücretsiz kargo kazandınız!</span>
                ) : (
                  <span>
                    Ücretsiz kargo için{" "}
                    <strong className="tabular-nums">
                      {formatPrice(totals.freeShippingRemaining)}
                    </strong>{" "}
                    kaldı.
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#E2D9CC]">
                <div
                  className="h-full bg-[#B88A5A] transition-all duration-300"
                  style={{ width: `${totals.itemCount === 0 ? 0 : totals.freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Ürün Listesi veya Boş Durum */}
            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-[#5C564F]" strokeWidth={1.25} />
                <p className="font-heading mt-4 text-2xl font-medium text-[#1F1F1F]">
                  Sepetiniz şu an boş
                </p>
                <p className="mt-2 text-sm text-[#5C564F]">
                  Yeni sezon keten elbiselerimizi, gömleklerimizi ve zamansız dış giyim parçalarımızı keşfedin.
                </p>
                <Link
                  href="/koleksiyon/tumu"
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-6 inline-flex min-h-[46px] items-center justify-center bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
                >
                  Koleksiyonu Keşfet
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-[#E2D9CC] overflow-y-auto px-5">
                  {cartItems.map((item) => {
                    const fullProduct = products.find((p) => p.id === item.productId);
                    const pricing = getProductPricing(item, campaign);
                    const availableSizesForColor =
                      fullProduct?.variants.filter(
                        (v) => v.color === item.color && v.stock > 0
                      ) ?? [];
                    const availableColors = fullProduct?.colors ?? [];

                    return (
                      <div key={item.sku} className="flex gap-4 py-4">
                        <Link
                          href={`/urun/${item.slug}`}
                          onClick={() => setCartDrawerOpen(false)}
                          className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#EFE9E0]"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/urun/${item.slug}`}
                                onClick={() => setCartDrawerOpen(false)}
                                className="text-sm font-medium text-[#1F1F1F] hover:underline"
                              >
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.sku)}
                                aria-label={`${item.name} ürününü sepetten kaldır`}
                                className="p-1 text-[#5C564F] hover:text-[#9E3B32]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Varyant Değiştirme (Renk ve Beden) */}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              {availableColors.length > 1 ? (
                                <label className="flex items-center gap-1 text-[#5C564F]">
                                  <span>Renk:</span>
                                  <select
                                    aria-label={`${item.name} renk değiştir`}
                                    value={item.color}
                                    onChange={(e) =>
                                      updateItemVariant(
                                        item.sku,
                                        e.target.value,
                                        item.size
                                      )
                                    }
                                    className="border border-[#E2D9CC] bg-[#FAF8F5] px-1.5 py-0.5 text-xs text-[#1F1F1F]"
                                  >
                                    {availableColors.map((c) => (
                                      <option key={c.name} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              ) : (
                                <span className="text-[#5C564F]">Renk: {item.color}</span>
                              )}

                              {availableSizesForColor.length > 1 ? (
                                <label className="flex items-center gap-1 text-[#5C564F]">
                                  <span>Beden:</span>
                                  <select
                                    aria-label={`${item.name} beden değiştir`}
                                    value={item.size}
                                    onChange={(e) =>
                                      updateItemVariant(
                                        item.sku,
                                        item.color,
                                        e.target.value as ProductSize
                                      )
                                    }
                                    className="border border-[#E2D9CC] bg-[#FAF8F5] px-1.5 py-0.5 text-xs text-[#1F1F1F]"
                                  >
                                    {availableSizesForColor.map((v) => (
                                      <option key={v.sku} value={v.size}>
                                        {v.size}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              ) : (
                                <span className="text-[#5C564F]">Beden: {item.size}</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-[#E2D9CC] bg-[#FAF8F5]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.sku, item.quantity - 1)
                                }
                                aria-label="Adet azalt"
                                className="flex h-8 w-8 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="tabular-nums w-8 text-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.sku, item.quantity + 1)
                                }
                                aria-label="Adet artır"
                                className="flex h-8 w-8 items-center justify-center text-[#1F1F1F] hover:bg-[#EFE9E0]"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="tabular-nums text-right">
                              <span className="text-sm font-medium text-[#1F1F1F]">
                                {formatPrice(pricing.finalPrice * item.quantity)}
                              </span>
                              {pricing.strikethroughPrice ? (
                                <span className="ml-1.5 text-xs text-[#5C564F] line-through">
                                  {formatPrice(pricing.strikethroughPrice * item.quantity)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Alt Özet ve İndirim Kodu */}
                <div className="border-t border-[#E2D9CC] bg-[#FAF8F5] p-5">
                  <form onSubmit={handleApplyCoupon} className="mb-4">
                    <label
                      htmlFor="drawer-coupon-input"
                      className="mb-1.5 flex items-center justify-between text-xs text-[#5C564F]"
                    >
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                        İndirim Kodu (Demo kodu: <strong>MIRA10</strong>)
                      </span>
                      {totals.appliedCoupon && (
                        <button
                          type="button"
                          onClick={() => {
                            setCouponCode("");
                            setCouponInput("");
                          }}
                          className="text-xs text-[#9E3B32] underline"
                        >
                          Kodu Kaldır ({totals.appliedCoupon.code})
                        </button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="drawer-coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="MIRA10"
                        className="min-h-[42px] flex-1 border border-[#E2D9CC] bg-white px-3 text-sm text-[#1F1F1F] uppercase"
                      />
                      <button
                        type="submit"
                        className="min-h-[42px] border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A] hover:border-[#B88A5A]"
                      >
                        Uygula
                      </button>
                    </div>
                    {totals.couponError && (
                      <p role="alert" className="mt-1 text-xs text-[#9E3B32]">
                        {totals.couponError}
                      </p>
                    )}
                    {totals.appliedCoupon && (
                      <p className="mt-1 text-xs text-[#596348]">
                        {totals.appliedCoupon.code} uygulandı: -{formatPrice(totals.couponDiscount)}
                      </p>
                    )}
                  </form>

                  <div className="space-y-1.5 text-sm tabular-nums">
                    <div className="flex justify-between text-[#5C564F]">
                      <span>Ara Toplam</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.couponDiscount > 0 && (
                      <div className="flex justify-between text-[#9E3B32]">
                        <span>İndirim Kodu ({totals.appliedCoupon?.code})</span>
                        <span>-{formatPrice(totals.couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#5C564F]">
                      <span>Kargo</span>
                      <span>
                        {totals.shippingFee === 0
                          ? "Ücretsiz"
                          : formatPrice(totals.shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[#E2D9CC] pt-2 text-base font-medium text-[#1F1F1F]">
                      <span>Toplam (KDV Dahil)</span>
                      <span>{formatPrice(totals.total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <Link
                      href="/sepet"
                      onClick={() => setCartDrawerOpen(false)}
                      className="flex min-h-[48px] items-center justify-center border border-[#1F1F1F] bg-transparent px-4 text-sm font-medium text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
                    >
                      Sepete Git
                    </Link>
                    <Link
                      href="/odeme"
                      onClick={() => setCartDrawerOpen(false)}
                      className="flex min-h-[48px] items-center justify-center gap-1.5 bg-[#1F1F1F] px-4 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
                    >
                      <span>Ödemeye Geç</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
