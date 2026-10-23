import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[68vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-medium text-[#5C564F]">404 — Sayfa Bulunamadı</p>
      <h1 className="font-heading mt-3 text-4xl font-normal text-[#1F1F1F] sm:text-5xl">
        Aradığınız parça veya sayfa taşınmış olabilir
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5C564F]">
        İncelemek istediğiniz ürün koleksiyondan kalkmış veya bağlantı adresi değişmiş olabilir. Güncel seçkimize göz atabilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[46px] items-center gap-2 bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Ana Sayfaya Dön</span>
        </Link>
        <Link
          href="/koleksiyon/tumu"
          className="inline-flex min-h-[46px] items-center gap-2 border border-[#1F1F1F] bg-transparent px-6 text-sm font-medium text-[#1F1F1F] transition-colors hover:bg-[#EFE9E0]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Tüm Koleksiyonu Gör</span>
        </Link>
      </div>
    </div>
  );
}
