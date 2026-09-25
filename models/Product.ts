import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  price: number;
  shortDescription?: string;
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
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [150, "Short description cannot exceed 150 characters"],
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price cannot be negative"],
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

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
