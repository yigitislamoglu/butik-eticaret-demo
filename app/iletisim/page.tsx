"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
} from "lucide-react";
import { site } from "@/site.config";
import { buildWhatsAppUrl } from "@/lib/utils";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Beden ve Kalıp Danışma");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-[var(--color-border-subtle)] pb-6">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#B88A5A]">
          Bize Ulaşın • {site.city}
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
          İletişim ve Müşteri Destek
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B645C]">
          Siparişleriniz, beden/kalıp sorularınız veya mağaza ziyaretiniz için
          bize telefon, WhatsApp veya iletişim formumuz üzerinden
          ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* SOL SÜTUN: İLETİŞİM BİLGİLERİ */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <MapPin className="h-5 w-5 text-[#B88A5A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B645C]">
                  Mağaza & İade Adresi
                </h2>
                <p className="mt-1 text-sm text-[#1F1F1F] leading-relaxed">
                  {site.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="h-5 w-5 text-[#B88A5A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B645C]">
                  Çalışma Saatleri
                </h2>
                <p className="mt-1 text-sm text-[#1F1F1F]">
                  {site.workingHours}
                </p>
                <p className="text-xs text-[#6B645C]">
                  Pazar günleri online sipariş hazırlamamız devam etmektedir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="h-5 w-5 text-[#B88A5A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B645C]">
                  Telefon & Müşteri Hizmetleri
                </h2>
                <p className="mt-1 text-sm font-medium text-[#1F1F1F]">
                  {site.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="h-5 w-5 text-[#B88A5A] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B645C]">
                  E-posta & KEP Adresi
                </h2>
                <p className="mt-1 text-sm text-[#1F1F1F]">{site.email}</p>
                <p className="text-xs text-[#6B645C]">
                  KEP: {site.legal.kepAddress}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <a
                href={buildWhatsAppUrl(
                  `Merhaba ${site.name}, bilgi almak istiyorum.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#2E6B4E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#24573E] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Destek Hattına Yazın
              </a>
            </div>
          </div>

          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] p-5 text-xs text-[#6B645C] space-y-1">
            <strong className="text-[#1F1F1F] block">Resmi Ticari Bilgiler</strong>
            <p>Ticari Unvan: {site.legal.sellerTitle}</p>
            <p>
              Vergi Dairesi / No: {site.legal.taxOffice} —{" "}
              {site.legal.taxNumber}
            </p>
            <p>MERSİS No: {site.legal.mersisNo}</p>
            <p>{site.legal.etbisNote}</p>
          </div>
        </div>

        {/* SAĞ SÜTUN: İLETİŞİM FORMU */}
        <div className="lg:col-span-7">
          <div className="rounded-sm border border-[var(--color-border-subtle)] bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#1F1F1F] mb-2">
              Mesaj Gönderin
            </h2>
            <p className="text-xs text-[#6B645C] mb-6">
              Formu doldurduğunuzda müşteri temsilcimiz aynı iş günü içinde
              dönüş sağlar.
            </p>

            {submitted && (
              <div
                role="status"
                className="mb-6 flex items-center gap-2.5 rounded-sm border border-[#2E6B4E]/40 bg-[#2E6B4E]/10 p-4 text-xs font-medium text-[#2E6B4E]"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  Mesajınız alındı! Ekibimiz en kısa sürede sizinle iletişime
                  geçecektir.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                  >
                    Adınız Soyadınız *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                  >
                    E-posta veya Telefon *
                  </label>
                  <input
                    id="contact-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@eposta.com / 0532..."
                    className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Konu
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                >
                  <option>Beden ve Kalıp Danışma</option>
                  <option>Sipariş ve Kargo Durumu</option>
                  <option>İade ve Değişim İşlemleri</option>
                  <option>Mağaza Stok Sorgulama</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium uppercase tracking-wider text-[#6B645C] mb-1.5"
                >
                  Mesajınız *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Merak ettiğiniz ürün veya sipariş numaranızı yazabilirsiniz..."
                  className="w-full rounded-sm border border-[var(--color-border-subtle)] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1F1F1F] focus:border-[#1F1F1F] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-sm bg-[#1F1F1F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Mesajı Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
