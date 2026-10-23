"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, MessageCircle, ExternalLink } from "lucide-react";
import { site } from "@/site.config";
import { buildWhatsAppUrl } from "@/lib/utils";
import { useShop } from "@/components/providers/shop-provider";

export function Footer() {
  const { resetDemo } = useShop();
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleReset = () => {
    resetDemo();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2500);
  };

  const whatsappHelpUrl = buildWhatsAppUrl(
    site.contact.whatsapp,
    `Merhaba ${site.name}, ürünleriniz ve sipariş süreci hakkında bilgi almak istiyorum.`
  );

  return (
    <>
      <footer className="border-t border-[#E2D9CC] bg-[#EFE9E0] text-[#1F1F1F]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {/* Üst Izgara: Marka, Koleksiyon, Müşteri Hizmetleri, Yasal & Satıcı Bilgileri */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Marka Sütunu */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block">
                <Image
                  src={site.logo.src}
                  alt={site.logo.alt}
                  width={180}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#5C564F]">
                {site.tagline}. Doğal ketenler, özenli kalıplar ve zamansız parçalarla
                Instagram DM karmaşasına gerek kalmadan şeffaf, hızlı ve güvenli alışveriş deneyimi.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A] hover:border-[#B88A5A]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp Destek Hattı</span>
                </a>
                <a
                  href={site.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-1.5 border border-[#1F1F1F]/30 bg-[#FAF8F5] px-3.5 text-xs font-medium text-[#1F1F1F] hover:border-[#1F1F1F]"
                >
                  <span>Instagram {site.contact.instagramHandle}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Koleksiyonlar */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-medium text-[#1F1F1F]">
                Koleksiyon
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-[#5C564F]">
                <li>
                  <Link href="/koleksiyon/elbise" className="hover:text-[#1F1F1F] hover:underline">
                    Elbise
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyon/gomlek-bluz" className="hover:text-[#1F1F1F] hover:underline">
                    Gömlek & Bluz
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyon/pantolon-etek" className="hover:text-[#1F1F1F] hover:underline">
                    Pantolon & Etek
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyon/triko" className="hover:text-[#1F1F1F] hover:underline">
                    Triko Seçkisi
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyon/dis-giyim" className="hover:text-[#1F1F1F] hover:underline">
                    Dış Giyim
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyon/aksesuar" className="hover:text-[#1F1F1F] hover:underline">
                    Aksesuar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kurumsal & Yardım */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-xl font-medium text-[#1F1F1F]">
                Müşteri Hizmetleri & Hukuk
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[#5C564F]">
                <li>
                  <Link href="/siparis-takip" className="hover:text-[#1F1F1F] hover:underline">
                    Sipariş Takibi
                  </Link>
                </li>
                <li>
                  <Link href="/iade-talebi" className="hover:text-[#1F1F1F] hover:underline">
                    Online İade Talebi ({site.returns.days} Gün Cayma Hakkı)
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className="hover:text-[#1F1F1F] hover:underline">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:text-[#1F1F1F] hover:underline">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="hover:text-[#1F1F1F] hover:underline">
                    Sıkça Sorulan Sorular (SSS)
                  </Link>
                </li>
                <li>
                  <Link href="/kargo-ve-teslimat" className="hover:text-[#1F1F1F] hover:underline">
                    Kargo ve Teslimat Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/iade-ve-degisim" className="hover:text-[#1F1F1F] hover:underline">
                    İade ve Değişim Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/on-bilgilendirme-formu" className="hover:text-[#1F1F1F] hover:underline">
                    Ön Bilgilendirme Formu
                  </Link>
                </li>
                <li>
                  <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-[#1F1F1F] hover:underline">
                    Mesafeli Satış Sözleşmesi
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk" className="hover:text-[#1F1F1F] hover:underline">
                    KVKK Aydınlatma Metni
                  </Link>
                </li>
                <li>
                  <Link href="/cerez-politikasi" className="hover:text-[#1F1F1F] hover:underline">
                    Çerez Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/gizlilik" className="hover:text-[#1F1F1F] hover:underline">
                    Gizlilik ve Güvenlik Politikası
                  </Link>
                </li>
              </ul>
            </div>

            {/* Yasal Satıcı Bilgileri (6502 Sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği) */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-xl font-medium text-[#1F1F1F]">
                Satıcı Künye Bilgileri
              </h2>
              <dl className="mt-4 space-y-1.5 text-xs leading-relaxed text-[#5C564F]">
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">Ticari Unvan: </dt>
                  <dd className="inline">{site.seller.legalName}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">Adres: </dt>
                  <dd className="inline">{site.contact.address}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">Telefon: </dt>
                  <dd className="inline">{site.contact.phone}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">E-posta: </dt>
                  <dd className="inline">{site.contact.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">Vergi Dairesi / No: </dt>
                  <dd className="inline">
                    {site.seller.taxOffice} VD / {site.seller.taxNumber}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">MERSİS No: </dt>
                  <dd className="inline tabular-nums">{site.seller.mersis}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">KEP Adresi: </dt>
                  <dd className="inline">{site.seller.kep}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[#1F1F1F]">ETBİS: </dt>
                  <dd className="inline">{site.seller.etbis}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Alt Editoryal İsim ve EMY Digital Demo Notu */}
          <div className="mt-14 border-t border-[#E2D9CC] pt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="text-xs text-[#5C564F]">
                <p>
                  © {new Date().getFullYear()} {site.name}. Tüm fiyatlara KDV dahildir.
                </p>
                {site.demo && (
                  <p className="mt-1 font-medium text-[#1F1F1F]">
                    Bu site <strong>EMY Digital</strong> tarafından hazırlanmış bir örnektir. Mağaza adı, satıcı bilgileri ve iletişim bilgileri kurgusaldır.
                  </p>
                )}
              </div>

              {site.demo && (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/panel"
                    className="inline-flex min-h-[38px] items-center border border-[#1F1F1F]/25 bg-[#FAF8F5] px-3 text-xs font-medium text-[#1F1F1F] hover:border-[#1F1F1F]"
                  >
                    Yönetim Paneli (/panel)
                  </Link>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[38px] items-center gap-1.5 border border-[#1F1F1F]/25 bg-[#FAF8F5] px-3 text-xs font-medium text-[#1F1F1F] hover:border-[#9E3B32] hover:text-[#9E3B32]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {resetConfirmed ? "Demo Verileri Sıfırlandı!" : "Demoyu Sıfırla"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Köşede Küçük, Zarif "Demo" Rozeti (`site.demo === true` iken) */}
      {site.demo && (
        <div
          className="fixed bottom-4 left-4 z-30 flex items-center gap-2 border border-[#1F1F1F]/20 bg-[#FAF8F5]/95 px-3 py-1.5 text-xs text-[#1F1F1F]"
          aria-label="Demo modu aktif"
        >
          <span className="h-2 w-2 rounded-full bg-[#B88A5A]" aria-hidden="true" />
          <span className="font-medium">Demo</span>
          <span className="text-[#5C564F]">·</span>
          <Link href="/panel" className="underline hover:text-[#B88A5A]">
            Panel
          </Link>
        </div>
      )}
    </>
  );
}
