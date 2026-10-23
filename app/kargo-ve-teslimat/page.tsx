import React from "react";
import { site } from "@/site.config";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: `Kargo ve Teslimat Koşulları — ${site.name}`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            Teslimat Rehberi
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Kargo ve Teslimat Koşulları
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. Kargo Hazırlık ve Gönderim Süresi
          </h2>
          <p>
            <strong>{site.legal.sellerTitle}</strong> ({site.name}) üzerinden
            hafta içi ve Cumartesi günleri saat{" "}
            <strong>{site.shipping.sameDayCutoff}</strong>&apos;a kadar
            tamamlanan siparişler aynı gün içinde kargoya teslim edilir. Pazar
            günü ve resmi tatil günlerinde verilen siparişler takip eden ilk iş
            gününde gönderime çıkarılır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. Anlaşmalı Kargo Firmaları ve Tahmini Teslimat
          </h2>
          <p>
            Gönderilerimiz Türkiye&apos;nin 81 iline anlaşmalı kargo firmalarımız{" "}
            <strong>{site.shipping.carriers.join(" ve ")}</strong> aracılığıyla
            sigortalı olarak ulaştırılır. Kargoya verildikten sonra tahmini
            teslimat süresi <strong>{site.shipping.estimatedDays}</strong>{" "}
            aralığındadır. Yasal azami teslim süresi 6502 sayılı Kanun uyarınca
            30 günü aşamaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. Kargo Ücreti ve Ücretsiz Kargo Limiti
          </h2>
          <p>
            Sitemizden yapacağınız{" "}
            <strong>{formatPrice(site.shipping.freeOver)} ve üzeri</strong> tüm
            alışverişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde
            sabit kargo ücreti{" "}
            <strong>{formatPrice(site.shipping.fee)}</strong> olarak sepet
            toplamına eklenir. Kapıda ödeme tercih edilmesi halinde kargo
            firması tahsilat hizmet bedeli olarak{" "}
            <strong>+{formatPrice(site.payment.cashOnDelivery.fee)}</strong>{" "}
            yansıtılır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            4. Kargo Takibi ve Teslimat Sırasında Kontrol
          </h2>
          <p>
            Siparişiniz kargoya verildiğinde SMS ve e-posta yoluyla takip
            numaranız iletilir. Ayrıca sitemizdeki{" "}
            <strong>Sipariş Takip</strong> sayfasından sipariş numaranız ve
            telefon numaranızla canlı durumu izleyebilirsiniz. Paketinizi teslim
            alırken dış ambalajda hasar fark etmeniz halinde kargo görevlisine
            tutanak tutturarak bizimle <strong>{site.phone}</strong> numaralı
            hattımızdan iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
