import { products as baseProducts, type Product } from "@/content/products";
import { site } from "@/site.config";
import { DEFAULT_COUPONS, type CouponDefinition } from "@/lib/pricing";
import type {
  CampaignStateOverride,
  OrderRecord,
  OrderStatus,
  RestockNotificationRequest,
  ReturnRequestRecord,
  StoreRepository,
} from "./types";

const STORAGE_KEYS = {
  STOCK_OVERRIDES: "mira_demo_stock_v1",
  ORDERS: "mira_demo_orders_v1",
  CAMPAIGN: "mira_demo_campaign_v1",
  COUPONS: "mira_demo_coupons_v1",
  RETURNS: "mira_demo_returns_v1",
  RESTOCK: "mira_demo_restock_v1",
} as const;

export const STORE_UPDATED_EVENT = "mira-store-updated";

function notifyStoreUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT));
  }
}

const SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: "ord-sample-1",
    orderNumber: "MRA-2026-1042",
    createdAt: "2026-10-23T11:20:00+03:00",
    status: "Hazırlanıyor",
    statusHistory: [
      { status: "Alındı", timestamp: "2026-10-23T11:20:00+03:00", note: "Siparişiniz başarıyla oluşturuldu." },
      { status: "Hazırlanıyor", timestamp: "2026-10-23T13:05:00+03:00", note: "Ürünler kalite kontrol ve ütü aşamasında." },
    ],
    customer: {
      fullName: "Ayşe Yılmaz",
      phone: "0532 111 22 33",
      email: "ayse.ornek@ornek.com",
      city: "Adana",
      district: "Çukurova",
      addressLine: "Güzelyalı Mah. Turgut Özal Bulvarı No: 48 D: 7",
      postalCode: "01170",
      marketingConsent: false,
    },
    items: [
      {
        productId: "prd-01",
        slug: "alara-kusakli-ham-keten-midi-elbise",
        name: "Alara Kuşaklı Ham Keten Midi Elbise",
        color: "Kum Beji",
        size: "S",
        sku: "MRA-ELB-01-KUM-S",
        quantity: 1,
        price: 2450,
        campaignPercent: 20,
        previousPrice30dLowest: 2290,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      },
    ],
    paymentMethod: "kart",
    paymentStatus: "Ödendi (Test)",
    subtotal: 1960,
    couponDiscount: 0,
    shippingFee: 0,
    cashOnDeliveryFee: 0,
    total: 1960,
    carrier: site.shipping.carrier,
    contractsAcceptedAt: "2026-10-23T11:19:50+03:00",
  },
  {
    id: "ord-sample-2",
    orderNumber: "MRA-2026-1038",
    createdAt: "2026-10-21T15:40:00+03:00",
    status: "Kargoda",
    statusHistory: [
      { status: "Alındı", timestamp: "2026-10-21T15:40:00+03:00" },
      { status: "Hazırlanıyor", timestamp: "2026-10-21T17:10:00+03:00" },
      { status: "Kargoda", timestamp: "2026-10-22T10:15:00+03:00", note: "Kargo takip no: TR88492014" },
    ],
    customer: {
      fullName: "Melis Demir",
      phone: "0544 222 33 44",
      email: "melis.ornek@ornek.com",
      city: "İstanbul",
      district: "Kadıköy",
      addressLine: "Moda Cad. Şair Nefi Sok. No: 14 D: 3",
      postalCode: "34710",
      marketingConsent: false,
    },
    items: [
      {
        productId: "prd-07",
        slug: "bade-oversize-saf-keten-gomlek",
        name: "Bade Oversize Saf Keten Gömlek",
        color: "Doğal Keten",
        size: "M",
        sku: "MRA-GML-07-DOG-M",
        quantity: 1,
        price: 1650,
        campaignPercent: 20,
        previousPrice30dLowest: 1550,
        image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
      },
      {
        productId: "prd-13",
        slug: "nil-yuksek-bel-keten-palazzo-pantolon",
        name: "Nil Yüksek Bel Çift Pileli Keten Palazzo Pantolon",
        color: "Doğal Keten",
        size: "M",
        sku: "MRA-PNT-13-DOG-M",
        quantity: 1,
        price: 1950,
        campaignPercent: 20,
        previousPrice30dLowest: 1850,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      },
    ],
    paymentMethod: "kapida-odeme",
    paymentStatus: "Kapıda Ödenecek",
    couponCode: "MIRA10",
    subtotal: 2880,
    couponDiscount: 288,
    shippingFee: 0,
    cashOnDeliveryFee: 30,
    total: 2622,
    carrier: site.shipping.carrier,
    trackingCode: "TR88492014",
    contractsAcceptedAt: "2026-10-21T15:39:40+03:00",
  },
  {
    id: "ord-sample-3",
    orderNumber: "MRA-2026-1029",
    createdAt: "2026-10-18T14:10:00+03:00",
    status: "Teslim edildi",
    statusHistory: [
      { status: "Alındı", timestamp: "2026-10-18T14:10:00+03:00" },
      { status: "Hazırlanıyor", timestamp: "2026-10-18T16:30:00+03:00" },
      { status: "Kargoda", timestamp: "2026-10-19T09:45:00+03:00" },
      { status: "Teslim edildi", timestamp: "2026-10-20T13:20:00+03:00", note: "Alıcıya teslim edildi." },
    ],
    customer: {
      fullName: "Burcu Kaya",
      phone: "0505 333 44 55",
      email: "burcu.ornek@ornek.com",
      city: "Ankara",
      district: "Çankaya",
      addressLine: "Tunalı Hilmi Cad. Bülten Sok. No: 22 D: 9",
      postalCode: "06680",
      marketingConsent: false,
    },
    items: [
      {
        productId: "prd-25",
        slug: "pera-kruvaze-kusakli-uzun-trenckot",
        name: "Pera Kruvaze Kuşaklı Su İtici Uzun Trençkot",
        color: "Taş Beji",
        size: "S",
        sku: "MRA-DIS-25-TAS-S",
        quantity: 1,
        price: 3650,
        campaignPercent: 20,
        previousPrice30dLowest: 3490,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      },
    ],
    paymentMethod: "havale-eft",
    paymentStatus: "Ödendi (Test)",
    subtotal: 2920,
    couponDiscount: 0,
    shippingFee: 0,
    cashOnDeliveryFee: 0,
    total: 2920,
    carrier: site.shipping.carrier,
    trackingCode: "TR88410293",
    contractsAcceptedAt: "2026-10-18T14:09:50+03:00",
  },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notifyStoreUpdate();
  } catch {
    // localStorage quota or private mode
  }
}

function cleanPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-10); // Son 10 hane (5XX XXX XX XX) ile esnek eşleşme
}

export class BrowserStoreRepository implements StoreRepository {
  getProducts(): Product[] {
    const overrides = readJson<Record<string, number>>(STORAGE_KEYS.STOCK_OVERRIDES, {});
    if (Object.keys(overrides).length === 0) {
      return baseProducts;
    }
    return baseProducts.map((product) => ({
      ...product,
      variants: product.variants.map((v) =>
        typeof overrides[v.sku] === "number" ? { ...v, stock: overrides[v.sku] } : v
      ),
    }));
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  }

  updateVariantStock(sku: string, newStock: number): void {
    const overrides = readJson<Record<string, number>>(STORAGE_KEYS.STOCK_OVERRIDES, {});
    overrides[sku] = Math.max(0, Math.floor(newStock));
    writeJson(STORAGE_KEYS.STOCK_OVERRIDES, overrides);
  }

  decrementStockForOrder(items: Array<{ sku: string; quantity: number }>): void {
    const currentProducts = this.getProducts();
    const overrides = readJson<Record<string, number>>(STORAGE_KEYS.STOCK_OVERRIDES, {});

    for (const item of items) {
      for (const p of currentProducts) {
        const variant = p.variants.find((v) => v.sku === item.sku);
        if (variant) {
          overrides[item.sku] = Math.max(0, variant.stock - item.quantity);
        }
      }
    }
    writeJson(STORAGE_KEYS.STOCK_OVERRIDES, overrides);
  }

