# Mira Butik — EMY Digital Butik E-Ticaret Satış Demosu

Instagram DM üzerinden satış yapan giyim ve moda butiklerine **"Instagram DM'den çıkıp kendi markalı mağazanıza geçin"** vizyonunu canlı olarak göstermek üzere **EMY Digital** için geliştirilmiş, uçtan uca çalışan Türkçe e-ticaret vitrini ve butik yönetim paneli demosu.

---

## 1. Hızlı Kurulum ve Geliştirme Komutları

Projeyi yerel ortamınızda çalıştırmak için Node.js (v20+) ve `npm` yeterlidir. Herhangi bir harici veritabanı veya ücretli API anahtarı gerektirmez:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın (http://localhost:3000)
npm run dev

# 3. Birim testlerini çalıştırın (sepet, kampanya, kupon, ücretsiz kargo ve kapıda ödeme hesaplamaları)
npm test

# 4. Kod kalitesi (ESLint) ve tip kontrolü
npm run lint

# 5. Üretim (Production) derlemesi oluşturun
npm run build
npm run start
```

---

## 2. Yayına Alma (Deployment) Adımları

### Seçenek A: Vercel Üzerinde Yayına Alma (Önerilen Hızlı Kurulum)
1. Projeyi bir GitHub / GitLab deposuna yükleyin.
2. Vercel panelinden **"Add New Project"** diyerek depoyu seçin.
3. Framework Preset olarak **Next.js** otomatik algılanacaktır (`npm run build`).
4. İsteğe bağlı ortam değişkenlerini (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DEMO_PANEL_PIN`) tanımlayıp **Deploy** düğmesine tıklayın.

### Seçenek B: Cloudflare Workers (OpenNext) Üzerinde Yayına Alma
1. OpenNext Cloudflare adaptörünü ekleyin:
   ```bash
   npm install --save-dev @opennextjs/cloudflare wrangler
   ```
2. `wrangler.jsonc` dosyasını oluşturup `nodejs_compat` bayrağını etkinleştirin.
3. Derleme ve yayınlama komutunu çalıştırın:
   ```bash
   npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
   ```

---

## 3. Yeni Bir Butiğe Uyarlama Kontrol Listesi (15 Dakikada Özelleştirme)

Bu proje, yeni bir butik müşterisine sunum yaparken veya satışı tamamlanan bir butiğe canlı mağaza kurarken **kodun içine dağılmış metinleri aramadan** tek merkezden özelleştirilebilecek şekilde tasarlanmıştır:

### Adım 1: `site.config.ts` Dosyasını Güncelleyin
- **`demo`**: Müşteri sunumu / demo sitelerinde `true` bırakın (`noindex, nofollow` aktif olur ve sahte ticari varlık oluşmaması için JSON-LD çıktısı bastırılır). Gerçek müşteri mağazası yayına alınırken `false` yapın.
- **`name`, `tagline`, `city`, `address`, `phone`, `whatsapp`, `email`, `instagram`**: Butiğin iletişim ve sosyal medya bilgilerini girin.
- **`legal`**: 6502 sayılı TKHK ve Elektronik Ticaretin Düzenlenmesi Hakkında Kanun gereği zorunlu olan `sellerTitle`, `mersisNo`, `taxOffice`, `taxNumber`, `kepAddress` ve `etbisNote` alanlarını müşterinin vergi levhasına göre doldurun. Bu bilgiler `/odeme` adımındaki dinamik sözleşmelere ve tüm kurumsal/yasal sayfalara otomatik yansır.
- **`shipping`**: Ücretsiz kargo alt limitini (`freeOver: 1500`), standart kargo ücretini (`fee: 89`), aynı gün kargo saatini (`sameDayCutoff: "15:00"`) ve anlaşmalı kargo şirketlerini (`carriers`) düzenleyin.
- **`payment`**: Kapıda ödeme hizmet bedelini (`cashOnDelivery.fee: 30`) ve Havale/EFT IBAN bilgilerini (`bankTransfer`) güncelleyin.
- **`theme`**: Vurgu rengi (`accentColor`) ve arka plan rengini (`backgroundColor`) butiğin kurumsal kimliğine göre değiştirin.

### Adım 2: Logoyu Değiştirin (`public/brand/logo.svg`)
- Yeni butiğin SVG formatındaki logosunu `public/brand/logo.svg` üzerine kaydedin veya `site.config.ts` içindeki marka adını güncelleyin.

