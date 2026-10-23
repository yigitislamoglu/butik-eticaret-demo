"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useShop } from "@/components/providers/shop-provider";
import { ProductCard } from "@/components/ui/product-card";

export default function FavoritesPage() {
  const { products, favorites } = useShop();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-[#E2D9CC] pb-6">
        <h1 className="font-heading text-4xl font-normal text-[#1F1F1F] sm:text-5xl">
          Favorilerim ({favoriteProducts.length})
        </h1>
        <p className="mt-2 text-sm text-[#5C564F]">
          Üyelik gerektirmeden tarayıcınızda saklanan favori parçalarınız. Beğendiğiniz bedeni doğrudan sepetinize ekleyebilirsiniz.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="mt-10 border border-[#E2D9CC] bg-[#FAF8F5] px-6 py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-[#5C564F]" strokeWidth={1.25} />
          <h2 className="font-heading mt-4 text-3xl font-normal text-[#1F1F1F]">
            Henüz favorilerinize bir ürün eklemediniz
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5C564F]">
            Koleksiyonumuzda beğendiğiniz ürünlerin sağ üst köşesindeki kalp simgesine dokunarak favori listenizi oluşturabilirsiniz.
          </p>
          <Link
            href="/koleksiyon/tumu"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 bg-[#1F1F1F] px-6 text-sm font-medium text-[#F7F3EE] transition-colors hover:bg-[#B88A5A]"
          >
            <span>Koleksiyonu Keşfet</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
