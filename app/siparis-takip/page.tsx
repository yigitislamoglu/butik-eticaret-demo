"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  MapPin,
  RotateCcw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  store,
  STORE_UPDATED_EVENT,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/store";
import { formatPrice, formatDateTR } from "@/lib/utils";

const STATUS_STEPS: OrderStatus[] = [
  "Alındı",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim edildi",
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);

  const loadOrders = () => {
    const orders = store.getOrders();
    setAllOrders(orders);
    return orders;
  };

  useEffect(() => {
    const orders = loadOrders();
    const qOrder = searchParams.get("order");
    const qPhone = searchParams.get("phone");

    if (qOrder && qPhone) {
      setOrderNumber(qOrder);
      setPhone(qPhone);
      const found = store.findOrderByNumberAndPhone(qOrder, qPhone);
      if (found) {
        setMatchedOrder(found);
        setError(null);
      }
    } else if (orders.length > 0 && !matchedOrder) {
      // İlk açılışta en güncel siparişi hazır doldur
      setOrderNumber(orders[0].orderNumber);
      setPhone(orders[0].customer.phone);
      setMatchedOrder(orders[0]);
    }

    const handleUpdate = () => {
      const updatedOrders = store.getOrders();
      setAllOrders(updatedOrders);
      if (orderNumber) {
        const refreshed = store.getOrderByNumber(orderNumber);
        if (refreshed) setMatchedOrder(refreshed);
      }
    };

    window.addEventListener(STORE_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Lütfen sipariş numaranızı ve telefon numaranızı girin.");
      return;
    }
    const found = store.findOrderByNumberAndPhone(orderNumber, phone);
    if (!found) {
      setMatchedOrder(null);
      setError(
        "Girdiğiniz sipariş numarası ve telefon numarasıyla eşleşen bir kayıt bulunamadı. Lütfen bilgileri kontrol edin veya aşağıdaki örnek siparişlerden birini seçin."
      );
      return;
    }
    setError(null);
    setMatchedOrder(found);
  };

  const selectDemoOrder = (order: OrderRecord) => {
    setOrderNumber(order.orderNumber);
    setPhone(order.customer.phone);
    setMatchedOrder(order);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-[var(--color-border-subtle)] pb-6">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
          Kargo & Durum Sorgulama
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
          Sipariş Takip
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B645C]">
          Sipariş numaranız ve sipariş sırasında kullandığınız cep telefonu
          numaranızla kargonuzun güncel durumunu sorgulayabilirsiniz. Yönetim
          panelinden yapılan durum güncellemeleri bu sayfaya anında yansır.
        </p>
      </div>

      {/* Sorgulama Formu */}
      <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 shadow-xs">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 sm:grid-cols-12 sm:items-end"
        >
          <div className="sm:col-span-5">
            <label
              htmlFor="track-order-no"
              className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
            >
              Sipariş Numarası
            </label>
            <input
              id="track-order-no"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Örn: MRA-2026-1042"
              className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="track-phone"
              className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
            >
              Cep Telefonu Numarası
            </label>
            <input
              id="track-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Örn: 0500 000 00 00"
              className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1F1F1F] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#333333] transition-colors cursor-pointer h-[42px]"
            >
              <Search className="h-4 w-4" />
              Sorgula
            </button>
          </div>
        </form>

        {/* Demo Hızlı Seçim Çipleri */}
        {allOrders.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border-subtle)] pt-4">
            <span className="text-xs font-medium text-[#6B645C]">
              Kayıtlı / Örnek Siparişler (Tek Tıkla Dene):
            </span>
            {allOrders.slice(0, 5).map((ord) => (
              <button
                key={ord.orderNumber}
                type="button"
                onClick={() => selectDemoOrder(ord)}
                className={`rounded-sm border px-2.5 py-1 text-xs font-mono transition-colors ${
                  matchedOrder?.orderNumber === ord.orderNumber
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
                    : "border-[var(--color-border-subtle)] bg-[#FAF8F5] text-[#1F1F1F] hover:border-[#B88A5A]"
                }`}
              >
                #{ord.orderNumber} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-sm border border-[#9E3B32]/40 bg-[#9E3B32]/5 p-4 text-sm text-[#9E3B32]"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sorgulanan Sipariş Detayı ve Canlı Zaman Çizelgesi */}
      {matchedOrder && (
        <div className="mt-8 rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xl font-semibold text-[#1F1F1F]">
                  #{matchedOrder.orderNumber}
                </span>
                <span className="rounded-sm bg-[#EFE8DF] px-2.5 py-0.5 text-xs font-semibold text-[#1F1F1F]">
                  {matchedOrder.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#6B645C]">
                Sipariş Tarihi: {formatDateTR(matchedOrder.createdAt)} • Alıcı:{" "}
                <strong className="text-[#1F1F1F]">
                  {matchedOrder.customer.fullName}
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href={`/iade-talebi?order=${matchedOrder.orderNumber}`}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-[#1F1F1F] hover:border-[#1F1F1F] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                İade / Değişim Talebi Oluştur
              </Link>
              <Link
                href="/panel"
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#B88A5A] bg-[#F7F3EE] px-3.5 py-2 text-xs font-medium text-[#1F1F1F] hover:bg-[#EFE8DF] transition-colors"
              >
                Panelden Durumu Değiştir
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Adımlı Canlı Durum Çizelgesi */}
          <div className="my-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C] mb-4">
              Canlı Kargo & Hazırlık Durumu
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {STATUS_STEPS.map((step, idx) => {
                const currentIdx = STATUS_STEPS.indexOf(matchedOrder.status);
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const historyEntry = [...matchedOrder.statusHistory]
                  .reverse()
                  .find((h) => h.status === step);

                return (
                  <div
                    key={step}
                    className={`rounded-sm border p-4 transition-all ${
                      isCurrent
                        ? "border-[#1F1F1F] bg-[#F7F3EE] shadow-xs"
                        : isDone
                        ? "border-[#2E6B4E]/40 bg-[#2E6B4E]/5"
                        : "border-[var(--color-border-subtle)] bg-[#FAF8F5] opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#6B645C]">
                        ADIM 0{idx + 1}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2E6B4E]" />
                      ) : (
                        <Clock className="h-4 w-4 text-[#6B645C]" />
                      )}
                    </div>
                    <p className="mt-2 font-serif text-lg font-medium text-[#1F1F1F]">
                      {step}
                    </p>
                    <p className="mt-1 text-xs text-[#6B645C]">
                      {historyEntry
                        ? formatDateTR(historyEntry.timestamp)
                        : "Henüz bu adıma geçilmedi"}
                    </p>
                    {historyEntry?.note && (
                      <p className="mt-1.5 text-[11px] text-[#1F1F1F] bg-white/80 rounded-sm px-2 py-1 border border-[var(--color-border-subtle)]">
                        {historyEntry.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kargo ve Teslimat Özeti */}
          <div className="grid gap-8 border-t border-[var(--color-border-subtle)] pt-6 md:grid-cols-12">
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C]">
                Kargo & Teslimat Bilgisi
              </h3>
              <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <Truck className="h-4 w-4 text-[#B88A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#6B645C] block">
                      Kargo Firması & Takip Kodu
                    </span>
                    <strong className="text-[#1F1F1F]">
                      {matchedOrder.carrier}
                    </strong>
                    {matchedOrder.trackingCode && (
                      <span className="ml-2 font-mono text-xs bg-white px-2 py-0.5 border border-[var(--color-border-subtle)] rounded-sm">
                        {matchedOrder.trackingCode}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#B88A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#6B645C] block">
                      Teslimat Adresi
                    </span>
                    <p className="text-xs text-[#1F1F1F] leading-relaxed">
                      {matchedOrder.customer.addressLine},{" "}
                      {matchedOrder.customer.district} /{" "}
                      {matchedOrder.customer.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Package className="h-4 w-4 text-[#B88A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#6B645C] block">
                      Ödeme Durumu
                    </span>
                    <p className="text-xs font-medium text-[#1F1F1F]">
                      {matchedOrder.paymentStatus} — Toplam:{" "}
                      <span className="font-mono">
                        {formatPrice(matchedOrder.total)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B645C] mb-3">
                Sipariş İçeriği ({matchedOrder.items.length} Kalem)
              </h3>
              <ul className="divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] rounded-sm bg-[#FAF8F5] px-4">
                {matchedOrder.items.map((item) => (
                  <li key={item.sku} className="flex items-center gap-4 py-3">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-[#EFE8DF]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/urun/${item.slug}`}
                        className="text-sm font-medium text-[#1F1F1F] hover:text-[#B88A5A]"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#6B645C]">
                        Renk: {item.color} • Beden: {item.size} • Adet:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#1F1F1F]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1120px] px-4 py-16 text-center text-sm text-[#6B645C]">
          Sipariş takip ekranı yükleniyor...
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
