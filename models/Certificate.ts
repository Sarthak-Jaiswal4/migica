import mongoose, { Model, Schema } from "mongoose";

const CertificateSchema = new Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, default: "", trim: true },
  awardedOn: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Certificate: Model<{ title: string; issuer: string; awardedOn: string; description: string; image: string; order: number }> = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
export default Certificate;
