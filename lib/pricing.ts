import { site } from "@/site.config";
import { getProductPricing } from "./utils";
import type { ProductSize } from "@/content/products";

export type PaymentMethodType =
  | "kart"
  | "kapida-odeme"
  | "havale-eft"
  | "whatsapp";

export interface CouponDefinition {
  code: string;
  discountPercent: number;
  minOrderAmount?: number;
  active: boolean;
  description: string;
}

export const DEFAULT_COUPONS: CouponDefinition[] = [
  {
    code: "MIRA10",
    discountPercent: 10,
    minOrderAmount: 0,
    active: true,
    description: "Sepette %10 tanışma indirimi",
  },
  {
    code: "ADANA15",
    discountPercent: 15,
    minOrderAmount: 2500,
    active: true,
    description: "2.500 TL ve üzeri alışverişlerde %15 indirim",
  },
];

export interface CartPricingItem {
  productId: string;
  slug: string;
  name: string;
  color: string;
  size: ProductSize;
  sku: string;
  quantity: number;
  price: number;
  campaignPercent?: number;
  previousPrice30dLowest?: number;
  image: string;
}

export interface CartTotalsInput {
  items: CartPricingItem[];
  couponCode?: string | null;
  paymentMethod?: PaymentMethodType;
  shippingConfig?: {
    freeOver: number;
    fee: number;
  };
  paymentConfig?: {
    cashOnDelivery: { enabled: boolean; fee: number };
  };
  campaignConfig?: {
    active: boolean;
    endsAt: string;
  };
  availableCoupons?: CouponDefinition[];
  now?: Date;
}

export interface CartTotalsResult {
  itemCount: number;
  rawCatalogSubtotal: number;
  campaignSavings: number;
  subtotal: number; // Kampanyalı ürün fiyatları üzerinden ara toplam
  appliedCoupon: CouponDefinition | null;
  couponError?: string;
  couponDiscount: number;
  discountedSubtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  isFreeShipping: boolean;
  cashOnDeliveryFee: number;
  total: number;
  kdvIncludedAmount: number; // %10 tekstil KDV dahil iç tutar bilgisi
}

export function calculateCartTotals(input: CartTotalsInput): CartTotalsResult {
  const {
    items,
    couponCode,
    paymentMethod,
    shippingConfig = site.shipping,
    paymentConfig = site.payment,
    campaignConfig = site.campaign,
    availableCoupons = DEFAULT_COUPONS,
    now = new Date(),
  } = input;

  let itemCount = 0;
  let rawCatalogSubtotal = 0;
  let subtotal = 0;

  for (const item of items) {
    if (item.quantity <= 0) continue;
    const pricing = getProductPricing(
      {
        price: item.price,
        campaignPercent: item.campaignPercent,
        previousPrice30dLowest: item.previousPrice30dLowest,
      },
      campaignConfig,
      now
    );
    itemCount += item.quantity;
    rawCatalogSubtotal += pricing.basePrice * item.quantity;
    subtotal += pricing.finalPrice * item.quantity;
  }

  const campaignSavings = Math.max(0, rawCatalogSubtotal - subtotal);

  // İndirim kodu kontrolü
  let appliedCoupon: CouponDefinition | null = null;
  let couponError: string | undefined;
  let couponDiscount = 0;

  const trimmedCode = couponCode?.trim().toUpperCase();
  if (trimmedCode && subtotal > 0) {
    const found = availableCoupons.find(
      (c) => c.code.toUpperCase() === trimmedCode && c.active
    );
    if (!found) {
      couponError = "Geçersiz veya süresi dolmuş indirim kodu.";
    } else if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      couponError = `${found.code} kodu en az ${found.minOrderAmount} TL tutarındaki sepetlerde geçerlidir.`;
    } else {
      appliedCoupon = found;
      couponDiscount = Math.round((subtotal * found.discountPercent) / 100);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);

  // Kargo hesaplaması
  const freeShippingThreshold = shippingConfig.freeOver;
  const isFreeShipping =
    itemCount === 0 || discountedSubtotal >= freeShippingThreshold;
  const shippingFee = itemCount === 0 ? 0 : isFreeShipping ? 0 : shippingConfig.fee;
  const freeShippingRemaining =
    itemCount === 0
      ? freeShippingThreshold
      : Math.max(0, freeShippingThreshold - discountedSubtotal);
  const freeShippingProgress =
    freeShippingThreshold <= 0
      ? 100
      : Math.min(100, Math.round((discountedSubtotal / freeShippingThreshold) * 100));

  // Kapıda ödeme hizmet bedeli
  const cashOnDeliveryFee =
    itemCount > 0 &&
    paymentMethod === "kapida-odeme" &&
    paymentConfig.cashOnDelivery.enabled
      ? paymentConfig.cashOnDelivery.fee
      : 0;

  const total = discountedSubtotal + shippingFee + cashOnDeliveryFee;
  // Tekstil ürünlerinde %10 KDV dahil iç tutar
  const kdvIncludedAmount = Math.round(total - total / 1.1);

  return {
    itemCount,
    rawCatalogSubtotal,
    campaignSavings,
    subtotal,
    appliedCoupon,
    couponError,
    couponDiscount,
    discountedSubtotal,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    isFreeShipping,
    cashOnDeliveryFee,
    total,
    kdvIncludedAmount,
  };
}
