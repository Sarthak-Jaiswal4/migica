import mongoose, { Model, Schema } from "mongoose";

const HappyCustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HappyCustomer: Model<{ name: string; caption: string; image: string; order: number }> =
  mongoose.models.HappyCustomer || mongoose.model("HappyCustomer", HappyCustomerSchema);

export default HappyCustomer;
