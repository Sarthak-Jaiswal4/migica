import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/product";

export interface CartProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartProduct[];
  addItem: (product: Omit<CartProduct, "quantity">) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export type ProductDetail = Omit<Product, "images" | "features" | "scent" | "quantity"> & {
  images: { id: string; url: string; alt: string }[];
  features: string[];
  scent: { top: string; middle: string; base: string };
};

interface ProductStore {
  productById: Record<string, ProductDetail>;
  productsPoolById: Record<string, Product>;
  relatedByProductId: Record<string, Product[]>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string | null>;
  fetchProductPageData: (id: string) => Promise<void>;
}

const toProductDetail = (p: Product & { _id?: string }): ProductDetail => {
  const rawUrls = (Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]).filter(Boolean);
  const urls = Array.from(new Set(rawUrls as string[]));
  const features =
    Array.isArray(p.features) && p.features.length > 0
      ? p.features
      : [
          "Premium materials",
          "Small-batch craftsmanship",
          "Thoughtful packaging",
          "Designed for everyday ritual",
        ];

  return {
    ...p,
    id: String(p._id ?? p.id),
    images: urls.map((url: string, i: number) => ({
      id: `img-${i}`,
      url,
      alt: `${p.name} — ${i + 1}`,
    })),
    features,
    scent: p.scent?.top ? p.scent : { top: "Opening notes", middle: "Heart notes", base: "Base notes" },
  };
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

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
}));

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      productById: {},
      productsPoolById: {},
      relatedByProductId: {},
      loadingById: {},
      errorById: {},

      fetchProductPageData: async (id: string) => {
        if (!id) return;

        const state = get();
        const hasProduct = Boolean(state.productById[id]);
        const hasRelated = id in state.relatedByProductId;
        const isLoading = Boolean(state.loadingById[id]);

        if ((hasProduct && hasRelated) || isLoading) {
          return;
        }
        // Build related from already cached catalog items before hitting API again.
        if (!hasRelated) {
          const pooledRelated = Object.values(state.productsPoolById).filter((p) => p.id !== id);
          if (pooledRelated.length > 0) {
            set((current) => ({
              relatedByProductId: { ...current.relatedByProductId, [id]: pooledRelated },
            }));
          }
        }

        // If product already exists in pool, promote it to detail without API.
        if (!hasProduct && state.productsPoolById[id]) {
          set((current) => ({
            productById: { ...current.productById, [id]: toProductDetail(state.productsPoolById[id]) },
          }));
          if (id in get().relatedByProductId) return;
        }

        set((current) => ({
          loadingById: { ...current.loadingById, [id]: true },
          errorById: { ...current.errorById, [id]: null },
        }));

        try {
          const nextState = get();
          const needDetail = !nextState.productById[id];
          const needRelated = !(id in nextState.relatedByProductId);

          const detailPromise = needDetail ? fetch(`/api/products/${id}`) : Promise.resolve(null);
          const relatedPromise = needRelated ? fetch(`/api/products?relatedTo=${encodeURIComponent(id)}`) : Promise.resolve(null);

          const [detailRes, relatedRes] = await Promise.all([detailPromise, relatedPromise]);
          const detailJson = detailRes ? await detailRes.json() : null;
          const relatedJson = relatedRes ? await relatedRes.json() : null;

          set((current) => {
            const nextProductById = { ...current.productById };
            const nextProductsPoolById = { ...current.productsPoolById };
            const nextRelatedByProductId = { ...current.relatedByProductId };

            if (detailJson?.product) {
              const p = detailJson.product as Product & { _id: string };
              const normalized = { ...p, id: String(p._id) };
              nextProductById[id] = toProductDetail(normalized);
              nextProductsPoolById[id] = normalized;
            }

            if (relatedJson?.products) {
              const related = relatedJson.products.map((rp: { _id: string }) => ({
                ...rp,
                id: String(rp._id),
              })) as Product[];
              nextRelatedByProductId[id] = related;
              for (const product of related) {
                nextProductsPoolById[product.id] = product;
              }
            }

            return {
              productById: nextProductById,
              productsPoolById: nextProductsPoolById,
              relatedByProductId: nextRelatedByProductId,
            };
          });
        } catch (error) {
          console.error("Failed to fetch product", error);
          set((current) => ({
            errorById: { ...current.errorById, [id]: "Failed to load product" },
          }));
        } finally {
          set((current) => ({
            loadingById: { ...current.loadingById, [id]: false },
          }));
        }
      },
    }),
    {
      name: "magica-product-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        productById: state.productById,
        productsPoolById: state.productsPoolById,
        relatedByProductId: state.relatedByProductId,
      }),
    }
  )
);
