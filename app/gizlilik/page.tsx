import React from "react";
import { site } from "@/site.config";

export const metadata = {
  title: `Gizlilik ve Güvenlik Politikası — ${site.name}`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            Veri Güvenliği İlkeleri
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Gizlilik ve Güvenlik Politikası
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. Ödeme ve Kredi Kartı Güvenliği
          </h2>
          <p>
            <strong>{site.name}</strong> ({site.legal.sellerTitle}) üzerinden
            gerçekleştirilen ödemelerde 256-bit SSL şifreleme ve BDDK lisanslı
            ödeme kuruluşlarının ({site.payment.creditCardProviders.join(" / ")})
            3D Secure altyapısı kullanılır. Kredi kartı numaranız veya CVV
            bilginiz hiçbir koşulda mağaza sunucularımızda saklanmaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. Ticari Elektronik İleti ve İYS Uyumu (6563 Sayılı Kanun)
          </h2>
          <p>
            Sipariş tamamlama adımında pazarlama ve kampanya duyuru izni,
            mesafeli satış sözleşmesi onayından tamamen ayrı ve varsayılan
            olarak işaretsiz sunulur. Yalnızca kendi isteğiyle onay veren
            müşterilerimize İYS (İleti Yönetim Sistemi) kurallarına uygun
            olarak bilgilendirme gönderilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. İletişim
          </h2>
          <p>
            Gizlilik politikamızla ilgili her türlü sorunuz için{" "}
            <strong>{site.email}</strong> adresinden veya{" "}
            <strong>{site.phone}</strong> numaralı müşteri destek hattımızdan
            bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
