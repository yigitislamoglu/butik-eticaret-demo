export const site = {
  name: "Mira Butik",                    // kurgusal demo adı
  tagline: "Gündelik şıklık, Adana'dan kapınıza",
  city: "Adana",
  address: "Örnek Mah. Örnek Cad. No: 1, Seyhan / Adana",
  phone: "+90 500 000 00 00",
  whatsapp: "905000000000",
  email: "destek@ornek.com",
  workingHours: "Pazartesi – Cumartesi, 09:30 – 19:30",
  logo: { src: "/brand/logo.svg", alt: "Mira Butik" },
  colors: {
    primary: "#1F1F1F",
    accent: "#B88A5A",
    cream: "#F7F3EE",
    sale: "#9E3B32",
  }, // CSS değişkenlerine aktarılır
  fonts: {
    heading: "Cormorant Garamond",
    body: "Plus Jakarta Sans",
  },
  contact: {
    whatsapp: "905000000000",
    phone: "+90 500 000 00 00",
    email: "destek@ornek.com",
    instagram: "https://instagram.com/mirabutik.demo",
    instagramHandle: "@mirabutik.demo",
    address: "Örnek Mah. Örnek Cad. No: 1, Seyhan / Adana",
    workingHours: "Pazartesi – Cumartesi, 09:30 – 19:30",
  },
  seller: {                              // yasal satıcı bilgileri (demoda örnek)
    legalName: "Örnek Tekstil Ltd. Şti.",
    taxOffice: "Seyhan",
    taxNumber: "0000000000",
    mersis: "0000000000000000",
    etbis: "ETBİS kayıt no: örnek",
    kep: "ornek@hs01.kep.tr",
  },
  legal: {
    sellerTitle: "Örnek Tekstil Ltd. Şti.",
    taxOffice: "Seyhan",
    taxNumber: "0000000000",
    mersisNo: "0000000000000000",
    etbisNote: "ETBİS kayıt no: örnek",
    kepAddress: "ornek@hs01.kep.tr",
  },
  shipping: {
    freeOver: 1500,
    fee: 89,
    carrier: "Yurtiçi Kargo",
    carriers: ["Yurtiçi Kargo", "Aras Kargo"],
    dispatchDays: "1–2 iş günü",
    estimatedDays: "1–3 iş günü",
    sameDayCutoff: "15:00",
  },
  payment: {
    card: true,
    creditCardProviders: ["iyzico", "PayTR"],
    cashOnDelivery: { enabled: true, fee: 30 },
    transfer: true,
    whatsappOrder: true,
    bankAccount: {
      bankName: "Örnek Bankası",
      accountHolder: "Örnek Tekstil Ltd. Şti.",
      iban: "TR00 0000 0000 0000 0000 0000 00",
      branch: "Seyhan / Adana Şubesi",
    },
    bankTransfer: {
      enabled: true,
      bankName: "Örnek Bankası",
      accountHolder: "Örnek Tekstil Ltd. Şti.",
      iban: "TR00 0000 0000 0000 0000 0000 00",
      branch: "Seyhan / Adana Şubesi",
    },
  },
  returns: { days: 14 },
  campaign: {
    active: true,
    label: "Sezon açılışı: seçili ürünlerde %20",
    endsAt: "2026-12-31T23:59:59+03:00",
  },
  demo: true,                            // true iken "Demo" rozeti, test ödeme ve noindex
};

export type SiteConfig = typeof site;
