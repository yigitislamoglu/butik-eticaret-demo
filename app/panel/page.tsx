"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  Tag,
  BarChart3,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Lock,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import {
  store,
  STORE_UPDATED_EVENT,
  type OrderRecord,
  type OrderStatus,
  type ReturnRequestRecord,
  type RestockNotificationRequest,
} from "@/lib/store";
import { formatPrice, formatDateTR } from "@/lib/utils";
import type { CouponDefinition } from "@/lib/pricing";

const ORDER_STATUSES: OrderStatus[] = [
  "Alındı",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim edildi",
];

type PanelTab = "orders" | "inventory" | "campaigns" | "summary";

export default function AdminPanelPage() {
  const {
    products,
    campaign,
    coupons,
    resetDemo,
    refreshStore,
  } = useShop();

  // Ortam değişkeninden okunan opsiyonel demo PIN'i (Kaynak kodda sabit parola bulunmaz)
  const requiredPin = process.env.NEXT_PUBLIC_DEMO_PANEL_PIN || "";
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(!requiredPin);
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<PanelTab>("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequestRecord[]>(
    []
  );
  const [restockRequests, setRestockRequests] = useState<
    RestockNotificationRequest[]
  >([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stok arama filtresi
  const [productQuery, setProductQuery] = useState("");

  // Kampanya düzenleme state
  const [campaignLabel, setCampaignLabel] = useState(campaign.label);
  const [campaignEndsAt, setCampaignEndsAt] = useState(
    campaign.endsAt.slice(0, 10)
  );

  // Yeni kupon ekleme state
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponRate, setNewCouponRate] = useState("15");
  const [newCouponDesc, setNewCouponDesc] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const syncPanelData = () => {
    setOrders(store.getOrders());
    setReturnRequests(store.getReturnRequests());
    setRestockRequests(store.getRestockRequests());
    const camp = store.getCampaign();
    setCampaignLabel(camp.label);
    setCampaignEndsAt(camp.endsAt.slice(0, 10));
  };

  useEffect(() => {
    syncPanelData();
    const handleStoreUpdate = () => {
      syncPanelData();
    };
    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
  }, []);

  const handleStatusChange = (orderNumber: string, newStatus: OrderStatus) => {
    store.updateOrderStatus(orderNumber, newStatus);
    syncPanelData();
    showToast(
      `Sipariş #${orderNumber} durumu "${newStatus}" olarak güncellendi. Sipariş Takip sayfasına anında yansıdı.`
    );
  };

  const handleStockChange = (sku: string, newStock: number) => {
    const clamped = Math.max(0, Math.min(999, newStock));
    store.updateVariantStock(sku, clamped);
    refreshStore();
    showToast(
      clamped === 0
        ? `${sku} stoğu 0 yapıldı — vitrinde "Tükendi" olarak işaretlendi.`
        : `${sku} stoğu ${clamped} adet olarak güncellendi.`
    );
  };

  const handleToggleCampaign = (active: boolean) => {
    store.updateCampaign({ active });
    refreshStore();
    showToast(
      active
        ? "Sezon kampanyası aktif edildi."
        : "Kampanya kapatıldı; vitrin fiyatları indirimsiz liste fiyatına döndü."
    );
  };

  const handleSaveCampaignDetails = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCampaign({
      label: campaignLabel.trim() || "Sezon Kampanyası",
      endsAt: `${campaignEndsAt}T23:59:59+03:00`,
    });
    refreshStore();
    showToast("Kampanya başlığı ve bitiş tarihi güncellendi.");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase();
    const percentNum = Number(newCouponRate);
    if (!cleanCode || isNaN(percentNum) || percentNum <= 0 || percentNum >= 100)
      return;

    const coupon: CouponDefinition = {
      code: cleanCode,
      discountPercent: percentNum,
      description:
        newCouponDesc.trim() || `%${Math.round(percentNum)} indirim kuponu`,
      active: true,
    };
    store.upsertCoupon(coupon);
    refreshStore();
    setNewCouponCode("");
    setNewCouponDesc("");
    showToast(`"${cleanCode}" indirim kodu eklendi ve aktif edildi.`);
  };

  const handleResetDemo = () => {
    resetDemo();
    syncPanelData();
    showToast("Tüm demo verileri (siparişler, stoklar ve kampanya) ilk haline sıfırlandı.");
  };

  const filteredProducts = useMemo(() => {
    if (!productQuery.trim()) return products;
    const q = productQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q))
    );
  }, [products, productQuery]);

  // Satış Özeti Metrikleri
  const summaryStats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const todayOrders = orders.slice(0, 2);
    const todayRevenue = todayOrders.reduce((acc, o) => acc + o.total, 0);
    const lowStockVariants = products.flatMap((p) =>
      p.variants
        .filter((v) => v.stock <= 2)
        .map((v) => ({ productName: p.name, slug: p.slug, ...v }))
    );

    const bestSellers = products
      .filter((p) => p.tags.includes("cok-satan"))
      .slice(0, 5);

    return {
      totalRevenue,
      todayRevenue,
      orderCount: orders.length,
      averageBasket: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      lowStockVariants,
      bestSellers,
    };
  }, [orders, products]);

  // Opsiyonel PIN kilidi ekranı (yalnızca NEXT_PUBLIC_DEMO_PANEL_PIN tanımlıysa gösterilir)
  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-sm border border-[#D8D3CA] bg-white p-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#1F1F1F]">
            <Lock className="h-5 w-5 text-[#B88A5A]" />
            <h1 className="font-serif text-2xl">Butik Yönetim Paneli</h1>
          </div>
          <p className="mt-2 text-xs text-[#6B645C]">
            Bu ortamda demo paneli PIN korumalıdır. Ortam değişkeninde
            tanımlanan PIN kodunu girin:
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput === requiredPin) {
                setIsUnlocked(true);
                setPinError(false);
              } else {
                setPinError(true);
              }
            }}
            className="mt-5 space-y-4"
          >
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Demo PIN Kodu"
              aria-label="Demo PIN Kodu"
              className="w-full rounded-sm border border-[#D8D3CA] bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm"
            />
            {pinError && (
              <p className="text-xs text-[#9E3B32]">
                Girdiğiniz PIN kodu eşleşmedi.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-sm bg-[#1F1F1F] py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Paneli Aç
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#18181B]">
      {/* Üst Yönetim Şeridi (Achromatic Ledger Direction) */}
      <div className="border-b border-[#DCD9D0] bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#B88A5A]/50 bg-[#F7F3EE] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F]">
                <ShieldAlert className="h-3.5 w-3.5 text-[#B88A5A]" />
                Salt Okunur / Tarayıcı İçi Demo Modu
              </span>
              <span className="font-mono text-xs text-[#6B645C]">
                EMY Digital • Butik Yönetim Önizlemesi
              </span>
            </div>
            <h1 className="mt-1.5 font-serif text-2xl sm:text-3xl text-[#18181B]">
              Mira Butik — Mağaza & Stok Yönetim Paneli
            </h1>
            <p className="mt-0.5 text-xs text-[#6B645C]">
              Sipariş durumlarını, beden bazlı stokları ve indirim kuponlarını
              buradan değiştirdiğinizde mağaza vitrini anında güncellenir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/siparis-takip"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-[#18181B] hover:border-[#18181B] transition-colors"
            >
              Sipariş Takip Sayfası
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/koleksiyon"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-[#18181B] hover:border-[#18181B] transition-colors"
            >
              Mağaza Vitrinini Gör
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#9E3B32]/40 bg-[#9E3B32]/10 px-4 py-2 text-xs font-semibold text-[#9E3B32] hover:bg-[#9E3B32] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Demoyu Sıfırla
            </button>
          </div>
        </div>

        {/* Sekme Navigasyonu */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Yönetim paneli sekmeleri"
            className="flex overflow-x-auto border-t border-[#ECEAE4] -mb-px space-x-2"
          >
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#6B645C] hover:text-[#18181B]"
              }`}
            >
              <Package className="h-4 w-4" />
              Siparişler ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "inventory"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#6B645C] hover:text-[#18181B]"
              }`}
            >
              <Layers className="h-4 w-4" />
              Ürünler ve Stok ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("campaigns")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "campaigns"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#6B645C] hover:text-[#18181B]"
              }`}
            >
              <Tag className="h-4 w-4" />
              Kampanya & İndirim Kodları ({coupons.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "summary"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#6B645C] hover:text-[#18181B]"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Satış Özeti & Talepler
            </button>
          </nav>
        </div>
      </div>

      {/* Canlı Geri Bildirim Bildirimi */}
      {toastMessage && (
        <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8">
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-sm border border-[#2E6B4E] bg-[#2E6B4E]/10 px-4 py-3 text-xs font-medium text-[#2E6B4E]"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ANA İÇERİK ALANI */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* SEKME 1: SİPARİŞLER */}
        {activeTab === "orders" && (
          <div className="rounded-sm border border-[#DCD9D0] bg-white">
            <div className="flex flex-col gap-2 border-b border-[#DCD9D0] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl text-[#18181B]">
                  Gelen Siparişler ve Kargo Durum Yönetimi
                </h2>
                <p className="text-xs text-[#6B645C]">
                  Bir siparişin durumunu değiştirdiğinizde{" "}
                  <Link href="/siparis-takip" className="underline text-[#18181B]">
                    /siparis-takip
                  </Link>{" "}
                  sayfasındaki zaman çizelgesi anında güncellenir.
                </p>
              </div>
              <span className="font-mono text-xs text-[#6B645C]">
                Toplam {orders.length} kayıt
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCD9D0] bg-[#FAF8F5] font-mono text-[11px] uppercase tracking-wider text-[#6B645C]">
                    <th className="py-3.5 px-4">Sipariş No / Tarih</th>
                    <th className="py-3.5 px-4">Müşteri & Şehir</th>
                    <th className="py-3.5 px-4">Ürünler</th>
                    <th className="py-3.5 px-4">Ödeme & Kargo</th>
                    <th className="py-3.5 px-4 text-right">Toplam</th>
                    <th className="py-3.5 px-4">Durum Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEAE4]">
                  {orders.map((ord) => (
                    <tr
                      key={ord.orderNumber}
                      className="hover:bg-[#FAF8F5]/70 transition-colors"
                    >
                      <td className="py-4 px-4 align-top">
                        <Link
                          href={`/siparis-takip?order=${ord.orderNumber}&phone=${encodeURIComponent(
                            ord.customer.phone
                          )}`}
                          className="font-mono text-sm font-semibold text-[#18181B] hover:text-[#B88A5A] underline"
                        >
                          #{ord.orderNumber}
                        </Link>
                        <span className="block mt-0.5 text-[11px] text-[#6B645C]">
                          {formatDateTR(ord.createdAt)}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <p className="font-medium text-[#18181B] text-sm">
                          {ord.customer.fullName}
                        </p>
                        <p className="text-[#6B645C]">
                          {ord.customer.phone} • {ord.customer.district}/
                          {ord.customer.city}
                        </p>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <ul className="space-y-1">
                          {ord.items.map((item) => (
                            <li key={item.sku} className="text-[#18181B]">
                              <span className="font-medium">{item.name}</span>{" "}
                              <span className="text-[#6B645C]">
                                ({item.color}/{item.size} ×{item.quantity})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="inline-block rounded-sm bg-[#EFE8DF] px-2 py-0.5 text-[11px] font-medium text-[#18181B]">
                          {ord.paymentStatus}
                        </span>
                        <span className="block mt-1 text-[#6B645C]">
                          {ord.carrier}
                          {ord.couponCode ? ` • Kupon: ${ord.couponCode}` : ""}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-right font-mono text-sm font-semibold text-[#18181B]">
                        {formatPrice(ord.total)}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {ORDER_STATUSES.map((st) => {
                            const active = ord.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(ord.orderNumber, st)
                                }
                                className={`rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                                  active
                                    ? "border-[#18181B] bg-[#18181B] text-white"
                                    : "border-[#DCD9D0] bg-white text-[#18181B] hover:border-[#18181B]"
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 2: ÜRÜNLER VE STOK */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-sm border border-[#DCD9D0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl text-[#18181B]">
                  Ürünler ve Beden Bazlı Stok Yönetimi
                </h2>
                <p className="text-xs text-[#6B645C]">
                  Bir varyantın (renk × beden) stoğunu{" "}
                  <code className="font-mono font-semibold text-[#9E3B32]">0</code>{" "}
                  yaptığınızda ürün kartında ve detay sayfasında anında{" "}
                  <strong>&ldquo;Tükendi&rdquo;</strong> olarak işaretlenir.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B645C]" />
                <input
                  type="search"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Ürün adı, kategori veya SKU ara..."
                  aria-label="Ürün veya SKU ara"
                  className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs text-[#18181B] focus:border-[#18181B] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredProducts.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stock,
                  0
                );
                const firstImg =
                  Object.values(product.images)[0]?.[0] ?? "";

                return (
                  <div
                    key={product.id}
                    className="rounded-sm border border-[#DCD9D0] bg-white p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#ECEAE4] pb-4">
                      <div className="flex items-center gap-3.5">
                        {firstImg && (
                          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-[#EFE8DF]">
                            <Image
                              src={firstImg}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/urun/${product.slug}`}
                              className="font-medium text-sm text-[#18181B] hover:text-[#B88A5A] underline"
                            >
                              {product.name}
                            </Link>
                            <span className="rounded-sm bg-[#F4F3EF] px-2 py-0.5 text-[11px] text-[#6B645C]">
                              {product.category}
                            </span>
                          </div>
                          <p className="mt-0.5 font-mono text-xs text-[#6B645C]">
                            Liste Fiyatı: {formatPrice(product.price)} • Toplam
                            Stok:{" "}
                            <strong
                              className={
                                totalStock === 0
                                  ? "text-[#9E3B32]"
                                  : "text-[#18181B]"
                              }
                            >
                              {totalStock} adet
                            </strong>
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/urun/${product.slug}`}
                        className="self-start sm:self-center inline-flex items-center gap-1 text-xs font-medium text-[#6B645C] hover:text-[#18181B]"
                      >
                        Vitrinde Gör
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* Varyant Stok Izgarası */}
                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                      {product.variants.map((variant) => {
                        const isZero = variant.stock === 0;
                        const isLow = variant.stock > 0 && variant.stock <= 2;

                        return (
                          <div
                            key={variant.sku}
                            className={`flex items-center justify-between rounded-sm border p-2.5 text-xs ${
                              isZero
                                ? "border-[#9E3B32]/40 bg-[#9E3B32]/5"
                                : isLow
                                ? "border-[#B88A5A]/50 bg-[#F7F3EE]"
                                : "border-[#ECEAE4] bg-[#FAF8F5]"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="block font-medium text-[#18181B] truncate">
                                {variant.color} /{" "}
                                <strong>{variant.size}</strong>
                              </span>
                              <span className="block font-mono text-[10px] text-[#6B645C] truncate">
                                {variant.sku}
                              </span>
                              {isZero && (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#9E3B32]">
                                  Tükendi
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStockChange(variant.sku, 0)
                                }
                                title="Stoğu Sıfırla (Tükendi yap)"
                                className="rounded-sm border border-[#DCD9D0] bg-white px-1.5 py-1 font-mono text-[10px] text-[#9E3B32] hover:bg-[#9E3B32] hover:text-white transition-colors cursor-pointer"
                              >
                                0 Yap
                              </button>
                              <input
                                type="number"
                                min={0}
                                max={999}
                                aria-label={`${product.name} ${variant.color} ${variant.size} stok adedi`}
                                value={variant.stock}
                                onChange={(e) =>
                                  handleStockChange(
                                    variant.sku,
                                    parseInt(e.target.value || "0", 10)
                                  )
                                }
                                className="w-14 rounded-sm border border-[#DCD9D0] bg-white px-2 py-1 text-center font-mono text-xs font-semibold text-[#18181B]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEKME 3: KAMPANYA & İNDİRİM KODLARI */}
        {activeTab === "campaigns" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Üst Şerit Kampanya Yönetimi */}
            <div className="lg:col-span-6 rounded-sm border border-[#DCD9D0] bg-white p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-4">
                <div>
                  <h2 className="font-serif text-xl text-[#18181B]">
                    Üst Şerit Sezon Kampanyası
                  </h2>
                  <p className="text-xs text-[#6B645C]">
                    Kapattığınızda veya bitiş tarihi geçtiğinde üstü çizili
                    kampanya fiyatları otomatik kalkar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleCampaign(!campaign.active)}
                  className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    campaign.active
                      ? "bg-[#2E6B4E] text-white"
                      : "bg-[#DCD9D0] text-[#18181B]"
                  }`}
                >
                  {campaign.active ? "Aktif (Açık)" : "Pasif (Kapalı)"}
                </button>
              </div>

              <form onSubmit={handleSaveCampaignDetails} className="space-y-4">
                <div>
                  <label
                    htmlFor="camp-label"
                    className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                  >
                    Kampanya Duyuru Etiketi
                  </label>
                  <input
                    id="camp-label"
                    type="text"
                    value={campaignLabel}
                    onChange={(e) => setCampaignLabel(e.target.value)}
                    className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#18181B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="camp-date"
                    className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                  >
                    Kampanya Bitiş Tarihi
                  </label>
                  <input
                    id="camp-date"
                    type="date"
                    value={campaignEndsAt}
                    onChange={(e) => setCampaignEndsAt(e.target.value)}
                    className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm text-[#18181B]"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-sm bg-[#18181B] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#333333] cursor-pointer"
                >
                  Kampanya Bilgilerini Kaydet
                </button>
              </form>
            </div>

            {/* İndirim Kuponları (MIRA10 vb.) */}
            <div className="lg:col-span-6 rounded-sm border border-[#DCD9D0] bg-white p-6 space-y-6">
              <div className="border-b border-[#ECEAE4] pb-4">
                <h2 className="font-serif text-xl text-[#18181B]">
                  İndirim Kuponları Yönetimi
                </h2>
                <p className="text-xs text-[#6B645C]">
                  Sepet çekmecesinde ve sepet sayfasında geçerli olan kupon
                  kodları.
                </p>
              </div>

              <ul className="divide-y divide-[#ECEAE4] border border-[#ECEAE4] rounded-sm">
                {coupons.map((c) => (
                  <li
                    key={c.code}
                    className="flex items-center justify-between p-3.5 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#18181B]">
                          {c.code}
                        </span>
                        <span className="rounded-sm bg-[#F7F3EE] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#B88A5A]">
                          %{c.discountPercent} İndirim
                        </span>
                      </div>
                      <p className="mt-0.5 text-[#6B645C]">{c.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          store.toggleCoupon(c.code, !c.active);
                          refreshStore();
                          showToast(
                            `${c.code} kuponu ${
                              !c.active ? "aktif" : "pasif"
                            } yapıldı.`
                          );
                        }}
                        className={`rounded-sm px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                          c.active
                            ? "bg-[#2E6B4E]/15 text-[#2E6B4E]"
                            : "bg-[#ECEAE4] text-[#6B645C]"
                        }`}
                      >
                        {c.active ? "Aktif" : "Pasif"}
                      </button>
                      {c.code !== "MIRA10" && (
                        <button
                          type="button"
                          onClick={() => {
                            store.deleteCoupon(c.code);
                            refreshStore();
                            showToast(`${c.code} kuponu silindi.`);
                          }}
                          aria-label={`${c.code} kuponunu sil`}
                          className="p-1 text-[#9E3B32] hover:bg-[#9E3B32]/10 rounded-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Yeni Kupon Ekle */}
              <form
                onSubmit={handleAddCoupon}
                className="space-y-3 border-t border-[#ECEAE4] pt-4"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                  Yeni Kupon Kodu Ekle
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="new-coupon-code"
                      className="block text-[11px] text-[#6B645C] mb-1"
                    >
                      Kupon Kodu
                    </label>
                    <input
                      id="new-coupon-code"
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      placeholder="Örn: YAZ15"
                      className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3 py-2 font-mono text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-coupon-rate"
                      className="block text-[11px] text-[#6B645C] mb-1"
                    >
                      İndirim Oranı (%)
                    </label>
                    <input
                      id="new-coupon-rate"
                      type="number"
                      min={1}
                      max={90}
                      required
                      value={newCouponRate}
                      onChange={(e) => setNewCouponRate(e.target.value)}
                      className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3 py-2 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-coupon-desc"
                      className="block text-[11px] text-[#6B645C] mb-1"
                    >
                      Açıklama
                    </label>
                    <input
                      id="new-coupon-desc"
                      type="text"
                      value={newCouponDesc}
                      onChange={(e) => setNewCouponDesc(e.target.value)}
                      placeholder="Sezon indirimi"
                      className="w-full rounded-sm border border-[#DCD9D0] bg-[#FAF8F5] px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-[#18181B] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Kuponu Ekle
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SEKME 4: SATIŞ ÖZETİ & İADE / STOK TALEPLERİ */}
        {activeTab === "summary" && (
          <div className="space-y-8">
            {/* Sayısal Özet Kartları */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-sm border border-[#DCD9D0] bg-white p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6B645C]">
                  Bu Hafta Toplam Ciro
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-[#18181B]">
                  {formatPrice(summaryStats.totalRevenue)}
                </p>
                <span className="mt-1 block text-[11px] text-[#2E6B4E]">
                  {summaryStats.orderCount} onaylı sipariş üzerinden
                </span>
              </div>

              <div className="rounded-sm border border-[#DCD9D0] bg-white p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6B645C]">
                  Bugün Gelen Ciro
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-[#18181B]">
                  {formatPrice(summaryStats.todayRevenue)}
                </p>
                <span className="mt-1 block text-[11px] text-[#6B645C]">
                  Son 24 saatteki aktif siparişler
                </span>
              </div>

              <div className="rounded-sm border border-[#DCD9D0] bg-white p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6B645C]">
                  Ortalama Sepet Tutarı
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-[#18181B]">
                  {formatPrice(summaryStats.averageBasket)}
                </p>
                <span className="mt-1 block text-[11px] text-[#6B645C]">
                  Ücretsiz kargo barajı: 1.500 TL
                </span>
              </div>

              <div className="rounded-sm border border-[#DCD9D0] bg-white p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6B645C]">
                  Kritik / Tükenen Varyant
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-[#9E3B32]">
                  {summaryStats.lowStockVariants.length} Varyant
                </p>
                <span className="mt-1 block text-[11px] text-[#6B645C]">
                  Stoğu 2 veya altında olan bedenler
                </span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* En Çok Satan Ürünler */}
              <div className="lg:col-span-6 rounded-sm border border-[#DCD9D0] bg-white p-6">
                <h2 className="font-serif text-xl text-[#18181B] mb-4">
                  En Çok Satan Koleksiyon Parçaları
                </h2>
                <ul className="divide-y divide-[#ECEAE4]">
                  {summaryStats.bestSellers.map((prod, idx) => (
                    <li
                      key={prod.id}
                      className="flex items-center justify-between py-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#B88A5A]">
                          0{idx + 1}
                        </span>
                        <div>
                          <Link
                            href={`/urun/${prod.slug}`}
                            className="font-medium text-sm text-[#18181B] hover:underline"
                          >
                            {prod.name}
                          </Link>
                          <span className="block text-[#6B645C]">
                            {prod.category}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#18181B]">
                        {formatPrice(prod.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* İade Talepleri & Gelince Haber Ver Bildirimleri */}
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-sm border border-[#DCD9D0] bg-white p-6">
                  <h2 className="font-serif text-xl text-[#18181B] mb-3">
                    Gelen İade / Değişim Talepleri ({returnRequests.length})
                  </h2>
                  {returnRequests.length === 0 ? (
                    <p className="text-xs text-[#6B645C]">
                      Henüz oluşturulmuş bir iade talebi bulunmuyor.{" "}
                      <Link href="/iade-talebi" className="underline">
                        /iade-talebi
                      </Link>{" "}
                      sayfasından test edebilirsiniz.
                    </p>
                  ) : (
                    <ul className="divide-y divide-[#ECEAE4] text-xs">
                      {returnRequests.map((req) => (
                        <li key={req.id} className="py-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#18181B]">
                              {req.returnCode} (Sipariş #{req.orderNumber})
                            </span>
                            <span className="rounded-sm bg-[#F7F3EE] px-2 py-0.5 text-[11px] text-[#B88A5A]">
                              {req.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[#6B645C]">
                            Neden: {req.reason} • Ürün SKU:{" "}
                            {req.selectedSkus.join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-sm border border-[#DCD9D0] bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-4 w-4 text-[#B88A5A]" />
                    <h2 className="font-serif text-xl text-[#18181B]">
                      &ldquo;Gelince Haber Ver&rdquo; Talepleri (
                      {restockRequests.length})
                    </h2>
                  </div>
                  {restockRequests.length === 0 ? (
                    <p className="text-xs text-[#6B645C]">
                      Tükenen bir bedende müşterinin bıraktığı stok bildirim
                      talepleri burada listelenir.
                    </p>
                  ) : (
                    <ul className="divide-y divide-[#ECEAE4] text-xs">
                      {restockRequests.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between py-2.5"
                        >
                          <div>
                            <p className="font-medium text-[#18181B]">
                              {r.productName} ({r.color} / {r.size})
                            </p>
                            <p className="text-[#6B645C]">
                              İletişim: {r.contact}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] text-[#6B645C]">
                            {formatDateTR(r.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