### Adım 3: Ürün Kataloğunu ve Beden Tablosunu Güncelleyin
- **`content/products.ts`**: Her ürün aşağıdaki alanlara sahiptir:
  - `price`: Güncel satış fiyatı (KDV dahil TL).
  - `previousPrice30dLowest`: *(İsteğe bağlı)* 6502 sayılı Kanun ve Fiyat Etiketi Yönetmeliği gereği üstü çizili indirim gösterilebilmesi için **son 30 günün en düşük fiyatı**. Yalnızca `price` değerinden büyükse ve `site.config.ts` içindeki kampanya aktifse üstü çizili olarak gösterilir.
  - `variants`: `{ sku, color, colorHex, size, stock }` yapısında renk ve beden bazlı gerçek stok matrisi. Stoğu `0` olan bedenler "Tükendi" olarak işaretlenir ve "Gelince haber ver" formunu açar; `1–2` olanlarda "Son X ürün" uyarısı gösterilir.
  - `images`: Her renk adı için `3:4` dikey ürün fotoğrafları dizisi (kart üzerinde ikinci görsel önizlemesi ve detay sayfasında yakınlaştırmalı galeri için).
  - `fabric`, `care`, `fitNote`, `modelInfo`: Kumaş içeriği, yıkama talimatı, kalıp notu ve manken ölçüleri.
- **`content/size-chart.ts`**: Kategori bazlı (`elbise`, `gomlek-bluz`, `pantolon-etek`, `triko`, `dis-giyim`, `aksesuar`) santimetre ölçü tablolarını ve **"Bedenimi Bul"** hesaplama kurallarını (`recommendSize`) buradan özelleştirin.

### Adım 4: Canlı Mağazaya Geçiş (Ödeme, Veritabanı ve Yorumlar)
1. **Gerçek Ödeme Sağlayıcısı (iyzico / PayTR) Bağlama (`lib/payment/index.ts`)**:
   - Demoda güvenlik gereği kart numarası, son kullanma tarihi veya CVV alanı bulunmaz; `DemoTestPaymentProvider` çalışır.
   - Canlı mağazada `lib/payment/index.ts` içindeki `PaymentProvider` arayüzünü (`createPayment`, `confirmPayment`) iyzico Checkout Form veya PayTR iFrame API ile bağlayın.
   - API anahtarlarını **asla istemci koduna yazmayın**; sunucu ortam değişkenlerinde tanımlayın:
     ```env
     PAYMENT_PROVIDER="iyzico"
     PAYMENT_API_KEY="iyzico_live_api_key"
     PAYMENT_SECRET_KEY="iyzico_live_secret_key"
     PAYMENT_BASE_URL="https://api.iyzipay.com"
     ```
2. **Gerçek Veritabanına Geçiş (`lib/store/types.ts` & `lib/store/index.ts`)**:
   - Tüm veri okuma/yazma işlemleri `lib/store/types.ts` içindeki tekil `StoreRepository` arayüzünden geçer.
   - Demoda `lib/store/browser-store.ts` (`localStorage`) kullanılır. Canlı mağazada aynı `StoreRepository` arayüzünü Cloudflare D1 (Drizzle ORM) veya PostgreSQL (Prisma/Drizzle) ile uygulayıp `lib/store/index.ts` içinde dışa aktarmanız yeterlidir; sayfa bileşenlerinde hiçbir değişiklik gerekmez.
3. **Müşteri Yorumları Politikası**:
   - Demodaki tüm ürün yorumları haksız ticari uygulama oluşturmaması için açıkça **"Örnek yorum"** rozetiyle işaretlenmiştir.
   - Canlı mağazaya geçerken yorum bileşenini gerçek sipariş doğrulamasına (`order.status === "Teslim edildi"`) bağlayın veya doğrulanmış müşteri yorumu toplanana kadar örnek yorumları devre dışı bırakın.

---

## 4. Görsel Kaynakları ve Lisans Bilgisi

Projede kullanılan tüm moda ve mağaza fotoğrafları **Unsplash Lisansı** kapsamında ücretsiz ticari/demo kullanımına uygun görsellerden seçilmiş ve `next/image` ile optimize edilmiştir. Tüm fotoğrafçı atıfları ve doğrudan kaynak bağlantıları [`public/brand/KAYNAKLAR.md`](public/brand/KAYNAKLAR.md) dosyasında listelenmiştir.

---

## 5. Varsayımlar ve Mimari Kararlar

- **Editoryal Görsel Dil**: Standart soğuk SaaS şablonları yerine sıcak krem (`#F7F3EE`) zemin, taş rengi kartlar (`#EFE8DF`), karamel/kum vurgu (`#B88A5A`), `Cormorant Garamond` başlıklar ve `Plus Jakarta Sans` gövde tipografisi (`latin-ext` Türkçe karakter destekli) kullanılmıştır.
- **Yönetim Paneli Estetiği (`/panel`)**: Mağaza vitrininin sıcak editoryal dilinden ayrışacak şekilde, stok ve sipariş tablolarında yüksek okunabilirlik sağlayan `achromatic-ledger` (`tabular-nums` sayısal hizalama ve ince tablo çizgileri) düzeni tercih edilmiştir.
- **Yasal Uyumluluk**: 6502 sayılı TKHK, Mesafeli Sözleşmeler Yönetmeliği, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun (ayrı ve varsayılan işaretsiz İYS pazarlama izni) ve KVKK Çerez Rehberi (eşit görsel ağırlıklı "Reddet" ve "Kabul Et" düğmeleri) varsayılan olarak uygulanmıştır.
