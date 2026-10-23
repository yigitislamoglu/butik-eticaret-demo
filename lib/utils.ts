import { site } from "@/site.config";
import type { Product } from "@/content/products";

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  i: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  â: "a",
  Â: "a",
  î: "i",
  Î: "i",
  û: "u",
  Û: "u",
};

/**
 * Türkçe karakter duyarsız arama normalizasyonu ("gomlek" -> "gömlek" eşleşmesi için)
 */
export function normalizeTurkish(input: string): string {
  if (!input) return "";
  let out = "";
  for (const ch of input.trim()) {
    out += TURKISH_CHAR_MAP[ch] ?? ch.toLowerCase();
  }
  return out.replace(/\s+/g, " ");
}

/**
 * Fiyatları TL ve KDV dahil biçimde biçimlendirir (ör. 2.450 TL)
 */
export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  return `${ new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(rounded)} TL`;
}

/**
 * Kampanya bitiş tarihini kontrol eder; tarih geçmişse kampanya kendiliğinden kalkar.
 */
export function isCampaignActive(
  campaign: { active: boolean; endsAt: string } = site.campaign,
  now: Date = new Date()
): boolean {
  if (!campaign.active) return false;
  const endTimestamp = Date.parse(campaign.endsAt);
  if (Number.isNaN(endTimestamp)) return false;
  return now.getTime() <= endTimestamp;
}

export interface ProductPricingResult {
  basePrice: number;
  finalPrice: number;
  hasCampaign: boolean;
  campaignPercent?: number;
  /**
   * Fiyat Etiketi Yönetmeliği kuralı:
   * Üstü çizili eski fiyat YALNIZ `previousPrice30dLowest` doluysa ve indirimli fiyattan yüksekse gösterilir.
   */
  strikethroughPrice?: number;
}

export function getProductPricing(
  product: Pick<Product, "price" | "campaignPercent" | "previousPrice30dLowest">,
  campaignConfig: { active: boolean; endsAt: string } = site.campaign,
  now: Date = new Date()
): ProductPricingResult {
  const active = isCampaignActive(campaignConfig, now);
  const percent = active && product.campaignPercent && product.campaignPercent > 0 ? product.campaignPercent : 0;

  const finalPrice =
    percent > 0 ? Math.round(product.price * (1 - percent / 100)) : product.price;

  const strikethroughPrice =
    percent > 0 &&
    typeof product.previousPrice30dLowest === "number" &&
    product.previousPrice30dLowest > finalPrice
      ? product.previousPrice30dLowest
      : undefined;

  return {
    basePrice: product.price,
    finalPrice,
    hasCampaign: percent > 0,
    campaignPercent: percent > 0 ? percent : undefined,
    strikethroughPrice,
  };
}

export function buildWhatsAppUrl(phoneOrText: string, maybeText?: string): string {
  const phone = maybeText !== undefined ? phoneOrText : site.contact.whatsapp;
  const text = maybeText !== undefined ? maybeText : phoneOrText;
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function formatDateTR(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
