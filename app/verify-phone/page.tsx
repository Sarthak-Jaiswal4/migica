"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyPhonePage() {
  const router = useRouter();
  const params = useSearchParams();
  const required = params.get("required") === "1";
  const next = params.get("next") || "/";
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.user?.phoneVerified) router.replace(next);
      else if (data?.user?.phone) setPhone(data.user.phone);
    });
  }, [next, router]);

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/phone/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, channel }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPhone(data.phone); setSent(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not send OTP"); } finally { setLoading(false); }
  };

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/phone/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.replace(next);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not verify OTP"); } finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-[#F8F5F1] px-5 py-8 sm:px-8 sm:py-12"><div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden border border-[#DECFC4] bg-[#FFFCF9] lg:grid-cols-[0.85fr_1.15fr]">
    <aside className="relative hidden bg-[#3D2314] p-10 text-[#F8F0E8] lg:flex lg:flex-col lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E9CDB9]">Silver Star</p><h2 className="mt-8 font-[style] text-5xl leading-[0.95]">Your account,<br />securely yours.</h2><p className="mt-6 max-w-xs text-sm leading-relaxed text-[#EBDDD2]">A verified mobile number helps us protect your orders and keep you informed.</p></div><div className="space-y-3 text-xs text-[#EBDDD2]"><p className="flex items-center gap-2"><Check size={14} /> Secure order updates</p><p className="flex items-center gap-2"><Check size={14} /> One-time verification</p></div></aside>
    <section className="relative flex items-center justify-center px-6 py-12 sm:px-12"><div className="w-full max-w-md">
      {!required && <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-[#6E4C38] hover:bg-[#F3E7DD]" onClick={() => router.push(next)} aria-label="Close phone verification"><X className="h-5 w-5" /></Button>}
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center border border-[#C9956C]/45 text-[#9C6C4D]"><ShieldCheck size={19} /></div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6E5D]">Account verification</p></div>
      <div className="mt-10 flex items-center gap-3 text-xs font-medium text-[#8C6E5D]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3D2314] text-white">1</span><span>Verify phone</span><span className="h-px w-8 bg-[#D9C1B1]" /><span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D9C1B1]">2</span><span>Continue</span></div>
      <h1 className="mt-8 font-[style] text-4xl font-semibold tracking-tight text-[#2C1810] sm:text-5xl">Verify your number</h1><p className="mt-3 max-w-sm text-sm leading-relaxed text-[#765842]">{required ? "To continue to checkout, please verify the mobile number connected to your account." : "Add a verified mobile number to receive secure account and order updates."}</p>
      {!sent ? <form className="mt-10 space-y-7" onSubmit={requestOtp}><label className="block"><span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6E4C38]">Mobile number</span><Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="10-digit mobile number" required className="mt-3 h-12 rounded-xl border-[#CDB5A5] bg-transparent px-4 text-base shadow-none focus-visible:ring-1" /></label><fieldset><legend className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6E4C38]">Receive verification code by</legend><div className="mt-3 flex overflow-hidden rounded-xl border border-[#DCC9BB]"><button type="button" onClick={() => setChannel("sms")} className={`flex-1 px-4 py-3 text-sm font-medium transition ${channel === "sms" ? "bg-[#3D2314] text-white" : "text-[#6E4C38] hover:bg-[#F5EAE2]"}`}>SMS</button><button type="button" onClick={() => setChannel("whatsapp")} className={`flex-1 border-l border-[#DCC9BB] px-4 py-3 text-sm font-medium transition ${channel === "whatsapp" ? "bg-[#3D2314] text-white" : "text-[#6E4C38] hover:bg-[#F5EAE2]"}`}>WhatsApp</button></div></fieldset><Button className="h-12 w-full rounded-xl bg-[#C9956C] text-white hover:bg-[#AF7B58]" disabled={loading}>{loading ? "Sending code…" : <><span>Send verification code</span><ArrowRight className="ml-2 h-4 w-4" /></>}</Button></form> : <form className="mt-10 space-y-7" onSubmit={verifyOtp}><p className="border-l-2 border-[#C9956C] pl-4 text-sm leading-relaxed text-[#765842]">A verification code was sent to <strong className="text-[#3D2314]">{phone}</strong> by {channel === "sms" ? "SMS" : "WhatsApp"}.</p><label className="block"><span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6E4C38]">Verification code</span><Input inputMode="numeric" maxLength={10} value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter code" required className="mt-3 h-12 rounded-xl border-[#CDB5A5] bg-transparent px-4 text-base tracking-[0.25em] shadow-none focus-visible:ring-1" /></label><Button className="h-12 w-full rounded-xl bg-[#C9956C] text-white hover:bg-[#AF7B58]" disabled={loading}>{loading ? "Verifying…" : "Verify and continue"}</Button><Button type="button" variant="ghost" className="h-auto w-full rounded-xl px-0 py-2 text-sm text-[#6E4C38] hover:bg-transparent hover:text-[#2C1810]" onClick={() => setSent(false)}>Change phone number or delivery method</Button></form>}
      {error && <p className="mt-6 border-l-2 border-red-500 pl-3 text-sm text-red-700">{error}</p>}
    </div></section>
  </div></main>;
}
