# CLAUDE.md — Proje Rehberi ve AI Ajan Kılavuzu

Bu dosya, projede çalışan tüm yapay zeka ajanlarının (Claude Code, Antigravity, Cursor, GitHub Copilot vb.) **Mira Butik (EMY Digital Butik E-Ticaret Satış Demosu)** projesinin mimarisini, kurallarını, tasarım dilini ve özelleştirme noktalarını tek bakışta anlaması için hazırlanmıştır.

---

## 1. Projenin Amacı ve İş Bağlamı

- **Hedef**: Instagram DM üzerinden satış yapan giyim ve moda butiklerine ("Instagram DM'den çıkıp kendi markalı mağazanıza geçin") canlı sunum yapmak için **EMY Digital** adına geliştirilmiş, uçtan uca çalışan Türkçe e-ticaret vitrini ve butik yönetim paneli demosu.
- **Kurgusal Marka**: **Mira Butik** (Adana merkezli kadın giyim & aksesuar butiği).
- **Temel Prensip**: Yeni bir butiğe sunum yapılacağında veya gerçek mağaza kurulacağında, kodun içine dağılmış metinleri aramak yerine **yalnızca `site.config.ts`, `content/products.ts` ve `content/size-chart.ts`** dosyaları düzenlenerek 15 dakikada özelleştirme yapılabilmelidir.

---

## 2. Teknoloji Yığını ve Komutlar

- **Çatı**: Next.js 15 (App Router) + React 19 + TypeScript (Strict Mode)
- **Stil & Tasarım**: Tailwind CSS v4 (`@tailwindcss/postcss`) + CSS Değişkenleri (`app/globals.css`)
- **Animasyon & İkon**: `motion` (`motion/react`) + `lucide-react` (Not: `lucide-react` v1+ içinde marka ikonları kaldırıldığı için Instagram vb. sosyal ikonlar satır içi SVG olarak kullanılır)
- **Paket Yöneticisi**: `npm` (`package-lock.json`)
- **Birim Test**: Node yerleşik test koşucusu (`node --import tsx --test tests/*.test.ts`)

### Temel Komutlar
```bash
npm install          # Bağımlılıkları kurar
npm run dev          # Geliştirme sunucusunu başlatır (http://localhost:3000)
npm test             # Fiyat, kampanya, kupon, kargo ve Türkçe arama birim testlerini çalıştırır
npm run lint         # ESLint kontrolünü çalıştırır (0 hata, 0 uyarı beklenir)
npx tsc --noEmit     # TypeScript tip kontrolünü çalıştırır
npm run build        # Production derlemesini oluşturur
```

---

## 3. Dizin ve Dosya Haritası

```text
├── site.config.ts                  # TEK MERKEZLİ MAĞAZA YAPILANDIRMASI (isim, şehir, WhatsApp, yasal bilgiler, kargo, ödeme, kampanya, demo modu)
├── content/
│   ├── products.ts                 # 6 kategoride 36 ürün, 3:4 görseller, renk×beden stok matrisi, son 30 gün en düşük fiyat, örnek yorumlar
│   └── size-chart.ts               # Kategori bazlı santimetre ölçü tabloları ve "Bedenimi Bul" (recommendSize) algoritması
├── lib/
│   ├── utils.ts                    # normalizeTurkish, formatPrice, isCampaignActive, getProductPricing, buildWhatsAppUrl, formatDateTR
│   ├── pricing.ts                  # calculateCartTotals (ara toplam, kampanya, MIRA10 kuponu, 1500 TL ücretsiz kargo barajı, +30 TL kapıda ödeme)
│   ├── turkey-locations.ts         # Teslimat adresi için Türkiye il/ilçe listesi
│   ├── payment/
│   │   └── index.ts                # Sağlayıcıdan bağımsız ödeme arayüzü (createPayment, confirmPayment) + DemoTestPaymentProvider
│   └── store/
│       ├── types.ts                # Tekil veri katmanı arayüzü (StoreRepository)
│       ├── browser-store.ts        # Demo için localStorage tabanlı uygulama (siparişler, stok düşümü, kampanya/kupon, iade talebi, demo sıfırlama)
│       └── index.ts                # Store singleton ve STORE_UPDATED_EVENT yayını
├── components/
│   ├── providers/shop-provider.tsx # Global sepet, kupon, favoriler, son gezilenler, sepete uçma animasyonu ve canlı store senkronizasyonu
│   ├── ui/product-card.tsx         # 3:4 ürün kartı, blur placeholder, hover/tap 2. fotoğraf, erişilebilir renk noktaları, hızlı beden seçimi
│   ├── layout/                     # Header, CartDrawer, SearchModal, Footer, CookieBanner
│   ├── home/                       # Ana sayfa editoryal ve ürün bölümleri
│   ├── collection/                 # URL senkronize filtreleme ve mobil filtre çekmecesi
│   └── product/                    # Ürün detay galerisi, beden tablosu, "Bedenimi Bul" modalı, "Gelince haber ver" formu
├── app/
│   ├── page.tsx                    # 1. Ana Sayfa (/)
│   ├── koleksiyon/[slug]/page.tsx  # 2. Kategori / Koleksiyon Sayfası (/koleksiyon/elbise vb.)
│   ├── urun/[slug]/page.tsx        # 3. Ürün Detay Sayfası (/urun/[slug])
│   ├── arama/page.tsx              # 4. Türkçe karakter duyarsız arama (/arama)
│   ├── favoriler/page.tsx          # 5. Favoriler (/favoriler)
│   ├── sepet/page.tsx              # 6. Tam Sepet Sayfası (/sepet)
│   ├── odeme/page.tsx              # 7. Üyeliksiz Ödeme, Dinamik Sözleşmeler ve Sipariş Onayı (/odeme)
│   ├── siparis-takip/page.tsx      # 8. Canlı Sipariş Takip (/siparis-takip)
│   ├── iade-talebi/page.tsx        # 9. İade / Değişim Talebi ve Kargo Kodu Üretimi (/iade-talebi)
│   ├── panel/page.tsx              # 10. Butik Sahibi Yönetim Paneli Önizlemesi (/panel)
│   └── (kurumsal & yasal rotalar)  # 11. /hakkimizda, /iletisim, /sss, /kargo-ve-teslimat, /iade-ve-degisim, /mesafeli-satis-sozlesmesi, /on-bilgilendirme-formu, /kvkk, /cerez-politikasi, /gizlilik
└── tests/
    └── pricing.test.ts             # Sepet, kampanya, kupon ve Türkçe arama birim testleri
```

