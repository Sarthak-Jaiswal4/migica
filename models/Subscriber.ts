import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;
