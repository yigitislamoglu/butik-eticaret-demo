import type { GarmentCategory } from "./size-chart";
export type { GarmentCategory };

export type ProductFit = "dar" | "normal" | "oversize";
export type ProductTag = "yeni" | "cok-satan" | "surdurulebilir";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "STD";

export interface ProductColorOption {
  name: string;
  hex: string;
  images: string[];
}

export interface ProductVariant {
  sku: string;
  color: string;
  size: ProductSize;
  stock: number;
}

export interface SampleReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  sizePurchased: ProductSize;
  fitFeedback: "Tam kalıp" | "Biraz dar" | "Biraz geniş";
  comment: string;
  isSample: true; // Ticari Reklam Yönetmeliği gereği demoda açıkça "Örnek yorum" olarak işaretlenir
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  material: string;
  care: string[];
  fit: ProductFit;
  modelInfo: string;
  category: GarmentCategory;
  categoryLabel: string;
  collection: string;
  price: number;
  campaignPercent?: number;
  previousPrice30dLowest?: number;
  colors: ProductColorOption[];
   images: Record<string, string[]>;
  variants: ProductVariant[];
  tags: ProductTag[];
  related: string[];
  instagramHandleCaption?: {
    postImage: string;
    caption: string;
    dateLabel: string;
  };
  sampleReviews?: SampleReview[];
}

export const CATEGORY_INFO: Record<
  GarmentCategory,
  {
    slug: GarmentCategory;
    name: string;
    subtitle: string;
    heroImage: string;
  }
