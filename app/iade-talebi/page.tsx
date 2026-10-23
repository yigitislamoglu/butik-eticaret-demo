"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  Info,
} from "lucide-react";
import {
  store,
  type OrderRecord,
  type ReturnRequestRecord,
} from "@/lib/store";
import { site } from "@/site.config";
import { formatPrice, formatDateTR } from "@/lib/utils";

const RETURN_REASONS = [
  "Beden büyük geldi (Değişim veya İade)",
  "Beden küçük geldi (Değişim veya İade)",
  "Kumaş dokusu / kalıbı beklentime uymadı",
  "Renk tonu ekrandakinden farklı göründü",
  "14 günlük koşulsuz cayma hakkımı kullanmak istiyorum",
  "Kusurlu veya yanlış ürün gönderimi",
];

function ReturnRequestContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createdReturn, setCreatedReturn] =
    useState<ReturnRequestRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const allOrders = store.getOrders();
    setOrders(allOrders);
    const paramOrder = searchParams.get("order");

    const initialOrder =
      (paramOrder && allOrders.find((o) => o.orderNumber === paramOrder)) ||
      allOrders[0] ||
      null;

    if (initialOrder) {
      setSelectedOrderNo(initialOrder.orderNumber);
      setSelectedOrder(initialOrder);
      setSelectedSkus(initialOrder.items.map((i) => i.sku));
    }
  }, [searchParams]);

  const handleOrderSelect = (orderNo: string) => {
    setSelectedOrderNo(orderNo);
    const found = orders.find((o) => o.orderNumber === orderNo) || null;
    setSelectedOrder(found);
    setSelectedSkus(found ? found.items.map((i) => i.sku) : []);
    setCreatedReturn(null);
    setError(null);
  };

  const toggleSku = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) {
      setError("Lütfen iade talebi oluşturmak istediğiniz siparişi seçin.");
      return;
    }
    if (selectedSkus.length === 0) {
      setError("Lütfen iade veya değişim yapılacak en az bir ürün seçin.");
      return;
    }

    const result = store.createReturnRequest({
      orderNumber: selectedOrder.orderNumber,
      customerPhone: selectedOrder.customer.phone,
      selectedSkus,
      reason,
      explanation: explanation.trim() || undefined,
    });

    setError(null);
    setCreatedReturn(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-[var(--color-border-subtle)] pb-6">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
          14 Gün Koşulsuz Cayma Hakkı
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
          İade ve Değişim Talebi
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B645C]">
          Siparişinizi teslim aldığınız tarihten itibaren 14 gün içinde kolayca
          ücretsiz iade kargo kodu alabilir veya beden değişimi talep
          edebilirsiniz.
        </p>
      </div>

      {createdReturn && selectedOrder ? (
        <div className="rounded-sm border border-[#2E6B4E]/40 bg-white p-6 sm:p-10 shadow-xs mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] pb-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E6B4E]">
                  İade Kargo Kodunuz Hazır
                </span>
                <h2 className="mt-0.5 font-serif text-2xl text-[#1F1F1F]">
                  Talebiniz Kaydedildi
                </h2>
                <p className="mt-1 text-xs text-[#6B645C]">
                  Sipariş #{createdReturn.orderNumber} için oluşturulan kodu{" "}
                  <strong>{site.shipping.carriers.join(" veya ")}</strong>{" "}
                  şubesine ileterek ücretsiz gönderim yapabilirsiniz.
                </p>
              </div>
            </div>

            <div className="rounded-sm border border-[#B88A5A] bg-[#F7F3EE] px-5 py-3.5 text-left sm:text-right">
              <span className="block text-[11px] uppercase tracking-wider text-[#6B645C]">
                Ücretsiz İade Kargo Kodu
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-[#1F1F1F]">
                  {createdReturn.returnCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(createdReturn.returnCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-1.5 text-xs text-[#1F1F1F]"
                  aria-label="İade kodunu kopyala"
                >
                  {copiedCode ? (
                    <Check className="h-4 w-4 text-[#2E6B4E]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3 text-xs text-[#4A453F]">
            <div className="rounded-sm bg-[#FAF8F5] p-4 border border-[var(--color-border-subtle)]">
              <strong className="text-[#1F1F1F] block mb-1">
                1. Paketi Hazırlayın
              </strong>
              Ürünleri orijinal etiketi koparılmamış şekilde faturası ile
              birlikte paketleyin.
            </div>
            <div className="rounded-sm bg-[#FAF8F5] p-4 border border-[var(--color-border-subtle)]">
              <strong className="text-[#1F1F1F] block mb-1">
                2. Kargo Şubesine Teslim Edin
              </strong>
              Şubede yalnızca{" "}
              <strong className="font-mono">{createdReturn.returnCode}</strong>{" "}
              kodunu söylemeniz yeterlidir; kargo ücreti alınmaz.
            </div>
            <div className="rounded-sm bg-[#FAF8F5] p-4 border border-[var(--color-border-subtle)]">
              <strong className="text-[#1F1F1F] block mb-1">
                3. Hızlı Geri Ödeme
              </strong>
              Paket atölyemize ulaştıktan sonra 2 iş günü içinde incelenir ve
              ödeme yönteminizle iade edilir.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCreatedReturn(null)}
              className="rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-4 py-2.5 text-xs font-medium text-[#1F1F1F]"
            >
              Yeni Talep Oluştur
            </button>
            <Link
              href="/siparis-takip"
              className="rounded-sm bg-[#1F1F1F] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Sipariş Takibine Dön
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-12">
        {/* SOL SÜTUN: İADE FORMU */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 space-y-6"
          >
            <h2 className="font-serif text-xl text-[#1F1F1F]">
              1. Sipariş ve Ürün Seçimi
            </h2>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-sm border border-[#9E3B32]/40 bg-[#9E3B32]/5 p-3.5 text-xs text-[#9E3B32]"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="return-order-select"
                className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
              >
                Sipariş Seçin
              </label>
              <select
                id="return-order-select"
                value={selectedOrderNo}
                onChange={(e) => handleOrderSelect(e.target.value)}
                className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
              >
                {orders.map((ord) => (
                  <option key={ord.orderNumber} value={ord.orderNumber}>
                    #{ord.orderNumber} — {ord.customer.fullName} (
                    {formatDateTR(ord.createdAt)} • {formatPrice(ord.total)})
                  </option>
                ))}
              </select>
            </div>

            {selectedOrder && (
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-2">
                  İade / Değişim Yapılacak Ürünleri İşaretleyin
                </span>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item) => {
                    const checked = selectedSkus.includes(item.sku);
                    return (
                      <label
                        key={item.sku}
                        className={`flex cursor-pointer items-center gap-3.5 rounded-sm border p-3 transition-colors ${
                          checked
                            ? "border-[#1F1F1F] bg-[#F7F3EE]"
                            : "border-[var(--color-border-subtle)] bg-[#FAF8F5]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSku(item.sku)}
                          className="h-4 w-4 accent-[#1F1F1F]"
                        />
                        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-[#EFE8DF]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1F1F1F]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#6B645C]">
                            Renk: {item.color} • Beden: {item.size} • Adet:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#1F1F1F]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="return-reason"
                className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
              >
                2. İade veya Değişim Nedeni
              </label>
              <select
                id="return-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="return-explanation"
                className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
              >
                Ek Notunuz (Örn: İstediğiniz Yeni Beden — İsteğe Bağlı)
              </label>
              <textarea
                id="return-explanation"
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Beden değişimi istiyorsanız lütfen talep ettiğiniz bedeni belirtin..."
                className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1F1F1F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Ücretsiz İade Kargo Kodu Oluştur
            </button>
          </form>
        </div>

        {/* SAĞ SÜTUN: 14 GÜNLÜK CAYMA HAKKI VE HİJYEN İSTİSNALARI AÇIKLAMASI */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#2E6B4E]" />
              <h2 className="font-serif text-xl text-[#1F1F1F]">
                14 Günlük Cayma Hakkı Koşulları
              </h2>
            </div>

            <p className="text-xs leading-relaxed text-[#4A453F]">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
              Sözleşmeler Yönetmeliği uyarınca, siparişinizi teslim aldığınız
              tarihten itibaren <strong>14 (ondört) gün</strong> içerisinde
              herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
              cayma hakkınızı kullanabilirsiniz.
            </p>

            <ul className="space-y-2.5 text-xs text-[#4A453F]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E6B4E] shrink-0 mt-0.5" />
                <span>
                  <strong>Ücretsiz Gönderim:</strong> Sitemizden aldığınız{" "}
                  <code className="font-mono text-[#1F1F1F]">IADE-MRA-XXXX</code>{" "}
                  kodu ile anlaşmalı kargo firmalarımız ({site.shipping.carriers.join(", ")})
                  üzerinden ücretsiz gönderim yapabilirsiniz.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E6B4E] shrink-0 mt-0.5" />
                <span>
                  <strong>Ürün Kondisyonu:</strong> İade edilecek ürünlerin
                  kullanılmamış, yıkanmamış, parfüm/deodorant izi taşımıyor ve
                  karton etiketinin koparılmamış olması gerekmektedir.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E6B4E] shrink-0 mt-0.5" />
                <span>
                  <strong>Bedel İadesi Süresi:</strong> Ürün atölyemize
                  ulaştıktan sonra en geç 14 gün (ortalama 2-3 iş günü) içinde
                  ödeme yaptığınız kanala (kart veya IBAN) tek seferde iade
                  edilir.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-[#B88A5A]/40 bg-[#F7F3EE] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[#B88A5A]" />
              <h3 className="font-serif text-lg text-[#1F1F1F]">
                Hijyen ve İç Giyim İstisnaları
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#4A453F]">
              Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca;{" "}
              <strong>
                tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu
                unsurları açılmış olan; iadesi sağlık ve hijyen açısından uygun
                olmayan ürünlerde
              </strong>{" "}
              (iç giyim alt parçaları, mayo, bikini, küpe ve koruma bandı
              sökülmüş body ürünleri) cayma hakkı kullanılamamaktadır.
            </p>
            <p className="text-xs leading-relaxed text-[#4A453F]">
              Elbise, gömlek, bluz, pantolon, etek, triko ve dış giyim
              kategorilerimizdeki tüm ürünlerimizde ise hijyen bandı kısıtlaması
              bulunmaksızın 14 gün koşulsuz iade ve beden değişimi hakkınız
              geçerlidir.
            </p>
            <div className="pt-2">
              <Link
                href="/iade-ve-degisim"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F1F1F] underline hover:text-[#B88A5A]"
              >
                Detaylı İade ve Değişim Politikasını İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReturnRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1120px] px-4 py-16 text-center text-sm text-[#6B645C]">
          İade talebi ekranı yükleniyor...
        </div>
      }
    >
      <ReturnRequestContent />
    </Suspense>
  );
}
