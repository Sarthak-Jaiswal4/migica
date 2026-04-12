import { create } from "zustand";

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
