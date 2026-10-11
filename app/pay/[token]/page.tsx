import { jwtVerify } from "jose";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

export default async function PaymentPage({ params }: Props) {
  let upiUrl = "";
  let amount = 0;
  let orderReference = "Silver Star order";

  try {
    const { token } = await params;
    const secret = new TextEncoder().encode(process.env.PAYMENT_LINK_SECRET || process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    upiUrl = typeof payload.upiUrl === "string" ? payload.upiUrl : "";
    amount = typeof payload.amount === "number" ? payload.amount : 0;
    orderReference = typeof payload.orderReference === "string" ? payload.orderReference : orderReference;
  } catch {
    notFound();
  }

  if (!upiUrl) notFound();
  return <main className="flex min-h-screen items-center justify-center bg-[#FDFAF7] px-5"><section className="w-full max-w-md rounded-3xl border border-[#E8D5C8] bg-white p-8 text-center shadow-xl shadow-[#3D2314]/10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C6E5D]">Silver Star payment</p><h1 className="mt-3 font-[style] text-3xl font-semibold">Pay ₹{amount.toFixed(2)}</h1><p className="mt-3 text-sm text-[#8C6E5D]">Order {orderReference}</p><a href={upiUrl} className="mt-8 flex h-12 items-center justify-center rounded-xl bg-[#C9956C] px-5 py-3 font-semibold text-white shadow-lg shadow-[#C9956C]/25 transition hover:bg-[#B8845A]">Pay using UPI</a><p className="mt-4 text-xs leading-relaxed text-[#8C6E5D]">Your phone will open the default UPI app or show the available payment apps.</p></section></main>;
}
