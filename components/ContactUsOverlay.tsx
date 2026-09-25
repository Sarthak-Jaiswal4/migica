"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = { closing: boolean; onClose: () => void };

export function ContactUsOverlay({ closing, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "silverstarshalu@gmail.com";
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919005320012").replace(/\D/g, "");
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Arjunganj%2C%20Lucknow";

  return <div className={`fixed inset-0 z-[100] overflow-y-auto bg-[#E7D5C8] px-5 py-5 sm:px-8 sm:py-8 ${closing ? "contact-sheet-exit" : "contact-sheet-enter"}`} role="dialog" aria-modal="true" aria-labelledby="contact-heading">
    <style>{`@keyframes contactSheetEnter{0%{opacity:0;transform:translateY(-110%) rotate(-3.5deg);transform-origin:top center}70%{opacity:1;transform:translateY(1.5%) rotate(.25deg)}100%{opacity:1;transform:translateY(0) rotate(0)}}@keyframes contactSheetExit{0%{opacity:1;transform:translateY(0) rotate(0);transform-origin:bottom center}100%{opacity:0;transform:translateY(110%) rotate(3deg)}}.contact-sheet-enter{animation:contactSheetEnter .7s cubic-bezier(.16,1,.3,1) both}.contact-sheet-exit{animation:contactSheetExit .48s cubic-bezier(.7,0,.84,0) both}`}</style>
    <div className="relative mx-auto min-h-[calc(100vh-2.5rem)] max-w-7xl border border-[#3D2314]/55 bg-[#E9D9CC] px-7 py-10 text-[#3D2314] shadow-2xl sm:px-14 sm:py-14">
      <button type="button" onClick={onClose} className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#3D2314]/60 transition hover:bg-[#3D2314] hover:text-white" aria-label="Close contact form"><X size={20} /></button>
      <div className="grid grid-cols-1 gap-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2 lg:gap-20">
        <section className="flex flex-col justify-start gap-10 border-[#3D2314]/35 lg:justify-between lg:gap-0 lg:border-r lg:pr-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">Silver Star</p>
            <h1 id="contact-heading" className="mt-5 font-[style] text-4xl font-semibold leading-[0.95] tracking-tight sm:mt-8 sm:text-7xl lg:text-8xl">Let&apos;s talk.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#6E4C38] sm:mt-8 sm:text-base">Tell us about a product, a gifting request, or anything else you need. We&apos;d love to hear from you.</p>
          </div>
          <div className="space-y-6 text-sm">
            <p className="max-w-xs font-semibold uppercase leading-relaxed tracking-[0.12em]">Leave your details and we will get back to you within 24 hours.</p>
            {/* <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8C6E5D]">Contact</p><p className="mt-1 font-medium">Shalini Agarwal</p><p className="mt-1 text-[#6E4C38]">Arjunganj, Lucknow</p></div> */}
          </div>
        </section>
        <section className="flex flex-col justify-center">
          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            <ContactLink label="Write us" href={`mailto:${email}`} external={false}>{email}</ContactLink>
            <ContactLink label="Talk to us" href={`https://wa.me/${whatsappNumber}`}><span>WhatsApp</span><span className="mt-1 block text-xs font-medium normal-case tracking-normal text-[#6E4C38]">Chat with Silver Star</span></ContactLink>
            <ContactLink label="Owner" href={`mailto:${email}`} external={false}>Shalini Agarwal</ContactLink>
            <ContactLink label="Location" href={mapUrl}><span>Arjunganj, Lucknow</span><span className="mt-1 block text-xs font-medium normal-case tracking-normal text-[#6E4C38]">Open in Google Maps</span></ContactLink>
          </div>
          <p className="mt-16 max-w-sm text-sm leading-relaxed text-[#6E4C38]">For product questions, gifting requests, or order support, choose the contact method that works best for you.</p>
        </section>
      </div>
    </div>
  </div>;
}

function ContactLink({ label, href, children, external = true }: { label: string; href: string; children: React.ReactNode; external?: boolean }) {
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group block min-w-0 border-b border-[#3D2314]/35 pb-4 transition hover:border-[#3D2314]"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8C6E5D]">{label}</p><div className="mt-2 break-words text-sm font-semibold uppercase leading-relaxed tracking-[0.06em] transition group-hover:text-[#8C6E5D] sm:text-base sm:tracking-[0.1em]">{children}</div></a>;
}
