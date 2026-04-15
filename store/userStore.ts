import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

export type WishlistEntry = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  addedAt: number;
  /** Optional; older saved wishlists may omit this */
  inStock?: boolean;
};

export type RecentlyVisitedEntry = {
  id: string;
  name: string;
  image: string;
  visitedAt: number;
};

export type UserInfo = {
  /** User dismissed the "sign up to save wishlist" banner */
  wishlistSignupNudgeDismissed?: boolean;
};

const MAX_RECENTLY_VISITED = 15;

const LEGACY_CART_KEY = "magica-cart-store";
const USER_STORE_KEY = "magica-user-store";

function readLegacyCartItems(): CartProduct[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_CART_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { items?: CartProduct[] } };
    const items = parsed?.state?.items;
    if (Array.isArray(items) && items.length > 0) {
      localStorage.removeItem(LEGACY_CART_KEY);
      return items;
    }
  } catch {
    // ignore
  }
  return null;
}

interface UserStoreState {
  items: CartProduct[];
  wishlist: WishlistEntry[];
  recentlyVisited: RecentlyVisitedEntry[];
  info: UserInfo;

  addItem: (product: Omit<CartProduct, "quantity">) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;

  toggleWishlist: (product: Omit<WishlistEntry, "addedAt"> & { inStock?: boolean }) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: () => number;

  recordVisit: (entry: Omit<RecentlyVisitedEntry, "visitedAt">) => void;

  dismissWishlistSignupNudge: () => void;
  setUserInfo: (partial: Partial<UserInfo>) => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      recentlyVisited: [],
      info: {},

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      incrementQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
        }));
      },

      decrementQuantity: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (item && item.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)),
          };
        });
      },

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        return item?.quantity ?? 0;
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((w) => w.id === product.id);
          if (exists) {
            return { wishlist: state.wishlist.filter((w) => w.id !== product.id) };
          }
          return {
            wishlist: [
              ...state.wishlist,
              { ...product, addedAt: Date.now() },
            ],
          };
        });
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishlist: state.wishlist.filter((w) => w.id !== id),
        }));
      },

      isInWishlist: (id) => get().wishlist.some((w) => w.id === id),

      wishlistCount: () => get().wishlist.length,

      recordVisit: (entry) => {
        set((state) => {
          const next = [
            { ...entry, visitedAt: Date.now() },
            ...state.recentlyVisited.filter((r) => r.id !== entry.id),
          ].slice(0, MAX_RECENTLY_VISITED);
          return { recentlyVisited: next };
        });
      },

      dismissWishlistSignupNudge: () => {
        set((state) => ({
          info: { ...state.info, wishlistSignupNudgeDismissed: true },
        }));
      },

      setUserInfo: (partial) => {
        set((state) => ({
          info: { ...state.info, ...partial },
        }));
      },
    }),
    {
      name: USER_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        recentlyVisited: state.recentlyVisited,
        info: state.info,
      }),
      merge: (persistedState, currentState) => {
        const p = (persistedState ?? {}) as Partial<
          Pick<UserStoreState, "items" | "wishlist" | "recentlyVisited" | "info">
        >;
        const merged: UserStoreState = {
          ...currentState,
          items: p.items ?? currentState.items,
          wishlist: p.wishlist ?? currentState.wishlist,
          recentlyVisited: p.recentlyVisited ?? currentState.recentlyVisited,
          info: { ...currentState.info, ...p.info },
        };
        if (typeof window !== "undefined") {
          const migrated = readLegacyCartItems();
          if (migrated && merged.items.length === 0) {
            merged.items = migrated;
          }
        }
        return merged;
      },
    }
  )
);

/** @deprecated Prefer `useUserStore` — kept for existing imports */
export const useCartStore = useUserStore;
