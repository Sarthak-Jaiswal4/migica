import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/product";

export type { CartProduct, WishlistEntry, RecentlyVisitedEntry, UserInfo } from "./userStore";
export { useUserStore, useCartStore } from "./userStore";

export type ProductDetail = Omit<Product, "images" | "features" | "scent" | "quantity"> & {
  images: { id: string; url: string; alt: string }[];
  features: string[];
  scent: { top: string; middle: string; base: string };
};

interface ProductStore {
  productById: Record<string, ProductDetail>;
  productsPoolById: Record<string, Product>;
  productFetchedAtById: Record<string, number>;
  relatedFetchedAtById: Record<string, number>;
  relatedByProductId: Record<string, string[]>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string | null>;
  fetchProductPageData: (id: string) => Promise<void>;
}

const PRODUCT_CACHE_TTL_MS = 1000 * 60 * 15;

const isFresh = (fetchedAt?: number): boolean => {
  if (!fetchedAt) return false;
  return Date.now() - fetchedAt < PRODUCT_CACHE_TTL_MS;
};

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

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      productById: {},
      productsPoolById: {},
      productFetchedAtById: {},
      relatedFetchedAtById: {},
      relatedByProductId: {},
      loadingById: {},
      errorById: {},

      fetchProductPageData: async (id: string) => {
        if (!id) return;

        const state = get();
        const hasProduct = Boolean(state.productById[id]);
        const hasRelated = id in state.relatedByProductId;
        const hasFreshProduct = hasProduct && isFresh(state.productFetchedAtById[id]);
        const hasFreshRelated = hasRelated && isFresh(state.relatedFetchedAtById[id]);
        const isLoading = Boolean(state.loadingById[id]);

        if ((hasFreshProduct && hasFreshRelated) || isLoading) {
          return;
        }
        // Build related from already cached catalog items before hitting API again.
        if (!hasFreshRelated) {
          const pooledRelated = Object.values(state.productsPoolById).filter((p) => p.id !== id);
          if (pooledRelated.length > 0) {
            set((current) => ({
              relatedByProductId: { ...current.relatedByProductId, [id]: pooledRelated.map((p) => p.id) },
              relatedFetchedAtById: { ...current.relatedFetchedAtById, [id]: Date.now() },
            }));
          }
        }

        // If product already exists in pool, promote it to detail without API.
        if (!hasFreshProduct && state.productsPoolById[id]) {
          set((current) => ({
            productById: { ...current.productById, [id]: toProductDetail(state.productsPoolById[id]) },
            productFetchedAtById: { ...current.productFetchedAtById, [id]: Date.now() },
          }));
          if (isFresh(get().relatedFetchedAtById[id])) return;
        }

        set((current) => ({
          loadingById: { ...current.loadingById, [id]: true },
          errorById: { ...current.errorById, [id]: null },
        }));

        try {
          const nextState = get();
          const needDetail = !isFresh(nextState.productFetchedAtById[id]);
          const needRelated = !isFresh(nextState.relatedFetchedAtById[id]);

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
              nextRelatedByProductId[id] = related.map((p) => p.id);
              for (const product of related) {
                nextProductsPoolById[product.id] = product;
              }
            }

            return {
              productById: nextProductById,
              productsPoolById: nextProductsPoolById,
              productFetchedAtById: {
                ...current.productFetchedAtById,
                ...(detailJson?.product ? { [id]: Date.now() } : {}),
              },
              relatedFetchedAtById: {
                ...current.relatedFetchedAtById,
                ...(relatedJson?.products ? { [id]: Date.now() } : {}),
              },
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
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        productById: state.productById,
        productsPoolById: state.productsPoolById,
        productFetchedAtById: state.productFetchedAtById,
        relatedFetchedAtById: state.relatedFetchedAtById,
        relatedByProductId: state.relatedByProductId,
      }),
    }
  )
);
