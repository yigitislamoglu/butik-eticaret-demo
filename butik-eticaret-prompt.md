# Butik giyim e-ticaret demosu — yeni proje için prompt

Yeni, boş bir klasörde Claude Code'u aç ve aşağıdaki çizginin altındaki her şeyi tek mesaj olarak yapıştır.

---

Bir web ajansı (EMY Digital) için **satış demosu** olarak kullanılacak, gerçek bir mağazanınki gibi görünen bir **butik giyim e-ticaret sitesi** yapacağız. Hedef müşteri: satışlarının çoğunu Instagram DM'den yapan butikler ("Fiyat?", "M beden var mı?", "IBAN atar mısınız?"). Bu demoyu butik sahiplerine telefondan gösterip "sizin mağazanız böyle olur" diyeceğim; kısa sürede başka bir butiğin adına, logosuna, rengine, ürünlerine ve numarasına çevirebilmeliyim. Türkçe arayüz, mobil öncelikli, çok hızlı, akıcı (smooth) ve özenli hareket tasarımı istiyorum.

## 0. Önce yetenekleri (skills) kur, sonra başla

**Bu adımı atlama.** Kod yazmadan önce bu yetenekleri projeye kur ve her birinin SKILL.md dosyasını baştan sona oku. Tasarım, hareket, erişilebilirlik ve performans kararlarında bunlara uy; teslimde hangi kararda hangisini kullandığını yaz:

