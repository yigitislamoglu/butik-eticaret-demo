import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateCartTotals } from "../lib/pricing";
import { getProductPricing, isCampaignActive, normalizeTurkish } from "../lib/utils";
import { products, CATEGORY_INFO } from "../content/products";

describe("Fiyat Etiketi Yönetmeliği ve Kampanya Hesaplamaları", () => {
  const activeCampaign = {
    active: true,
    endsAt: "2026-12-31T23:59:59+03:00",
  };
  const now = new Date("2026-10-23T12:00:00+03:00");

  it("Kampanya aktifken ve bitiş tarihi geçmemişken %20 indirimi son 30 günün en düşük fiyatı üzerinden doğru uygular", () => {
    const pricing = getProductPricing(
      {
        price: 2450,
        campaignPercent: 20,
        previousPrice30dLowest: 2450,
      },
      activeCampaign,
      now
    );
    assert.equal(pricing.hasCampaign, true);
    assert.equal(pricing.finalPrice, 1960);
    // Üstü çizili fiyat yalnız previousPrice30dLowest doluysa o değer üzerinden gösterilmeli ve oran onunla birebir tutmalı (%20)
    assert.equal(pricing.strikethroughPrice, 2450);
    assert.equal(pricing.campaignPercent, 20);
  });

  it("previousPrice30dLowest boşsa üstü çizili eski fiyat ve indirim yüzdesi rozeti üretmez, yalnız indirimli fiyat döner", () => {
    const pricing = getProductPricing(
      {
        price: 2000,
        campaignPercent: 20,
        previousPrice30dLowest: undefined,
      },
      activeCampaign,
      now
    );
    assert.equal(pricing.hasCampaign, true);
    assert.equal(pricing.finalPrice, 1600);
    assert.equal(pricing.strikethroughPrice, undefined);
    assert.equal(pricing.campaignPercent, undefined);
  });

  it("Kampanya bitiş tarihi geçtiğinde kampanya kendiliğinden kalkar", () => {
    const expiredDate = new Date("2027-01-02T10:00:00+03:00");
    assert.equal(isCampaignActive(activeCampaign, expiredDate), false);

    const pricing = getProductPricing(
      {
        price: 2450,
        campaignPercent: 20,
        previousPrice30dLowest: 2290,
      },
      activeCampaign,
      expiredDate
    );
    assert.equal(pricing.hasCampaign, false);
    assert.equal(pricing.finalPrice, 2450);
    assert.equal(pricing.strikethroughPrice, undefined);
  });
});

