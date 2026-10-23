import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { site } from "@/site.config";

export const metadata = {
  title: `Hakkımızda — ${site.name}`,
  description: `${site.name} hikayesi, doğal kumaş seçkimiz ve ${site.city} mağazamız.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Üst Editoryal Başlık */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center border-b border-[var(--color-border-subtle)] pb-14">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#B88A5A]">
            Hikayemiz • {site.city}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.08] text-[#1F1F1F]">
            Doğal dokular, zamansız kalıplar ve özenli butik terziliği.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#4A453F]">
            <strong>{site.name}</strong>, hızlı tüketilen sezonluk trendler yerine
            gardırobunuzda yıllarca yerini koruyacak keten, pamuk poplin,
            modal ve yumuşak triko parçalar üretmek tutkusuyla{" "}
            {site.city} Ziyapaşa Bulvarı&apos;nda doğdu.
          </p>
          <p className="text-sm leading-relaxed text-[#6B645C]">
            Her koleksiyonumuzda kumaşın tenle temasını, gün boyu nefes alan
            doğal lif oranlarını ve farklı vücut tiplerinde kusursuz duran
            kalıpları önceliklendiriyoruz. Mağazamızda askıya çıkan her parça,
            kendi giymekten mutluluk duyacağımız kalite kontrol standartlarından
            geçerek size ulaşıyor.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/koleksiyon"
              className="inline-flex items-center gap-2 rounded-sm bg-[#1F1F1F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333] transition-colors"
            >
              Koleksiyonu İncele
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border-subtle)] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#1F1F1F] hover:border-[#1F1F1F] transition-colors"
            >
              Mağazamızı Ziyaret Edin
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#EFE8DF]">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
              alt={`${site.name} ${site.city} Mağaza ve Atölye Seçkisi`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-2.5 text-xs text-[#6B645C] italic">
            {site.name} {site.city} mağaza seçkisi — doğal keten ve toprak tonları
            koleksiyonu.
          </p>
        </div>
      </div>

      {/* Kalite İlkelerimiz */}
      <div className="py-14">
        <div className="mb-10 max-w-xl">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
            Üretim & Seçki Felsefemiz
          </span>
          <h2 className="mt-1 font-serif text-3xl text-[#1F1F1F]">
            Neden {site.name}?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-7 space-y-3">
            <Sparkles className="h-6 w-6 text-[#B88A5A]" />
            <h3 className="font-serif text-xl text-[#1F1F1F]">
              Nefes Alan Doğal Kumaşlar
            </h3>
            <p className="text-xs leading-relaxed text-[#6B645C]">
              Akdeniz ikliminin sıcaklığından ilham alarak %100 taşlanmış keten,
              organik pamuk vual, tencel ve ince merinos yünü karışımlı
              kumaşları özenle seçiyoruz.
            </p>
          </div>

          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-7 space-y-3">
            <ShieldCheck className="h-6 w-6 text-[#2E6B4E]" />
            <h3 className="font-serif text-xl text-[#1F1F1F]">
              Şeffaf Kalıp ve Beden Rehberi
            </h3>
            <p className="text-xs leading-relaxed text-[#6B645C]">
              Her ürün sayfasında mankenin boy ve ölçü bilgisini, kumaşın
              esneklik/iç gösterme durumunu ve santimetre bazlı gerçek kalıp
              ölçülerini şeffaflıkla paylaşıyoruz.
            </p>
          </div>

          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-7 space-y-3">
            <HeartHandshake className="h-6 w-6 text-[#B88A5A]" />
            <h3 className="font-serif text-xl text-[#1F1F1F]">
              Butik İlgi ve Hızlı Teslimat
            </h3>
            <p className="text-xs leading-relaxed text-[#6B645C]">
              Saat 15:00&apos;e kadar verilen siparişleri aynı gün özenli hediye
              paketinde kargoya teslim ediyor, 14 gün koşulsuz iade ve beden
              değişimi garantisi sunuyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Adana Mağaza Kartı */}
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[#EFE8DF]/70 p-8 sm:p-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88A5A]">
              <MapPin className="h-4 w-4" />
              Fiziksel Mağazamız
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1F]">
              {site.city} Ziyapaşa Mağazamıza Bekleriz
            </h2>
            <p className="text-sm text-[#4A453F]">{site.address}</p>
            <p className="text-xs text-[#6B645C]">
              Çalışma Saatlerimiz: {site.workingHours} • Tel: {site.phone}
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-sm bg-[#1F1F1F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333] transition-colors"
            >
              İletişim & Yol Tarifi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
