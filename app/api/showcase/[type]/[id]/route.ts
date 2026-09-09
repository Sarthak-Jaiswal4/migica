import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import HappyCustomer from "@/models/HappyCustomer";
import Exhibition from "@/models/Exhibition";
import type { Model } from "mongoose";

const models = { "happy-customers": HappyCustomer, exhibitions: Exhibition } as const;
type ShowcaseRecord = { image: string; order: number; [key: string]: unknown };

function getModel(type: string): Model<ShowcaseRecord> | undefined {
  const model = models[type as keyof typeof models];
  return model as unknown as Model<ShowcaseRecord> | undefined;
}

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  try {
    return (await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))).payload.isAdmin === true;
  } catch {
    return false;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  const Model = getModel(type);
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  const item = await Model.findByIdAndUpdate(id, await req.json(), { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  const Model = getModel(type);
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  await Model.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
