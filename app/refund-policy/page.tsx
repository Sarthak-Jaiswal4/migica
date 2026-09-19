import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Headers } from "@/components/Headers";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Return, refund, damage, and missing-item claim requirements for Silver Star.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Headers />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-28 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Silver Star</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Return &amp; Refund Policy</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">We inspect every item before shipping. If there is a genuine issue with your order, we will review your claim fairly.</p>

        <div className="mt-10 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <h2 className="text-lg font-bold">Unboxing video is compulsory</h2>
            <p className="mt-2 text-sm leading-6">A valid, continuous, unedited unboxing video is compulsory for every damage, missing-item, return, or refund claim. <strong>Without a valid unboxing video, return or refund requests cannot be accepted.</strong></p>
          </section>
          <PolicySection title="Eligible claims">
            <p>Claims may be considered if an order arrives with a damaged item, a missing item, or an issue that can be verified from the unboxing video and order details. All requests are subject to review by Silver Star.</p>
          </PolicySection>
          <PolicySection title="How to record the unboxing video">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Start recording before opening the parcel.</li>
              <li>Show the sealed outer packaging and the shipping label clearly in the frame.</li>
              <li>Record the entire opening process in one continuous video, without cuts, pauses, edits, or skipped steps.</li>
              <li>Show every received item and its condition clearly on camera.</li>
            </ol>
          </PolicySection>
          <PolicySection title="Return condition">
            <p>Where a return is approved, the item must be unused, in its original condition, and returned with its original packaging and any included tags or accessories. Approval of a claim does not guarantee that a return, replacement, or refund will be issued; the available resolution depends on the verified issue.</p>
          </PolicySection>
          <PolicySection title="Non-eligible requests">
            <p>We cannot accept claims submitted without a valid continuous unboxing video, or claims for items that have been used, altered, damaged after delivery, or returned without prior approval.</p>
          </PolicySection>
          <PolicySection title="Submitting a claim">
            <p>Please contact Silver Star with your order details, a clear description of the issue, and the complete unboxing video. Keep the product, packaging, and all contents safely with you until the claim has been reviewed.</p>
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
