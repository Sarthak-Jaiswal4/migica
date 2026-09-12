import mongoose, { Model, Schema } from "mongoose";

const PhoneVerificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const PhoneVerification: Model<{ userId: string; phone: string; expiresAt: Date }> =
  mongoose.models.PhoneVerification || mongoose.model("PhoneVerification", PhoneVerificationSchema);

export default PhoneVerification;
