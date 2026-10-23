import React from "react";
import { site } from "@/site.config";

export const metadata = {
  title: `KVKK Aydınlatma Metni — ${site.name}`,
};

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            KVKK Aydınlatma Metni
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. Veri Sorumlusunun Kimliği
          </h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
            uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
            <strong>{site.legal.sellerTitle}</strong> ({site.address} — MERSİS:{" "}
            {site.legal.mersisNo}) tarafından aşağıda açıklanan kapsamda
            işlenmektedir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. İşlenen Kişisel Veriler ve İşleme Amaçları
          </h2>
          <p>
            Üyeliksiz veya üyelikli alışveriş süreçlerinde paylaştığınız kimlik
            (ad-soyad), iletişim (telefon, e-posta, teslimat adresi) ve müşteri
            işlem (sipariş içeriği, fatura bilgisi) verileriniz;
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Mesafeli satış sözleşmesinin kurulması ve ifası (KVKK m.5/2-c),
            </li>
            <li>
              E-Arşiv fatura düzenlenmesi ve vergi mevzuatı yükümlülüklerinin
              yerine getirilmesi (KVKK m.5/2-ç),
            </li>
            <li>
              Siparişin kargo firması aracılığıyla adresinize teslim edilmesi ve
              kargo takip bilgilendirmelerinin yapılması,
            </li>
            <li>
              Açık rızanızın bulunması halinde (6563 sayılı Kanun ve İYS
              kapsamında) kampanya/duyuru iletilerinin gönderilmesi
            </li>
          </ul>
          <p>amaçlarıyla sınırlı ve ölçülü olarak işlenmektedir.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. Kişisel Verilerin Aktarılması
          </h2>
          <p>
            Kişisel verileriniz yalnızca siparişin teslimatı amacıyla anlaşmalı
            kargo şirketlerine ({site.shipping.carriers.join(", ")}), güvenli
            ödeme tahsilatı için BDDK lisanslı ödeme kuruluşlarına ve yasal
            yükümlülükler kapsamında yetkili kamu kurumlarına aktarılır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            4. KVKK Madde 11 Kapsamındaki Haklarınız
          </h2>
          <p>
            KVKK&apos;nın 11. maddesi uyarınca kişisel verilerinizin işlenip
            işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme
            haklarınızı <strong>{site.email}</strong> veya{" "}
            <strong>{site.legal.kepAddress}</strong> adresine yazılı olarak
            iletebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
