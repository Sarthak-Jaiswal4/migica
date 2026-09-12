import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/currentUser";
import PhoneVerification from "@/models/PhoneVerification";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await req.json();
  if (!/^\d{4,10}$/.test(String(code ?? ""))) return NextResponse.json({ error: "Enter the OTP sent by SMS" }, { status: 400 });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) return NextResponse.json({ error: "Phone verification is not configured yet" }, { status: 503 });

  await connectDB();
  const verification = await PhoneVerification.findOne({ userId });
  if (!verification || verification.expiresAt < new Date()) return NextResponse.json({ error: "Request a new OTP and try again" }, { status: 400 });

  const form = new URLSearchParams({ To: verification.phone, Code: String(code) });
  const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const result = await response.json() as { status?: string };
  if (!response.ok || result.status !== "approved") return NextResponse.json({ error: "That OTP is incorrect or has expired" }, { status: 400 });

  await User.findByIdAndUpdate(userId, { phone: verification.phone, phoneVerified: true });
  await PhoneVerification.deleteOne({ userId });
  return NextResponse.json({ ok: true, phone: verification.phone });
}
