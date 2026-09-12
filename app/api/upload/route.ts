import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import cloudinary from "@/lib/cloudinary";

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

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = formData.get("folder");
    const folder = requestedFolder === "happy-customers" || requestedFolder === "exhibitions" || requestedFolder === "hero-media"
      ? requestedFolder
      : "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const allowsVideo = folder === "hero-media" || folder === "products";
    if (!file.type.startsWith("image/") && !(allowsVideo && isVideo)) {
      return NextResponse.json({ error: "Please upload an image or video file" }, { status: 400 });
    }
    if (folder === "hero-media" && isVideo && file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Hero videos must be 25 MB or smaller" }, { status: 400 });
    }
    if (folder === "products" && isVideo && file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Product videos must be 20 MB or smaller" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `silver_star/${folder}`,
            resource_type: isVideo ? "video" : "image",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
              });
            } else reject(new Error("Cloudinary did not return an upload result"));
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
