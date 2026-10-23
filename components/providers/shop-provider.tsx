"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as staticProducts, type Product, type ProductSize } from "@/content/products";
import { site } from "@/site.config";
import {
  calculateCartTotals,
  DEFAULT_COUPONS,
  type CartPricingItem,
  type CartTotalsResult,
  type CouponDefinition,
  type PaymentMethodType,
} from "@/lib/pricing";
import {
  store,
  STORE_UPDATED_EVENT,
  type CampaignStateOverride,
} from "@/lib/store";

export interface FlyingItemAnimation {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

interface ShopContextValue {
  products: Product[];
  campaign: CampaignStateOverride;
  coupons: CouponDefinition[];
  cartItems: CartPricingItem[];
  couponCode: string;
  setCouponCode: (code: string) => void;
  getTotals: (paymentMethod?: PaymentMethodType) => CartTotalsResult;
  addToCart: (
    item: Omit<CartPricingItem, "quantity"> & { quantity?: number },
    triggerCoords?: { x: number; y: number },
    openDrawer?: boolean
  ) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  updateItemVariant: (oldSku: string, newColor: string, newSize: ProductSize) => void;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  recentlyViewedIds: string[];
  recordRecentlyViewed: (productId: string) => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  flyingItem: FlyingItemAnimation | null;
  cartBadgePulse: number;
  resetDemo: () => void;
  refreshStore: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "mira_cart_v1";
const COUPON_KEY = "mira_active_coupon_v1";
const FAVORITES_KEY = "mira_favorites_v1";
const RECENT_KEY = "mira_recently_viewed_v1";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [campaign, setCampaign] = useState<CampaignStateOverride>({
    active: site.campaign.active,
    label: site.campaign.label,
    endsAt: site.campaign.endsAt,
  });
  const [coupons, setCoupons] = useState<CouponDefinition[]>(DEFAULT_COUPONS);
  const [cartItems, setCartItems] = useState<CartPricingItem[]>([]);
  const [couponCode, setCouponCodeState] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState<FlyingItemAnimation | null>(null);
  const [cartBadgePulse, setCartBadgePulse] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const refreshStore = useCallback(() => {
    setProducts(store.getProducts());
    setCampaign(store.getCampaign());
    setCoupons(store.getCoupons());
  }, []);

  useEffect(() => {
    refreshStore();
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedCoupon = window.localStorage.getItem(COUPON_KEY);
      if (savedCoupon) setCouponCodeState(savedCoupon);

      const savedFavs = window.localStorage.getItem(FAVORITES_KEY);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecent = window.localStorage.getItem(RECENT_KEY);
      if (savedRecent) setRecentlyViewedIds(JSON.parse(savedRecent));
    } catch {
      // ignore storage errors
    }
    setHydrated(true);

    const handleStoreUpdate = () => {
      refreshStore();
    };
    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
  }, [refreshStore]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems, hydrated]);

  const setCouponCode = useCallback((code: string) => {
    setCouponCodeState(code);
    if (typeof window !== "undefined") {
      if (code) {
        window.localStorage.setItem(COUPON_KEY, code);
      } else {
        window.localStorage.removeItem(COUPON_KEY);
      }
    }
  }, []);

  const addToCart = useCallback(
    (
      item: Omit<CartPricingItem, "quantity"> & { quantity?: number },
      triggerCoords?: { x: number; y: number },
      openDrawer = true
    ) => {
      const qtyToAdd = item.quantity ?? 1;
      setCartItems((prev) => {
        const idx = prev.findIndex((i) => i.sku === item.sku);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + qtyToAdd,
          };
          return updated;
        }
        return [...prev, { ...item, quantity: qtyToAdd }];
      });

      setCartBadgePulse((c) => c + 1);

      if (triggerCoords && typeof window !== "undefined") {
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!prefersReduced) {
          setFlyingItem({
            id: Date.now(),
            image: item.image,
            startX: triggerCoords.x,
            startY: triggerCoords.y,
          });
          setTimeout(() => {
            setFlyingItem(null);
          }, 680);
        }
      }

      if (openDrawer) {
        setTimeout(
          () => {
            setCartDrawerOpen(true);
          },
          triggerCoords ? 320 : 0
        );
      }
    },
    []
  );

  const removeFromCart = useCallback((sku: string) => {
    setCartItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const updateQuantity = useCallback((sku: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.sku !== sku));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, quantity } : i))
    );
  }, []);

  const updateItemVariant = useCallback(
    (oldSku: string, newColor: string, newSize: ProductSize) => {
      setCartItems((prev) => {
        const currentItem = prev.find((i) => i.sku === oldSku);
        if (!currentItem) return prev;
        const product = products.find((p) => p.id === currentItem.productId);
        if (!product) return prev;

        const targetVariant = product.variants.find(
          (v) => v.color === newColor && v.size === newSize && v.stock > 0
        );
        if (!targetVariant) return prev;

        const newImage =
          product.images[newColor]?.[0] ?? currentItem.image;

        // Eğer hedef SKU zaten sepette varsa miktarları birleştir
        const existingTargetIdx = prev.findIndex(
          (i) => i.sku === targetVariant.sku && i.sku !== oldSku
        );
        if (existingTargetIdx >= 0) {
          return prev
            .map((item, idx) =>
              idx === existingTargetIdx
                ? { ...item, quantity: item.quantity + currentItem.quantity }
                : item
            )
            .filter((item) => item.sku !== oldSku);
        }

        return prev.map((item) =>
          item.sku === oldSku
            ? {
                ...item,
                sku: targetVariant.sku,
                color: newColor,
                size: newSize,
                image: newImage,
              }
            : item
        );
      });
    },
    [products]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCouponCode("");
  }, [setCouponCode]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [productId, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  const recordRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, 8);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getTotals = useCallback(
    (paymentMethod?: PaymentMethodType) =>
      calculateCartTotals({
        items: cartItems,
        couponCode,
        paymentMethod,
        shippingConfig: site.shipping,
        paymentConfig: site.payment,
        campaignConfig: campaign,
        availableCoupons: coupons,
      }),
    [cartItems, couponCode, campaign, coupons]
  );

  const resetDemo = useCallback(() => {
    store.resetDemoData();
    setCartItems([]);
    setCouponCode("");
    setFavorites([]);
    setRecentlyViewedIds([]);
    refreshStore();
  }, [refreshStore, setCouponCode]);

  const value = useMemo<ShopContextValue>(
    () => ({
      products,
      campaign,
      coupons,
      cartItems,
      couponCode,
      setCouponCode,
      getTotals,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemVariant,
      clearCart,
      favorites,
      toggleFavorite,
      isFavorite,
      recentlyViewedIds,
      recordRecentlyViewed,
      isCartDrawerOpen,
      setCartDrawerOpen,
      isSearchOpen,
      setSearchOpen,
      flyingItem,
      cartBadgePulse,
      resetDemo,
      refreshStore,
    }),
    [
      products,
      campaign,
      coupons,
      cartItems,
      couponCode,
      setCouponCode,
      getTotals,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemVariant,
      clearCart,
      favorites,
      toggleFavorite,
      isFavorite,
      recentlyViewedIds,
      recordRecentlyViewed,
      isCartDrawerOpen,
      isSearchOpen,
      flyingItem,
      cartBadgePulse,
      resetDemo,
      refreshStore,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return ctx;
}
