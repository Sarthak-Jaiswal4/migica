/** Client / API shape for a catalog product (Mongo `_id` exposed as `id` for UI). */
export type Product = {
  id: string;
  _id?: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image: string;
  images?: string[];
  hoverImage?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity: number;
  features?: string[];
  scent?: { top: string; middle: string; base: string };
  createdAt?: string;
  updatedAt?: string;
};
