import mongoose, { Model, Schema } from "mongoose";

const HeroMediaSchema = new Schema(
  {
    url: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HeroMedia: Model<{ url: string; mediaType: "image" | "video"; title: string; description: string; alt: string; order: number }> =
  mongoose.models.HeroMedia || mongoose.model("HeroMedia", HeroMediaSchema);

export default HeroMedia;