---

## 4. Kesin Tasarım, UX ve Yasal Kurallar (Bozulmaması Gerekenler)

Projede değişiklik yaparken aşağıdaki kuralları **asla ihlal etmeyin**:

1. **Dürüst Fiyat Gösterimi (6502 Sayılı TKHK & Fiyat Etiketi Yönetmeliği)**:
   - Bir üründe üstü çizili eski fiyat **yalnız** `previousPrice30dLowest` (son 30 günün en düşük fiyatı) tanımlıysa, güncel indirimli fiyattan yüksekse ve kampanya süresi (`site.campaign.endsAt`) dolmamışsa gösterilir (`lib/utils.ts` -> `getProductPricing`).
   - Kampanya bitiş tarihi geçtiğinde veya `/panel` üzerinden kampanya kapatıldığında indirimler kendiliğinden kalkar.
2. **Karanlık Desen (Dark Pattern) Yasağı**:
   - Sahte aciliyet sayaçları ("son 2 dakika!"), uydurma canlı izleyici sayıları ("şu an 14 kişi bakıyor") veya sepete önceden işaretli ek hizmet kutuları eklenemez.
   - Stok uyarıları (`Son 2 ürün`, `Tükendi`) yalnızca `variants` içindeki gerçek `stock` değerinden beslenir.
3. **Pazarlama İzni (6563 Sayılı Kanun / İYS)**:
   - Hem ana sayfadaki e-bülten formunda hem de `/odeme` sayfasında ticari elektronik ileti izni onay kutusu **ayrı** olmalı, **varsayılan olarak işaretsiz** gelmeli ve siparişi tamamlamak için **zorunlu olmamalıdır**.
4. **KVKK Çerez Çubuğu (`components/layout/cookie-banner.tsx`)**:
   - **"Reddet"** ve **"Kabul Et"** düğmeleri eşit görsel ağırlıkta ve yan yana yer almalıdır.
5. **Ödeme Güvenliği ve Sözleşmeler (`app/odeme/page.tsx`)**:
   - Demoda **gerçek kart numarası, son kullanma tarihi veya CVV girilen bir input alanı bulunmaz**. Bunun yerine `"Demo: gerçek ödeme alınmaz, kart bilgisi girmeyin"` uyarısı ve `"Test ödemesini tamamla"` / `"Başarısız ödemeyi dene"` düğmeleri yer alır.
   - Müşterinin girdiği ad, adres, telefon, seçilen ürünler ve toplam tutar **Ön Bilgilendirme Formu** ile **Mesafeli Satış Sözleşmesi** metinlerine dinamik olarak yansır.
   - Sipariş tamamlama düğmesinin metni ödeme yükümlülüğünü açıkça belirtir: **"Siparişi onayla ve öde"**.
6. **Örnek Yorumlar ve Demo SEO Kilidi**:
   - Demodaki tüm müşteri yorumları `isSample: true` ve **"Örnek yorum"** rozetiyle gösterilir.
   - `site.config.ts` içinde `demo: true` iken `robots` meta etiketi `noindex, nofollow` döner ve arama motorlarında sahte ticari varlık oluşmaması için JSON-LD (`Organization` / `Product`) çıktısı bastırılmaz.

---

## 5. Canlı Mağazaya ve Cloud'a Geçiş Rehberi

- **Cloudflare Workers (OpenNext) veya Vercel**: Proje standart Next.js 15 App Router yapısındadır; Vercel'e doğrudan veya `@opennextjs/cloudflare` ile Cloudflare Workers'a deploy edilebilir.
- **Veritabanı Geçişi**: `lib/store/types.ts` içindeki `StoreRepository` arayüzünü Cloudflare D1 veya PostgreSQL üzerinde gerçekleyip `lib/store/index.ts` içinde export etmeniz yeterlidir.
- **Ödeme Geçişi**: `lib/payment/index.ts` içindeki `PaymentProvider` arayüzünü iyzico veya PayTR ile gerçekleyip API anahtarlarını yalnızca sunucu ortam değişkenlerinden (`PAYMENT_API_KEY`, `PAYMENT_SECRET_KEY`) okuyun.
