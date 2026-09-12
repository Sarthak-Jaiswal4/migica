import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import HappyCustomer from "@/models/HappyCustomer";
import Exhibition from "@/models/Exhibition";
import Testimonial from "@/models/Testimonial";
import HeroMedia from "@/models/HeroMedia";
import type { Model } from "mongoose";

const models = { "happy-customers": HappyCustomer, exhibitions: Exhibition, testimonials: Testimonial, "hero-media": HeroMedia } as const;
type ShowcaseType = keyof typeof models;
type ShowcaseRecord = { image: string; order: number; [key: string]: unknown };

function getModel(type: string): Model<ShowcaseRecord> | undefined {
  const model = models[type as ShowcaseType];
  return model as unknown as Model<ShowcaseRecord> | undefined;
}

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return (await jwtVerify(token, secret)).payload.isAdmin === true;
  } catch {
    return false;
  }
}

function serialize(item: { toObject(): Record<string, unknown> }) {
  const document = item.toObject();
  const id = String(document._id ?? "");
  delete document._id;
  delete document.__v;
  return { ...document, id };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const Model = getModel(type);
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
  return NextResponse.json({ items: items.map(serialize) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const Model = getModel(type);
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  if (type === "hero-media" && await Model.countDocuments() >= 5) {
    return NextResponse.json({ error: "A maximum of five hero media items is allowed" }, { status: 400 });
  }
  const body = await req.json();
  const order = await Model.countDocuments();
  const item = await Model.create({ ...body, order });
  return NextResponse.json({ item: serialize(item) }, { status: 201 });
}
