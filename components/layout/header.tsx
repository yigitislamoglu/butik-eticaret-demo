"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Truck,
  Sparkles,
} from "lucide-react";
import { site } from "@/site.config";
import { formatDateTR, isCampaignActive } from "@/lib/utils";
import { useShop } from "@/components/providers/shop-provider";

const NAV_LINKS = [
  { href: "/koleksiyon/tumu", label: "Koleksiyon" },
  { href: "/koleksiyon/elbise", label: "Elbise" },
  { href: "/koleksiyon/gomlek-bluz", label: "Gömlek & Bluz" },
  { href: "/koleksiyon/pantolon-etek", label: "Pantolon & Etek" },
  { href: "/koleksiyon/triko", label: "Triko" },
  { href: "/koleksiyon/dis-giyim", label: "Dış Giyim" },
  { href: "/koleksiyon/aksesuar", label: "Aksesuar" },
];

export function Header() {
  const pathname = usePathname();
  const {
    campaign,
    getTotals,
    favorites,
    setCartDrawerOpen,
    setSearchOpen,
    flyingItem,
    cartBadgePulse,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [cartTargetCoords, setCartTargetCoords] = useState<{
    x: number;
    y: number;
  }>({ x: 320, y: 28 });

  const totals = getTotals();
  const campaignActive = isCampaignActive(campaign);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (flyingItem && cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      setCartTargetCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [flyingItem]);

  return (
    <>
      {/* Üst Kampanya ve Kargo Şeridi */}
      <div className="bg-[#1F1F1F] px-4 py-2 text-xs text-[#F7F3EE]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
          {campaignActive ? (
            <p className="flex items-center gap-1.5 font-normal">
              <Sparkles className="h-3.5 w-3.5 text-[#B88A5A]" aria-hidden="true" />
              <span>
                {campaign.label} —{" "}
                <span className="text-[#E2D9CC]">
                  Son gün: {formatDateTR(campaign.endsAt)}
                </span>
              </span>
            </p>
          ) : (
            <p className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#B88A5A]" aria-hidden="true" />
              <span>
                {site.shipping.freeOver} TL üzeri siparişlerde ücretsiz kargo ({site.shipping.dispatchDays} kargoda)
              </span>
            </p>
          )}

          <div className="hidden items-center gap-5 text-xs text-[#E2D9CC] md:flex">
            <Link href="/siparis-takip" className="hover:text-white hover:underline">
              Sipariş Takibi
            </Link>
            <Link href="/iade-talebi" className="hover:text-white hover:underline">
              Kolay İade ({site.returns.days} Gün)
            </Link>
            {site.demo && (
              <Link
                href="/panel"
                className="text-[#B88A5A] hover:underline"
              >
                Yönetim Paneli (Demo)
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Ana Üst Gezinme Çubuğu */}
      <header className="sticky top-0 z-30 border-b border-[#E2D9CC] bg-[#F7F3EE]/95 backdrop-blur-none">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          {/* Sol: Mobil Menü Düğmesi + Logo */}
          <div className="flex items-center gap-2 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Gezinme menüsünü aç"
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center text-[#1F1F1F] lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <Link
              href="/"
              className="flex items-center py-2"
              aria-label={`${site.name} Ana Sayfa`}
            >
              <Image
                src={site.logo.src}
                alt={site.logo.alt}
                width={175}
                height={35}
                priority
                className="h-7 w-auto sm:h-8"
              />
            </Link>
          </div>

          {/* Orta: Masaüstü Kategori Bağlantıları */}
          <nav
            aria-label="Ana kategoriler"
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-sm transition-colors ${
                    isActive
                      ? "font-medium text-[#1F1F1F] underline decoration-[#B88A5A] decoration-2 underline-offset-8"
                      : "text-[#1F1F1F]/85 hover:text-[#1F1F1F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sağ: Arama, Favoriler, Sepet */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Ürün arama penceresini aç"
              className="flex h-11 w-11 items-center justify-center text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <Link
              href="/favoriler"
              aria-label={`Favorilerim (${favorites.length} ürün)`}
              className="relative flex h-11 w-11 items-center justify-center text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              {favorites.length > 0 && (
                <span className="tabular-nums absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B88A5A] px-1 text-[11px] font-medium text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              ref={cartButtonRef}
              id="header-cart-button"
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Sepeti aç (${totals.itemCount} ürün)`}
              className="relative flex h-11 items-center gap-2 px-2.5 text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <motion.span
                key={cartBadgePulse}
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.28, 1] }}
                transition={{ duration: 0.32 }}
                aria-live="polite"
                className="tabular-nums flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1F1F1F] px-1.5 text-xs font-medium text-[#F7F3EE]"
              >
                {totals.itemCount}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      {/* Sepete Uçan Ürün Görseli Animasyonu */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            key={flyingItem.id}
            initial={{
              opacity: 0.95,
              scale: 1,
              x: flyingItem.startX - 28,
              y: flyingItem.startY - 36,
            }}
            animate={{
              opacity: 0.15,
              scale: 0.22,
              x: cartTargetCoords.x - 16,
              y: cartTargetCoords.y - 16,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed top-0 left-0 z-[90] h-20 w-16 overflow-hidden border border-[#1F1F1F]/20 bg-[#EFE9E0]"
            aria-hidden="true"
          >
            <Image
              src={flyingItem.image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobil Gezinme Çekmecesi */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil gezinme menüsü"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/45"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative flex h-full w-[86%] max-w-sm flex-col justify-between bg-[#F7F3EE] p-6 text-[#1F1F1F]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E2D9CC] pb-4">
                  <Image
                    src={site.logo.src}
                    alt={site.logo.alt}
                    width={150}
                    height={30}
                    className="h-7 w-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Menüyü kapat"
                    className="flex h-11 w-11 items-center justify-center text-[#1F1F1F]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav aria-label="Mobil kategoriler" className="mt-6 flex flex-col">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[46px] items-center border-b border-[#E2D9CC]/70 text-base font-medium text-[#1F1F1F]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 flex flex-col gap-2 text-sm text-[#5C564F]">
                  <Link
                    href="/siparis-takip"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#1F1F1F]"
                  >
                    Sipariş Takibi
                  </Link>
                  <Link
                    href="/iade-talebi"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#1F1F1F]"
                  >
                    İade & Değişim Talebi
                  </Link>
                  <Link
                    href="/hakkimizda"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#1F1F1F]"
                  >
                    Hakkımızda
                  </Link>
                  <Link
                    href="/iletisim"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#1F1F1F]"
                  >
                    İletişim
                  </Link>
                  {site.demo && (
                    <Link
                      href="/panel"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 font-medium text-[#9E3B32]"
                    >
                      Yönetim Paneli (/panel)
                    </Link>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E2D9CC] pt-4 text-xs text-[#5C564F]">
                <p className="font-medium text-[#1F1F1F]">{site.tagline}</p>
                <p className="mt-1">WhatsApp Destek: {site.contact.phone}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
