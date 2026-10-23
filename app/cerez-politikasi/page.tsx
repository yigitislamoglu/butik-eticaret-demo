import React from "react";
import { site } from "@/site.config";

export const metadata = {
  title: `Çerez (Cookie) Politikası — ${site.name}`,
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#4A453F]">
        <div className="border-b border-[var(--color-border-subtle)] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
            KVKK & Çerez Uygulamaları Rehberi
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Çerez (Cookie) Politikası
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            1. Çerez Nedir ve Nasıl Kullanıyoruz?
          </h2>
          <p>
            <strong>{site.legal.sellerTitle}</strong> ({site.name}) olarak,
            alışveriş sepetinizin korunması, favori ürünlerinizin hatırlanması
            ve çerez tercihlerinizin saklanması amacıyla tarayıcı depolama
            alanlarını (çerezler ve <code>localStorage</code>) kullanmaktayız.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            2. Kullandığımız Çerez Kategorileri
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Zorunlu (Temel) Çerezler:</strong> Sepete eklediğiniz
              ürünlerin, uyguladığınız indirim kuponunun ve gizlilik
              tercihlerinizin sayfa geçişlerinde kaybolmaması için teknik olarak
              zorunludur. Açık rıza şartına tabi değildir.
            </li>
            <li>
              <strong>Analitik ve Performans Çerezleri (İsteğe Bağlı):</strong>{" "}
              Yalnızca çerez bilgilendirme çubuğunda{" "}
              <strong>&ldquo;Kabul Et&rdquo;</strong> seçeneğini
              onayladığınızda etkinleşir;{" "}
              <strong>&ldquo;Reddet&rdquo;</strong> seçeneğini tercih etmeniz
              halinde hiçbir analitik veya pazarlama çerezi çalıştırılmaz.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            3. Çerez Tercihlerini Yönetme
          </h2>
          <p>
            Ziyaretçilerimiz siteye ilk girişte eşit görsel ağırlıkta sunulan{" "}
            <strong>&ldquo;Reddet&rdquo;</strong> ve{" "}
            <strong>&ldquo;Kabul Et&rdquo;</strong> düğmeleriyle tercihlerini
            belirleyebilir ve diledikleri zaman tarayıcı ayarlarından çerez
            kayıtlarını sıfırlayabilirler.
          </p>
        </section>
      </div>
    </div>
  );
}
