import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    const user = await User.create({
      email,
      password,
      name,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: email,
          subject: "Welcome to Magica!",
          html: `<h1>Welcome ${name || ""}!</h1><p>Your account has been successfully created.</p>`,
        });
      } catch (err) {
        console.error("Resend email error:", err);
      }
    }

    return NextResponse.json(
      { message: "Registration successful", userId: user._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
