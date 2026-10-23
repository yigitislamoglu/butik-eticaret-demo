import type { Product, ProductSize } from "@/content/products";
import type { CartPricingItem, CouponDefinition, PaymentMethodType } from "@/lib/pricing";

export type OrderStatus =
  | "Alındı"
  | "Hazırlanıyor"
  | "Kargoda"
  | "Teslim edildi";

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  addressLine: string;
  postalCode?: string;
  deliveryNote?: string;
  marketingConsent: boolean; // 6563 sayılı Kanun gereği ayrı ve varsayılan işaretsiz
}

export interface OrderRecord {
  id: string;
  orderNumber: string; // ör. MRA-2026-4821
  createdAt: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  customer: OrderCustomerInfo;
  items: CartPricingItem[];
  paymentMethod: PaymentMethodType;
  paymentStatus: "Ödendi (Test)" | "Tahsilat Bekleniyor" | "Kapıda Ödenecek";
  couponCode?: string;
  subtotal: number;
  couponDiscount: number;
  shippingFee: number;
  cashOnDeliveryFee: number;
  total: number;
  carrier: string;
  trackingCode?: string;
  contractsAcceptedAt: string;
}

export interface ReturnRequestRecord {
  id: string;
  returnCode: string; // ör. IADE-MRA-9042
  orderNumber: string;
  customerPhone: string;
  selectedSkus: string[];
  reason: string;
  explanation?: string;
  createdAt: string;
  status: "Kargo Bekleniyor" | "İnceleniyor" | "İade Tamamlandı";
}

export interface RestockNotificationRequest {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: ProductSize;
  contact: string;
  createdAt: string;
}

export interface CampaignStateOverride {
  active: boolean;
  label: string;
  endsAt: string;
}

/**
 * Tekil veri katmanı arayüzü (`lib/store/`).
 * Demoda tarayıcı (`localStorage`) uygulaması çalışır; gerçek mağazada aynı arayüz
 * Cloudflare D1 veya PostgreSQL üzerinde uygulanabilir.
 */
export interface StoreRepository {
  // Ürünler ve stok
  getProducts(): Product[];
  getProductBySlug(slug: string): Product | undefined;
  updateVariantStock(sku: string, newStock: number): void;
  decrementStockForOrder(items: Array<{ sku: string; quantity: number }>): void;

  // Siparişler
  getOrders(): OrderRecord[];
  getOrderByNumber(orderNumber: string): OrderRecord | undefined;
  findOrderByNumberAndPhone(orderNumber: string, phone: string): OrderRecord | undefined;
  createOrder(
    order: Omit<OrderRecord, "id" | "orderNumber" | "createdAt" | "status" | "statusHistory">
  ): OrderRecord;
  updateOrderStatus(orderNumber: string, status: OrderStatus, note?: string): OrderRecord | undefined;

  // Kampanya ve İndirim Kodları
  getCampaign(): CampaignStateOverride;
  updateCampaign(campaign: Partial<CampaignStateOverride>): CampaignStateOverride;
  getCoupons(): CouponDefinition[];
  upsertCoupon(coupon: CouponDefinition): CouponDefinition[];
  toggleCoupon(code: string, active: boolean): CouponDefinition[];
  deleteCoupon(code: string): CouponDefinition[];

  // İade talepleri ve stok bildirimleri
  getReturnRequests(): ReturnRequestRecord[];
  createReturnRequest(
    req: Omit<ReturnRequestRecord, "id" | "returnCode" | "createdAt" | "status">
  ): ReturnRequestRecord;
  getRestockRequests(): RestockNotificationRequest[];
  createRestockRequest(
    req: Omit<RestockNotificationRequest, "id" | "createdAt">
  ): RestockNotificationRequest;

  // Demo sıfırlama
  resetDemoData(): void;
}
