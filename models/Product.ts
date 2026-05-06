import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  description: string;
  originalPrice?: number;
  images: string[];
  image: string;
  features: string[];
  scent: { top: string; middle: string; base: string };
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      default: "",
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    scent: {
      top: { type: String, default: "" },
      middle: { type: String, default: "" },
      base: { type: String, default: "" },
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
