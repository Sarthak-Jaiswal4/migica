import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getCurrentUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return (jwt.verify(token, process.env.JWT_SECRET) as { userId: string }).userId;
  } catch {
    return null;
  }
}
