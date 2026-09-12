"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
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

  return <main className="flex min-h-screen items-center justify-center bg-background px-4"><section className="relative w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm">
    {!required && <Button variant="ghost" size="icon" className="absolute right-3 top-3" onClick={() => router.push(next)} aria-label="Close phone verification"><X className="h-5 w-5" /></Button>}
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account security</p><h1 className="mt-2 text-2xl font-bold">Verify your phone number</h1><p className="mt-2 text-sm text-muted-foreground">{required ? "Phone verification is required before checkout." : "Add a verified number to secure your account."}</p>
    {!sent ? <form className="mt-6 space-y-4" onSubmit={requestOtp}><Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="10-digit mobile number" required /><fieldset className="space-y-2"><legend className="text-sm font-medium">Receive OTP by</legend><div className="grid grid-cols-2 rounded-xl border bg-background p-1"><button type="button" onClick={() => setChannel("sms")} className={`rounded-lg px-3 py-2 text-sm font-medium ${channel === "sms" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>SMS</button><button type="button" onClick={() => setChannel("whatsapp")} className={`rounded-lg px-3 py-2 text-sm font-medium ${channel === "whatsapp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>WhatsApp</button></div></fieldset><Button className="w-full" disabled={loading}>{loading ? "Sending..." : `Send OTP by ${channel === "sms" ? "SMS" : "WhatsApp"}`}</Button></form> : <form className="mt-6 space-y-4" onSubmit={verifyOtp}><p className="text-sm">We sent an OTP to {phone} by {channel === "sms" ? "SMS" : "WhatsApp"}.</p><Input inputMode="numeric" maxLength={10} value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter OTP" required /><Button className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify number"}</Button><Button type="button" variant="ghost" className="w-full" onClick={() => setSent(false)}>Change number or delivery method</Button></form>}
    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
  </section></main>;
}
