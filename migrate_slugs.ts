import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      if (!product.get("slug")) {
        const baseSlug = product.get("name").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        let uniqueSlug = baseSlug;
        let count = 1;
        while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })) {
            uniqueSlug = `${baseSlug}-${count}`;
            count++;
        }
        product.set("slug", uniqueSlug);
        await product.save();
        console.log(`Updated product ${product._id} with slug ${uniqueSlug}`);
      }
    }
    console.log("Migration complete.");
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
