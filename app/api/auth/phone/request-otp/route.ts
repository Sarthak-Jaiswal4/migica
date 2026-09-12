import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/currentUser";
import PhoneVerification from "@/models/PhoneVerification";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const indiaNumber = digits.length === 10 ? `91${digits}` : digits;
  return /^\d{11,15}$/.test(indiaNumber) ? `+${indiaNumber}` : null;
}

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, channel } = await req.json();
  const deliveryChannel = channel === "whatsapp" ? "whatsapp" : "sms";
  const normalizedPhone = normalizePhone(String(phone ?? ""));
  if (!normalizedPhone) return NextResponse.json({ error: "Enter a valid mobile number" }, { status: 400 });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) {
    return NextResponse.json({ error: "Phone verification is not configured yet" }, { status: 503 });
  }

  const form = new URLSearchParams({ To: normalizedPhone, Channel: deliveryChannel });
  const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  if (!response.ok) return NextResponse.json({ error: "Could not send the verification code" }, { status: 502 });

  await connectDB();
  await PhoneVerification.findOneAndUpdate(
    { userId },
    { phone: normalizedPhone, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true, new: true }
  );
  return NextResponse.json({ ok: true, phone: normalizedPhone, channel: deliveryChannel });
}
