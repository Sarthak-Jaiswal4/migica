import mongoose, { Model, Schema } from "mongoose";

const ExhibitionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Exhibition: Model<{ title: string; location: string; description: string; image: string; order: number }> =
  mongoose.models.Exhibition || mongoose.model("Exhibition", ExhibitionSchema);

export default Exhibition;