```bash
npx skills add anthropics/skills --skill frontend-design
npx skills add leonxlnx/taste-skill --skill design-taste-frontend
npx skills add leonxlnx/taste-skill --skill high-end-visual-design
npx skills add devmartinese/awwwards-animations-skill
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
npx skills add vercel-labs/agent-skills --skill react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

Bir komut bu biçimde çalışmazsa `npx skills add <depo>` ile ekleyip listeden seç. Kurulumdan sonra `skills-lock.json` dosyasının oluştuğunu ve yedi yeteneğin de yüklendiğini doğrula. İş bitince `web-design-guidelines` ile arayüzünü denetle, `react-best-practices` ile performans kontrolü yap ve bulduklarını düzelt.

Next.js sürümün eğitim verinden yeni olabilir: kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehberi oku ve kullanımdan kaldırılan API'lere dikkat et.

## 1. Teknik çerçeve

- **Next.js (App Router, en güncel kararlı sürüm) + React + TypeScript + Tailwind CSS v4.**
- **Hareket:** `motion` (`motion/react`). Basit girişler için önce CSS ve `IntersectionObserver`, gerektiğinde Motion. Lenis kullanacaksan yalnız masaüstünde.
- **Sunucu bileşenleri varsayılan.** İstemci bileşeni yalnız etkileşim gereken yerde (sepet, filtre, varyant seçimi, ödeme adımları, panel).
- **Veri katmanı:** Ürünler ve stok `content/products.ts` dosyasından (tipli) gelsin; siparişler için `lib/store/` altında tek bir arayüz olsun. Demoda bu arayüzün **tarayıcıda çalışan** bir uygulaması kullanılsın (siparişler ve panel değişiklikleri `localStorage`'da, "Demoyu sıfırla" düğmesiyle temizlenir). Gerçek mağazaya geçerken aynı arayüzün veritabanı uygulaması (ör. Cloudflare D1 ya da Postgres) yazılabilsin; README'de nasıl yapılacağını anlat.
- **Ödeme:** `lib/payment/` altında sağlayıcıdan bağımsız bir arayüz (`createPayment`, `confirmPayment`). Demoda **yalnız "test modu" uygulaması** çalışsın: gerçek kart bilgisi istemez, hiçbir sağlayıcıya istek atmaz; ödeme adımında "Demo: gerçek ödeme alınmaz" uyarısı ve başarılı/başarısız ödeme senaryoları. iyzico ya da PayTR entegrasyonu için arayüz hazır olsun, anahtarlar yalnız ortam değişkeninden okunsun ve demoda tanımlı olmasın.
- **Yayın:** Cloudflare Workers (OpenNext) ya da Vercel; ikisinde de çalışacak şekilde kur. Gizli bilgi kodda olmasın.
- **Paket yöneticisi:** npm. Gereksiz bağımlılık ekleme; her paket için neden gerektiğini yaz.

## 2. Her şey yapılandırmadan değişsin

### `site.config.ts` — mağaza bilgileri

```ts
export const site = {
  name: "Mira Butik",                    // kurgusal demo adı
  tagline: "Gündelik şıklık, Adana'dan kapınıza",
  logo: { src: "/brand/logo.svg", alt: "Mira Butik" },
  colors: { primary: "#1F1F1F", accent: "#B88A5A", cream: "#F7F3EE", sale: "#9E3B32" }, // CSS değişkenlerine aktarılır
  fonts: { heading: "...", body: "..." },
  contact: {
    whatsapp: "905000000000",
    phone: "+90 500 000 00 00",
    email: "destek@ornek.com",
    instagram: "https://instagram.com/...",
    address: "Örnek Mah. Örnek Cad. No: 1, Seyhan / Adana",
  },
  seller: {                              // yasal satıcı bilgileri (demoda örnek)
    legalName: "Örnek Tekstil Ltd. Şti.",
    taxOffice: "Seyhan", taxNumber: "0000000000",
    mersis: "0000000000000000",
    etbis: "ETBİS kayıt no: örnek",
    kep: "ornek@hs01.kep.tr",
  },
  shipping: { freeOver: 1500, fee: 89, carrier: "Örnek Kargo", dispatchDays: "1–2 iş günü" },
  payment: { card: true, cashOnDelivery: { enabled: true, fee: 30 }, transfer: true, whatsappOrder: true },
  returns: { days: 14 },
  campaign: { active: true, label: "Sezon açılışı: seçili ürünlerde %20", endsAt: "2026-12-31T23:59:59+03:00" },
  demo: true,                            // true iken "Demo" rozeti, test ödeme ve noindex
};
```

### `content/products.ts` — ürünler

Her ürün: `id`, `slug`, `name`, `description`, `material` (kumaş içeriği), `care` (yıkama talimatı), `fit` (kalıp: dar/normal/oversize), `modelInfo` ("Model 1,72 m, S beden giyiyor"), `category`, `collection`, `price`, `campaignPercent` (isteğe bağlı), `previousPrice30dLowest` (yalnız gerçekten bilinen son 30 günün en düşük fiyatı; yoksa boş), `images` (renk başına), `variants` (renk × beden, her birinin `sku` ve `stock` değeri), `tags` (yeni, çok satan, sürdürülebilir), `related`. Kategoriler: elbise, gömlek & bluz, pantolon & etek, triko, dış giyim, aksesuar. Demoda en az 36 ürün olsun; gerçekçi isim, açıklama ve fiyatlar (kurgusal).

`content/size-chart.ts`: kategori bazlı beden tablosu (göğüs, bel, basen, boy; cm).

README'ye "Yeni butiğe uyarlama" başlığıyla adım adım kontrol listesi yaz: logo, renkler, `site.config.ts`, ürünler ve görseller, beden tablosu, yasal sayfalardaki satıcı bilgileri, ödeme sağlayıcısı, yayın.

## 3. Sayfalar

1. **Ana sayfa:** Editoryal bir açılış (büyük kampanya görseli ya da sessiz kısa video; metin kelime maskesiyle açılır), yeni gelenler, kategori vitrini, "Instagram'da gördüğünüz ürün" bölümü (gönderi görseli → ürün sayfası), çok satanlar, kampanya şeridi, güven şeridi (kargo süresi, 14 gün iade, güvenli ödeme, WhatsApp destek), bülten (ticari ileti izni ayrı ve işaretsiz onay kutusuyla).
2. **Kategori / koleksiyon:** Izgara, sıralama (yeni, fiyat artan/azalan, çok satan), filtreler (beden, renk, fiyat aralığı, kalıp, kampanyalı); filtreler URL'de tutulsun ve paylaşılabilsin. Mobilde filtreler alttan açılan panelde. Kartta ikinci görsel üzerine gelince/dokununca, renk noktaları, hızlı "Sepete ekle" (beden seçimi açılır).
3. **Ürün sayfası:** Kaydırmalı/yakınlaştırmalı galeri (dokunmatikte sıkıştırarak yakınlaştırma), renk ve beden seçimi (stokta olmayan beden çizili ve "Gelince haber ver"), beden tablosu ve "Bedenimi bul" küçük aracı (boy/kilo/kalıp tercihine göre öneri, "öneridir" notuyla), kumaş, bakım, model bilgisi, kargo ve iade özeti, "WhatsApp'tan sor" (ürün adı, renk, beden hazır mesajla), benzer ürünler, son bakılanlar.
4. **Arama:** Türkçe karakter duyarsız ("gomlek" → "Gömlek"), anlık öneriler.
5. **Favoriler** (giriş gerektirmeden, tarayıcıda).
6. **Sepet:** Yan panel + ayrı sayfa; adet, varyant değiştirme, ücretsiz kargoya kalan tutar çubuğu, indirim kodu alanı (demo kodu: `MIRA10`), ara toplam, kargo, toplam.
7. **Ödeme (checkout):** Misafir olarak ödeme; adımlar: İletişim → Teslimat adresi (il/ilçe seçimi) → Kargo → Ödeme (kart [test modu] / kapıda ödeme / havale-EFT / WhatsApp'tan sipariş) → Onay. Ödemeden önce **Ön Bilgilendirme Formu** ve **Mesafeli Satış Sözleşmesi** sipariş bilgileriyle doldurulmuş hâlde gösterilsin ve okunduğu onaylansın; "Sipariş ver" düğmesi "ödeme yükümlülüğü" doğuran ifadeyle yazılsın ("Siparişi onayla ve öde").
8. **Sipariş onayı ve takibi:** Sipariş numarası, özet, durum çizelgesi (Alındı → Hazırlanıyor → Kargoda → Teslim edildi); `/siparis-takip` sayfasında sipariş no + telefonla sorgulama (demoda yerel siparişler).
9. **İade talebi:** Sipariş seç → ürün ve sebep → iade kodu; 14 günlük cayma hakkı açıklaması.
10. **Yönetim paneli (`/panel`):** Demo girişi (ortam değişkeninden okunan demo şifresi; yoksa salt okunur demo modu). Bölümler: siparişler (durum değiştirme), ürünler ve stok (varyant bazında düzenleme, stok sıfırlanınca sitede "Tükendi"), kampanya aç/kapat, indirim kodları, basit satış özeti (bugün/bu hafta, en çok satanlar). Gerçekçi ama sade; mobilde de kullanılabilir.
11. **Kurumsal ve yasal sayfalar:** Hakkımızda, İletişim, SSS, Kargo ve teslimat, İade ve değişim, Mesafeli satış sözleşmesi, Ön bilgilendirme formu, KVKK aydınlatma metni, Çerez politikası, Gizlilik.
12. **404** ve boş durumlar (boş sepet, sonuç bulunamadı) özenli.

## 4. Tasarım yönü

- **His:** Moda dergisi sayfası gibi editoryal; büyük görseller, bol boşluk, ince tipografi, sakin bir palet (krem, siyah, kum/karamel vurgu). Ürün görselleri kahraman; arayüz geri planda. Yapay zekâ üretimi gibi duran hazır şablon görüntüsünden kaçın (her yerde aynı rozet/hap etiketler, rastgele parlak degradeler, gereksiz emoji).
- **Yazı:** Başlıklarda zarif bir serif ya da yüksek kontrastlı display font, gövdede okunaklı bir grotesk. Türkçe karakterleri (ç ğ ı İ ö ş ü) eksiksiz destekleyen fontlar seç ve her birini "Ğğ Şş İı Çç Öö Üü" ile görsel olarak test et.
- **Görseller:** Lisanslı ücretsiz stok moda fotoğrafları (Unsplash/Pexels, lisansına uygun); kaynakları `public/brand/KAYNAKLAR.md` dosyasında listele. Gerçek bir markanın ürün fotoğrafı ya da logosu kullanılmasın. Tüm görseller `next/image`, AVIF/WebP, doğru `sizes`, ürün görsellerinde sabit en-boy oranı (3:4) ve bulanık yer tutucu.
- **Logo:** Kurgusal butik için basit bir SVG kelime logosu üret; `public/brand/logo.svg` değişince her yerde değişsin.

## 5. Hareket (motion) kuralları

- Sayfa geçişlerinde yumuşak geçiş; ürün kartından ürün sayfasına görselin büyüyerek geçtiği paylaşılan öğe geçişi (View Transitions API destekleniyorsa, yoksa sade solma).
- Kaydırmayla kademeli açılan ızgaralar, başlıklarda kelime maskesi, sepete eklemede ürün görselinin sepete "uçması" ve sayaçta yaylanma, yan sepet panelinde yay (spring) hareketi, galeride sürükleme ivmesi.
- Yalnız `transform` ve `opacity` canlandır; 60 fps hedefle, düşük güçlü telefonda da takılmasın.
- `prefers-reduced-motion` açıksa hareketler kapanıp anlık geçişe dönsün; içerik JS olmadan da görünsün.
- Ödeme adımlarında hareket minimum: güven ve netlik önce gelir.

## 6. Performans ve kalite hedefleri

- Lighthouse (mobil, canlı ortamda): Performans ≥ 90, Erişilebilirlik ≥ 95, En İyi Uygulamalar ≥ 95, SEO ≥ 95.
- LCP < 2,5 sn, CLS < 0,05, INP < 200 ms. Ürün ızgarasında ilk ekrandaki görseller öncelikli, gerisi tembel yüklensin. Fontlar alt kümeli.
- Duyarlı tasarım: 360, 390, 768, 1024, 1440 px ve yatay telefonda test et; hiçbir genişlikte yatay kaydırma çubuğu çıkmasın; sepet, filtre ve ödeme düğmeleri başparmakla ulaşılır olsun.
- Erişilebilirlik: başlık sırası, odak halkaları, kontrast, görsellerde alt metin, renk seçiminde yalnız renge dayanmayan etiket, form hataları alanla ilişkili, panellerde odak tuzağı ve Esc ile kapanma.
- SEO: `metadata` API, ürün başına Open Graph görseli, `Product` + `Offer` (fiyat, para birimi, stok durumu) ve `BreadcrumbList` JSON-LD, `Organization`; site haritası. **Ancak `demo: true` iken `noindex, nofollow`** olsun ve JSON-LD üretilmesin.
- `npm run build` ve `npm run lint` hatasız geçsin; sepet ve ödeme hesaplamaları (ara toplam, kampanya, indirim kodu, kargo, kapıda ödeme ücreti) için birim testleri yaz ve çalıştır.

## 7. Hukuk ve dürüstlük kuralları

- **Mesafeli satış (6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği):** Satıcı bilgileri (unvan, adres, telefon, e-posta, vergi/MERSİS numarası, KEP) sitede görünür olsun. Ödemeden önce ön bilgilendirme formu ve mesafeli satış sözleşmesi siparişe özel bilgilerle gösterilip onaylansın. **14 gün cayma hakkı** ve iade şartları açık yazılsın; iç giyim/hijyen gibi istisnalar varsa ayrıca belirtilsin.
- **Fiyat (Fiyat Etiketi Yönetmeliği):** Fiyatlar TL ve KDV dahil; kargo ücreti ve kapıda ödeme ücreti sepette ve ödemede ayrı ve açık gösterilsin, sürpriz ücret çıkmasın. İndirimde **üstü çizili eski fiyat yalnız `previousPrice30dLowest` doluysa** ve o değer üzerinden gösterilsin; yoksa yalnız "%20" kampanya etiketi ve indirimli fiyat. Kampanya bitiş tarihi yazılsın; tarih geçince kampanya kendiliğinden kalksın.
- **Aldatıcı tasarım yok (Haksız Ticari Uygulamalar):** Sahte geri sayım, sahte "şu an 12 kişi bakıyor", gerçek dışı "son 2 ürün" yok. Stok uyarısı yalnız gerçek stok verisinden ("Bu bedende son 2 ürün"). Ödeme adımında önceden işaretli ek ürün, sigorta ya da bağış kutusu olmasın.
- **Ticari elektronik ileti (6563 sayılı Kanun, İYS):** Bülten ve kampanya mesajı izni sipariş onayından ayrı, **önceden işaretlenmemiş** bir kutuyla alınsın.
- **KVKK ve çerez:** Aydınlatma metni bağlantıları formların altında; zorunlu olmayan çerezler (analitik, pazarlama) ancak onaydan sonra yüklensin; çerez bandında "Reddet" en az "Kabul et" kadar görünür olsun.
- **Bu bir demo:** `demo: true` iken köşede küçük, zarif bir "Demo" rozeti, ödeme adımında "Demo: gerçek ödeme alınmaz, kart bilgisi girmeyin" uyarısı ve altbilgide "Bu site EMY Digital tarafından hazırlanmış bir örnektir" notu olsun. Mağaza adı, satıcı bilgileri ve iletişim bilgileri kurgusal ve açıkça örnek olsun. Test modunda kart numarası alanı yerine "Test ödemesini tamamla / Başarısız ödemeyi dene" düğmeleri olsun; demo hiçbir gerçek kart verisi toplamasın.
- **Yorumlar:** Uydurma müşteri yorumu gerçekmiş gibi yayınlanamaz (Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği). Demoda ürün yorumları "Örnek yorum" ibaresiyle ve az sayıda olsun; gerçek mağazada yalnız doğrulanmış alıcıların yorumları. README'ye yaz.

## 8. Teslim

1. Kurulu yedi yeteneği ve hangi kararda hangisini kullandığını kısaca listele.
2. Çalışan site: `npm run dev` ile aç; ana sayfa, kategori (filtre açık), ürün sayfası (beden seçimi ve beden tablosu), yan sepet, ödeme adımları (sözleşme onayı dahil), sipariş onayı, sipariş takibi ve panel sayfalarını 390 px ve 1440 px'de ekran görüntüsüyle göster.
3. Uçtan uca demo senaryosu: ürün seç → sepete ekle → `MIRA10` kodunu uygula → kapıda ödemeyle sipariş ver → panelde siparişi "Kargoda" yap → sipariş takipte durumun değiştiğini göster.
4. README: kurulum, yayın, "Yeni butiğe uyarlama" kontrol listesi, ürün dosyasının alan açıklamaları, ödeme sağlayıcısına geçiş adımları, veritabanına geçiş adımları, kaynak görsellerin listesi.
5. Son olarak `web-design-guidelines` denetimini çalıştır, bulguları düzelt ve kalan bir şey varsa açıkça yaz.

Kararsız kaldığın bir noktada bana sormadan önce mantıklı varsayılanı seç ve README'de "Varsayımlar" başlığı altında not et.
