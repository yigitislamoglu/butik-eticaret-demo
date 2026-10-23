import React from "react";
import { site } from "@/site.config";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: `Ön Bilgilendirme Formu — ${site.name}`,
};

export default function PreInformationFormPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            Mesafeli Sözleşmeler Yönetmeliği m.5
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Ön Bilgilendirme Formu
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. Satıcı Tanıtıcı Bilgileri
          </h2>
          <ul className="space-y-1">
            <li>
              <strong>Satıcı Unvanı:</strong> {site.legal.sellerTitle}
            </li>
            <li>
              <strong>Açık Adres:</strong> {site.address}
            </li>
            <li>
              <strong>Telefon:</strong> {site.phone}
            </li>
            <li>
              <strong>E-posta / KEP:</strong> {site.email} /{" "}
              {site.legal.kepAddress}
            </li>
            <li>
              <strong>MERSİS Numarası:</strong> {site.legal.mersisNo}
            </li>
            <li>
              <strong>Vergi Dairesi ve No:</strong> {site.legal.taxOffice} —{" "}
              {site.legal.taxNumber}
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. Mal veya Hizmetin Temel Nitelikleri ve Fiyatı
          </h2>
          <p>
            Ürünlerin cinsi, türü, rengi, bedeni, adedi ve tüm vergiler (KDV)
            dahil satış fiyatı ürün detay sayfalarında, sepet özetinde ve ödeme
            sayfasındaki dinamik Ön Bilgilendirme Formu alanında açıkça
            gösterilmektedir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. Ödeme ve Teslimat Bilgileri
          </h2>
          <p>
            <strong>Ödeme Yöntemleri:</strong> Kredi/Banka Kartı, Havale/EFT
            veya Kapıda Ödeme (+{formatPrice(site.payment.cashOnDelivery.fee)}{" "}
            hizmet bedeli).
          </p>
          <p>
            <strong>Teslimat Masrafları:</strong>{" "}
            {formatPrice(site.shipping.freeOver)} ve üzeri siparişlerde ücretsiz;
            altındaki siparişlerde {formatPrice(site.shipping.fee)}&apos;dir.
            Anlaşmalı kargo firmaları ({site.shipping.carriers.join(", ")}) ile
            tahmini {site.shipping.estimatedDays} içinde gönderim sağlanır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            4. Cayma Hakkı ve İade Prosedürü
          </h2>
          <p>
            Tüketici, ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong>{" "}
            içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart
            ödemeksizin cayma hakkını kullanabilir. İade kargo gönderimleri
            anlaşmalı kargo kodumuz ile ücretsizdir.
          </p>
        </section>
      </div>
    </div>
  );
}
