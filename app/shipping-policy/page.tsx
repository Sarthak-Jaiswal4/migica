import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Headers } from "@/components/Headers";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery information for Silver Star orders.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Headers />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-28 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Silver Star</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Shipping Policy</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">This policy explains how Silver Star prepares, dispatches, and delivers your order.</p>

        <div className="mt-10 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <PolicySection title="Order processing">
            <p>We carefully inspect and pack every Silver Star order before dispatch. Processing times may vary during sales, exhibitions, public holidays, or other high-volume periods.</p>
          </PolicySection>
          <PolicySection title="Estimated delivery time">
            <p>Orders are generally delivered within <strong>5–7 business days</strong> after dispatch. Delivery estimates are provided as a guide and can vary depending on the delivery address, courier service, weather, holidays, or circumstances beyond our control.</p>
          </PolicySection>
          <PolicySection title="Address accuracy">
            <p>Please provide a complete and accurate delivery address, postal code, and contact number at checkout. Silver Star cannot be responsible for delays or failed deliveries caused by incomplete or incorrect address details.</p>
          </PolicySection>
          <PolicySection title="Delivery updates">
            <p>Where available, tracking or delivery updates will be shared using the contact details provided with your order. Please keep those details accessible until your parcel is delivered.</p>
          </PolicySection>
          <PolicySection title="On delivery">
            <p>Please inspect the outer package when it arrives. If the parcel appears tampered with, damaged, or incomplete, record a continuous unboxing video before opening it. This video is required for any damage, missing-item, return, or refund claim. See our Refund Policy for full claim requirements.</p>
          </PolicySection>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-lg font-semibold">{title}</h2><div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div></section>;
}
