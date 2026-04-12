import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { jwtVerify } from "jose";
import { attachPublicImages } from "@/lib/publicProductImages";

async function checkAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.isAdmin === true;
  } catch {
    return false;
  }
}

function stripPresentationFields(body: object) {
  const { _id, __v, id, image, images, hoverImage, ...rest } = body as Record<string, unknown>;
  return rest;
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const data = stripPresentationFields((await req.json()) as object);

    const product = new Product(data);
    await product.save();

    const plain = product.toObject();
    return NextResponse.json(
      { product: attachPublicImages(plain), message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const relatedTo = req.nextUrl.searchParams.get("relatedTo");

    if (relatedTo) {
      const anchor = await Product.findById(relatedTo).lean();
      if (!anchor) {
        return NextResponse.json({ products: [] }, { status: 200 });
      }
      const others = await Product.find({
        category: anchor.category,
        _id: { $ne: relatedTo },
      })
        .sort({ rating: -1, reviews: -1 })
        .limit(12)
        .lean();
      const enriched = others.map((p) => attachPublicImages(p));
      return NextResponse.json({ products: enriched }, { status: 200 });
    }

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    const enriched = products.map((p) => attachPublicImages(p));
    return NextResponse.json({ products: enriched }, { status: 200 });
  } catch (error: unknown) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
