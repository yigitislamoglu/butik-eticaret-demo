"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Truck,
  RefreshCcw,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { site } from "@/site.config";
import { BLUR_DATA_URL, CATEGORY_INFO, type GarmentCategory } from "@/content/products";
import { useShop } from "@/components/providers/shop-provider";
import { ProductCard } from "@/components/ui/product-card";
import {
  buildWhatsAppUrl,
  formatDateTR,
  formatPrice,
  getProductPricing,
  isCampaignActive,
} from "@/lib/utils";

export function HomeClientSections() {
  const { products, campaign } = useShop();
  const [email, setEmail] = useState("");
  const [iysConsent, setIysConsent] = useState(false); // 6563 sayılı Kanun gereği başlangıçta İŞARETSİZ
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const newArrivals = products.filter((p) => p.tags.includes("yeni")).slice(0, 8);
  const bestSellers = products
    .filter((p) => p.tags.includes("cok-satan"))
    .slice(0, 8);
  const instagramFeatured = products
    .filter((p) => Boolean(p.instagramHandleCaption))
    .slice(0, 4);

  const campaignActive = isCampaignActive(campaign);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);

    if (!email.trim() || !email.includes("@")) {
      setNewsletterError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    if (!iysConsent) {
      setNewsletterError(
        "Bülten aboneliği için ticari elektronik ileti onay kutusunu işaretlemeniz gerekmektedir."
      );
      return;
    }

    setNewsletterSuccess(true);
    setEmail("");
    setIysConsent(false);
  };

  const categoryOrder: GarmentCategory[] = [
    "elbise",
    "gomlek-bluz",
    "pantolon-etek",
    "triko",
    "dis-giyim",
    "aksesuar",
  ];

  return (
    <div className="space-y-20 pb-20 lg:space-y-28 lg:pb-28">
      {/* 1. YENİ GELENLER */}
      <section
        aria-labelledby="heading-yeni-gelenler"
        className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-[#E2D9CC] pb-6 sm:flex-row sm:items-end">
          <div>
            <h2
              id="heading-yeni-gelenler"
              className="font-heading text-3xl font-normal text-[#1F1F1F] sm:text-4xl lg:text-5xl"
            >
              Yeni Gelenler
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#5C564F]">
              Bu hafta atölyeden çıkan doğal keten, poplin ve merinos yünü seçkimiz.
            </p>
          </div>
          <Link
            href="/koleksiyon/tumu?siralama=yeni"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F] underline decoration-[#B88A5A] underline-offset-8 hover:text-[#B88A5A]"
          >
            <span>Tüm yeni gelenleri incele</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {newArrivals.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      </section>

      {/* 2. KATEGORİ VİTRİNİ (Editoryal Asimetrik Izgara) */}
      <section
        aria-labelledby="heading-kategoriler"
        className="bg-[#EFE9E0] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2
                id="heading-kategoriler"
                className="font-heading text-3xl font-normal text-[#1F1F1F] sm:text-4xl lg:text-5xl"
              >
                Kategori Vitrini
              </h2>
              <p className="mt-2 max-w-lg text-sm text-[#5C564F]">
                Tek parçada zahmetsiz elbiselerden, birbiriyle kolayca eşleşen kapsül alt-üst takımlara.
              </p>
            </div>
            <Link
              href="/koleksiyon/tumu"
              className="text-sm font-medium text-[#1F1F1F] underline underline-offset-8"
            >
              36 ürünün tümünü gör
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {categoryOrder.map((catSlug, idx) => {
              const info = CATEGORY_INFO[catSlug];
              const count = products.filter((p) => p.category === catSlug).length;
              // Editoryal asimetrik sütun dağılımı (uneven-photographs yönüne uygun)
              const colSpanClass =
                idx === 0
                  ? "lg:col-span-5"
                  : idx === 1
                    ? "lg:col-span-4 lg:mt-8"
                    : idx === 2
                      ? "lg:col-span-3"
                      : idx === 3
                        ? "lg:col-span-4"
                        : idx === 4
                          ? "lg:col-span-5 lg:-mt-4"
                          : "lg:col-span-3";

              return (
                <Link
                  key={catSlug}
                  href={`/koleksiyon/${catSlug}`}
                  className={`group flex flex-col bg-[#FAF8F5] p-3 transition-colors hover:bg-white ${colSpanClass}`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E2D9CC]">
                    <Image
                      src={info.heroImage}
                      alt={info.name}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between pt-1">
                    <h3 className="font-heading text-2xl font-medium text-[#1F1F1F] group-hover:underline">
                      {info.name}
                    </h3>
                    <span className="tabular-nums text-xs text-[#5C564F]">
                      {count} Parça
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[#5C564F]">
                    {info.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INSTAGRAM'DA GÖRDÜĞÜNÜZ ÜRÜNLER */}
      <section
        aria-labelledby="heading-instagram"
        className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-[#E2D9CC] pb-6 md:flex-row md:items-end">
          <div>
            <h2
              id="heading-instagram"
              className="font-heading text-3xl font-normal text-[#1F1F1F] sm:text-4xl lg:text-5xl"
            >
              Instagram&apos;da Gördüğünüz Ürünler
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#5C564F]">
              DM&apos;den yanıt beklemeden, gönderilerimizde gördüğünüz parçaların güncel beden stoklarını ve fiyatlarını doğrudan inceleyip sipariş verebilirsiniz.
            </p>
          </div>
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F] hover:text-[#B88A5A]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>{site.contact.instagramHandle}</span>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instagramFeatured.map((product) => {
            const pricing = getProductPricing(product, campaign);
            const post = product.instagramHandleCaption!;
            const availableSizes = product.variants
              .filter((v) => v.color === product.colors[0]?.name && v.stock > 0)
              .map((v) => v.size);

            return (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="group flex flex-col border border-[#E2D9CC] bg-[#FAF8F5] transition-colors hover:border-[#1F1F1F]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9E0]">
                  <Image
                    src={post.postImage}
                    alt={`${product.name} Instagram paylaşımı`}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/95 px-2.5 py-1 text-[11px] font-medium text-[#1F1F1F]">
                    {post.dateLabel}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-xs leading-relaxed text-[#5C564F]">
                      &ldquo;{post.caption}&rdquo;
                    </p>
                    <h3 className="mt-2.5 text-sm font-medium text-[#1F1F1F] group-hover:underline">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E2D9CC] pt-3">
                    <div className="tabular-nums">
                      <span className="text-sm font-medium text-[#1F1F1F]">
                        {formatPrice(pricing.finalPrice)}
                      </span>
                      {pricing.strikethroughPrice && (
                        <span className="ml-1.5 text-xs text-[#5C564F] line-through">
                          {formatPrice(pricing.strikethroughPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#5C564F]">
                      Stok: {availableSizes.join(", ") || "Tükendi"} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. KAMPANYA ŞERİDİ (Aktif ve süresi geçmemişse gösterilir) */}
      {campaignActive && (
        <section
          aria-labelledby="heading-kampanya"
          className="bg-[#1F1F1F] py-14 text-[#F7F3EE] lg:py-20"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2
                id="heading-kampanya"
                className="font-heading text-3xl font-normal text-[#F7F3EE] sm:text-4xl lg:text-5xl"
              >
                {campaign.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#E2D9CC]">
                Kampanya dahilindeki seçili keten elbise, gömlek ve dış giyim ürünlerinde indirim sepette otomatik uygulanır. Ek olarak ilk siparişinize özel{" "}
                <strong className="text-white">MIRA10</strong> koduyla %10 tanışma indiriminden yararlanabilirsiniz.
              </p>
              <p className="mt-2 text-xs text-[#B88A5A]">
                Kampanya son geçerlilik tarihi: {formatDateTR(campaign.endsAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/koleksiyon/tumu?kampanya=1"
                className="inline-flex min-h-[48px] items-center gap-2 bg-[#B88A5A] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a37648]"
              >
                <span>Kampanyalı Ürünleri Gör</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. ÇOK SATANLAR */}
      <section
        aria-labelledby="heading-cok-satanlar"
        className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-[#E2D9CC] pb-6 sm:flex-row sm:items-end">
          <div>
            <h2
              id="heading-cok-satanlar"
              className="font-heading text-3xl font-normal text-[#1F1F1F] sm:text-4xl lg:text-5xl"
            >
              Çok Satanlar
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#5C564F]">
              Müşterilerimizin kalıbını ve kumaş dokusunu en çok sevdiği, tekrar stoğa giren klasikler.
            </p>
          </div>
          <Link
            href="/koleksiyon/tumu?siralama=cok-satan"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F] underline decoration-[#B88A5A] underline-offset-8 hover:text-[#B88A5A]"
          >
            <span>Tüm çok satanları gör</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. GÜVEN ŞERİDİ */}
      <section
        aria-labelledby="heading-guven-seridi"
        className="border-y border-[#E2D9CC] bg-[#FAF8F5] py-12 lg:py-16"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 id="heading-guven-seridi" className="sr-only">
            Mağaza Güvenceleri ve Hizmet Standartları
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <Truck className="mt-0.5 h-6 w-6 shrink-0 text-[#B88A5A]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="text-base font-medium text-[#1F1F1F]">
                  Hızlı ve Özenli Gönderim
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#5C564F]">
                  Siparişleriniz {site.shipping.dispatchDays} içinde {site.shipping.carrier} ile kargoya teslim edilir. {formatPrice(site.shipping.freeOver)} üzeri ücretsiz kargo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <RefreshCcw className="mt-0.5 h-6 w-6 shrink-0 text-[#B88A5A]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="text-base font-medium text-[#1F1F1F]">
                  {site.returns.days} Gün Koşulsuz İade
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#5C564F]">
                  6502 sayılı Kanun kapsamında teslimattan itibaren {site.returns.days} gün içinde online iade kodu alarak kolayca iade edebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#B88A5A]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="text-base font-medium text-[#1F1F1F]">
                  Şeffaf ve Güvenli Ödeme
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#5C564F]">
                  Kredi/banka kartı, havale/EFT veya kapıda ödeme (+{formatPrice(site.payment.cashOnDelivery.fee)}) seçenekleriyle sürpriz masraf olmadan alışveriş.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#B88A5A]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="text-base font-medium text-[#1F1F1F]">
                  WhatsApp Beden & Stil Desteği
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#5C564F]">
                  Kalıp veya ölçü konusunda kararsız kaldığınızda atölye ekibimize{" "}
                  <a
                    href={buildWhatsAppUrl(
                      site.contact.whatsapp,
                      `Merhaba ${site.name}, beden seçimi konusunda danışmak istiyorum.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1F1F1F] underline"
                  >
                    WhatsApp&apos;tan
                  </a>{" "}
                  doğrudan ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BÜLTEN (6563 Sayılı Kanun / İYS Uyumlu — Onay Kutusu Ayrı ve İşaretsiz) */}
      <section
        aria-labelledby="heading-bulten"
        className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 bg-[#EFE9E0] p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:p-14">
          <div className="lg:col-span-6">
            <h2
              id="heading-bulten"
              className="font-heading text-3xl font-normal text-[#1F1F1F] sm:text-4xl"
            >
              Yeni Koleksiyon ve Özel Seçkilerden Haberdar Olun
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#5C564F]">
              Sınırlı sayıda üretilen keten serilerimiz ve sezon açılışı davetlerimiz için bültenimize katılın. İstediğiniz an tek tıklamayla ayrılabilirsiniz.
            </p>
          </div>

          <div className="lg:col-span-6">
            {newsletterSuccess ? (
              <div
                role="status"
                className="flex items-start gap-3 border border-[#596348] bg-[#FAF8F5] p-5 text-[#1F1F1F]"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#596348]" />
                <div className="text-sm">
                  <p className="font-medium">Bülten kaydınız alındı.</p>
                  <p className="mt-1 text-xs text-[#5C564F]">
                    Ticari elektronik ileti izniniz kaydedilmiştir. Teşekkür ederiz.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-3">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      E-posta adresiniz
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@eposta.com"
                      aria-describedby={newsletterError ? "newsletter-error" : undefined}
                      className="min-h-[48px] w-full border border-[#1F1F1F]/30 bg-[#FAF8F5] px-4 text-sm text-[#1F1F1F] placeholder:text-[#5C564F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[48px] bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
                  >
                    Abone Ol
                  </button>
                </div>

                {/* İşaretsiz Ayrı Ticari İleti İzni Kutusu */}
                <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#5C564F]">
                  <input
                    type="checkbox"
                    checked={iysConsent}
                    onChange={(e) => setIysConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#1F1F1F]"
                  />
                  <span>
                    6563 sayılı Kanun kapsamında {site.name} ({site.seller.legalName}) tarafından
                    yeni sezon ve kampanya bilgilendirmeleri için tarafıma ticari elektronik ileti (e-posta)
                    gönderilmesini kabul ediyorum.{" "}
                    <Link href="/kvkk" className="text-[#1F1F1F] underline">
                      KVKK Aydınlatma Metni
                    </Link>
                    &apos;ni okudum.
                  </span>
                </label>

                {newsletterError && (
                  <p
                    id="newsletter-error"
                    role="alert"
                    className="text-xs font-medium text-[#9E3B32]"
                  >
                    {newsletterError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