> = {
  elbise: {
    slug: "elbise",
    name: "Elbise",
    subtitle: "Gün ışığından akşam davetlerine uzanan, doğal dokulu ve akıcı silüetler.",
    heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  "gomlek-bluz": {
    slug: "gomlek-bluz",
    name: "Gömlek & Bluz",
    subtitle: "Ham keten, poplin ve ipeksi viskon dokularla zahmetsiz şehir kesimleri.",
    heroImage: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1200&q=80",
  },
  "pantolon-etek": {
    slug: "pantolon-etek",
    name: "Pantolon & Etek",
    subtitle: "Yüksek bel палazzo pantolonlar, pens detaylı kesimler ve midi etekler.",
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
  },
  triko: {
    slug: "triko",
    name: "Triko",
    subtitle: "Yumuşak merinos karışımları, ince fitilli hırkalar ve mevsim geçişi kazakları.",
    heroImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
  },
  "dis-giyim": {
    slug: "dis-giyim",
    name: "Dış Giyim",
    subtitle: "Kemerli trençkotlar, kruvaze yün kabanlar ve yapısal keten blazer ceketler.",
    heroImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
  },
  aksesuar: {
    slug: "aksesuar",
    name: "Aksesuar",
    subtitle: "El işçiliği deri kemerler, dokuma omuz çantaları ve saf ipek fularlar.",
    heroImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
  },
};

// Sıcak taş/krem tonunda bulanık yer tutucu (CLS < 0.05 ve yumuşak yükleme için)
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDQiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjQiIGZpbGw9IiNFREU2REMiLz48L3N2Zz4=";

function createVariants(
  skuPrefix: string,
  colors: string[],
  sizes: ProductSize[],
  stockPattern: number[]
): ProductVariant[] {
  const list: ProductVariant[] = [];
  let idx = 0;
  for (const color of colors) {
    const colorCode = color
      .slice(0, 3)
      .toUpperCase()
      .replace(/İ/g, "I")
      .replace(/Ş/g, "S")
      .replace(/Ğ/g, "G")
      .replace(/Ü/g, "U")
      .replace(/Ö/g, "O")
      .replace(/Ç/g, "C");
    for (const size of sizes) {
      const stock = stockPattern[idx % stockPattern.length];
      list.push({
        sku: `${skuPrefix}-${colorCode}-${size}`,
        color,
        size,
        stock,
      });
      idx++;
    }
  }
  return list;
}

export const products: Product[] = [
  // ==================== 1. ELBİSE (6 ÜRÜN) ====================
  {
    id: "prd-01",
    slug: "alara-kusakli-ham-keten-midi-elbise",
    name: "Alara Kuşaklı Ham Keten Midi Elbise",
    description:
      "Akdeniz sıcaklarında nefes alan %100 doğal keten dokusuyla tasarlanan Alara Midi Elbise, çıkarılabilir kemeri ve yan yırtmaç detayıyla hem sandaletlerle gündüz şıklığına hem de akşam davetlerine uyum sağlar.",
    material: "%100 Avrupa Ham Keten (185 gr/m², iç göstermeyen sık dokuma)",
    care: [
      "30°C'de hassas programda benzer renklerle yıkayınız.",
      "Ağartıcı kullanmayınız, tamburlu kurutma yapmayınız.",
      "Nemliyken tersten orta ısıda ütüleyiniz.",
    ],
    fit: "normal",
    modelInfo: "Model 1,73 m, 55 kg, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Akdeniz Keten Seçkisi",
    price: 2450,
    campaignPercent: 20,
    previousPrice30dLowest: 2290,
    colors: [
      {
        name: "Kum Beji",
        hex: "#D6C6B2",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Zeytin Yeşili",
        hex: "#596348",
        images: [
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Kum Beji": [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
      ],
      "Zeytin Yeşili": [
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-01", ["Kum Beji", "Zeytin Yeşili"], ["XS", "S", "M", "L", "XL"], [4, 7, 2, 0, 3]),
    tags: ["yeni", "cok-satan", "surdurulebilir"],
    related: ["prd-02", "prd-07", "prd-25", "prd-31"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      caption: "DM'den en çok sorulan Alara Keten Elbise tüm bedenleriyle stokta.",
      dateLabel: "2 gün önce paylaşıldı",
    },
    sampleReviews: [
      {
        id: "rev-01",
        author: "Selin K.",
        rating: 5,
        date: "12 Ekim 2026",
        sizePurchased: "S",
        fitFeedback: "Tam kalıp",
        comment: "Kumaşın tok duruşu ve dikiş kalitesi harika. 1,68 boy 56 kiloyum, S beden tam oldu.",
        isSample: true,
      },
      {
        id: "rev-02",
        author: "Derya A.",
        rating: 5,
        date: "04 Ekim 2026",
        sizePurchased: "M",
        fitFeedback: "Tam kalıp",
        comment: "Kum beji rengi görseldekiyle birebir aynı, iç göstermiyor.",
        isSample: true,
      },
    ],
  },
  {
    id: "prd-02",
    slug: "vera-sirt-detayli-saten-slip-elbise",
    name: "Vera Sırt Detaylı Saten Slip Elbise",
    description:
      "Verev (bias) kesimi sayesinde vücut hatlarını zarifçe takip eden Vera Slip Elbise, ayarlanabilir ince askıları ve hafif degaje yaka formuyla zamansız bir akşam parçasıdır.",
    material: "%65 Ecovero Viskon, %35 İpek Dokulu Saten",
    care: ["Kuru temizleme önerilir veya elde soğuk suda yıkayınız.", "Sıkmayınız, asarak kurutunuz."],
    fit: "dar",
    modelInfo: "Model 1,75 m, 54 kg, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Gece & Davet Seçkisi",
    price: 2890,
    campaignPercent: 20,
    colors: [
      {
        name: "Gece Siyahı",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Şampanya",
        hex: "#E8DEC8",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Gece Siyahı": [
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      ],
      "Şampanya": [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-02", ["Gece Siyahı", "Şampanya"], ["XS", "S", "M", "L"], [2, 5, 1, 0]),
    tags: ["cok-satan"],
    related: ["prd-01", "prd-26", "prd-32"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
      caption: "Verev kesim Vera Slip Elbise: tek parçada zahmetsiz akşam şıklığı.",
      dateLabel: "4 gün önce paylaşıldı",
    },
  },
  {
    id: "prd-03",
    slug: "defne-poplin-gomlek-elbise",
    name: "Defne Korse Bel Poplin Gömlek Elbise",
    description:
      "Bel kısmındaki ince pens dikişleriyle kum saati formu yaratan Defne Poplin Elbise, tok pamuklu dokusu ve sedef düğmeleriyle ofisten hafta sonuna geçişi kolaylaştırır.",
    material: "%100 Organik Pamuk Poplin",
    care: ["30°C'de makinede yıkanabilir.", "Düşük devirde sıkma yapınız."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Şehir Klasikleri",
    price: 2190,
    colors: [
      {
        name: "Kırık Beyaz",
        hex: "#F5F2EB",
        images: [
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Acı Kahve",
        hex: "#4A3728",
        images: [
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Kırık Beyaz": [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
      ],
      "Acı Kahve": [
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-03", ["Kırık Beyaz", "Acı Kahve"], ["XS", "S", "M", "L", "XL"], [3, 6, 4, 2, 1]),
    tags: ["yeni", "surdurulebilir"],
    related: ["prd-01", "prd-04", "prd-31"],
  },
  {
    id: "prd-04",
    slug: "leysa-dokumlu-krep-maksi-elbise",
    name: "Leysa Dökümlü Krep Maksi Elbise",
    description:
      "Kırışmaya dayanıklı krep kumaşı ve omuzlardaki zarif büzgü detayıyla gün boyu konfor sunan maksi boy elbise.",
    material: "%72 Viskon, %28 Polyester Krep",
    care: ["30°C'de narin yıkama.", "Asarak kurutulduğunda ütü gerektirmez."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Zamansız Kapsül",
    price: 2350,
    campaignPercent: 20,
    previousPrice30dLowest: 2150,
    colors: [
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Karamel: [
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-04", ["Karamel", "Siyah"], ["XS", "S", "M", "L", "XL"], [5, 4, 6, 3, 2]),
    tags: ["cok-satan"],
    related: ["prd-01", "prd-05", "prd-33"],
  },
  {
    id: "prd-05",
    slug: "nihan-fitilli-triko-midi-elbise",
    name: "Nihan Kare Yaka Fitilli Triko Elbise",
    description:
      "Mevsim geçişlerinde trençkot ve çizmelerle kusursuz uyum yakalayan, esnek fitilli dokusuyla diz altı boyda triko elbise.",
    material: "%55 Pamuk, %35 Modal, %10 Merinos Yünü",
    care: ["Düz zeminde sererek kurutunuz.", "Askıda bekletmeyiniz."],
    fit: "dar",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Sonbahar / Kış Editoryal",
    price: 1980,
    colors: [
      {
        name: "Yulaf",
        hex: "#E2D9C8",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Antrasit",
        hex: "#3B3B3B",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Yulaf: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      ],
      Antrasit: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-05", ["Yulaf", "Antrasit"], ["XS", "S", "M", "L"], [2, 4, 3, 1]),
    tags: ["yeni"],
    related: ["prd-19", "prd-25", "prd-01"],
  },
  {
    id: "prd-06",
    slug: "peri-kruvaze-keten-karisimli-elbise",
    name: "Peri Kruvaze Keten Karışımlı Midi Elbise",
    description:
      "V yaka kruvaze kapanışı ve ayarlanabilir iç bağı sayesinde her vücut tipine rahatça oturan, nefes alan keten-viskon elbise.",
    material: "%55 Keten, %45 Viskon",
    care: ["30°C'de hassas yıkama.", "Düşük ısıda tersten ütüleyiniz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "elbise",
    categoryLabel: "Elbise",
    collection: "Akdeniz Keten Seçkisi",
    price: 2290,
    colors: [
      {
        name: "Tarçın",
        hex: "#8E4B32",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Ekru",
        hex: "#F3EFE6",
        images: [
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Tarçın: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      ],
      Ekru: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ELB-06", ["Tarçın", "Ekru"], ["XS", "S", "M", "L", "XL"], [1, 5, 4, 2, 0]),
    tags: ["surdurulebilir"],
    related: ["prd-01", "prd-03", "prd-34"],
  },

  // ==================== 2. GÖMLEK & BLUZ (6 ÜRÜN) ====================
  {
    id: "prd-07",
    slug: "bade-oversize-saf-keten-gomlek",
    name: "Bade Oversize Saf Keten Gömlek",
    description:
      "Düşük omuz kesimi, doğal sedef düğmeleri ve yıkandıkça yumuşayan taşlanmış keten dokusuyla dört mevsim gardırobunuzun temel parçası.",
    material: "%100 Avrupa Keten",
    care: ["30°C'de hassas yıkama.", "Kurutma makinesine atmayınız."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Akdeniz Keten Seçkisi",
    price: 1650,
    campaignPercent: 20,
    previousPrice30dLowest: 1550,
    colors: [
      {
        name: "Doğal Keten",
        hex: "#DDD3C2",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Beyaz",
        hex: "#FAFAFA",
        images: [
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Espresso",
        hex: "#3B2B23",
        images: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Doğal Keten": [
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
      ],
      Beyaz: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
      Espresso: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-07", ["Doğal Keten", "Beyaz", "Espresso"], ["XS", "S", "M", "L", "XL"], [6, 8, 2, 4, 0]),
    tags: ["cok-satan", "surdurulebilir"],
    related: ["prd-13", "prd-01", "prd-31"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      caption: "Bade Saf Keten Gömlek ve Nil Palazzo Pantolon takımımız yeniden stokta.",
      dateLabel: "3 gün önce paylaşıldı",
    },
    sampleReviews: [
      {
        id: "rev-03",
        author: "Zeynep T.",
        rating: 5,
        date: "15 Ekim 2026",
        sizePurchased: "S",
        fitFeedback: "Biraz geniş",
        comment: "Kalıbı gerçek oversize, kendi bedeninizi alırsanız tam salaş ve şık duruyor.",
        isSample: true,
      },
    ],
  },
  {
    id: "prd-08",
    slug: "ceyda-drapeli-ipeksi-saten-bluz",
    name: "Ceyda Drapeli İpeksi Saten Bluz",
    description:
      "Ön yakadaki zarif drape katları ve gizli arka düğme kapamasıyla ceket içlerinde ve yüksek bel pantolonlarla sofistike bir görünüm sunar.",
    material: "%100 Ecovero Saten Viskon",
    care: ["Elde soğuk yıkama veya kuru temizleme.", "Buharlı ütü ile uzaktan düzeltiniz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Şehir Klasikleri",
    price: 1490,
    colors: [
      {
        name: "Fildişi",
        hex: "#F6F3EC",
        images: [
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Vizon",
        hex: "#A59282",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Fildişi: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
      Vizon: [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-08", ["Fildişi", "Vizon"], ["XS", "S", "M", "L"], [3, 5, 4, 2]),
    tags: ["yeni"],
    related: ["prd-14", "prd-26", "prd-32"],
  },
  {
    id: "prd-09",
    slug: "merve-cizgili-maskulen-poplin-gomlek",
    name: "Merve İnce Çizgili Maskülen Poplin Gömlek",
    description:
      "Geniş manşetleri ve ince dokuma çizgileriyle klasik erkek gömleği kalıbından ilham alan, tok duruşlu %100 pamuk poplin gömlek.",
    material: "%100 Uzun Elyaf Pamuk Poplin",
    care: ["30°C'de makinede yıkanabilir.", "Orta ısıda ütüleyiniz."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Şehir Klasikleri",
    price: 1580,
    campaignPercent: 20,
    colors: [
      {
        name: "Taş Çizgili",
        hex: "#D8D0C5",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Mavi Çizgili",
        hex: "#8CA3B5",
        images: [
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Taş Çizgili": [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
      "Mavi Çizgili": [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-09", ["Taş Çizgili", "Mavi Çizgili"], ["XS", "S", "M", "L", "XL"], [4, 6, 5, 3, 1]),
    tags: ["cok-satan"],
    related: ["prd-13", "prd-15", "prd-27"],
  },
  {
    id: "prd-10",
    slug: "asli-baglama-detayli-muslin-bluz",
    name: "Aslı Önü Bağlamalı Çift Kat Müslin Bluz",
    description:
      "Yumuşacık organik pamuk müslin dokusu ve balon kol kesimiyle sıcak günlerde cildinize nefes aldıran zarif tasarım.",
    material: "%100 Organik Pamuk Müslin",
    care: ["30°C'de yıkanabilir.", "Ütü gerektirmeyen doğal dokulu yüzey."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Akdeniz Keten Seçkisi",
    price: 1290,
    colors: [
      {
        name: "Ekru",
        hex: "#F4EFE6",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Adaçayı",
        hex: "#9CAF9E",
        images: [
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Ekru: [
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
      ],
      Adaçayı: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-10", ["Ekru", "Adaçayı"], ["XS", "S", "M", "L"], [2, 7, 5, 1]),
    tags: ["surdurulebilir"],
    related: ["prd-07", "prd-16"],
  },
  {
    id: "prd-11",
    slug: "sueda-dik-yaka-kolsuz-keten-top",
    name: "Sueda Dik Yaka Kolsuz Keten Top",
    description:
      "Minimalist kesimi ve arka kısmındaki yırtmaçlı sedef düğme detayıyla keten pantolon ve eteklerin en yalın tamamlayıcısı.",
    material: "%70 Keten, %30 Pamuk",
    care: ["30°C'de hassas yıkama.", "Tersten ütüleyiniz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Zamansız Kapsül",
    price: 1190,
    colors: [
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Kum",
        hex: "#D5C5B0",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Siyah: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      ],
      Kum: [
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-11", ["Siyah", "Kum"], ["XS", "S", "M", "L"], [4, 5, 3, 2]),
    tags: ["yeni"],
    related: ["prd-13", "prd-17"],
  },
  {
    id: "prd-12",
    slug: "lara-nervur-dikisli-viskon-gomlek",
    name: "Lara Nervür Dikişli İnce Viskon Gömlek",
    description:
      "Ön pat boyunca uzanan ince nervür dikişleri ve dökümlü dokusuyla klasik beyaz gömleğe modern bir yorum katar.",
    material: "%100 Lenzing Viskon",
    care: ["30°C'de hassas yıkama.", "Nemliyken asarak kurutunuz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "gomlek-bluz",
    categoryLabel: "Gömlek & Bluz",
    collection: "Şehir Klasikleri",
    price: 1540,
    colors: [
      {
        name: "Krem",
        hex: "#F5F0E6",
        images: [
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Tarçın Kahve",
        hex: "#7C4D3A",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Krem: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
      ],
      "Tarçın Kahve": [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-GML-12", ["Krem", "Tarçın Kahve"], ["XS", "S", "M", "L", "XL"], [3, 4, 2, 1, 0]),
    tags: ["yeni"],
    related: ["prd-14", "prd-15"],
  },

  // ==================== 3. PANTOLON & ETEK (6 ÜRÜN) ====================
  {
    id: "prd-13",
    slug: "nil-yuksek-bel-keten-palazzo-pantolon",
    name: "Nil Yüksek Bel Çift Pileli Keten Palazzo Pantolon",
    description:
      "Beli saran yüksek kesimi, bacak boyunu uzun gösteren çift pile detayı ve geniş paça formuyla hem keten gömleklerle hem de kısa trikolarla kusursuz bir silüet oluşturur.",
    material: "%100 Avrupa Keten (Astarlı ekru seçeneğiyle)",
    care: ["30°C'de hassas yıkama.", "Tersten buharlı ütü uygulayınız."],
    fit: "normal",
    modelInfo: "Model 1,73 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Akdeniz Keten Seçkisi",
    price: 1950,
    campaignPercent: 20,
    previousPrice30dLowest: 1850,
    colors: [
      {
        name: "Doğal Keten",
        hex: "#DDD3C2",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Ekru",
        hex: "#F4EFE6",
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Doğal Keten": [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      ],
      Ekru: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-PNT-13", ["Doğal Keten", "Ekru", "Siyah"], ["XS", "S", "M", "L", "XL"], [5, 9, 2, 3, 1]),
    tags: ["cok-satan", "surdurulebilir"],
    related: ["prd-07", "prd-11", "prd-31"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      caption: "Yüksek bel ve tam dökümlü Nil Palazzo Pantolon ile gün boyu ferahlık.",
      dateLabel: "5 gün önce paylaşıldı",
    },
  },
  {
    id: "prd-14",
    slug: "mila-verev-kesim-saten-midi-etek",
    name: "Mila Verev Kesim Saten Midi Etek",
    description:
      "Gizli bel lastiği ve verev kesimiyle yürürken su gibi akan Mila Saten Etek, yazın keten gömleklerle, kışın kalın örgü kazaklarla kombinlenir.",
    material: "%100 Ecovero Saten Viskon",
    care: ["30°C'de çamaşır filesi içinde hassas yıkama."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Zamansız Kapsül",
    price: 1690,
    colors: [
      {
        name: "Şampanya",
        hex: "#E6DBC6",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Acı Kahve",
        hex: "#453327",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Şampanya: [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      ],
      "Acı Kahve": [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ETK-14", ["Şampanya", "Acı Kahve"], ["XS", "S", "M", "L"], [3, 6, 4, 2]),
    tags: ["cok-satan"],
    related: ["prd-08", "prd-19", "prd-32"],
  },
  {
    id: "prd-15",
    slug: "seren-pens-detayli-kumas-pantolon",
    name: "Seren Pens Detaylı Havuç Kesim Kumaş Pantolon",
    description:
      "Bilekte biten modern havuç kesimi, ütü izli ön pili ve tok gabardin-viskon karışımlı kumaşıyla şehirli ve düzenli bir duruş sunar.",
    material: "%64 Polyester, %33 Viskon, %3 Elastan",
    care: ["30°C'de yıkanabilir.", "Düşük ısıda ütüleyiniz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Şehir Klasikleri",
    price: 1850,
    colors: [
      {
        name: "Vizon",
        hex: "#B5A594",
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Vizon: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-PNT-15", ["Vizon", "Siyah"], ["XS", "S", "M", "L", "XL"], [4, 5, 6, 3, 2]),
    tags: ["yeni"],
    related: ["prd-09", "prd-27", "prd-31"],
  },
  {
    id: "prd-16",
    slug: "duru-kloş-pamuk-poplin-midi-etek",
    name: "Duru Yan Cepli Kloş Poplin Midi Etek",
    description:
      "Gizli yan cepleri ve volümlü A-kesim formuyla hareket özgürlüğü sağlayan, %100 organik pamuk poplin midi etek.",
    material: "%100 Organik Pamuk",
    care: ["30°C'de makinede yıkanabilir."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Akdeniz Keten Seçkisi",
    price: 1620,
    campaignPercent: 20,
    colors: [
      {
        name: "Kırık Beyaz",
        hex: "#F5F2EB",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Kırık Beyaz": [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      ],
      Karamel: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ETK-16", ["Kırık Beyaz", "Karamel"], ["XS", "S", "M", "L"], [2, 5, 3, 1]),
    tags: ["surdurulebilir"],
    related: ["prd-10", "prd-11"],
  },
  {
    id: "prd-17",
    slug: "eda-kusakli-anvelop-keten-etek",
    name: "Eda Kuşaklı Anvelop Keten Midi Etek",
    description:
      "Beli iki kademeli düğme ve kuşakla ayarlanabilen, yürürken zarif bir yırtmaç etkisi bırakan doğal keten anvelop etek.",
    material: "%100 Ham Keten",
    care: ["30°C'de hassas yıkama.", "Nemliyken ütüleyiniz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Akdeniz Keten Seçkisi",
    price: 1740,
    colors: [
      {
        name: "Zeytin",
        hex: "#596348",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Kum Beji",
        hex: "#D6C6B2",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Zeytin: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
      ],
      "Kum Beji": [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-ETK-17", ["Zeytin", "Kum Beji"], ["XS", "S", "M", "L"], [3, 4, 2, 0]),
    tags: ["yeni", "surdurulebilir"],
    related: ["prd-07", "prd-11"],
  },
  {
    id: "prd-18",
    slug: "yasemin-genis-paca-dokumlu-krep-pantolon",
    name: "Yasemin Geniş Paça Dökümlü Krep Pantolon",
    description:
      "Arka beli gizli esnek bantlı, önü klasik fermuar ve kanca kapamalı; gün boyu kırışmadan formunu koruyan akıcı pantolon.",
    material: "%75 Viskon, %25 Polyester Krep",
    care: ["30°C'de hassas yıkama."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "pantolon-etek",
    categoryLabel: "Pantolon & Etek",
    collection: "Zamansız Kapsül",
    price: 1890,
    colors: [
      {
        name: "Taş",
        hex: "#CFC6B8",
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Gece Siyahı",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Taş: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      ],
      "Gece Siyahı": [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-PNT-18", ["Taş", "Gece Siyahı"], ["XS", "S", "M", "L", "XL"], [4, 6, 5, 2, 1]),
    tags: ["cok-satan"],
    related: ["prd-08", "prd-20", "prd-26"],
  },

  // ==================== 4. TRİKO (6 ÜRÜN) ====================
  {
    id: "prd-19",
    slug: "luna-merinos-yun-karisimli-hirka",
    name: "Luna Boynuz Düğmeli Merinos Yün Karışımlı Hırka",
    description:
      "Yumuşak dokusuyla teni rahatsız etmeyen, V yakalı ve doğal boynuz görünümlü düğmeleriyle hem tek başına bluz gibi hem de gömlek üzerinde kullanılabilen triko hırka.",
    material: "%45 İnce Merinos Yünü, %35 Pamuk, %20 Polyamid",
    care: ["Elde veya yün programında soğuk suda yıkayınız.", "Sererek kurutunuz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Sonbahar / Kış Editoryal",
    price: 1890,
    campaignPercent: 20,
    previousPrice30dLowest: 1790,
    colors: [
      {
        name: "Yulaf Melanj",
        hex: "#DFD5C5",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Yulaf Melanj": [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      ],
      Karamel: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-19", ["Yulaf Melanj", "Karamel"], ["XS", "S", "M", "L"], [4, 7, 2, 1]),
    tags: ["cok-satan", "yeni"],
    related: ["prd-14", "prd-13", "prd-20"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      caption: "Luna Merinos Hırka: serin akşamların en yumuşak eşlikçisi.",
      dateLabel: "1 hafta önce paylaşıldı",
    },
  },
  {
    id: "prd-20",
    slug: "ada-polo-yaka-ince-triko-kazak",
    name: "Ada Açık Polo Yaka İnce Triko Kazak",
    description:
      "Düğmesiz açık polo yakası ve ince dokumasıyla ceket altlarında ağırlık yapmayan, zarif ve zamansız triko.",
    material: "%70 Viskon, %30 Pamuk",
    care: ["30°C'de hassas programda yıkayınız.", "Sererek kurutunuz."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Zamansız Kapsül",
    price: 1590,
    colors: [
      {
        name: "Ekru",
        hex: "#F4EFE6",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Ekru: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-20", ["Ekru", "Siyah"], ["XS", "S", "M", "L"], [3, 6, 5, 2]),
    tags: ["cok-satan"],
    related: ["prd-15", "prd-18", "prd-26"],
  },
  {
    id: "prd-21",
    slug: "neva-kayik-yaka-dokulu-triko-bluz",
    name: "Neva Kayık Yaka Dokulu Triko Bluz",
    description:
      "Köprücük kemiklerini zarifçe ortaya çıkaran kayık yaka kesimi ve nefes alan pamuklu buklet dokusuyla dört mevsim giyilebilir.",
    material: "%85 Organik Pamuk, %15 Keten İplik",
    care: ["30°C'de hassas yıkama."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Akdeniz Keten Seçkisi",
    price: 1450,
    colors: [
      {
        name: "Kum",
        hex: "#D6C6B2",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Acı Kahve",
        hex: "#453327",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Kum: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ],
      "Acı Kahve": [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-21", ["Kum", "Acı Kahve"], ["XS", "S", "M", "L"], [2, 5, 4, 1]),
    tags: ["surdurulebilir"],
    related: ["prd-13", "prd-14"],
  },
  {
    id: "prd-22",
    slug: "iklim-oversize-balikci-yaka-kazak",
    name: "İklim Düşük Omuz Balıkçı Yaka Kazak",
    description:
      "Boynu sıkmayan rahat balıkçı yakası, yan yırtmaçları ve yumuşak yün-kaşmir tuşeli dokusuyla kış günlerinin favorisi.",
    material: "%50 Yün, %30 Viskon, %20 Polyamid",
    care: ["Yün programında soğuk yıkama.", "Düz zeminde kurutunuz."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Sonbahar / Kış Editoryal",
    price: 2150,
    campaignPercent: 20,
    colors: [
      {
        name: "Krem",
        hex: "#F4EFE6",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Antrasit Melanj",
        hex: "#424242",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Krem: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      ],
      "Antrasit Melanj": [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-22", ["Krem", "Antrasit Melanj"], ["XS", "S", "M", "L", "XL"], [3, 5, 4, 2, 1]),
    tags: ["yeni"],
    related: ["prd-14", "prd-28"],
  },
  {
    id: "prd-23",
    slug: "melis-dugmeli-triko-yelek",
    name: "Melis Kruvaze Düğmeli Triko Yelek",
    description:
      "Tek başına bluz olarak ya da poplin gömleklerin üzerinde katmanlı stil oluşturmak için tasarlanan tok dokulu triko yelek.",
    material: "%65 Pamuk, %35 Viskon",
    care: ["30°C'de hassas yıkama."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Şehir Klasikleri",
    price: 1390,
    colors: [
      {
        name: "Vizon",
        hex: "#A89786",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Vizon: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-23", ["Vizon", "Siyah"], ["XS", "S", "M", "L"], [4, 4, 2, 0]),
    tags: ["yeni"],
    related: ["prd-09", "prd-15"],
  },
  {
    id: "prd-24",
    slug: "roza-kusakli-uzun-triko-hirka",
    name: "Roza Kuşaklı Uzun Triko Hırka",
    description:
      "Kemerli bel formu ve cepli rahat kesimiyle sabah kahvesinden hafta sonu yürüyüşlerine kadar saran sıcak triko hırka.",
    material: "%50 Pamuk, %35 Akrilik, %15 Yün",
    care: ["Sererek kurutunuz."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "triko",
    categoryLabel: "Triko",
    collection: "Sonbahar / Kış Editoryal",
    price: 2050,
    colors: [
      {
        name: "Kum Beji",
        hex: "#D6C6B2",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Zeytin",
        hex: "#596348",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Kum Beji": [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ],
      Zeytin: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-TRK-24", ["Kum Beji", "Zeytin"], ["XS", "S", "M", "L"], [2, 6, 5, 3]),
    tags: ["cok-satan"],
    related: ["prd-05", "prd-13"],
  },

  // ==================== 5. DIŞ GİYİM (6 ÜRÜN) ====================
  {
    id: "prd-25",
    slug: "pera-kruvaze-kusakli-uzun-trenckot",
    name: "Pera Kruvaze Kuşaklı Su İtici Uzun Trençkot",
    description:
      "Klasik apolet ve rüzgarlık detaylarını modern, akıcı bir kalıpla buluşturan Pera Trençkot; su itici pamuk-gabardin dokusu ve iç astarıyla mevsim geçişlerinin vazgeçilmez yatırımıdır.",
    material: "%68 Pamuk, %32 Teknik Gabardin (Tam Astarlı)",
    care: ["Kuru temizleme önerilir.", "Düşük ısıda buharlı ütü uygulayınız."],
    fit: "oversize",
    modelInfo: "Model 1,74 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Sonbahar / Kış Editoryal",
    price: 3650,
    campaignPercent: 20,
    previousPrice30dLowest: 3490,
    colors: [
      {
        name: "Taş Beji",
        hex: "#CBBBA4",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Haki",
        hex: "#525946",
        images: [
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Taş Beji": [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
      ],
      Haki: [
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-25", ["Taş Beji", "Haki"], ["XS", "S", "M", "L", "XL"], [3, 6, 2, 4, 0]),
    tags: ["cok-satan", "yeni"],
    related: ["prd-05", "prd-15", "prd-31"],
    instagramHandleCaption: {
      postImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      caption: "Su itici gabardin dokusuyla Pera Uzun Trençkot yeni sezonun yıldızı.",
      dateLabel: "1 gün önce paylaşıldı",
    },
    sampleReviews: [
      {
        id: "rev-04",
        author: "Elif B.",
        rating: 5,
        date: "18 Ekim 2026",
        sizePurchased: "S",
        fitFeedback: "Tam kalıp",
        comment: "Omuz duruşu ve kumaşın ağırlığı çok kaliteli. İçine kalın kazaklarla da rahatça giyiliyor.",
        isSample: true,
      },
    ],
  },
  {
    id: "prd-26",
    slug: "sena-yapisal-keten-blazer-ceket",
    name: "Sena Tek Düğmeli Yapısal Keten Blazer Ceket",
    description:
      "İnce vatka destekli omuzları ve nefes alan viskon iç astarıyla hem Nil Palazzo Pantolon ile takım olarak hem de elbiselerin üzerinde kullanılır.",
    material: "%100 Avrupa Keten (Astar: %100 Viskon)",
    care: ["Yalnızca kuru temizleme."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Akdeniz Keten Seçkisi",
    price: 2950,
    colors: [
      {
        name: "Doğal Keten",
        hex: "#DDD3C2",
        images: [
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Doğal Keten": [
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-26", ["Doğal Keten", "Siyah"], ["XS", "S", "M", "L", "XL"], [2, 5, 4, 3, 1]),
    tags: ["cok-satan", "surdurulebilir"],
    related: ["prd-13", "prd-08", "prd-11"],
  },
  {
    id: "prd-27",
    slug: "beliz-kruvaze-kisa-tuvit-ceket",
    name: "Beliz Dokulu Kısa Tüvit Ceket",
    description:
      "Mat metalik düğmeleri ve ince pamuk-tüvit dokumasıyla yüksek bel pantolonlarla modern bir oran yakalayan kısa ceket.",
    material: "%60 Pamuk, %30 Akrilik, %10 Viskon",
    care: ["Kuru temizleme önerilir."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Şehir Klasikleri",
    price: 2790,
    colors: [
      {
        name: "Ekru Dokulu",
        hex: "#F2EDE4",
        images: [
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah Dokulu",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Ekru Dokulu": [
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
      ],
      "Siyah Dokulu": [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-27", ["Ekru Dokulu", "Siyah Dokulu"], ["XS", "S", "M", "L"], [2, 4, 3, 1]),
    tags: ["yeni"],
    related: ["prd-15", "prd-32"],
  },
  {
    id: "prd-28",
    slug: "gazel-el-dikisi-yun-kaban",
    name: "Gazel El Dikişi Detaylı Çift Yüzlü Yün Kaban",
    description:
      "Astarsız çift yüzlü (double-face) yün kumaşı sayesinde hafif ama yüksek ısı yalıtımlı, kuşaklı uzun kış kabanı.",
    material: "%80 Yün, %20 Polyamid",
    care: ["Yalnızca kuru temizleme."],
    fit: "oversize",
    modelInfo: "Model 1,74 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Sonbahar / Kış Editoryal",
    price: 4450,
    campaignPercent: 20,
    previousPrice30dLowest: 4190,
    colors: [
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Acı Kahve",
        hex: "#423024",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Karamel: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
      ],
      "Acı Kahve": [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-28", ["Karamel", "Acı Kahve"], ["XS", "S", "M", "L"], [1, 4, 3, 2]),
    tags: ["yeni", "cok-satan"],
    related: ["prd-22", "prd-33"],
  },
  {
    id: "prd-29",
    slug: "beril-kusakli-kimono-ceket",
    name: "Beril Dokuma Keten Kimono Ceket",
    description:
      "Düğmesiz rahat kesimi ve geniş kol formuyla hem şehir içinde jean/pantolonlarla hem de tatil valizlerinde çok yönlü kullanım sunar.",
    material: "%100 Ham Keten",
    care: ["30°C'de hassas yıkama."],
    fit: "oversize",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Akdeniz Keten Seçkisi",
    price: 2250,
    colors: [
      {
        name: "Kum Beji",
        hex: "#D6C6B2",
        images: [
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Kiremit",
        hex: "#9E4B3B",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Kum Beji": [
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      ],
      Kiremit: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-29", ["Kum Beji", "Kiremit"], ["XS", "S", "M", "L"], [3, 5, 4, 2]),
    tags: ["surdurulebilir"],
    related: ["prd-11", "prd-13"],
  },
  {
    id: "prd-30",
    slug: "hande-dik-yaka-kisa-trenckot",
    name: "Hande Dik Yaka Kısa Pamuklu Trençkot",
    description:
      "Kalça hizasında biten dinamik boyu, çıtçıtlı rüzgar patı ve ayarlanabilir bilek bantlarıyla hafta sonu kombinlerinin tamamlayıcısı.",
    material: "%100 Pamuk Gabardin",
    care: ["Kuru temizleme veya 30°C'de narin yıkama."],
    fit: "normal",
    modelInfo: "Model 1,72 m, S beden giyiyor",
    category: "dis-giyim",
    categoryLabel: "Dış Giyim",
    collection: "Şehir Klasikleri",
    price: 2690,
    colors: [
      {
        name: "Taş",
        hex: "#D3C8B8",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Gece Siyahı",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Taş: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      ],
      "Gece Siyahı": [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-DIS-30", ["Taş", "Gece Siyahı"], ["XS", "S", "M", "L"], [2, 6, 4, 2]),
    tags: ["yeni"],
    related: ["prd-15", "prd-20"],
  },

  // ==================== 6. AKSESUAR (6 ÜRÜN) ====================
  {
    id: "prd-31",
    slug: "solen-pirinc-tokali-deri-kemer",
    name: "Sölen Pirinç Tokalı Hakiki Deri Kemer (2,5 cm)",
    description:
      "Bitkisel tabaklanmış yumuşak dana derisinden el işçiliğiyle üretilen, mat fırçalanmış pirinç tokalı klasik kemer. Elbise ve pantolonlarla kullanıma uygundur.",
    material: "%100 Bitkisel Tabaklanmış Hakiki Deri (Ebat: Genişlik 2,5 cm, Uzunluk 100 cm)",
    care: ["Nemli bezle siliniz, doğrudan su ve parfümle temasından kaçınınız."],
    fit: "normal",
    modelInfo: "Standart beden (64–92 cm bel aralığına uyumlu 7 delikli)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Zamansız Kapsül",
    price: 890,
    colors: [
      {
        name: "Taba",
        hex: "#8F5838",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Taba: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      ],
      Siyah: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-31", ["Taba", "Siyah"], ["STD"], [12, 9]),
    tags: ["cok-satan"],
    related: ["prd-01", "prd-13", "prd-15"],
  },
  {
    id: "prd-32",
    slug: "nora-dokuma-deri-omuz-cantasi",
    name: "Nora El Örgüsü Dokuma Deri Omuz Çantası",
    description:
      "Yumuşak dokuma deri yüzeyi, mıknatıslı üst kapaması ve pamuklu keten iç kesesiyle gündüzden geceye tüm temel eşyalarınızı taşıyan zamansız çanta.",
    material: "%100 Yumuşak Dana Derisi (Ebat: 28 × 19 × 9 cm)",
    care: ["Toz torbasında muhafaza ediniz."],
    fit: "normal",
    modelInfo: "Standart Ebat (28 × 19 × 9 cm)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Şehir Klasikleri",
    price: 2750,
    campaignPercent: 20,
    previousPrice30dLowest: 2590,
    colors: [
      {
        name: "Acı Kahve",
        hex: "#433024",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Krem",
        hex: "#EFEAE1",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Acı Kahve": [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
      ],
      Krem: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-32", ["Acı Kahve", "Krem"], ["STD"], [5, 3]),
    tags: ["cok-satan", "yeni"],
    related: ["prd-02", "prd-08", "prd-14"],
  },
  {
    id: "prd-33",
    slug: "vera-saf-ipek-twill-fular",
    name: "Vera Desenli %100 Saf İpek Twill Fular (70×70)",
    description:
      "El kıvırması kenar dikişleri ve sıcak toprak tonlarındaki editoryal deseniyle boyunda, saçta ya da çanta sapında kullanılabilen saf ipek fular.",
    material: "%100 Dut İpeği Twill (70 × 70 cm)",
    care: ["Yalnızca kuru temizleme."],
    fit: "normal",
    modelInfo: "Standart Ebat (70 × 70 cm)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Zamansız Kapsül",
    price: 1150,
    colors: [
      {
        name: "Toprak & Krem",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Toprak & Krem": [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-33", ["Toprak & Krem"], ["STD"], [8]),
    tags: ["yeni"],
    related: ["prd-07", "prd-25"],
  },
  {
    id: "prd-34",
    slug: "alize-rafya-deri-detayli-plaj-ve-sehir-cantasi",
    name: "Alize Deri Saplı Doğal Rafya Tote Çanta",
    description:
      "El örgüsü doğal rafya gövdesi ve uzunluğu ayarlanabilir hakiki deri omuz askılarıyla yaz-bahar stilinin en ferah parçası.",
    material: "%80 Doğal Rafya, %20 Hakiki Deri (Ebat: 38 × 30 × 14 cm)",
    care: ["Kuru fırça veya hafif nemli bezle temizleyiniz."],
    fit: "normal",
    modelInfo: "Standart Ebat (38 × 30 × 14 cm)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Akdeniz Keten Seçkisi",
    price: 1950,
    colors: [
      {
        name: "Doğal Rafya / Taba",
        hex: "#D2BC9A",
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Doğal Rafya / Taba": [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-34", ["Doğal Rafya / Taba"], ["STD"], [6]),
    tags: ["surdurulebilir"],
    related: ["prd-01", "prd-06"],
  },
  {
    id: "prd-35",
    slug: "mercan-yun-karisimli-dokuma-sal",
    name: "Mercan İnce Saçaklı Yün-Modal Dokuma Şal",
    description:
      "Cildi rahatsız etmeyen yumuşak modal ve ince yün dokumasıyla serin akşamların ve seyahatlerin kurtarıcı aksesuarı.",
    material: "%60 Modal, %40 İnce Yün (Ebat: 75 × 190 cm)",
    care: ["Elde soğuk suda yıkayınız veya kuru temizleme yapınız."],
    fit: "normal",
    modelInfo: "Standart Ebat (75 × 190 cm)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Sonbahar / Kış Editoryal",
    price: 980,
    colors: [
      {
        name: "Yulaf Beji",
        hex: "#E1D7C6",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      "Yulaf Beji": [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      ],
      Karamel: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-35", ["Yulaf Beji", "Karamel"], ["STD"], [7, 4]),
    tags: ["yeni"],
    related: ["prd-25", "prd-28"],
  },
  {
    id: "prd-36",
    slug: "lina-minimal-tokali-ince-bel-kemeri",
    name: "Lina Minimal Altın Tokalı İnce Elbise Kemeri (1,5 cm)",
    description:
      "Gömlek elbiselerin, blazer ceketlerin ve uzun hırkaların belini zarifçe vurgulamak için tasarlanan ince hakiki deri kemer.",
    material: "%100 Hakiki Deri (Ebat: Genişlik 1,5 cm)",
    care: ["Nemli bezle siliniz."],
    fit: "normal",
    modelInfo: "Standart beden (Bel ve basen kullanımına uygun 9 delikli)",
    category: "aksesuar",
    categoryLabel: "Aksesuar",
    collection: "Zamansız Kapsül",
    price: 780,
    colors: [
      {
        name: "Siyah",
        hex: "#1F1F1F",
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        ],
      },
      {
        name: "Karamel",
        hex: "#B88A5A",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        ],
      },
    ],
    images: {
      Siyah: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      ],
      Karamel: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      ],
    },
    variants: createVariants("MRA-AKS-36", ["Siyah", "Karamel"], ["STD"], [10, 8]),
    tags: ["cok-satan"],
    related: ["prd-03", "prd-24", "prd-26"],
  },
];