describe("Sepet ve Ödeme Hesaplamaları (Ara toplam, MIRA10, Kargo, Kapıda Ödeme)", () => {
  const now = new Date("2026-10-23T12:00:00+03:00");
  const campaignConfig = { active: true, endsAt: "2026-12-31T23:59:59+03:00" };
  const shippingConfig = { freeOver: 1500, fee: 89 };
  const paymentConfig = { cashOnDelivery: { enabled: true, fee: 30 } };

  it("1.500 TL altındaki sepette 89 TL kargo ücreti ve ücretsiz kargoya kalan tutarı hesaplar", () => {
    const res = calculateCartTotals({
      items: [
        {
          productId: "prd-31",
          slug: "solen-pirinc-tokali-deri-kemer",
          name: "Sölen Deri Kemer",
          color: "Taba",
          size: "STD",
          sku: "MRA-AKS-31-TAB-STD",
          quantity: 1,
          price: 890,
          image: "/test.jpg",
        },
      ],
      shippingConfig,
      paymentConfig,
      campaignConfig,
      now,
    });

    assert.equal(res.subtotal, 890);
    assert.equal(res.isFreeShipping, false);
    assert.equal(res.shippingFee, 89);
    assert.equal(res.freeShippingRemaining, 610);
    assert.equal(res.total, 979);
  });

  it("MIRA10 indirim kodunu (%10) ve kapıda ödeme ücretini (30 TL) doğru uygular", () => {
    const res = calculateCartTotals({
      items: [
        {
          productId: "prd-01",
          slug: "alara-kusakli-ham-keten-midi-elbise",
          name: "Alara Elbise",
          color: "Kum Beji",
          size: "S",
          sku: "MRA-ELB-01-KUM-S",
          quantity: 1,
          price: 2450,
          campaignPercent: 20, // 2450 -> 1960 TL
          previousPrice30dLowest: 2450,
          image: "/test.jpg",
        },
      ],
      couponCode: "mira10",
      paymentMethod: "kapida-odeme",
      shippingConfig,
      paymentConfig,
      campaignConfig,
      now,
    });

    assert.equal(res.rawCatalogSubtotal, 2450);
    assert.equal(res.campaignSavings, 490);
    assert.equal(res.subtotal, 1960);
    assert.equal(res.couponDiscount, 196); // %10 MIRA10
    assert.equal(res.discountedSubtotal, 1764);
    assert.equal(res.isFreeShipping, true); // 1764 >= 1500
    assert.equal(res.shippingFee, 0);
    assert.equal(res.cashOnDeliveryFee, 30);
    assert.equal(res.total, 1794);
  });

  it("İndirim kodu sonrası tutar 1.500 TL'nin altına düşerse kargo ücretini ekler", () => {
    const res = calculateCartTotals({
      items: [
        {
          productId: "prd-08",
          slug: "ceyda-drapeli-ipeksi-saten-bluz",
          name: "Ceyda Saten Bluz",
          color: "Fildişi",
          size: "M",
          sku: "MRA-GML-08-FIL-M",
          quantity: 1,
          price: 1550,
          image: "/test.jpg",
        },
      ],
      couponCode: "MIRA10", // 1550 - 155 = 1395 (< 1500)
      paymentMethod: "kart",
      shippingConfig,
      paymentConfig,
      campaignConfig,
      now,
    });

    assert.equal(res.discountedSubtotal, 1395);
    assert.equal(res.isFreeShipping, false);
    assert.equal(res.shippingFee, 89);
    assert.equal(res.cashOnDeliveryFee, 0);
    assert.equal(res.total, 1484);
  });
});

describe("Türkçe Karakter Duyarsız Arama Normalizasyonu", () => {
  it("'gomlek' sorgusunu 'Gömlek' ve 'Işıltı' sorgusunu 'isilti' ile eşleştirir", () => {
    assert.equal(normalizeTurkish("Gömlek & Bluz"), "gomlek & bluz");
    assert.equal(normalizeTurkish("gomlek"), "gomlek");
    assert.equal(normalizeTurkish("İPEK ŞAL"), "ipek sal");
    assert.equal(normalizeTurkish("Ğğ Şş İı Çç Öö Üü"), "gg ss ii cc oo uu");
  });
});

describe("Katalog Bütünlüğü ve Fiyat Etiketi Yönetmeliği Denetimi (36 Ürün)", () => {
  const activeCampaign = {
    active: true,
    endsAt: "2026-12-31T23:59:59+03:00",
  };
  const now = new Date("2026-10-23T12:00:00+03:00");

  it("Tüm 36 üründe üstü çizili fiyat varsa indirim yüzdesi rozeti gerçek oranla birebir tutar", () => {
    for (const product of products) {
      const pricing = getProductPricing(product, activeCampaign, now);
      if (pricing.strikethroughPrice !== undefined) {
        const expectedPct = Math.round(
          ((pricing.strikethroughPrice - pricing.finalPrice) / pricing.strikethroughPrice) * 100
        );
        assert.equal(
          pricing.campaignPercent,
          expectedPct,
          `${product.id} (${product.name}) indirim oranı uyuşmuyor`
        );
      } else {
        assert.equal(
          pricing.campaignPercent,
          undefined,
          `${product.id} (${product.name}) üstü çizili fiyat yokken indirim rozeti gösterilmemeli`
        );
      }
    }
  });

  it("Kategori ve ürün metinlerinde Kiril alfabesi karakteri bulunmaz", () => {
    const cyrillicRegex = /[\u0400-\u04FF]/;
    assert.equal(cyrillicRegex.test( JSON.stringify(CATEGORY_INFO)), false);
    assert.equal(cyrillicRegex.test(JSON.stringify(products)), false);
  });
});
