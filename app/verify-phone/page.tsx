import { Suspense } from "react";
import { VerifyPhoneClient } from "@/components/VerifyPhoneClient";

export default function VerifyPhonePage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#F8F5F1]" />}><VerifyPhoneClient /></Suspense>;
}
