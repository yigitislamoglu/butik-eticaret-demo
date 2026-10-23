import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/site.config";
import { BLUR_DATA_URL } from "@/content/products";
import { HomeClientSections } from "@/components/home/home-client-sections";

export default function HomePage() {
  const headlineWordsLine1 = ["Doğal", "dokular,"];
  const headlineWordsLine2 = ["zahmetsiz", "şehir", "şıklığı."];

  return (
    <div>
      {/* EDİTORYAL AÇILIŞ (Uneven Photographs & Kelime Maskesi) */}
      <section className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 sm:px-6 lg:px-8 lg:pt-10 lg:pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* Sol Sütun: Başlık (Kelime Maskesiyle Açılır), Açıklama ve Eylem */}
          <div className="lg:col-span-5">
            <h1 className="font-heading text-4xl leading-[0.98] font-normal tracking-tight text-[#1F1F1F] sm:text-6xl xl:text-[68px]">
              <span className="block">
                {headlineWordsLine1.map((word, idx) => (
                  <span key={word} className="word-mask mr-[0.22em]">
                    <span
                      className="word-mask-inner"
                      style={{ animationDelay: `${idx * 90 + 60}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
              <span className="block">
                {headlineWordsLine2.map((word, idx) => (
                  <span key={word} className="word-mask mr-[0.22em]">
                    <span
                      className="word-mask-inner"
                      style={{ animationDelay: `${(idx + 2) * 90 + 60}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[#5C564F] sm:text-lg">
              {site.tagline}. Avrupa ham keteni, organik poplin ve ince merinos
              karışımlarıyla küçük partiler hâlinde üretilen yeni sezon koleksiyonumuz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/koleksiyon/tumu"
                className="inline-flex min-h-[48px] items-center gap-2 bg-[#1F1F1F] px-7 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
              >
                <span>Koleksiyonu Keşfet</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/koleksiyon/elbise"
                className="inline-flex min-h-[48px] items-center border border-[#1F1F1F] bg-transparent px-6 text-sm font-medium text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
              >
                Elbise Seçkisi
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[#E2D9CC] pt-6 text-xs text-[#5C564F]">
              <div>
                <dt className="font-medium text-[#1F1F1F]">Kargo Süresi</dt>
                <dd className="mt-0.5">{site.shipping.dispatchDays}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#1F1F1F]">Ücretsiz Kargo</dt>
                <dd className="mt-0.5 tabular-nums">{site.shipping.freeOver} TL üzeri</dd>
              </div>
              <div>
                <dt className="font-medium text-[#1F1F1F]">Kolay İade</dt>
                <dd className="mt-0.5">{site.returns.days} gün cayma hakkı</dd>
              </div>
            </dl>
          </div>

          {/* Sağ Sütun: Editoryal Asimetrik Görsel Kompozisyonu (3:4 Oranlı) */}
          <div className="grid grid-cols-12 gap-4 lg:col-span-7">
            <div className="col-span-7 sm:col-span-7">
              <Link
                href="/urun/alara-kusakli-ham-keten-midi-elbise"
                className="shutter-reveal group block overflow-hidden bg-[#EFE9E0]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85"
                    alt="Alara Kuşaklı Ham Keten Midi Elbise — Kum Beji"
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 1024px) 58vw, 40vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1F1F1F]">
                  <span className="font-medium group-hover:underline">
                    Alara Keten Midi Elbise
                  </span>
                  <span className="tabular-nums text-[#5C564F]">1.960 TL</span>
                </div>
              </Link>
            </div>

            <div className="col-span-5 flex flex-col justify-between pt-8 sm:pt-14">
              <Link
                href="/urun/pera-kruvaze-kusakli-uzun-trenckot"
                className="group block overflow-hidden bg-[#EFE9E0]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
                    alt="Pera Kruvaze Kuşaklı Uzun Trençkot — Taş Beji"
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="bg-[#FAF8F5] px-3 py-2 text-xs text-[#1F1F1F]">
                  <span className="block truncate font-medium group-hover:underline">
                    Pera Uzun Trençkot
                  </span>
                  <span className="tabular-nums text-[#5C564F]">2.920 TL</span>
                </div>
              </Link>

              <div className="mt-4 hidden border-l-2 border-[#B88A5A] pl-3.5 text-xs leading-relaxed text-[#5C564F] sm:block">
                <p className="font-medium text-[#1F1F1F]">Editoryal Not</p>
                <p className="mt-0.5">
                  Tüm kalıplarımız gerçek beden ölçüleriyle test edilmiş, &ldquo;Bedenimi Bul&rdquo; aracıyla desteklenmiştir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstemci Etkileşimli Ana Sayfa Bölümleri */}
      <HomeClientSections />
    </div>
  );
}
