import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already subscribed
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "You are already subscribed!" },
        { status: 400 }
      );
    }

    // Save subscriber to DB
    await Subscriber.create({ email });

    // Send Welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Silver Star <welcome@silverstar.live>",
          to: email,
          subject: "Welcome to Silver Star! ✨",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Silver Star</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: #FDFAF7;
                  color: #2C1810;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 40px 20px;
                }
                .card {
                  background-color: #ffffff;
                  border-radius: 12px;
                  padding: 40px;
                  box-shadow: 0 4px 20px rgba(44, 24, 16, 0.05);
                  border: 1px solid #E8D5C8;
                  text-align: center;
                }
                .logo {
                  font-size: 28px;
                  font-weight: 800;
                  letter-spacing: 0.15em;
                  color: #2C1810;
                  text-transform: uppercase;
                  margin-bottom: 24px;
                }
                .badge {
                  background-color: #ffcf00;
                  color: #2C1810;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 6px 14px;
                  border-radius: 50px;
                  display: inline-block;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  margin-bottom: 20px;
                }
                h1 {
                  font-size: 24px;
                  font-weight: 700;
                  margin-bottom: 16px;
                  color: #2C1810;
                }
                p {
                  font-size: 15px;
                  line-height: 1.6;
                  color: #5C4B43;
                  margin-bottom: 30px;
                  text-align: left;
                }
                .divider {
                  height: 1px;
                  background-color: #E8D5C8;
                  margin: 30px 0;
                }
                .highlight-box {
                  background-color: #FDFAF7;
                  border-left: 4px solid #C9956C;
                  padding: 16px;
                  text-align: left;
                  border-radius: 0 8px 8px 0;
                  margin-bottom: 30px;
                }
                .highlight-box p {
                  margin: 0;
                  font-size: 14px;
                  color: #2C1810;
                  font-weight: 600;
                }
                .footer {
                  font-size: 12px;
                  color: #8C6E5D;
                  margin-top: 30px;
                  line-height: 1.5;
                }
                .footer-links a {
                  color: #C9956C;
                  text-decoration: none;
                  margin: 0 10px;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="card">
                  <div class="logo">Silver Star</div>
                  <div class="badge">Newsletter Subscription</div>
                  <h1>Thank you for joining us!</h1>
                  <p>
                    Hello there,
                  </p>
                  <p>
                    We've successfully registered your email for updates. Our brand new online store is currently under construction, but we are working tirelessly behind the scenes to craft a premium shopping experience featuring our handcrafted soy candles, jewellery, and gifts.
                  </p>
                  <div class="highlight-box">
                    <p>🎁 Launch Day Surprise: Since you subscribed early, we will send an exclusive surprise discount code straight to your inbox the moment we go live!</p>
                  </div>
                  <p>
                    We can't wait to share what we've been working on. Stay tuned, and we'll keep you posted!
                  </p>
                  <div class="divider"></div>
                  <div class="footer">
                    <p style="text-align: center; margin-bottom: 10px;">
                      © ${new Date().getFullYear()} Silver Star. All rights reserved.
                    </p>
                    <div class="footer-links">
                      <a href="https://www.silverstar.live">Visit Website</a>
                    </div>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (err) {
        console.error("Resend email error:", err);
        // Do not fail the whole request if email sending fails, as long as it saved to DB.
      }
    } else {
      console.warn("Resend API key not configured. Welcome email was not sent, but subscriber was saved to DB.");
    }

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Subscription endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
