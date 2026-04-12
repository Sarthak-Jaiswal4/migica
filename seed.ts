import mongoose from "mongoose";
import User from "./models/User";
import Product from "./models/Product";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

/** Catalog rows: images are assigned at read time from /public (not stored in Mongo). */
const seedProducts = [
  // Candles
  { name: "Lavender Dream", category: "Candles", price: 2099, description: "French lavender and vanilla bean in a clean-burning soy blend.", rating: 4.8, reviews: 127, inStock: true, quantity: 50, originalPrice: 2599 },
  { name: "Vanilla Bliss", category: "Candles", price: 1699, description: "Creamy vanilla with toasted marshmallow warmth.", rating: 4.9, reviews: 203, inStock: true, quantity: 35 },
  { name: "Ocean Breeze", category: "Candles", price: 1899, description: "Sea salt, driftwood, and airy citrus.", rating: 4.7, reviews: 89, inStock: true, quantity: 40 },
  { name: "Cinnamon Spice", category: "Candles", price: 2199, description: "Baked cinnamon, clove, and brown sugar.", rating: 4.6, reviews: 156, inStock: false, quantity: 0 },
  { name: "Rose Garden", category: "Candles", price: 2499, description: "Dewy rose petals and green stems.", rating: 4.8, reviews: 142, inStock: true, quantity: 25 },
  { name: "Cedarwood & Sage", category: "Candles", price: 2399, description: "Grounding cedar and fresh culinary sage.", rating: 4.9, reviews: 178, inStock: true, quantity: 20 },
  { name: "Citrus Burst", category: "Candles", price: 1699, description: "Grapefruit, lemon zest, and bergamot spark.", rating: 4.7, reviews: 95, inStock: true, quantity: 30 },
  { name: "Midnight Amber", category: "Candles", price: 2799, description: "Amber resin, patchouli, and soft jasmine.", rating: 5.0, reviews: 234, inStock: true, quantity: 15 },
  { name: "Sandalwood Glow", category: "Candles", price: 2299, description: "Creamy sandalwood with a touch of tonka.", rating: 4.85, reviews: 88, inStock: true, quantity: 28 },
  { name: "White Tea & Ginger", category: "Candles", price: 1999, description: "Delicate white tea leaves and bright ginger.", rating: 4.75, reviews: 64, inStock: true, quantity: 33 },
  { name: "Fig Orchard", category: "Candles", price: 2599, description: "Black fig, green leaves, and sun-warmed wood.", rating: 4.9, reviews: 112, inStock: true, quantity: 18 },
  { name: "Snow Pine", category: "Seasonal", price: 2199, description: "Crisp pine needles, mint, and frosted air.", rating: 4.8, reviews: 201, inStock: true, quantity: 44 },
  { name: "Pumpkin Soufflé", category: "Seasonal", price: 1899, description: "Roasted pumpkin, nutmeg, and caramel cream.", rating: 4.7, reviews: 167, inStock: true, quantity: 36 },
  // Aromatherapy
  { name: "Eucalyptus Clarity", category: "Aromatherapy", price: 1999, description: "Clearing eucalyptus and spearmint for focus.", rating: 4.82, reviews: 76, inStock: true, quantity: 42 },
  { name: "Chamomile Calm", category: "Aromatherapy", price: 1799, description: "Apple chamomile and honeyed musk.", rating: 4.78, reviews: 54, inStock: true, quantity: 39 },
  { name: "Peppermint Focus", category: "Aromatherapy", price: 1899, description: "Cool peppermint with a hint of rosemary.", rating: 4.65, reviews: 41, inStock: true, quantity: 31 },
  // Fresh / Floral / Woodsy / Luxury
  { name: "Rain on Leaves", category: "Fresh", price: 2099, description: "Petrichor, wet stone, and crushed mint.", rating: 4.72, reviews: 59, inStock: true, quantity: 27 },
  { name: "Linen Sky", category: "Fresh", price: 1949, description: "Line-dried cotton, ozone, and soft musk.", rating: 4.68, reviews: 48, inStock: true, quantity: 29 },
  { name: "Peony Blush", category: "Floral", price: 2249, description: "Pink peony, rose water, and sheer peony petals.", rating: 4.86, reviews: 93, inStock: true, quantity: 24 },
  { name: "Jasmine Noir", category: "Floral", price: 2399, description: "Night-blooming jasmine with dark plum.", rating: 4.81, reviews: 71, inStock: true, quantity: 22 },
  { name: "Oud & Ember", category: "Woodsy", price: 3199, description: "Smoky oud, birch tar, and spiced cardamom.", rating: 4.92, reviews: 118, inStock: true, quantity: 16 },
  { name: "Forest Floor", category: "Woodsy", price: 2499, description: "Moss, vetiver, and damp cedar bark.", rating: 4.77, reviews: 63, inStock: true, quantity: 21 },
  { name: "Goldleaf Reserve", category: "Luxury", price: 4299, description: "Saffron, honeyed amber, and velvet rose.", rating: 4.95, reviews: 45, inStock: true, quantity: 12 },
  { name: "Crystal Musk", category: "Luxury", price: 3999, description: "Mineral musk, iris butter, and white woods.", rating: 4.9, reviews: 38, inStock: true, quantity: 11 },
  // Scarves
  { name: "Silk Whisper", category: "Scarves", price: 3799, description: "Hand-finished mulberry silk in a soft floral.", rating: 5.0, reviews: 42, inStock: true, quantity: 10 },
  { name: "Cashmere Cloud", category: "Scarves", price: 7399, description: "Featherlight cashmere wrap in classic check.", rating: 4.9, reviews: 67, inStock: true, quantity: 12 },
  { name: "Velvet Night", category: "Scarves", price: 2899, description: "Deep-toned velvet scarf with satin edge.", rating: 4.8, reviews: 88, inStock: true, quantity: 18 },
  { name: "Autumn Plaid", category: "Scarves", price: 2399, description: "Warm wool blend in heritage plaid.", rating: 4.7, reviews: 112, inStock: true, quantity: 20 },
  { name: "Linen Stripe", category: "Scarves", price: 2199, description: "Breathable linen for sun-season layering.", rating: 4.66, reviews: 35, inStock: true, quantity: 26 },
  { name: "Merino Rib", category: "Scarves", price: 3299, description: "Rib-knit merino with rolled hem.", rating: 4.84, reviews: 52, inStock: true, quantity: 17 },
  // Jewelry
  { name: "Golden Aura", category: "Jewelry", price: 9999, description: "Gold-plated sunburst pendant on fine chain.", rating: 4.9, reviews: 34, inStock: true, quantity: 8 },
  { name: "Silver Star", category: "Jewelry", price: 6199, description: "Sterling silver star charm necklace.", rating: 4.8, reviews: 56, inStock: true, quantity: 15 },
  { name: "Emerald Eye", category: "Jewelry", price: 12499, description: "Vintage-inspired emerald-cut ring.", rating: 4.9, reviews: 28, inStock: true, quantity: 5 },
  { name: "Pearl Essence", category: "Jewelry", price: 7899, description: "Freshwater pearl drops with gold accents.", rating: 4.7, reviews: 45, inStock: true, quantity: 10 },
  { name: "Moonbeam Hoops", category: "Jewelry", price: 5499, description: "Hammered silver hoops with satin finish.", rating: 4.75, reviews: 61, inStock: true, quantity: 14 },
  { name: "Onyx Signet", category: "Jewelry", price: 6899, description: "Matte onyx in a polished signet setting.", rating: 4.83, reviews: 29, inStock: true, quantity: 9 },
  // Gift
  { name: "Golden Aura Gift Set", category: "Gift", price: 10999, description: "Necklace, cloth pouch, and polishing cloth.", rating: 4.9, reviews: 34, inStock: true, quantity: 12 },
  { name: "Silver Star Gift Set", category: "Gift", price: 6999, description: "Curated silver pieces in a keepsake box.", rating: 4.8, reviews: 56, inStock: true, quantity: 14 },
  { name: "Emerald Eye Gift Set", category: "Gift", price: 12999, description: "Ring presentation with ribboned packaging.", rating: 4.9, reviews: 28, inStock: true, quantity: 6 },
  { name: "Pearl Essence Gift Set", category: "Gift", price: 8499, description: "Pearl earrings with artisan gift wrap.", rating: 4.7, reviews: 45, inStock: true, quantity: 9 },
  { name: "Candle Trio Mini", category: "Gift", price: 4599, description: "Three votives in bestseller scents.", rating: 4.88, reviews: 140, inStock: true, quantity: 55 },
  { name: "Spa Night Box", category: "Gift", price: 5299, description: "Candle, silk eye mask, and bath salts.", rating: 4.79, reviews: 73, inStock: true, quantity: 23 },
  // T-Shirt
  { name: "Golden Aura Tee", category: "T-Shirt", price: 2499, description: "Organic cotton tee with soft gold print.", rating: 4.9, reviews: 34, inStock: true, quantity: 30 },
  { name: "Silver Star Tee", category: "T-Shirt", price: 2199, description: "Relaxed fit with embroidered star.", rating: 4.8, reviews: 56, inStock: true, quantity: 25 },
  { name: "Emerald Eye Tee", category: "T-Shirt", price: 2699, description: "Limited emerald graphic on heavyweight cotton.", rating: 4.9, reviews: 28, inStock: true, quantity: 10 },
  { name: "Pearl Essence Tee", category: "T-Shirt", price: 2399, description: "Pearl-toned mineral dye finish.", rating: 4.7, reviews: 45, inStock: true, quantity: 20 },
  { name: "Magica Logo Tee", category: "T-Shirt", price: 1999, description: "Unisex staple with tonal chest mark.", rating: 4.65, reviews: 102, inStock: true, quantity: 48 },
  { name: "Artist Series Tee", category: "T-Shirt", price: 2899, description: "Small-batch print collaboration.", rating: 4.8, reviews: 37, inStock: true, quantity: 19 },
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGO_URL;
    if (!MONGODB_URI) {
      throw new Error("MONGO_URL missing in .env.local");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding");

    await User.deleteMany({});
    console.log("Cleared existing users");
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const adminUser = new User({
      email: "admin@gmail.com",
      password: "password123",
    });

    await adminUser.save();
    console.log("Admin user seeded successfully: admin@gmail.com / password123");

    const productDocuments = seedProducts.map((p) => ({
      ...p,
      description: p.description || "",
      image: "",
      images: [] as string[],
      features: [] as string[],
      scent: { top: "", middle: "", base: "" },
    }));

    await Product.insertMany(productDocuments);
    console.log(`Successfully seeded ${productDocuments.length} products into the database.`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    await mongoose.connection.close();
  }
}

seed();
