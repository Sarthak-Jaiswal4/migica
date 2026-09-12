import mongoose, { Model, Schema } from "mongoose";

const TestimonialSchema = new Schema(
  {
    body: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    detail: { type: String, default: "", trim: true },
    stars: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Testimonial: Model<{ body: string; name: string; detail: string; stars: number; order: number }> =
  mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;
