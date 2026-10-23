import React from "react";
import Link from "next/link";
import { site } from "@/site.config";

export const metadata = {
  title: `İade ve Değişim Koşulları — ${site.name}`,
};

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            Tüketici Hakları • 6502 Sayılı TKHK
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            İade ve Değişim Koşulları
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. 14 Günlük Koşulsuz Cayma Hakkı
          </h2>
          <p>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
            Sözleşmeler Yönetmeliği uyarınca alıcı; ürünü teslim aldığı tarihten
            itibaren <strong>14 (ondört) gün</strong> içerisinde herhangi bir
            gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma
            hakkına sahiptir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. Ücretsiz İade Gönderim Adımları
          </h2>
          <p>
            Sitemizde yer alan{" "}
            <Link href="/iade-talebi" className="underline text-[#1F1F1F]">
              İade ve Değişim Talebi
            </Link>{" "}
            sayfasından siparişinizi seçerek anında ücretsiz iade kargo kodu
            (ör. <code className="font-mono">IADE-MRA-XXXX</code>)
            oluşturabilirsiniz. Ürünü faturası ve koparılmamış orijinal etiketi
            ile birlikte <strong>{site.shipping.carriers.join(" veya ")}</strong>{" "}
            şubelerine ücretsiz teslim edebilirsiniz.
          </p>
          <p>
            <strong>İade Gönderim Adresi:</strong> {site.legal.sellerTitle} —{" "}
            {site.address}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. Cayma Hakkının Kullanılamayacağı Hijyen İstisnaları
          </h2>
          <p>
            Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca;
            tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu
            unsurları açılmış olan ve iadesi sağlık/hijyen açısından uygun
            olmayan <strong>iç giyim alt parçaları, mayo, bikini ve küpe</strong>{" "}
            ürünlerinde cayma hakkı kullanılamaz. Dış giyim, elbise, gömlek,
            bluz, triko ve pantolon/etek ürünlerimizde ise ürünün kullanılmamış
            ve yıkanmamış olması şartıyla 14 gün koşulsuz iade geçerlidir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            4. Bedel İadesi Süreci
          </h2>
          <p>
            İade edilen ürün atölyemize ulaştıktan sonra kalite kontrol ekibimiz
            tarafından incelenir ve yasal azami 14 günü aşmamak üzere (ortalama
            2-3 iş günü içerisinde) ödeme yaptığınız kredi/banka kartına veya
            belirttiğiniz IBAN hesabına tek seferde iade edilir.
          </p>
        </section>
      </div>
    </div>
  );
}
