"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  Lock,
  FileText,
  Copy,
  Check,
  Package,
  ArrowRight,
} from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { site } from "@/site.config";
import { TURKEY_CITIES } from "@/lib/turkey-locations";
import {
  formatPrice,
  formatDateTR,
  buildWhatsAppUrl,
  getProductPricing,
} from "@/lib/utils";
import { store, type OrderRecord, type OrderStatus } from "@/lib/store";
import { createPayment, confirmPayment } from "@/lib/payment";
import type { PaymentMethodType } from "@/lib/pricing";

const ORDER_STATUS_STEPS: OrderStatus[] = [
  "Alındı",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim edildi",
];

export default function CheckoutPage() {
  const {
    cartItems,
    campaign,
    getTotals,
    couponCode,
    clearCart,
    refreshStore,
  } = useShop();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Adana");
  const [district, setDistrict] = useState("Seyhan");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>(
    site.shipping.carriers[0]
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("kart");

  // Yasal onaylar:
  // 1) Ön Bilgilendirme Formu & Mesafeli Satış Sözleşmesi (Zorunlu)
  const [contractsAccepted, setContractsAccepted] = useState(false);
  // 2) Pazarlama İletisi İzni - 6563 sayılı Kanun / İYS (Ayrı, varsayılan işaretsiz, zorunlu değil)
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Sözleşme önizleme sekmesi
  const [activeLegalTab, setActiveLegalTab] = useState<
    "on-bilgilendirme" | "mesafeli-satis"
  >("on-bilgilendirme");

  // Ödeme test modu durumu
  const [paymentSimulationState, setPaymentSimulationState] = useState<
    "idle" | "processing" | "succeeded" | "failed"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  // Form doğrulama ve tamamlanan sipariş
  const [formError, setFormError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [copiedIban, setCopiedIban] = useState(false);

  const totals = getTotals(paymentMethod);

  const pricedItems = useMemo(
    () =>
      cartItems.map((item) => {
        const p = getProductPricing(item, campaign);
        return {
          ...item,
          effectiveUnitPrice: p.finalPrice,
          originalUnitPrice: p.strikethroughPrice,
          lineTotal: p.finalPrice * item.quantity,
        };
      }),
    [cartItems, campaign]
  );

  const availableDistricts = useMemo(() => {
    const found = TURKEY_CITIES.find((c) => c.city === city);
    return found ? found.districts : ["Merkez"];
  }, [city]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const found = TURKEY_CITIES.find((c) => c.city === newCity);
    if (found && found.districts.length > 0) {
      setDistrict(found.districts[0]);
    } else {
      setDistrict("Merkez");
    }
  };

  // Demo hızlı doldurma (jüri / müşteri sunumu kolaylığı için)
  const fillSampleCustomer = () => {
    setFullName("Zeynep Karahan");
    setPhone("0500 000 00 00");
    setEmail("zeynep.ornek@ornek.com");
    setCity("İstanbul");
    setDistrict("Kadıköy");
    setAddressLine("Örnek Mah. Örnek Cad. No: 18 Daire: 4");
    setPostalCode("34710");
    setDeliveryNote("Güvenliğe bırakabilirsiniz.");
    setFormError(null);
  };

  // Kart Test Modu Simülasyonu ("Test ödemesini tamamla" / "Başarısız ödemeyi dene")
  const handleSimulateCardPayment = async (scenario: "success" | "failure") => {
    setPaymentSimulationState("processing");
    setPaymentMessage(null);

    const created = await createPayment({
      orderReference: `DRAFT-${Date.now()}`,
      amount: totals.total,
      currency: "TRY",
      method: "kart",
      customer: {
        fullName: fullName || "Misafir Müşteri",
        email: email || "misafir@ornek.com",
        phone: phone || "05000000000",
        city,
      },
      basketItems: pricedItems.map((item) => ({
        id: item.sku,
        name: item.name,
        category: item.slug,
        price: item.lineTotal,
      })),
    });

    const confirmation = await confirmPayment({
      paymentId: created.paymentId,
      scenario,
    });

    if (confirmation.success) {
      setPaymentSimulationState("succeeded");
      setTransactionRef(confirmation.transactionReference ?? null);
      setPaymentMessage(
        `Test ödemesi provizyonu onaylandı (Ref: ${confirmation.transactionReference}). Şimdi sözleşmeyi onaylayıp siparişi tamamlayabilirsiniz.`
      );
    } else {
      setPaymentSimulationState("failed");
      setTransactionRef(null);
      setPaymentMessage(
        confirmation.errorMessage ?? "Test ödemesi başarısız oldu."
      );
    }
  };

  const validateBeforeSubmit = (): boolean => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError("Lütfen adınızı ve soyadınızı eksiksiz girin.");
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError(
        "Lütfen geçerli bir telefon numarası girin (ör. 0500 000 00 00)."
      );
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError(
        "Sipariş bilgilendirmesi için geçerli bir e-posta adresi girin."
      );
      return false;
    }
    if (!addressLine.trim() || addressLine.trim().length < 10) {
      setFormError(
        "Lütfen açık teslimat adresinizi (mahalle, sokak, kapı no) girin."
      );
      return false;
    }
    if (paymentMethod === "kart" && paymentSimulationState === "failed") {
      setFormError(
        "Başarısız ödeme simülasyonu seçili. Siparişi tamamlamak için 'Test ödemesini tamamla' düğmesine tıklayın veya başka bir ödeme yöntemi seçin."
      );
      return false;
    }
    if (!contractsAccepted) {
      setFormError(
        "Siparişi tamamlamadan önce Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onay kutusunu işaretlemeniz gerekmektedir."
      );
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBeforeSubmit()) return;

    // Eğer kredi kartı seçiliyse ve henüz test butonu tıklanmadıysa otomatik başarılı test provizyonu çalıştır
    if (paymentMethod === "kart" && paymentSimulationState === "idle") {
      await handleSimulateCardPayment("success");
    }

    const paymentStatusMap: Record<
      PaymentMethodType,
      OrderRecord["paymentStatus"]
    > = {
      kart: "Ödendi (Test)",
      "kapida-odeme": "Kapıda Ödenecek",
      "havale-eft": "Tahsilat Bekleniyor",
      whatsapp: "Tahsilat Bekleniyor",
    };

    const createdOrder = store.createOrder({
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city,
        district,
        addressLine: addressLine.trim(),
        postalCode: postalCode.trim() || undefined,
        deliveryNote: deliveryNote.trim() || undefined,
        marketingConsent,
      },
      items: cartItems,
      paymentMethod,
      paymentStatus: paymentStatusMap[paymentMethod],
      couponCode: totals.appliedCoupon?.code,
      subtotal: totals.subtotal,
      couponDiscount: totals.couponDiscount,
      shippingFee: totals.shippingFee,
      cashOnDeliveryFee: totals.cashOnDeliveryFee,
      total: totals.total,
      carrier: selectedCarrier,
      contractsAcceptedAt: new Date().toISOString(),
    });

    // Stokları düşür
    store.decrementStockForOrder(
      cartItems.map((i) => ({ sku: i.sku, quantity: i.quantity }))
    );

    refreshStore();
    clearCart();
    setCompletedOrder(createdOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappOrderUrl = useMemo(() => {
    const lines = [
      `Merhaba ${site.name}, web sitenizden sipariş vermek istiyorum:`,
      "",
      ...pricedItems.map(
        (item) =>
          `• ${item.name} (${item.color} / ${item.size}) x${item.quantity} — ${formatPrice(
            item.lineTotal
          )}`
      ),
      "",
      `Toplam Tutar: ${formatPrice(totals.total)}`,
      fullName ? `Ad Soyad: ${fullName}` : "",
      phone ? `Telefon: ${phone}` : "",
      addressLine ? `Adres: ${addressLine}, ${district}/${city}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return buildWhatsAppUrl(lines);
  }, [pricedItems, totals, fullName, phone, addressLine, district, city]);

  const paymentMethodLabel: Record<PaymentMethodType, string> = {
    kart: "Kredi / Banka Kartı (Test Modu)",
    "kapida-odeme": `Kapıda Ödeme (+${formatPrice(
      site.payment.cashOnDelivery.fee
    )} hizmet bedeli)`,
    "havale-eft": "Havale / EFT",
    whatsapp: "WhatsApp'tan Sipariş",
  };

  // ADIM 5: SİPARİŞ ONAY EKRANI
  if (completedOrder) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col items-start gap-4 border-b border-[var(--color-border-subtle)] pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.14em] uppercase text-[#2E6B4E]">
                  5. Adım • Sipariş Onayı
                </span>
                <h1 className="mt-1 font-serif text-2xl sm:text-3xl text-[#1F1F1F]">
                  Siparişiniz Alındı, Teşekkür Ederiz!
                </h1>
                <p className="mt-1 text-sm text-[#6B645C]">
                  Sipariş özetiniz ve sözleşme kopyanız{" "}
                  <strong className="text-[#1F1F1F]">
                    {completedOrder.customer.email}
                  </strong>{" "}
                  adresine iletilmiştir.
                </p>
              </div>
            </div>
            <div className="rounded-sm bg-[#F7F3EE] px-4 py-3 text-left sm:text-right">
              <span className="block text-[11px] uppercase tracking-wider text-[#6B645C]">
                Sipariş Numarası
              </span>
              <span className="font-mono text-lg font-semibold text-[#1F1F1F]">
                #{completedOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Durum Zaman Çizelgesi */}
          <div className="my-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C] mb-5">
              Sipariş Durumu Zaman Çizelgesi
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ORDER_STATUS_STEPS.map((step, index) => {
                const currentIdx = ORDER_STATUS_STEPS.indexOf(
                  completedOrder.status
                );
                const isCompleted = index <= currentIdx;
                const isCurrent = index === currentIdx;
                return (
                  <div
                    key={step}
                    className={`rounded-sm border p-3.5 transition-colors ${
                      isCurrent
                        ? "border-[#B88A5A] bg-[#F7F3EE]"
                        : isCompleted
                        ? "border-[#2E6B4E]/40 bg-[#2E6B4E]/5"
                        : "border-[var(--color-border-subtle)] bg-[#FAF8F5] opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-[#6B645C]">
                        0{index + 1}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-[#2E6B4E]" />
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[#1F1F1F]">
                      {step}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6B645C]">
                      {isCurrent
                        ? formatDateTR(completedOrder.createdAt)
                        : "Bekleniyor"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Havale seçildiyse IBAN Kutusu */}
          {completedOrder.paymentMethod === "havale-eft" && (
            <div className="mb-8 rounded-sm border border-[#B88A5A]/40 bg-[#F7F3EE] p-5">
              <h3 className="text-sm font-semibold text-[#1F1F1F]">
                Havale / EFT Bilgileri
              </h3>
              <p className="mt-1 text-xs text-[#6B645C]">
                Lütfen açıklama kısmına yalnızca sipariş numaranızı (
                <strong className="font-mono text-[#1F1F1F]">
                  {completedOrder.orderNumber}
                </strong>
                ) yazarak ödemenizi 24 saat içinde tamamlayın.
              </p>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-[#6B645C] block">Banka:</span>
                  <strong className="text-[#1F1F1F]">
                    {site.payment.bankTransfer.bankName}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B645C] block">Alıcı Unvanı:</span>
                  <strong className="text-[#1F1F1F]">
                    {site.payment.bankTransfer.accountHolder}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B645C] block">IBAN:</span>
                  <strong className="font-mono text-[#1F1F1F]">
                    {site.payment.bankTransfer.iban}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Sipariş ve Teslimat Detayları */}
          <div className="grid gap-8 border-t border-[var(--color-border-subtle)] pt-8 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C] mb-3">
                Teslimat & İletişim Bilgileri
              </h3>
              <dl className="space-y-2 text-sm text-[#1F1F1F]">
                <div>
                  <dt className="text-xs text-[#6B645C]">Alıcı Ad Soyad</dt>
                  <dd className="font-medium">
                    {completedOrder.customer.fullName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#6B645C]">Telefon & E-posta</dt>
                  <dd>
                    {completedOrder.customer.phone} •{" "}
                    {completedOrder.customer.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#6B645C]">Teslimat Adresi</dt>
                  <dd>
                    {completedOrder.customer.addressLine},{" "}
                    {completedOrder.customer.district} /{" "}
                    {completedOrder.customer.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#6B645C]">Kargo & Ödeme</dt>
                  <dd>
                    {completedOrder.carrier} •{" "}
                    {paymentMethodLabel[completedOrder.paymentMethod]} (
                    {completedOrder.paymentStatus})
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C] mb-3">
                Sipariş Özeti ({completedOrder.items.length} Kalem)
              </h3>
              <ul className="divide-y divide-[var(--color-border-subtle)] border-b border-[var(--color-border-subtle)]">
                {completedOrder.items.map((item) => (
                  <li
                    key={item.sku}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#1F1F1F]">{item.name}</p>
                      <p className="text-xs text-[#6B645C]">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-medium text-[#1F1F1F]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6B645C]">
                  <span>Ara Toplam</span>
                  <span className="font-mono">
                    {formatPrice(completedOrder.subtotal)}
                  </span>
                </div>
                {completedOrder.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#2E6B4E]">
                    <span>İndirim ({completedOrder.couponCode})</span>
                    <span className="font-mono">
                      -{formatPrice(completedOrder.couponDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B645C]">
                  <span>Kargo Ücreti</span>
                  <span className="font-mono">
                    {completedOrder.shippingFee === 0
                      ? "Ücretsiz"
                      : formatPrice(completedOrder.shippingFee)}
                  </span>
                </div>
                {completedOrder.cashOnDeliveryFee > 0 && (
                  <div className="flex justify-between text-[#6B645C]">
                    <span>Kapıda Ödeme Hizmet Bedeli</span>
                    <span className="font-mono">
                      {formatPrice(completedOrder.cashOnDeliveryFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[var(--color-border-subtle)] pt-2 text-base font-semibold text-[#1F1F1F]">
                  <span>Toplam (KDV Dahil)</span>
                  <span className="font-mono">
                    {formatPrice(completedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-6">
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/siparis-takip?order=${completedOrder.orderNumber}&phone=${encodeURIComponent(
                  completedOrder.customer.phone
                )}`}
                className="inline-flex items-center gap-2 rounded-sm bg-[#1F1F1F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#333333] transition-colors"
              >
                <Package className="h-4 w-4" />
                Siparişi Takip Et
              </Link>
              <Link
                href="/panel"
                className="inline-flex items-center gap-2 rounded-sm border border-[#B88A5A] bg-[#F7F3EE] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1F1F1F] hover:bg-[#EFE8DF] transition-colors"
              >
                Yönetim Panelinde Durumu Güncelle (Demo)
              </Link>
            </div>
            <Link
              href="/koleksiyon"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B645C] hover:text-[#1F1F1F]"
            >
              Alışverişe Devam Et
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SEPET BOŞSA
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#1F1F1F]">
          Sepetinizde Ürün Bulunmuyor
        </h1>
        <p className="mt-3 text-sm text-[#6B645C]">
          Ödeme adımına geçebilmek için koleksiyonumuzdan sepetinize ürün
          ekleyebilirsiniz.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/koleksiyon"
            className="rounded-sm bg-[#1F1F1F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333]"
          >
            Koleksiyonu Keşfet
          </Link>
          <Link
            href="/siparis-takip"
            className="rounded-sm border border-[var(--color-border-subtle)] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#1F1F1F]"
          >
            Sipariş Takip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Üst Başlık & Adım Göstergesi */}
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
            Üyeliksiz Hızlı Alışveriş
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
            Güvenli Ödeme ve Sipariş Tamamlama
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6B645C]">
            <span className="font-semibold text-[#1F1F1F]">1. İletişim</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#1F1F1F]">
              2. Teslimat Adresi
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#1F1F1F]">3. Kargo</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#1F1F1F]">4. Ödeme</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>5. Sipariş Onayı</span>
          </div>
        </div>
        <button
          type="button"
          onClick={fillSampleCustomer}
          className="self-start rounded-sm border border-[#B88A5A]/50 bg-[#EFE8DF]/70 px-3.5 py-2 text-xs font-medium text-[#1F1F1F] hover:bg-[#EFE8DF] transition-colors cursor-pointer"
        >
          Örnek Müşteri Bilgilerini Doldur (Demo)
        </button>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-sm border border-[#9E3B32]/40 bg-[#9E3B32]/5 p-4 text-sm text-[#9E3B32]"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form
        onSubmit={handleCompleteOrder}
        className="grid gap-10 lg:grid-cols-12"
        noValidate
      >
        {/* SOL SÜTUN: ADIM 1-4 + YASAL SÖZLEŞMELER */}
        <div className="space-y-8 lg:col-span-7">
          {/* ADIM 1: İLETİŞİM BİLGİLERİ */}
          <section className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#1F1F1F]">
                1. İletişim Bilgileri (Üyeliksiz)
              </h2>
              <span className="text-xs text-[#6B645C]">
                Üyelik gerekmez, misafir olarak tamamlanır
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-fullname"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Ad Soyad *
                </label>
                <input
                  id="checkout-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Zeynep Karahan"
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Cep Telefonu (Kargo SMS Takibi) *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0500 000 00 00"
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  E-posta Adresi (E-Arşiv Fatura & Sözleşme) *
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ad.soyad@ornek.com"
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* ADIM 2: TESLİMAT ADRESİ */}
          <section className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-4">
              2. Teslimat Adresi
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  İl Seçimi *
                </label>
                <select
                  id="checkout-city"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                >
                  {TURKEY_CITIES.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-district"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  İlçe Seçimi *
                </label>
                <select
                  id="checkout-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Açık Adres (Mahalle, Cadde/Sokak, Bina ve Daire No) *
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Mahalle, sokak, apartman adı, kapı ve daire numaranızı yazınız..."
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-postal"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Posta Kodu (İsteğe Bağlı)
                </label>
                <input
                  id="checkout-postal"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="01120"
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-note"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Teslimat Notu (İsteğe Bağlı)
                </label>
                <input
                  id="checkout-note"
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Örn: Hediye paketi olsun / Güvenliğe bırakılsın"
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* ADIM 3: KARGO SEÇİMİ */}
          <section className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-4">
              3. Kargo Seçimi
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {site.shipping.carriers.map((carrier) => {
                const isSelected = selectedCarrier === carrier;
                return (
                  <label
                    key={carrier}
                    className={`flex cursor-pointer items-start justify-between rounded-sm border p-4 transition-colors ${
                      isSelected
                        ? "border-[#1F1F1F] bg-[#F7F3EE]"
                        : "border-[var(--color-border-subtle)] bg-[#FAF8F5] hover:border-[#B88A5A]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="carrier"
                        value={carrier}
                        checked={isSelected}
                        onChange={() => setSelectedCarrier(carrier)}
                        className="mt-1 accent-[#1F1F1F]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#1F1F1F]">
                          {carrier}
                        </p>
                        <p className="text-xs text-[#6B645C]">
                          Tahmini teslimat: {site.shipping.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#1F1F1F]">
                      {totals.isFreeShipping
                        ? "Ücretsiz"
                        : formatPrice(site.shipping.fee)}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* ADIM 4: ÖDEME YÖNTEMİ */}
          <section className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-4">
              4. Ödeme Yöntemi
            </h2>

            <div className="grid gap-3 sm:grid-cols-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("kart")}
                className={`flex flex-col items-start rounded-sm border p-4 text-left transition-colors cursor-pointer ${
                  paymentMethod === "kart"
                    ? "border-[#1F1F1F] bg-[#F7F3EE]"
                    : "border-[var(--color-border-subtle)] bg-[#FAF8F5]"
                }`}
              >
                <CreditCard className="h-5 w-5 text-[#1F1F1F] mb-2" />
                <span className="text-sm font-medium text-[#1F1F1F]">
                  Kredi / Banka Kartı
                </span>
                <span className="mt-0.5 text-[11px] text-[#6B645C]">
                  Test Modu (iyzico / PayTR)
                </span>
              </button>

              {site.payment.cashOnDelivery.enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod("kapida-odeme")}
                  className={`flex flex-col items-start rounded-sm border p-4 text-left transition-colors cursor-pointer ${
                    paymentMethod === "kapida-odeme"
                      ? "border-[#1F1F1F] bg-[#F7F3EE]"
                      : "border-[var(--color-border-subtle)] bg-[#FAF8F5]"
                  }`}
                >
                  <Banknote className="h-5 w-5 text-[#1F1F1F] mb-2" />
                  <span className="text-sm font-medium text-[#1F1F1F]">
                    Kapıda Ödeme
                  </span>
                  <span className="mt-0.5 text-[11px] text-[#6B645C]">
                    +{formatPrice(site.payment.cashOnDelivery.fee)} hizmet bedeli
                  </span>
                </button>
              )}

              {site.payment.bankTransfer.enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod("havale-eft")}
                  className={`flex flex-col items-start rounded-sm border p-4 text-left transition-colors cursor-pointer ${
                    paymentMethod === "havale-eft"
                      ? "border-[#1F1F1F] bg-[#F7F3EE]"
                      : "border-[var(--color-border-subtle)] bg-[#FAF8F5]"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-[#1F1F1F] mb-2" />
                  <span className="text-sm font-medium text-[#1F1F1F]">
                    Havale / EFT
                  </span>
                  <span className="mt-0.5 text-[11px] text-[#6B645C]">
                    Banka hesabına transfer
                  </span>
                </button>
              )}
            </div>

            {/* YÖNTEM DETAYI: KREDİ KARTI TEST MODU (GERÇEK KART GİRİŞİ YOK) */}
            {paymentMethod === "kart" && (
              <div className="rounded-sm border border-[#B88A5A]/50 bg-[#F7F3EE] p-5">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 shrink-0 text-[#B88A5A] mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F1F1F]">
                      Demo: gerçek ödeme alınmaz, kart bilgisi girmeyin
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B645C]">
                      Güvenlik gereği bu satış demosunda kart numarası, son
                      kullanma tarihi veya CVV alanı yer almaz. Canlı mağazada bu
                      alanda{" "}
                      <strong className="text-[#1F1F1F]">
                        {site.payment.creditCardProviders.join(" / ")}
                      </strong>{" "}
                      3D Secure ortak ödeme formu açılır. Aşağıdaki test
                      düğmeleriyle başarılı veya başarısız ödeme akışını
                      deneyebilirsiniz:
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleSimulateCardPayment("success")}
                    disabled={paymentSimulationState === "processing"}
                    className="inline-flex items-center gap-2 rounded-sm bg-[#2E6B4E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#24573E] transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Test ödemesini tamamla
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateCardPayment("failure")}
                    disabled={paymentSimulationState === "processing"}
                    className="inline-flex items-center gap-2 rounded-sm border border-[#9E3B32] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#9E3B32] hover:bg-[#9E3B32]/5 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Başarısız ödemeyi dene
                  </button>
                </div>

                {paymentMessage && (
                  <div
                    className={`mt-4 rounded-sm p-3 text-xs ${
                      paymentSimulationState === "succeeded"
                        ? "bg-[#2E6B4E]/10 text-[#2E6B4E] border border-[#2E6B4E]/30"
                        : "bg-[#9E3B32]/10 text-[#9E3B32] border border-[#9E3B32]/30"
                    }`}
                  >
                    {paymentMessage}
                    {transactionRef && (
                      <span className="block mt-1 font-mono font-semibold">
                        İşlem Referansı: {transactionRef}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* YÖNTEM DETAYI: KAPIDA ÖDEME */}
            {paymentMethod === "kapida-odeme" && (
              <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-5 text-sm">
                <p className="font-medium text-[#1F1F1F]">
                  Kapıda Nakit veya Tek Çekim Kart ile Ödeme
                </p>
                <p className="mt-1 text-xs text-[#6B645C]">
                  Siparişiniz kargo görevlisi tarafından teslim edilirken kapıda
                  nakit veya kredi kartı ile ödeme yapabilirsiniz. Kargo firması
                  tahsilat hizmet bedeli olarak sipariş toplamına{" "}
                  <strong className="font-mono text-[#1F1F1F]">
                    +{formatPrice(site.payment.cashOnDelivery.fee)}
                  </strong>{" "}
                  eklenir.
                </p>
              </div>
            )}

            {/* YÖNTEM DETAYI: HAVALE / EFT */}
            {paymentMethod === "havale-eft" && (
              <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#1F1F1F]">
                      {site.payment.bankTransfer.bankName} —{" "}
                      {site.payment.bankTransfer.accountHolder}
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold text-[#1F1F1F]">
                      {site.payment.bankTransfer.iban}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        site.payment.bankTransfer.iban
                      );
                      setCopiedIban(true);
                      setTimeout(() => setCopiedIban(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs font-medium text-[#1F1F1F] cursor-pointer"
                  >
                    {copiedIban ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#2E6B4E]" />
                        IBAN Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        IBAN Kopyala
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#6B645C]">
                  Siparişi onayladığınızda size özel üretilen{" "}
                  <strong className="text-[#1F1F1F]">#MRA-2026-XXXX</strong>{" "}
                  sipariş numarasını havale açıklama alanına yazmanız yeterlidir.
                </p>
              </div>
            )}

            {/* ALTERNATİF: WHATSAPP'TAN SİPARİŞ VER */}
            <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-4 sm:flex-row sm:items-center">
              <div className="text-xs text-[#6B645C]">
                Form doldurmak yerine sepetinizi doğrudan WhatsApp hattımıza
                iletebilirsiniz:
              </div>
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-[#2E6B4E] bg-[#2E6B4E]/10 px-4 py-2 text-xs font-semibold text-[#2E6B4E] hover:bg-[#2E6B4E] hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp&apos;tan Sipariş Ver
              </a>
            </div>
          </section>

          {/* DİNAMİK ÖN BİLGİLENDİRME FORMU & MESAFELİ SATIŞ SÖZLEŞMESİ VE ONAY KUTULARI */}
          <section className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#B88A5A]" />
                <h2 className="font-serif text-xl text-[#1F1F1F]">
                  Yasal Sözleşmeler ve Onay Adımı
                </h2>
              </div>
              <div className="flex rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveLegalTab("on-bilgilendirme")}
                  className={`rounded-sm px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                    activeLegalTab === "on-bilgilendirme"
                      ? "bg-[#1F1F1F] text-white"
                      : "text-[#6B645C] hover:text-[#1F1F1F]"
                  }`}
                >
                  Ön Bilgilendirme Formu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLegalTab("mesafeli-satis")}
                  className={`rounded-sm px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                    activeLegalTab === "mesafeli-satis"
                      ? "bg-[#1F1F1F] text-white"
                      : "text-[#6B645C] hover:text-[#1F1F1F]"
                  }`}
                >
                  Mesafeli Satış Sözleşmesi
                </button>
              </div>
            </div>

            {/* Dinamik doldurulmuş sözleşme metin kutusu */}
            <div className="max-h-60 overflow-y-auto rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#4A453F] space-y-3">
              {activeLegalTab === "on-bilgilendirme" ? (
                <>
                  <p className="font-semibold text-[#1F1F1F] uppercase">
                    ÖN BİLGİLENDİRME FORMU (6502 Sayılı TKHK ve Mesafeli
                    Sözleşmeler Yönetmeliği Uyarınca)
                  </p>
                  <p>
                    <strong>1. SATICI BİLGİLERİ:</strong>
                    <br />
                    Unvan: {site.legal.sellerTitle}
                    <br />
                    Adres: {site.address}
                    <br />
                    MERSİS No: {site.legal.mersisNo} | Vergi Dairesi / No:{" "}
                    {site.legal.taxOffice} - {site.legal.taxNumber}
                    <br />
                    Telefon: {site.phone} | E-posta: {site.email} | KEP:{" "}
                    {site.legal.kepAddress}
                  </p>
                  <p>
                    <strong>2. ALICI (TÜKETİCİ) BİLGİLERİ:</strong>
                    <br />
                    Ad Soyad: {fullName || "[Ad Soyad Girilmedi]"}
                    <br />
                    Teslimat Adresi:{" "}
                    {addressLine
                      ? `${addressLine}, ${district} / ${city}`
                      : `[Adres Girilmedi — ${district} / ${city}]`}
                    <br />
                    Telefon: {phone || "[Telefon Girilmedi]"} | E-posta:{" "}
                    {email || "[E-posta Girilmedi]"}
                  </p>
                  <div>
                    <strong>
                      3. SÖZLEŞME KONUSU ÜRÜNLER VE VERGİLER DAHİL TOPLAM BEDEL:
                    </strong>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      {pricedItems.map((item) => (
                        <li key={item.sku}>
                          {item.name} ({item.color} / {item.size}) — Adet:{" "}
                          {item.quantity} — Birim:{" "}
                          {formatPrice(item.effectiveUnitPrice)} — Satır Toplamı:{" "}
                          {formatPrice(item.lineTotal)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1">
                      Kargo Firması: {selectedCarrier} | Kargo Ücreti:{" "}
                      {totals.shippingFee === 0
                        ? "Ücretsiz (0 TL)"
                        : formatPrice(totals.shippingFee)}
                      {totals.cashOnDeliveryFee > 0 &&
                        ` | Kapıda Ödeme Hizmet Bedeli: ${formatPrice(
                          totals.cashOnDeliveryFee
                        )}`}
                      <br />
                      <strong>
                        Ödeme Yöntemi: {paymentMethodLabel[paymentMethod]}
                      </strong>
                      <br />
                      <strong>
                        Vergiler (KDV) Dahil Ödenecek Toplam Tutar:{" "}
                        {formatPrice(totals.total)}
                      </strong>
                    </p>
                  </div>
                  <p>
                    <strong>4. CAYMA HAKKI VE İSTİSNALAR:</strong> Alıcı, ürünü
                    teslim aldığı tarihten itibaren <strong>14 (ondört) gün</strong>{" "}
                    içinde herhangi bir gerekçe göstermeksizin ve cezai şart
                    ödemeksizin cayma hakkını kullanabilir. Cayma hakkı bildirimi{" "}
                    {site.email} adresine veya sitedeki İade Talebi sayfasından
                    yapılabilir. Hijyen koruma bandı açılmış iç giyim, mayo/bikini
                    ve kişiye özel tadilat yapılmış ürünlerde Mesafeli Sözleşmeler
                    Yönetmeliği m.15 uyarınca cayma hakkı kullanılamaz.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[#1F1F1F] uppercase">
                    MESAFELİ SATIŞ SÖZLEŞMESİ
                  </p>
                  <p>
                    <strong>MADDE 1 - TARAFLAR:</strong> İşbu sözleşme bir
                    tarafta <strong>{site.legal.sellerTitle}</strong> (SATICI) ile
                    diğer tarafta{" "}
                    <strong>{fullName || "[Alıcı Ad Soyad]"}</strong> (ALICI -
                    Tel: {phone || "-"}, Adres:{" "}
                    {addressLine
                      ? `${addressLine}, ${district}/${city}`
                      : `${district}/${city}`}
                    ) arasında elektronik ortamda kurulmuştur.
                  </p>
                  <p>
                    <strong>MADDE 2 - KONU VE BEDEL:</strong> İşbu sözleşmenin
                    konusu, ALICI&apos;nın SATICI&apos;ya ait internet sitesinden
                    sipariş verdiği aşağıda nitelikleri ve satış fiyatı belirtilen
                    ürünlerin (
                    {pricedItems
                      .map((i) => `${i.name} x${i.quantity}`)
                      .join(", ")}
                    ) satışı ve teslimi ile ilgili 6502 sayılı Tüketicinin
                    Korunması Hakkında Kanun hükümleri gereğince tarafların hak
                    ve yükümlülüklerinin belirlenmesidir. KDV dahil toplam bedel{" "}
                    <strong>{formatPrice(totals.total)}</strong> olup ödeme şekli{" "}
                    <strong>{paymentMethodLabel[paymentMethod]}</strong> olarak
                    seçilmiştir.
                  </p>
                  <p>
                    <strong>MADDE 3 - TESLİMAT:</strong> Ürünler, {selectedCarrier}{" "}
                    aracılığıyla ALICI&apos;nın yukarıda belirttiği adrese yasal 30
                    günlük süreyi aşmamak kaydıyla (tahmini{" "}
                    {site.shipping.estimatedDays} içinde) teslim edilir.
                  </p>
                  <p>
                    <strong>MADDE 4 - UYUŞMAZLIK ÇÖZÜMÜ:</strong> İşbu
                    sözleşmeden doğabilecek uyuşmazlıklarda Ticaret Bakanlığınca
                    ilan edilen parasal sınırlar dahilinde ALICI&apos;nın
                    yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici
                    Mahkemeleri yetkilidir.
                  </p>
                </>
              )}
            </div>

            {/* ONAY KUTULARI */}
            <div className="mt-5 space-y-3.5">
              {/* Zorunlu Sözleşme Onayı */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={contractsAccepted}
                  onChange={(e) => setContractsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm accent-[#1F1F1F]"
                />
                <span className="text-xs leading-relaxed text-[#1F1F1F]">
                  Yukarıda bilgileri yer alan{" "}
                  <Link
                    href="/on-bilgilendirme-formu"
                    target="_blank"
                    className="underline font-medium hover:text-[#B88A5A]"
                  >
                    Ön Bilgilendirme Formu
                  </Link>{" "}
                  ve{" "}
                  <Link
                    href="/mesafeli-satis-sozlesmesi"
                    target="_blank"
                    className="underline font-medium hover:text-[#B88A5A]"
                  >
                    Mesafeli Satış Sözleşmesi
                  </Link>{" "}
                  metinlerini okudum, anladım ve onaylıyorum. *
                </span>
              </label>

              {/* 6563 sayılı Kanun / İYS Pazarlama İzni (Ayrı, varsayılan işaretsiz, zorunlu değil) */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm accent-[#1F1F1F]"
                />
                <span className="text-xs leading-relaxed text-[#6B645C]">
                  Kampanya ve duyurulardan haberdar olmak istiyorum (6563 sayılı
                  Kanun ve İYS kapsamında SMS/e-posta ticari elektronik ileti
                  izni — <em>isteğe bağlıdır</em>).
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* SAĞ SÜTUN: SİPARİŞ ÖZETİ & "SİPARİŞİ ONAYLA VE ÖDE" DÜĞMESİ */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl text-[#1F1F1F] pb-4 border-b border-[var(--color-border-subtle)]">
              Sipariş Özeti ({totals.itemCount} Ürün)
            </h2>

            <ul className="divide-y divide-[var(--color-border-subtle)] max-h-80 overflow-y-auto my-4 pr-1">
              {pricedItems.map((item) => (
                <li key={item.sku} className="flex gap-3.5 py-3">
                  <div className="relative h-20 w-15 shrink-0 overflow-hidden rounded-sm bg-[#EFE8DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between text-xs">
                    <div>
                      <p className="font-medium text-[#1F1F1F] text-sm">
                        {item.name}
                      </p>
                      <p className="text-[#6B645C] mt-0.5">
                        Renk: {item.color} • Beden: {item.size} • Adet:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-[#1F1F1F] text-sm">
                        {formatPrice(item.lineTotal)}
                      </span>
                      {item.originalUnitPrice && (
                        <span className="font-mono text-[11px] text-[#6B645C] line-through">
                          {formatPrice(item.originalUnitPrice * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
              <div className="flex justify-between text-[#6B645C]">
                <span>Ara Toplam</span>
                <span className="font-mono">{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.campaignSavings > 0 && (
                <div className="flex justify-between text-[#9E3B32] text-xs">
                  <span>Kampanya Avantajı</span>
                  <span className="font-mono">
                    -{formatPrice(totals.campaignSavings)}
                  </span>
                </div>
              )}

              {totals.couponDiscount > 0 && (
                <div className="flex justify-between text-[#2E6B4E]">
                  <span>İndirim Kodu ({couponCode})</span>
                  <span className="font-mono">
                    -{formatPrice(totals.couponDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6B645C]">
                <span>Kargo ({selectedCarrier})</span>
                <span className="font-mono">
                  {totals.shippingFee === 0
                    ? "Ücretsiz"
                    : formatPrice(totals.shippingFee)}
                </span>
              </div>

              {totals.cashOnDeliveryFee > 0 && (
                <div className="flex justify-between text-[#6B645C]">
                  <span>Kapıda Ödeme Hizmet Bedeli</span>
                  <span className="font-mono">
                    +{formatPrice(totals.cashOnDeliveryFee)}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t border-[var(--color-border-subtle)] pt-3 text-lg font-semibold text-[#1F1F1F]">
                <span>Ödenecek Toplam (KDV Dahil)</span>
                <span className="font-mono">{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* Yasal zorunluluk: Ödeme yükümlülüğünü açıkça belirten düğme metni */}
            <button
              type="submit"
              className="mt-6 w-full rounded-sm bg-[#1F1F1F] py-4 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Siparişi onayla ve öde ({formatPrice(totals.total)})
            </button>

            <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-[var(--color-border-subtle)] text-[11px] text-[#6B645C]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#2E6B4E] shrink-0" />
                <span>256-Bit SSL & 3D Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#B88A5A] shrink-0" />
                <span>14 Gün Koşulsuz İade</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
