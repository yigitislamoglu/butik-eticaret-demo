"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "mira_cookie_consent_v1";

export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const savePreferences = (prefs: { analytics: boolean; marketing: boolean }) => {
    const record: CookiePreferences = {
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      decidedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1F1F1F]/20 bg-[#FAF8F5] p-4 text-[#1F1F1F] sm:p-5"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl text-xs leading-relaxed text-[#5C564F]">
          <p className="font-medium text-[#1F1F1F]">
            Çerez ve Gizlilik Tercihleriniz (KVKK Uyumlu)
          </p>
          <p className="mt-1">
            Sitemizde sepetinizin çalışması için zorunlu çerezler kullanılmaktadır. Analitik ve
            pazarlama çerezleri ise <strong>yalnızca açık onayınız olması hâlinde</strong>{" "}
            etkinleştirilir. Detaylı bilgi için{" "}
            <Link href="/cerez-politikasi" className="text-[#1F1F1F] underline">
              Çerez Politikası
            </Link>{" "}
            ve{" "}
            <Link href="/kvkk" className="text-[#1F1F1F] underline">
              KVKK Aydınlatma Metni
            </Link>{" "}
            sayfalarımızı inceleyebilirsiniz.
          </p>

          {detailsOpen && (
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[#E2D9CC] pt-3 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-xs text-[#1F1F1F]">
                <input type="checkbox" checked disabled className="h-4 w-4 accent-[#1F1F1F]" />
                <span>Zorunlu Çerezler (Her zaman aktif)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-[#1F1F1F]"
                />
                <span>Performans & Analitik Çerezleri</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4 accent-[#1F1F1F]"
                />
                <span>Kampanya & Pazarlama Çerezleri</span>
              </label>
            </div>
          )}
        </div>

        {/* "Reddet" düğmesi en az "Kabul et" kadar görünür ve eşit boyutta */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            className="min-h-[42px] border border-[#E2D9CC] bg-white px-3.5 text-xs font-medium text-[#1F1F1F] hover:border-[#1F1F1F]"
          >
            {detailsOpen ? "Tercihleri Gizle" : "Tercihleri Yönet"}
          </button>

          {detailsOpen ? (
            <button
              type="button"
              onClick={() => savePreferences({ analytics, marketing })}
              className="min-h-[42px] border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE]"
            >
              Seçimi Kaydet
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => savePreferences({ analytics: false, marketing: false })}
            className="min-h-[42px] border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] transition-colors hover:bg-[#333333]"
          >
            Reddet
          </button>

          <button
            type="button"
            onClick={() => savePreferences({ analytics: true, marketing: true })}
            className="min-h-[42px] border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-xs font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A] hover:border-[#B88A5A]"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </section>
  );
}
