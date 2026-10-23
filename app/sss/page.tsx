import React from "react";
import Link from "next/link";
import { site } from "@/site.config";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: `Sıkça Sorulan Sorular — ${site.name}`,
  description: `Kargo süresi, kapıda ödeme, beden değişimi ve yıkama talimatları hakkında merak edilenler.`,
};

const FAQ_ITEMS = [
  {
    category: "Kargo ve Teslimat Süresi",
    q: "Siparişim ne zaman kargoya verilir ve kaç günde teslim edilir?",
    a: `Hafta içi ve Cumartesi günleri saat ${site.shipping.sameDayCutoff}'a kadar verilen tüm siparişler aynı gün özenle paketlenerek anlaşmalı kargo firmalarımıza (${site.shipping.carriers.join(
      " / "
    )}) teslim edilir. Türkiye geneline tahmini teslimat süremiz ${
      site.shipping.estimatedDays
    } aralığındadır.`,
  },
  {
    category: "Kargo ve Teslimat Süresi",
    q: "Kargo ücreti ne kadar? Ücretsiz kargo sınırınız var mı?",
    a: `${formatPrice(
      site.shipping.freeOver
    )} ve üzeri tüm alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo ücreti ${formatPrice(
      site.shipping.fee
    )}'dir.`,
  },
  {
    category: "Kapıda Ödeme ve Ödeme Seçenekleri",
    q: "Kapıda ödeme seçeneğiniz var mı? Ek ücret alınıyor mu?",
    a: `Evet, tüm siparişlerinizde kapıda nakit veya kapıda tek çekim kredi kartı ile ödeme yapabilirsiniz. Kargo firmalarının tahsilat hizmet bedeli olarak kapıda ödeme seçeneğinde +${formatPrice(
      site.payment.cashOnDelivery.fee
    )} hizmet bedeli yansıtılmaktadır.`,
  },
  {
    category: "Kapıda Ödeme ve Ödeme Seçenekleri",
    q: "Üye olmadan sipariş verebilir miyim?",
    a: "Evet! Sitemizde üyelik zorunluluğu yoktur. Yalnızca ad-soyad, telefon, e-posta ve açık adres bilgilerinizi girerek 1 dakikada misafir olarak siparişinizi tamamlayabilirsiniz.",
  },
  {
    category: "Beden Seçimi ve Değişim",
    q: "Bedenimden emin olamazsam nasıl doğru bedeni seçebilirim?",
    a: "Her ürün sayfasında santimetre bazlı gerçek kalıp ölçü tablosu ve 'Bedenimi Bul' hesaplama aracımız yer alır. Boy, kilo ve göğüs/bel/basen ölçülerinizi girerek size en uygun bedeni anında görebilir veya WhatsApp hattımızdan stil danışmanımıza sorabilirsiniz.",
  },
  {
    category: "Beden Seçimi ve Değişim",
    q: "Aldığım ürünün bedeni uymazsa değişim veya iade yapabilir miyim?",
    a: "Elbette. Siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde 'İade ve Değişim Talebi' sayfamızdan ücretsiz kargo kodu alarak beden değişimi veya koşulsuz iade yapabilirsiniz.",
  },
  {
    category: "Kumaş Bakımı ve Yıkama Talimatı",
    q: "Keten, poplin ve triko ürünleri nasıl yıkamalıyım?",
    a: "Doğal lifli keten ve pamuk poplin parçalarımızı 30°C hassas programda, ağartıcı kullanmadan ve düşük devirde yıkamanızı; triko ve merinos karışımlı ürünleri ise formunu koruması için elde soğuk suda yıkayıp sererek kurutmanızı öneririz.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-[var(--color-border-subtle)] pb-6">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
          Yardım Merkezi
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-2 text-sm text-[#6B645C]">
          Kargo süresi, kapıda ödeme, beden değişimi ve yıkama talimatları
          hakkında en çok merak edilen soruların yanıtları.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={idx}
            open={idx < 2}
            className="group rounded-sm border border-[var(--color-border-subtle)] bg-white p-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#B88A5A]">
                  {item.category}
                </span>
                <h2 className="mt-0.5 font-serif text-xl text-[#1F1F1F]">
                  {item.q}
                </h2>
              </div>
              <span className="font-mono text-lg text-[#6B645C] group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 border-t border-[var(--color-border-subtle)] pt-3 text-sm leading-relaxed text-[#4A453F]">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-[var(--color-border-subtle)] bg-[#EFE8DF]/70 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-[#1F1F1F]">
            Başka bir sorunuz mu var?
          </h3>
          <p className="text-xs text-[#6B645C]">
            Ekibimiz hafta içi ve Cumartesi {site.workingHours} saatleri
            arasında yanınızda.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/iletisim"
            className="rounded-sm bg-[#1F1F1F] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
          >
            İletişime Geçin
          </Link>
          <Link
            href="/iade-talebi"
            className="rounded-sm border border-[var(--color-border-subtle)] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F1F1F]"
          >
            İade / Değişim Başlat
          </Link>
        </div>
      </div>
    </div>
  );
}
