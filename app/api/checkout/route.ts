import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
    const userId = decoded.userId;

    const { name, address, city, zipCode, country, items, couponCode } = await req.json();

    if (!address || !city || !zipCode || !country) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.phoneVerified) {
      return NextResponse.json({ error: "Verify your phone number before checkout" }, { status: 403 });
    }

    // Update user with address
    user.name = name || user.name;
    user.address = address;
    user.city = city;
    user.zipCode = zipCode;
    user.country = country;
    await user.save();

    // Prepare email content & calculate total
    let cartHtml = `<h2>Order Summary</h2><ul>`;
    let total = 0;
    if (items && Array.isArray(items)) {
        for (const item of items as Array<{ name: string; quantity: number; price: number }>) {
            cartHtml += `<li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`;
            total += item.price * item.quantity;
        }
    }
    let discount = 0;
    if (couponCode === "SILVERSTAR10") discount = total * 0.10;
    else if (couponCode === "WELCOME20") discount = total * 0.20;
    
    // Add shipping cost logic to backend to be accurate
    const shipping = items && items.length > 0 ? 50 : 0; // Assuming SHIPPING_COST is 50
    const finalTotal = Math.max(0, total - discount + shipping);

    if (discount > 0) {
        cartHtml += `<li style="color: #059669;">Discount (${couponCode}): -₹${discount.toFixed(2)}</li>`;
    }
    cartHtml += `<li>Shipping: ₹${shipping.toFixed(2)}</li>`;
    cartHtml += `</ul><h3>Total: ₹${finalTotal.toFixed(2)}</h3>`;

    // Create Order in DB
    const newOrder = new Order({
      user: user._id,
      items: (items as Array<{ id?: string; _id?: string; productId?: string; name: string; price: number; quantity: number; image: string }>).map((i) => ({
        productId: i.id || i._id || i.productId || "unknown",
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      shippingAddress: {
        name: name || user.name || "Customer",
        address,
        city,
        zipCode,
        country,
      },
      totalAmount: finalTotal,
      status: "pending",
    });
    await newOrder.save();

    // Temporary UPI ID. Set BUSINESS_UPI_ID before accepting live payments.
    const upiId = process.env.BUSINESS_UPI_ID || "silverstar@upi";
    const orderReference = `SS-${newOrder._id.toString().slice(-8).toUpperCase()}`;
    const upiUrl = new URL("upi://pay");
    upiUrl.searchParams.set("pa", upiId);
    upiUrl.searchParams.set("pn", "Silver Star");
    upiUrl.searchParams.set("am", finalTotal.toFixed(2));
    upiUrl.searchParams.set("cu", "INR");
    upiUrl.searchParams.set("tn", `Order ${orderReference}`);

    const htmlContent = `
      <h1>Hello ${user.name || "Customer"},</h1>
      <p>Thank you for your order!</p>
      <h3>Shipping Address:</h3>
      <p>
        ${user.address}<br />
        ${user.city}, ${user.zipCode}<br />
        ${user.country}
      </p>
      ${cartHtml}
    `;

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "orders@silverstar.live",
          to: user.email,
          subject: "Your Order Receipt",
          html: htmlContent,
        });
      } catch (err) {
        console.error("Resend email error:", err);
      }
    }

    return NextResponse.json({
      message: "Checkout successful",
      payment: { orderReference, amount: finalTotal, upiUrl: upiUrl.toString() },
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
