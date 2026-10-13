"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/store'
import { Headers } from '@/components/Headers'
import { Footer } from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AppImage as Image } from '@/components/AppImage'
import {
  Loader2, MapPin, Package, Shield, ArrowLeft,
  Truck, Tag, CheckCircle2, Lock, Gift,
  MessageCircle, AlertCircle, Wrench
} from 'lucide-react'
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import Link from 'next/link'

/* ─── tiny helper: labelled input field ─────────────────────────── */
function Field({
  id, label, placeholder, value, onChange, required, type = 'text',
}: {
  id: string; label: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8C6E5D]"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="h-12 rounded-xl border-[#E8D5C8] bg-[#FDFAF7] text-foreground placeholder:text-neutral-400
                   focus-visible:ring-2 focus-visible:ring-[#C9956C]/40 focus-visible:border-[#C9956C] transition-all"
      />
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice } = useUserStore()

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', zipCode: '', country: '',
  })
  const [loading] = useState(false)
  const [hasSavedAddress, setHasSavedAddress] = useState(false)
  const [success] = useState(false)

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [error] = useState('')
  const [showPaymentMaintenance, setShowPaymentMaintenance] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          const u = data.user
          if (!u.phoneVerified) {
            router.replace('/verify-phone?required=1&next=%2Fcheckout')
            return
          }
          if (u.address || u.city || u.zipCode || u.country) {
            setFormData({
              name: u.name || '', address: u.address || '',
              city: u.city || '', zipCode: u.zipCode || '', country: u.country || '',
            })
            setHasSavedAddress(true)
          } else if (u.name) {
            setFormData(prev => ({ ...prev, name: u.name }))
          }
        }
      } catch { /* silently ignore */ }
    }
    fetchProfile()
  }, [router])

  const subtotal = totalPrice()
  const shipping = calculateShipping(subtotal)
  const total = Math.max(0, subtotal - discountAmount + shipping)
  const businessWhatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919208323399')
    .replace(/\D/g, '')

  const handleApplyCoupon = () => {
    if (couponCode === 'SILVERSTAR10') {
      setDiscountAmount(subtotal * 0.10); setCouponApplied(true); setCouponError('')
    } else if (couponCode === 'WELCOME20') {
      setDiscountAmount(subtotal * 0.20); setCouponApplied(true); setCouponError('')
    } else {
      setCouponError('Invalid coupon code'); setCouponApplied(false); setDiscountAmount(0)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value })

  const handlePayOnWhatsApp = () => {
    setShowPaymentMaintenance(true)
  }

  /* ─── SUCCESS SCREEN ─────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Headers />
        <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
          <style>{`
            @keyframes successCardIn { from{opacity:0;transform:translateY(24px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes circleStroke { from{stroke-dashoffset:283} to{stroke-dashoffset:0} }
            @keyframes checkStroke  { from{stroke-dashoffset:48}  to{stroke-dashoffset:0}  }
            @keyframes ringPulse  { 0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.5} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
            @keyframes sparkle    { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 50%{opacity:1} 100%{transform:translate(-50%,-50%) scale(1) translateY(-60px);opacity:0} }
            @keyframes fadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
            @keyframes blushReveal { 0%{clip-path:circle(0% at 50% 28%)} 100%{clip-path:circle(150% at 50% 28%)} }
            @keyframes noiseIn    { from{opacity:0} to{opacity:0.2} }
            @keyframes glowFloat  { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.1)} }
            @keyframes pageBlushReveal { 0%{clip-path:circle(0% at 50% 40%)} 100%{clip-path:circle(150% at 50% 40%)} }
          `}</style>
          {/* Full-page blush — mobile */}
          <div className="fixed inset-0 pointer-events-none z-0 lg:hidden"
            style={{ background:'linear-gradient(135deg,#FAF5F0 0%,#F5EBE4 30%,#F0E4DA 60%,#EDE0D5 100%)',
              animation:'pageBlushReveal 1s cubic-bezier(0.16,1,0.3,1) 1.25s forwards', clipPath:'circle(0% at 50% 40%)' }} />
          <div className="fixed top-0 right-0 w-72 h-72 bg-rose-300/20 blur-[100px] rounded-full -mr-16 -mt-16 pointer-events-none z-0 lg:hidden"
            style={{ animation:'noiseIn 0.5s ease-out 1.8s both' }} />
          <div className="fixed bottom-0 left-0 w-64 h-64 bg-amber-300/20 blur-[100px] rounded-full -ml-16 -mb-16 pointer-events-none z-0 lg:hidden"
            style={{ animation:'noiseIn 0.5s ease-out 1.9s both' }} />
          <div className="fixed inset-0 mix-blend-overlay pointer-events-none z-0 lg:hidden"
            style={{ backgroundImage:"url('/gaussian-noise.png')", backgroundRepeat:'repeat',
              animation:'noiseIn 0.4s ease-out 1.7s both', opacity:0 }} />

          <div className="w-full max-w-lg rounded-[2rem] p-10 sm:p-14 text-center relative overflow-hidden z-10 bg-transparent lg:bg-card shadow-none lg:shadow-2xl lg:shadow-neutral-900/10"
            style={{ animation:'successCardIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}>
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-0 hidden lg:block"
              style={{ background:'linear-gradient(135deg,#FAF5F0 0%,#F5EBE4 30%,#F0E4DA 60%,#EDE0D5 100%)',
                animation:'blushReveal 0.8s cubic-bezier(0.16,1,0.3,1) 1.25s forwards', clipPath:'circle(0% at 50% 28%)' }} />
            <div className="absolute top-0 right-0 w-52 h-52 bg-rose-300/25 blur-[80px] rounded-full -mr-10 -mt-10 pointer-events-none z-[1] hidden lg:block"
              style={{ animation:'noiseIn 0.4s ease-out 1.7s both' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/20 blur-[80px] rounded-full -ml-10 -mb-10 pointer-events-none z-[1] hidden lg:block"
              style={{ animation:'noiseIn 0.4s ease-out 1.8s both' }} />
            <div className="absolute inset-0 mix-blend-overlay pointer-events-none rounded-[2rem] z-[1] hidden lg:block"
              style={{ backgroundImage:"url('/gaussian-noise.png')", backgroundRepeat:'repeat',
                animation:'noiseIn 0.4s ease-out 1.6s both', opacity:0 }} />

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/40"
                  style={{ animation:'ringPulse 1.2s ease-out 0.9s forwards', opacity:0, transform:'translate(-50%,-50%)' }} />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/20"
                  style={{ animation:'ringPulse 1.2s ease-out 1.1s forwards', opacity:0, transform:'translate(-50%,-50%)' }} />
                {[
                  { top:'10%',left:'85%',delay:'1s',color:'#34d399' },
                  { top:'0%', left:'50%',delay:'1.15s',color:'#fbbf24' },
                  { top:'15%',left:'15%',delay:'1.3s',color:'#34d399' },
                  { top:'75%',left:'90%',delay:'1.1s',color:'#fbbf24' },
                  { top:'85%',left:'10%',delay:'1.25s',color:'#34d399' },
                ].map((s, i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{ top:s.top,left:s.left,backgroundColor:s.color,
                      animation:`sparkle 0.8s ease-out ${s.delay} forwards`,opacity:0,transform:'translate(-50%,-50%) scale(0)' }} />
                ))}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#d1fae5" strokeWidth="6" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray="283" strokeDashoffset="283" transform="rotate(-90 50 50)"
                    style={{ animation:'circleStroke 0.8s cubic-bezier(0.65,0,0.35,1) 0.15s forwards' }} />
                  <path d="M30 52 L44 66 L70 38" fill="none" stroke="#10b981" strokeWidth="6"
                    strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48" strokeDashoffset="48"
                    style={{ animation:'checkStroke 0.4s cubic-bezier(0.65,0,0.35,1) 0.85s forwards' }} />
                </svg>
              </div>
              <h2 className="font-[style] text-3xl font-semibold tracking-tight text-foreground"
                style={{ animation:'fadeUp 0.5s ease-out 1.4s both' }}>Order Initiated!</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base"
                style={{ animation:'fadeUp 0.5s ease-out 1.6s both' }}>
                Your order is ready. WhatsApp is opening with your complete order details.
              </p>
              <Button onClick={() => router.push('/shop/all')}
                className="mt-8 h-12 px-10 bg-[#C9956C] text-white hover:bg-[#B8845A] rounded-xl font-semibold shadow-lg shadow-[#C9956C]/25 transition-all active:scale-[0.98]"
                style={{ animation:'fadeUp 0.5s ease-out 1.8s both' }}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* ─── CHECKOUT FORM ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen w-full bg-[#FDFAF7] flex flex-col">
      <Headers />

      <main className="flex-grow pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8C6E5D] hover:text-foreground transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>

          {/* Page heading */}
          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9956C] mb-2">
              Almost there
            </p>
            <h1 className="font-[style] text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Complete your order
            </h1>
            <p className="mt-3 text-sm text-[#8C6E5D]">
              {hasSavedAddress
                ? "We've loaded your saved address — review and confirm."
                : 'Tell us where to send your Silver Star order.'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── LEFT: ADDRESS FORM ───────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="space-y-6">

                {/* Saved-address banner */}
                {hasSavedAddress && (
                  <div className="flex items-start gap-3 rounded-2xl border border-[#C9956C]/25 bg-[#C9956C]/8 px-5 py-4">
                    <CheckCircle2 className="w-4 h-4 text-[#C9956C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#7A5C47] leading-relaxed">
                      Your saved address has been filled in automatically. Make any changes before confirming.
                    </p>
                  </div>
                )}

                {/* Delivery address card */}
                <div className="rounded-3xl border border-[#E8D5C8] bg-white shadow-sm shadow-neutral-900/[0.03] overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center gap-3 px-7 py-5 border-b border-[#F0E4D8] bg-[#FDFAF7]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9956C]/12 border border-[#C9956C]/20">
                      <MapPin className="h-4 w-4 text-[#C9956C]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Delivery Address</h2>
                      <p className="text-xs text-[#8C6E5D]">Where should we send your order?</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="px-7 py-7 space-y-5">
                    <Field
                      id="name" label="Full Name" placeholder="Shalini Agarwal"
                      value={formData.name} onChange={handleChange} required
                    />
                    <Field
                      id="address" label="Street Address" placeholder="12 Silver Lane, Sector 4"
                      value={formData.address} onChange={handleChange} required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        id="city" label="City" placeholder="Lucknow"
                        value={formData.city} onChange={handleChange} required
                      />
                      <Field
                        id="zipCode" label="PIN / Zip Code" placeholder="226001"
                        value={formData.zipCode} onChange={handleChange} required
                      />
                    </div>
                    <Field
                      id="country" label="Country" placeholder="India"
                      value={formData.country} onChange={handleChange} required
                    />
                  </div>

                  {/* Shipping info strip */}
                  <div className="mx-7 mb-6 flex items-center gap-3 rounded-2xl bg-[#F4EFE8] border border-[#E8D5C8] px-5 py-4">
                    <Truck className="h-4 w-4 text-[#C9956C] shrink-0" />
                    <p className="text-xs text-[#7A5C47] leading-relaxed">
                      <span className="font-semibold text-foreground">Free delivery</span> on orders of ₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')} or more ·
                      Standard delivery 3 – 5 business days across India
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

              </div>
            </div>

            {/* ── RIGHT: ORDER SUMMARY ─────────────────────────── */}
            <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-[#E8D5C8] bg-white shadow-sm shadow-neutral-900/[0.03] overflow-hidden">

                {/* Summary header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#F0E4D8] bg-[#FDFAF7]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9956C]/12 border border-[#C9956C]/20">
                    <Package className="h-4 w-4 text-[#C9956C]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Order Summary</h2>
                    <p className="text-xs text-[#8C6E5D]">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {/* Item list */}
                <div className="px-6 py-5 space-y-4 max-h-64 overflow-y-auto">
                  {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#F4EFE8] border border-[#E8D5C8] shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 bg-[#2C1810] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-[11px] uppercase tracking-wider text-[#8C6E5D] mt-0.5">{item.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <Gift className="w-8 h-8 text-[#C9956C]/40 mx-auto mb-2" />
                      <p className="text-sm text-[#8C6E5D]">Your cart is empty</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-[#F0E4D8]" />

                {/* Promo code */}
                <div className="px-6 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8C6E5D] mb-2.5">
                    Promo code
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9956C]" />
                      <Input
                        placeholder="e.g. SILVERSTAR10"
                        className="pl-8 h-10 rounded-xl border-[#E8D5C8] bg-[#FDFAF7] text-sm focus-visible:ring-2 focus-visible:ring-[#C9956C]/40 focus-visible:border-[#C9956C] transition-all"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        disabled={couponApplied}
                      />
                    </div>
                    <Button
                      type="button" onClick={handleApplyCoupon}
                      disabled={!couponCode || couponApplied || items.length === 0}
                      className={`h-10 px-4 rounded-xl font-semibold text-sm transition-all shrink-0 ${
                        couponApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                          : 'bg-[#C9956C] text-white hover:bg-[#B8845A]'
                      }`}
                    >
                      {couponApplied ? '✓ Applied' : 'Apply'}
                    </Button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                  {couponApplied && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                      {couponCode} applied — saving ₹{discountAmount.toFixed(2)}
                    </p>
                  )}
                </div>

                <Separator className="bg-[#F0E4D8]" />

                {/* Totals */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm text-[#8C6E5D]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Discount ({couponCode})</span>
                      <span>−₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-[#8C6E5D]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                      {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator className="bg-[#F0E4D8] my-1" />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-[#C9956C]">₹{total.toFixed(2)}</span>
                  </div>

                  {/* Desktop CTA */}
                  <Button
                    type="button"
                    onClick={handlePayOnWhatsApp}
                    disabled={loading}
                    className="hidden lg:flex w-full h-14 mt-3 items-center justify-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98] cursor-pointer gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5 fill-current" />}
                    {loading ? 'Opening payment...' : `Payment · ₹${total > 0 ? total.toFixed(2) : '0.00'}`}
                  </Button>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-[#8C6E5D]">
                      <Lock className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">WhatsApp order support</span>
                    </div>
                    <span className="text-[#E8D5C8]">·</span>
                    <div className="flex items-center gap-1.5 text-[#8C6E5D]">
                      <Shield className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">100% Safe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile CTA — kept below the complete order summary */}
              <div className="lg:hidden mt-4">
                <Button
                  type="button"
                  onClick={handlePayOnWhatsApp}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base shadow-lg shadow-[#25D366]/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5 fill-current" />}
                  {loading ? 'Opening payment...' : `Payment · ₹${total > 0 ? total.toFixed(2) : '0.00'}`}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[#8C6E5D]">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Secured Order Process</span>
                </div>
              </div>

              {/* Reassurance note */}
              <p className="mt-4 text-center text-xs text-[#8C6E5D] leading-relaxed">
                By placing your order, you agree to Silver Star&apos;s{' '}
                <Link href="/shipping-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Shipping Policy
                </Link>{' '}and{' '}
                <Link href="/refund-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Refund Policy
                </Link>.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <AlertDialog open={showPaymentMaintenance} onOpenChange={setShowPaymentMaintenance}>
        <AlertDialogContent className="max-w-md overflow-hidden rounded-[2rem] border-[#E8D5C8] bg-[#FDFAF7] p-0 shadow-2xl shadow-[#2C1810]/20">
          <div className="relative overflow-hidden px-7 pb-6 pt-8 text-center sm:px-10">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[#F3E3D7] via-[#FAF5F0] to-[#EED3C1]" />
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9956C]/30 bg-white text-[#B8845A] shadow-lg shadow-[#C9956C]/15">
              <Wrench className="h-7 w-7" />
            </div>
            <AlertDialogHeader className="relative place-items-center text-center sm:place-items-center sm:text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9956C]">A small pause</p>
              <AlertDialogTitle className="font-[style] text-3xl font-semibold tracking-tight text-[#2C1810]">
                Payments are under maintenance
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-3 max-w-sm text-center text-sm leading-relaxed text-[#7A5C47]">
                We&apos;re making a few improvements to our payment service. Please chat with us on WhatsApp and we&apos;ll gladly help you place your order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="relative mt-7 gap-3 sm:flex-col sm:items-stretch">
              <AlertDialogAction asChild className="h-12 w-full rounded-xl bg-[#25D366] font-semibold text-white hover:bg-[#20bd5a]">
                <a href={`https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent('Hello Silver Star, I need help placing my order.')}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </AlertDialogAction>
              <AlertDialogCancel className="h-11 rounded-xl border-[#E8D5C8] bg-white text-[#7A5C47] hover:bg-[#F4EFE8] hover:text-[#2C1810]">
                Continue browsing
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
