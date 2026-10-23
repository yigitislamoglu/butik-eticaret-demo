import React from "react";
import { site } from "@/site.config";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: `Mesafeli Satış Sözleşmesi — ${site.name}`,
};

export default function DistanceSalesContractPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            6502 Sayılı Kanun & Mesafeli Sözleşmeler Yönetmeliği
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Mesafeli Satış Sözleşmesi
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            MADDE 1 — TARAFLAR
          </h2>
          <p>
            <strong>1.1. SATICI BİLGİLERİ:</strong>
            <br />
            Ticari Unvan: {site.legal.sellerTitle}
            <br />
            Adres: {site.address}
            <br />
            Telefon: {site.phone} | E-posta: {site.email}
            <br />
            MERSİS No: {site.legal.mersisNo} | Vergi Dairesi ve No:{" "}
            {site.legal.taxOffice} / {site.legal.taxNumber}
            <br />
            KEP Adresi: {site.legal.kepAddress}
          </p>
          <p>
            <strong>1.2. ALICI (TÜKETİCİ) BİLGİLERİ:</strong> Sipariş ekranında
            (`/odeme`) alıcı tarafından beyan edilen ad-soyad, teslimat adresi,
            telefon ve e-posta bilgileri sözleşme anında dinamik olarak
            işlenmektedir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            MADDE 2 — SÖZLEŞMENİN KONUSU
          </h2>
          <p>
            İşbu sözleşmenin konusu, ALICI&apos;nın SATICI&apos;ya ait internet
            sitesinden elektronik ortamda siparişini verdiği aşağıda nitelikleri
            ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili
            olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
            Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve
            yükümlülüklerinin saptanmasıdır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            MADDE 3 — TESLİMAT VE KARGO
          </h2>
          <p>
            Sözleşme konusu ürün, yasal 30 (otuz) günlük süreyi aşmamak
            koşulu ile ALICI veya gösterdiği adresteki kişi/kuruluşa anlaşmalı
            kargo şirketleri ({site.shipping.carriers.join(", ")}) aracılığıyla
            teslim edilir. {formatPrice(site.shipping.freeOver)} altı
            siparişlerde kargo bedeli {formatPrice(site.shipping.fee)} olup
            sipariş toplamına eklenir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            MADDE 4 — CAYMA HAKKI
          </h2>
          <p>
            ALICI, malı teslim aldığı tarihten itibaren 14 (ondört) gün içinde
            herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin bu
            sözleşmeden cayma hakkına sahiptir. Cayma hakkı bildiriminin
            yöneltileceği iletişim kanalları Madde 1.1&apos;de belirtilen
            SATICI iletişim bilgileridir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            MADDE 5 — YETKİLİ MAHKEME VE HAKEM HEYETİ
          </h2>
          <p>
            İşbu sözleşmeden doğan uyuşmazlıklarda şikayet ve itirazlar,
            Ticaret Bakanlığınca her yıl Aralık ayında belirlenen parasal
            sınırlar dahilinde tüketicinin yerleşim yerinin bulunduğu veya
            tüketici işleminin yapıldığı yerdeki Tüketici Sorunları Hakem
            Heyetine veya Tüketici Mahkemesine yapılabilir.
          </p>
        </section>
      </div>
    </div>
  );
}