  getOrders(): OrderRecord[] {
    const stored = readJson<OrderRecord[] | null>(STORAGE_KEYS.ORDERS, null);
    if (!stored) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_ORDERS));
      }
      return SAMPLE_ORDERS;
    }
    return stored;
  }

  getOrderByNumber(orderNumber: string): OrderRecord | undefined {
    const normalized = orderNumber.trim().toUpperCase();
    return this.getOrders().find((o) => o.orderNumber.toUpperCase() === normalized);
  }

  findOrderByNumberAndPhone(orderNumber: string, phone: string): OrderRecord | undefined {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return undefined;
    const targetPhone = cleanPhoneDigits(phone);
    if (!targetPhone) return order;
    return cleanPhoneDigits(order.customer.phone) === targetPhone ? order : undefined;
  }

  createOrder(
    orderInput: Omit<OrderRecord, "id" | "orderNumber" | "createdAt" | "status" | "statusHistory">
  ): OrderRecord {
    const orders = this.getOrders();
    const nowIso = new Date().toISOString();
    const randomSuffix = Math.floor(2000 + Math.random() * 7999);
    const orderNumber = `MRA-2026-${randomSuffix}`;

    const newOrder: OrderRecord = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: nowIso,
      status: "Alındı",
      statusHistory: [
        {
          status: "Alındı",
          timestamp: nowIso,
          note: "Siparişiniz alındı ve sıraya eklendi.",
        },
      ],
    };

    this.decrementStockForOrder(
      orderInput.items.map((i) => ({ sku: i.sku, quantity: i.quantity }))
    );

    const updated = [newOrder, ...orders];
    writeJson(STORAGE_KEYS.ORDERS, updated);
    return newOrder;
  }

  updateOrderStatus(
    orderNumber: string,
    status: OrderStatus,
    note?: string
  ): OrderRecord | undefined {
    const orders = this.getOrders();
    const idx = orders.findIndex(
      (o) => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase()
    );
    if (idx === -1) return undefined;

    const nowIso = new Date().toISOString();
    const existing = orders[idx];
    const trackingCode =
      status === "Kargoda" && !existing.trackingCode
        ? `TR${Math.floor(10000000 + Math.random() * 89999999)}`
        : existing.trackingCode;

    const defaultNote =
      status === "Hazırlanıyor"
        ? "Ürünleriniz özenle paketleniyor."
        : status === "Kargoda"
          ? `${site.shipping.carrier} ile kargoya verildi. Takip No: ${trackingCode}`
          : status === "Teslim edildi"
            ? "Sipariş alıcıya teslim edildi."
            : "Sipariş durumu güncellendi.";

    const updatedOrder: OrderRecord = {
      ...existing,
      status,
      trackingCode,
      statusHistory: [
        ...existing.statusHistory.filter((h) => h.status !== status),
        {
          status,
          timestamp: nowIso,
          note: note ?? defaultNote,
        },
      ],
    };

    const nextOrders = [...orders];
    nextOrders[idx] = updatedOrder;
    writeJson(STORAGE_KEYS.ORDERS, nextOrders);
    return updatedOrder;
  }

  getCampaign(): CampaignStateOverride {
    return readJson<CampaignStateOverride>(STORAGE_KEYS.CAMPAIGN, {
      active: site.campaign.active,
      label: site.campaign.label,
      endsAt: site.campaign.endsAt,
    });
  }

  updateCampaign(campaign: Partial<CampaignStateOverride>): CampaignStateOverride {
    const current = this.getCampaign();
    const next: CampaignStateOverride = {
      ...current,
      ...campaign,
    };
    writeJson(STORAGE_KEYS.CAMPAIGN, next);
    return next;
  }

  getCoupons(): CouponDefinition[] {
    return readJson<CouponDefinition[]>(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
  }

  upsertCoupon(coupon: CouponDefinition): CouponDefinition[] {
    const coupons = this.getCoupons();
    const code = coupon.code.trim().toUpperCase();
    const normalized: CouponDefinition = { ...coupon, code };
    const existingIdx = coupons.findIndex((c) => c.code.toUpperCase() === code);
    const next =
      existingIdx >= 0
        ? coupons.map((c, i) => (i === existingIdx ? normalized : c))
        : [...coupons, normalized];
    writeJson(STORAGE_KEYS.COUPONS, next);
    return next;
  }

  toggleCoupon(code: string, active: boolean): CouponDefinition[] {
    const coupons = this.getCoupons().map((c) =>
      c.code.toUpperCase() === code.toUpperCase() ? { ...c, active } : c
    );
    writeJson(STORAGE_KEYS.COUPONS, coupons);
    return coupons;
  }

  deleteCoupon(code: string): CouponDefinition[] {
    const coupons = this.getCoupons().filter(
      (c) => c.code.toUpperCase() !== code.toUpperCase()
    );
    writeJson(STORAGE_KEYS.COUPONS, coupons);
    return coupons;
  }

  getReturnRequests(): ReturnRequestRecord[] {
    return readJson<ReturnRequestRecord[]>(STORAGE_KEYS.RETURNS, []);
  }

  createReturnRequest(
    req: Omit<ReturnRequestRecord, "id" | "returnCode" | "createdAt" | "status">
  ): ReturnRequestRecord {
    const current = this.getReturnRequests();
    const record: ReturnRequestRecord = {
      ...req,
      id: `ret-${Date.now()}`,
      returnCode: `IADE-MRA-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toISOString(),
      status: "Kargo Bekleniyor",
    };
    writeJson(STORAGE_KEYS.RETURNS, [record, ...current]);
    return record;
  }

  getRestockRequests(): RestockNotificationRequest[] {
    return readJson<RestockNotificationRequest[]>(STORAGE_KEYS.RESTOCK, []);
  }

  createRestockRequest(
    req: Omit<RestockNotificationRequest, "id" | "createdAt">
  ): RestockNotificationRequest {
    const current = this.getRestockRequests();
    const record: RestockNotificationRequest = {
      ...req,
      id: `rst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    writeJson(STORAGE_KEYS.RESTOCK, [record, ...current]);
    return record;
  }

  resetDemoData(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
    window.localStorage.removeItem("mira_cart_v1");
    window.localStorage.removeItem("mira_favorites_v1");
    window.localStorage.removeItem("mira_recently_viewed_v1");
    notifyStoreUpdate();
  }
}
