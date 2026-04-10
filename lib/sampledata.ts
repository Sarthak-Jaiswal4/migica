// ========================================
// Centralized Sample Data
// Single source of truth for all mock data
// ========================================

// ---------- Interfaces ----------

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    originalPrice?: number;
    description?: string;
    quantity?: number;
    images?: string[];
    features?: string[];
    scent?: {
        top: string;
        middle: string;
        base: string;
    };
}

export interface Review {
    id: number;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
}

export interface CartItem {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
}

// ---------- Constants ----------

export const SHIPPING_COST = 99;

export const categories = [
    "All", "Aromatherapy", "Classic", "Fresh", "Seasonal", "Floral", "Woodsy", "Luxury"
];

// ---------- Single Master Product Array ----------

export const allProducts: Product[] = [
    // Candles
    { id: 1, name: "Lavender Dream", category: "Candles", price: 2099, image: "/jar candle.png", images: ["/1.jpeg", "/2.jpeg", "/3.jpeg"], rating: 4.8, reviews: 127, inStock: true, description: "A soothing blend of French lavender and vanilla bean, perfect for unwinding after a long day.", quantity: 50 },
    { id: 2, name: "Vanilla Bliss", category: "Candles", price: 1699, image: "/2.jpeg", images: ["/2.jpeg", "/1.jpeg", "/4.jpeg"], rating: 4.9, reviews: 203, inStock: true, description: "Classic creamy vanilla with a hint of toasted marshmallow and spice.", quantity: 35 },
    { id: 3, name: "Ocean Breeze", category: "Candles", price: 1899, image: "/3.jpeg", rating: 4.7, reviews: 89, inStock: true, description: "Refreshing oceanic fragrance with hints of sea salt and driftwood.", quantity: 40 },
    { id: 4, name: "Cinnamon Spice", category: "Candles", price: 2199, image: "/4.jpeg", rating: 4.6, reviews: 156, inStock: false, description: "Warm cinnamon and spice blend perfect for cozy evenings.", quantity: 0 },
    { id: 5, name: "Rose Garden", category: "Candles", price: 17499, image: "/5.jpeg", rating: 4.8, reviews: 142, inStock: true, description: "Delicate rose petals blended with fresh garden notes.", quantity: 25 },
    { id: 6, name: "Cedarwood & Sage", category: "Candles", price: 2399, image: "/3.jpeg", images: ["/3.jpeg", "/4.jpeg", "/1.jpeg"], rating: 4.9, reviews: 178, inStock: true, description: "Earthy cedarwood combined with fresh sage leaves for a grounding, natural aroma.", quantity: 20 },
    { id: 7, name: "Citrus Burst", category: "Candles", price: 1699, image: "/7.jpeg", rating: 4.7, reviews: 95, inStock: true, description: "Energizing citrus blend of lemon, orange, and grapefruit.", quantity: 30 },
    { id: 8, name: "Midnight Amber", category: "Candles", price: 2799, image: "/1.jpeg", images: ["/1.jpeg", "/3.jpeg", "/4.jpeg"], rating: 5.0, reviews: 234, inStock: true, description: "Deep, mysterious amber notes with a touch of patchouli and midnight jasmine.", quantity: 15 },
    { id: 9, name: "Midnight Rose", category: "Candles", price: 2199, image: "/4.jpeg", rating: 4.7, reviews: 89, inStock: true, description: "A romantic blend of midnight blooming roses.", quantity: 22 },

    // Scarves / Fashion Accessories
    { id: 201, name: "Silk Whisper", category: "Scarves", price: 3799, image: "/5.jpeg", images: ["/5.jpeg", "/6.jpeg"], rating: 5.0, reviews: 42, inStock: true, description: "Exquisite 100% mulberry silk scarf featuring a hand-painted floral design.", quantity: 10 },
    { id: 202, name: "Cashmere Cloud", category: "Scarves", price: 7399, image: "/6.jpeg", rating: 4.9, reviews: 67, inStock: true, description: "Ultra-soft cashmere wrap in a classic check pattern.", quantity: 12 },
    { id: 203, name: "Velvet Night", category: "Scarves", price: 2899, image: "/8.jpeg", rating: 4.8, reviews: 88, inStock: true, description: "Luxurious velvet scarf with an elegant midnight finish.", quantity: 18 },
    { id: 204, name: "Autumn Breeze", category: "Scarves", price: 2399, image: "/8.jpeg", rating: 4.7, reviews: 112, inStock: true, description: "Lightweight scarf in warm autumn tones.", quantity: 20 },
    { id: 203, name: "Velvet Night", category: "Scarves", price: 2899, image: "/8.jpeg", rating: 4.8, reviews: 88, inStock: true, description: "Luxurious velvet scarf with an elegant midnight finish.", quantity: 18 },
    
    // Jewelry
    { id: 301, name: "Golden Aura", category: "Jewelry", price: 9999, image: "/1.jpeg", images: ["/1.jpeg", "/2.jpeg"], rating: 4.9, reviews: 34, inStock: true, description: "Minimalist 14k gold-plated necklace with a delicate sunburst pendant.", quantity: 8 },
    { id: 302, name: "Silver Star", category: "Jewelry", price: 6199, image: "/2.jpeg", rating: 4.8, reviews: 56, inStock: true, description: "Sterling silver star pendant on a dainty chain.", quantity: 15 },
    { id: 303, name: "Emerald Eye", category: "Jewelry", price: 12499, image: "/3.jpeg", rating: 4.9, reviews: 28, inStock: true, description: "Emerald-cut gemstone ring in a vintage-inspired setting.", quantity: 5 },
    { id: 304, name: "Pearl Essence", category: "Jewelry", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Classic freshwater pearl drop earrings with gold accents.", quantity: 10 },

    // Gifts
    { id: 401, name: "Golden Aura Gift Set", category: "Gift", price: 9999, image: "/1.jpeg", rating: 4.9, reviews: 34, inStock: true, description: "Curated gift set featuring our best-selling golden accessories.", quantity: 12 },
    { id: 402, name: "Silver Star Gift Set", category: "Gift", price: 6199, image: "/2.jpeg", rating: 4.8, reviews: 56, inStock: true, description: "Elegant silver-themed gift box with premium packaging.", quantity: 14 },
    { id: 403, name: "Emerald Eye Gift Set", category: "Gift", price: 12499, image: "/3.jpeg", rating: 4.9, reviews: 28, inStock: true, description: "Luxurious emerald-themed spa and jewelry gift set.", quantity: 6 },
    { id: 404, name: "Pearl Essence Gift Set", category: "Gift", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Pearl-inspired beauty and accessory gift collection.", quantity: 9 },
    { id: 403, name: "Emerald Eye Gift Set", category: "Gift", price: 12499, image: "/3.jpeg", rating: 4.9, reviews: 28, inStock: true, description: "Luxurious emerald-themed spa and jewelry gift set.", quantity: 6 },
    { id: 404, name: "Pearl Essence Gift Set", category: "Gift", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Pearl-inspired beauty and accessory gift collection.", quantity: 9 },

    // T-Shirts
    { id: 501, name: "Golden Aura Tee", category: "T-Shirt", price: 9999, image: "/1.jpeg", rating: 4.9, reviews: 34, inStock: true, description: "Premium cotton tee with gold foil graphic print.", quantity: 30 },
    { id: 502, name: "Silver Star Tee", category: "T-Shirt", price: 6199, image: "/2.jpeg", rating: 4.8, reviews: 56, inStock: true, description: "Soft-touch cotton tee with silver star embroidery.", quantity: 25 },
    { id: 503, name: "Emerald Eye Tee", category: "T-Shirt", price: 12499, image: "/3.jpeg", rating: 4.9, reviews: 28, inStock: true, description: "Limited edition emerald graphic art tee.", quantity: 10 },
    { id: 504, name: "Pearl Essence Tee", category: "T-Shirt", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Minimalist pearl-toned organic cotton tee.", quantity: 20 },
    { id: 504, name: "Pearl Essence Tee", category: "T-Shirt", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Minimalist pearl-toned organic cotton tee.", quantity: 20 },
    { id: 504, name: "Pearl Essence Tee", category: "T-Shirt", price: 7899, image: "/4.jpeg", rating: 4.7, reviews: 45, inStock: true, description: "Minimalist pearl-toned organic cotton tee.", quantity: 20 },
];

// ---------- Derived Category Filters ----------

export const candleProducts = allProducts.filter(p => p.category === "Candles");
export const scarfProducts = allProducts.filter(p => p.category === "Scarves");
export const jewelryProducts = allProducts.filter(p => p.category === "Jewelry");
export const giftProducts = allProducts.filter(p => p.category === "Gift");
export const tShirtProducts = allProducts.filter(p => p.category === "T-Shirt");

// ---------- Curated Lists (derived from the same array) ----------

export const shopProducts = allProducts.filter(p => [1, 2, 3, 4, 5, 6, 7, 8].includes(p.id));
export const bestSellerProducts = allProducts.filter(p => [1, 2, 6, 8].includes(p.id));
export const relatedProducts = allProducts.filter(p => [2, 3, 5, 6].includes(p.id));

// Backward compat — admin pages use `products`
export const products = allProducts;

// ---------- Product Detail Page ----------

export const featuredProduct: Omit<Product, 'images'> & {
    originalPrice: number;
    images: { id: number; url: string; alt: string }[];
    features: string[];
    scent: { top: string; middle: string; base: string };
} = {
    id: 1,
    name: "Lavender Dream",
    category: "Aromatherapy",
    price: 2099,
    originalPrice: 2899,
    rating: 4.8,
    reviews: 127,
    inStock: true,
    image: "/1.jpeg",
    images: [
        { id: 1, url: "/1.jpg", alt: "Lavender Dream - Front view" },
        { id: 2, url: "/2.jpg", alt: "Lavender Dream - Side view" },
        { id: 3, url: "/3.jpg", alt: "Lavender Dream - Top view" },
        { id: 4, url: "/4.jpg", alt: "Lavender Dream - Lifestyle" },
    ],
    description: "Immerse yourself in the calming embrace of our Lavender Dream candle. Hand-poured with premium soy wax and infused with pure lavender essential oil, this candle creates a serene atmosphere perfect for relaxation and meditation. Each candle is carefully crafted to ensure an even burn and long-lasting fragrance.",
    features: [
        "100% Natural Soy Wax",
        "Lead-free Cotton Wick",
        "Burns for 40-50 hours",
        "Cruelty-free & Vegan",
        "Hand-poured in small batches",
        "Premium Glass Container"
    ],
    scent: {
        top: "French Lavender, Bergamot",
        middle: "Chamomile, Rosemary",
        base: "Vanilla, Cedarwood"
    }
};

// ---------- Reviews ----------

export const reviews: Review[] = [
    {
        id: 1,
        author: "Sarah M.",
        rating: 5,
        date: "2 days ago",
        title: "Absolutely amazing scent!",
        comment: "This candle exceeded my expectations. The lavender scent is so authentic and calming. Perfect for my evening meditation routine.",
        verified: true
    },
    {
        id: 2,
        author: "James K.",
        rating: 5,
        date: "1 week ago",
        title: "Best candle I've ever purchased",
        comment: "The quality is outstanding. Burns evenly and the scent fills the entire room without being overwhelming. Will definitely be ordering more!",
        verified: true
    },
    {
        id: 3,
        author: "Emily R.",
        rating: 4,
        date: "2 weeks ago",
        title: "Great product",
        comment: "Love the scent and the minimalist packaging. Only wish it came in a larger size!",
        verified: true
    }
];

// ---------- Cart Items ----------

export const cartItems: CartItem[] = [
    {
        id: 1,
        name: "Lavender Dream",
        category: "Aromatherapy",
        price: 2099,
        image: "/1.jpeg",
        quantity: 1,
    },
    {
        id: 2,
        name: "Vanilla Bliss",
        category: "Classic",
        price: 1699,
        image: "/2.jpeg",
        quantity: 2,
    },
];

// ---------- Helper Functions ----------

export const getProducts = () => allProducts;

export const getProductById = (id: number) => allProducts.find(p => p.id === id);

export const updateProduct = (updatedProduct: Product) => {
    const index = allProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
        allProducts[index] = updatedProduct;
        return true;
    }
    return false;
};

export const addProduct = (newProduct: Product) => {
    allProducts.push(newProduct);
    return true;
};
