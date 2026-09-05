import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL?.trim()!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URL environment variable in .env.local");
}

// Cache connection in development to avoid reconnecting on every hot reload
let cached = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    }).then((mongoose) => mongoose)
      .catch((err) => {
        // Reset so the next call retries instead of reusing the failed promise
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
