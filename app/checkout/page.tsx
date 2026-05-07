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
import { AppImage as Image } from '@/components/AppImage'
import { Loader2, CheckCircle2, MapPin, Package, Shield, ArrowLeft } from 'lucide-react'
import { SHIPPING_COST } from '@/lib/constants'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice, clearCart } = useUserStore()

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        zipCode: '',
        country: ''
    })
    const [loading, setLoading] = useState(false)
    const [fetchingAddress, setFetchingAddress] = useState(true)
    const [hasSavedAddress, setHasSavedAddress] = useState(false)
    const [success, setSuccess] = useState(false)

    // Coupon states
    const [couponCode, setCouponCode] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [discountAmount, setDiscountAmount] = useState(0)
    const [error, setError] = useState('')

    // Fetch saved address on mount
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    const u = data.user
                    if (u.address || u.city || u.zipCode || u.country) {
                        setFormData({
                            name: u.name || '',
                            address: u.address || '',
                            city: u.city || '',
                            zipCode: u.zipCode || '',
                            country: u.country || '',
                        })
                        setHasSavedAddress(true)
                    } else if (u.name) {
                        setFormData(prev => ({ ...prev, name: u.name }))
                    }
                }
            } catch {
                // silently ignore — form stays empty
            } finally {
                setFetchingAddress(false)
            }
        }
        fetchProfile()
    }, [])

    const subtotal = totalPrice()
    const shipping = items.length > 0 ? SHIPPING_COST : 0
    // Prevent negative total if discount exceeds subtotal
    const total = Math.max(0, subtotal - discountAmount + shipping)

    const handleApplyCoupon = () => {
        if (couponCode === "MAGICA10") {
            setDiscountAmount(subtotal * 0.10)
            setCouponApplied(true)
            setCouponError("")
        } else if (couponCode === "WELCOME20") {
            setDiscountAmount(subtotal * 0.20)
            setCouponApplied(true)
            setCouponError("")
        } else {
            setCouponError("Invalid coupon code")
            setCouponApplied(false)
            setDiscountAmount(0)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (items.length === 0) {
            setError("Your cart is empty.")
            return
        }

        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, items, couponCode: couponApplied ? couponCode : undefined, discountAmount }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Checkout failed. Please try again.')
                setLoading(false)
                return
            }

            setSuccess(true)
            clearCart()
        } catch (err) {
            console.error('Checkout error:', err)
            setError('Connection error. Please try again later.')
            setLoading(false)
        }
    }

    /* ─── SUCCESS SCREEN ─── */
    if (success) {
        return (
            <div className='min-h-screen w-full bg-[#F6F4F1] flex flex-col'>
                <Headers />
                <main className='flex-grow flex items-center justify-center px-4 pt-28 pb-16'>
                    {/* Inline keyframes for the animated success */}
                    <style>{`
                        @keyframes successCardIn {
                            from { opacity: 0; transform: translateY(24px) scale(0.96); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes circleStroke {
                            from { stroke-dashoffset: 283; }
                            to   { stroke-dashoffset: 0; }
                        }
                        @keyframes checkStroke {
                            from { stroke-dashoffset: 48; }
                            to   { stroke-dashoffset: 0; }
                        }
                        @keyframes ringPulse {
                            0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.5; }
                            100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
                        }
                        @keyframes sparkle {
                            0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
                            50%  { opacity: 1; }
                            100% { transform: translate(-50%,-50%) scale(1) translateY(-60px); opacity: 0; }
                        }
                        @keyframes fadeUp {
                            from { opacity: 0; transform: translateY(12px); }
                            to   { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes blushReveal {
                            0%   { clip-path: circle(0% at 50% 28%); }
                            100% { clip-path: circle(150% at 50% 28%); }
                        }
                        @keyframes noiseIn {
                            from { opacity: 0; }
                            to   { opacity: 0.2; }
                        }
                        @keyframes glowFloat {
                            0%, 100% { opacity: 0.2; transform: scale(1); }
                            50%      { opacity: 0.35; transform: scale(1.1); }
                        }
                        @keyframes pageBlushReveal {
                            0%   { clip-path: circle(0% at 50% 40%); }
                            100% { clip-path: circle(150% at 50% 40%); }
                        }
                    `}</style>

                    {/* Full-page blush reveal — mobile only */}
                    <div
                        className='fixed inset-0 pointer-events-none z-0 lg:hidden'
                        style={{
                            background: 'linear-gradient(135deg, #FAF5F0 0%, #F5EBE4 30%, #F0E4DA 60%, #EDE0D5 100%)',
                            animation: 'pageBlushReveal 1s cubic-bezier(0.16,1,0.3,1) 1.25s forwards',
                            clipPath: 'circle(0% at 50% 40%)',
                        }}
                    />
                    {/* Full-page glows — mobile only */}
                    <div
                        className='fixed top-0 right-0 w-72 h-72 bg-rose-300/20 blur-[100px] rounded-full -mr-16 -mt-16 pointer-events-none z-0 lg:hidden'
                        style={{ animation: 'noiseIn 0.5s ease-out 1.8s both' }}
                    />
                    <div
                        className='fixed bottom-0 left-0 w-64 h-64 bg-amber-300/20 blur-[100px] rounded-full -ml-16 -mb-16 pointer-events-none z-0 lg:hidden'
                        style={{ animation: 'noiseIn 0.5s ease-out 1.9s both' }}
                    />
                    {/* Full-page noise texture — mobile only */}
                    <div
                        className='fixed inset-0 mix-blend-overlay pointer-events-none z-0 lg:hidden'
                        style={{
                            backgroundImage: "url('/gaussian-noise.png')",
                            backgroundRepeat: 'repeat',
                            animation: 'noiseIn 0.4s ease-out 1.7s both',
                            opacity: 0,
                        }}
                    />

                    <div
                        className='w-full max-w-lg rounded-[2rem] p-10 sm:p-14 text-center relative overflow-hidden z-10 bg-transparent lg:bg-white shadow-none lg:shadow-2xl lg:shadow-neutral-900/10'
                        style={{ animation: 'successCardIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}
                    >
                        {/* Blush background inside card — desktop only (mobile uses full-page reveal) */}
                        <div
                            className='absolute inset-0 rounded-[2rem] pointer-events-none z-0 hidden lg:block'
                            style={{
                                background: 'linear-gradient(135deg, #FAF5F0 0%, #F5EBE4 30%, #F0E4DA 60%, #EDE0D5 100%)',
                                animation: 'blushReveal 0.8s cubic-bezier(0.16,1,0.3,1) 1.25s forwards',
                                clipPath: 'circle(0% at 50% 28%)',
                            }}
                        />
                        {/* Rose & amber glows inside card — desktop only */}
                        <div
                            className='absolute top-0 right-0 w-52 h-52 bg-rose-300/25 blur-[80px] rounded-full -mr-10 -mt-10 pointer-events-none z-[1] hidden lg:block'
                            style={{ animation: 'noiseIn 0.4s ease-out 1.7s both' }}
                        />
                        <div
                            className='absolute bottom-0 left-0 w-48 h-48 bg-amber-300/20 blur-[80px] rounded-full -ml-10 -mb-10 pointer-events-none z-[1] hidden lg:block'
                            style={{ animation: 'noiseIn 0.4s ease-out 1.8s both' }}
                        />
                        <div
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200/15 blur-[80px] rounded-full pointer-events-none z-[1] hidden lg:block'
                            style={{ animation: 'glowFloat 4s ease-in-out 2s infinite both' }}
                        />
                        {/* Noise texture inside card — desktop only */}
                        <div
                            className='absolute inset-0 mix-blend-overlay pointer-events-none rounded-[2rem] z-[1] hidden lg:block'
                            style={{
                                backgroundImage: "url('/gaussian-noise.png')",
                                backgroundRepeat: 'repeat',
                                animation: 'noiseIn 0.4s ease-out 1.6s both',
                                opacity: 0,
                            }}
                        />

                        <div className='relative z-10 flex flex-col items-center'>
                            {/* Animated check icon container */}
                            <div className='relative w-24 h-24 mb-8'>
                                {/* Radiating ring pulses */}
                                <div
                                    className='absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/40'
                                    style={{ animation: 'ringPulse 1.2s ease-out 0.9s forwards', opacity: 0, transform: 'translate(-50%,-50%)' }}
                                />
                                <div
                                    className='absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/20'
                                    style={{ animation: 'ringPulse 1.2s ease-out 1.1s forwards', opacity: 0, transform: 'translate(-50%,-50%)' }}
                                />

                                {/* Sparkle particles */}
                                {[
                                    { top: '10%', left: '85%', delay: '1s', color: '#34d399' },
                                    { top: '0%',  left: '50%', delay: '1.15s', color: '#fbbf24' },
                                    { top: '15%', left: '15%', delay: '1.3s', color: '#34d399' },
                                    { top: '75%', left: '90%', delay: '1.1s', color: '#fbbf24' },
                                    { top: '85%', left: '10%', delay: '1.25s', color: '#34d399' },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className='absolute w-2 h-2 rounded-full'
                                        style={{
                                            top: s.top, left: s.left,
                                            backgroundColor: s.color,
                                            animation: `sparkle 0.8s ease-out ${s.delay} forwards`,
                                            opacity: 0,
                                            transform: 'translate(-50%,-50%) scale(0)',
                                        }}
                                    />
                                ))}

                                {/* SVG animated circle + checkmark */}
                                <svg viewBox='0 0 100 100' className='w-full h-full'>
                                    <circle cx='50' cy='50' r='45' fill='none' stroke='#d1fae5' strokeWidth='6' />
                                    <circle
                                        cx='50' cy='50' r='45'
                                        fill='none' stroke='#10b981' strokeWidth='6' strokeLinecap='round'
                                        strokeDasharray='283' strokeDashoffset='283'
                                        style={{ animation: 'circleStroke 0.8s cubic-bezier(0.65,0,0.35,1) 0.15s forwards' }}
                                        transform='rotate(-90 50 50)'
                                    />
                                    <path
                                        d='M30 52 L44 66 L70 38'
                                        fill='none' stroke='#10b981' strokeWidth='6'
                                        strokeLinecap='round' strokeLinejoin='round'
                                        strokeDasharray='48' strokeDashoffset='48'
                                        style={{ animation: 'checkStroke 0.4s cubic-bezier(0.65,0,0.35,1) 0.85s forwards' }}
                                    />
                                </svg>
                            </div>

                            <h2
                                className="text-3xl font-bold tracking-tight text-neutral-900"
                                style={{ animation: 'fadeUp 0.5s ease-out 1.4s both' }}
                            >
                                Order Confirmed!
                            </h2>
                            <p
                                className="mt-4 text-sm leading-relaxed text-neutral text-neutral-600 sm:text-base"
                                style={{ animation: 'fadeUp 0.5s ease-out 1.6s both' }}
                            >
                                Your shipping details have been saved and a receipt has been sent to your email.
                            </p>
                            <Button
                                onClick={() => router.push('/')}
                                className='mt-8 h-12 px-10 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-semibold shadow-lg shadow-neutral-900/15 transition-all active:scale-[0.98]'
                                style={{ animation: 'fadeUp 0.5s ease-out 1.8s both' }}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    /* ─── CHECKOUT FORM ─── */
    return (
        <div className='min-h-screen w-full bg-[#F6F4F1] flex flex-col'>
            <Headers />

            <main className='flex-grow pt-28 pb-16 px-4'>
                <div className='max-w-6xl mx-auto'>
                    {/* Breadcrumb */}
                    <Link href='/' className='inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group'>
                        <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                        Continue Shopping
                    </Link>

                    <h1 className='text-4xl font-bold tracking-tight text-neutral-900 mb-2'>Checkout</h1>
                    <p className='text-neutral-500 text-sm mb-10'>Complete your order by filling in the details below</p>

                    <div className='flex flex-col lg:flex-row gap-8'>
                        {/* ─── LEFT: FORM ─── */}
                        <div className='flex-1'>
                            <form onSubmit={handleSubmit} className='space-y-8'>
                                {/* Shipping Info */}
                                <div className='bg-white rounded-2xl p-8 shadow-lg shadow-neutral-900/[0.04] border border-neutral-100'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <div className='p-2.5 bg-amber-50 border border-amber-100 rounded-xl'>
                                            <MapPin className='h-5 w-5 text-amber-600' />
                                        </div>
                                        <div>
                                            <h2 className='text-lg font-bold text-neutral-900'>Shipping Address</h2>
                                            <p className='text-xs text-neutral-400'>
                                                {hasSavedAddress ? 'Your saved address has been loaded — feel free to update it.' : 'Where should we deliver your order?'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='name' className='text-sm font-medium text-neutral-700'>Full Name</Label>
                                            <Input
                                                id='name'
                                                placeholder='John Doe'
                                                className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='address' className='text-sm font-medium text-neutral-700'>Street Address</Label>
                                            <Input
                                                id='address'
                                                placeholder='123 Magic Street, Apt 4B'
                                                className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='city' className='text-sm font-medium text-neutral-700'>City</Label>
                                                <Input
                                                    id='city'
                                                    placeholder='Mumbai'
                                                    className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor='zipCode' className='text-sm font-medium text-neutral-700'>Zip / Pin Code</Label>
                                                <Input
                                                    id='zipCode'
                                                    placeholder='400001'
                                                    className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                                    value={formData.zipCode}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='country' className='text-sm font-medium text-neutral-700'>Country</Label>
                                            <Input
                                                id='country'
                                                placeholder='India'
                                                className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                                value={formData.country}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className='bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2'>
                                        <span className='shrink-0'>⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit – visible on mobile, hidden on desktop (appears in sidebar) */}
                                <div className='lg:hidden'>
                                    <Button
                                        type='submit'
                                        className='w-full h-14 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-all duration-300 font-semibold text-base shadow-lg shadow-neutral-900/15 active:scale-[0.98] disabled:opacity-60'
                                        disabled={loading || items.length === 0}
                                    >
                                        {loading ? (
                                            <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Processing...</>
                                        ) : (
                                            `Complete Purchase  ·  ₹${total.toFixed(2)}`
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* ─── RIGHT: ORDER SUMMARY ─── */}
                        <div className='w-full lg:w-[400px] shrink-0'>
                            <div className='bg-white rounded-2xl shadow-lg shadow-neutral-900/[0.04] border border-neutral-100 overflow-hidden lg:sticky lg:top-28'>
                                {/* Header */}
                                <div className='p-6 border-b border-neutral-100 flex items-center gap-3'>
                                    <div className='p-2.5 bg-amber-50 border border-amber-100 rounded-xl'>
                                        <Package className='h-5 w-5 text-amber-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg font-bold text-neutral-900'>Order Summary</h2>
                                        <p className='text-xs text-neutral-400'>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className='p-6 space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent'>
                                    {items.length > 0 ? items.map(item => (
                                        <div key={item.id} className='flex gap-4'>
                                            <div className='relative h-16 w-16 rounded-xl overflow-hidden bg-[#F6F4F1] border border-neutral-100 shrink-0'>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className='object-cover'
                                                />
                                                <span className='absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='text-sm font-semibold text-neutral-900 truncate'>{item.name}</h4>
                                                <p className='text-[11px] text-neutral-400 uppercase tracking-wider'>{item.category}</p>
                                            </div>
                                            <span className='text-sm font-semibold text-neutral-800 shrink-0'>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    )) : (
                                        <p className='text-sm text-neutral-400 text-center py-4'>Your cart is empty</p>
                                    )}
                                </div>

                                {/* Coupon Section */}
                                <div className='px-6 pt-2 pb-4'>
                                    <div className='flex items-center gap-2'>
                                        <Input
                                            placeholder='Promo code (e.g. MAGICA10)'
                                            className='h-10 bg-[#F6F4F1]/50 border-neutral-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm'
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            disabled={couponApplied}
                                        />
                                        <Button
                                            type='button'
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || couponApplied || items.length === 0}
                                            className={`h-10 px-4 rounded-lg font-semibold transition-all ${couponApplied ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                                        >
                                            {couponApplied ? 'Applied' : 'Apply'}
                                        </Button>
                                    </div>
                                    {couponError && <p className='text-xs text-red-500 mt-2'>{couponError}</p>}
                                </div>

                                {/* Totals */}
                                <div className='px-6 pb-6 pt-2'>
                                    <Separator className='bg-neutral-100 mb-4' />
                                    <div className='space-y-2 mb-4'>
                                        <div className='flex justify-between text-sm text-neutral-500'>
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        {couponApplied && (
                                            <div className='flex justify-between text-sm text-emerald-600 font-medium'>
                                                <span>Discount ({couponCode})</span>
                                                <span>-₹{discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className='flex justify-between text-sm text-neutral-500'>
                                            <span>Shipping</span>
                                            <span>₹{shipping.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Separator className='bg-neutral-100 mb-4' />
                                    <div className='flex justify-between text-lg font-bold text-neutral-900'>
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>

                                    {/* Desktop CTA */}
                                    <Button
                                        type='button'
                                        onClick={handleSubmit as any}
                                        className='hidden lg:flex w-full h-14 mt-6 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-all duration-300 font-semibold text-base shadow-lg shadow-neutral-900/15 active:scale-[0.98] disabled:opacity-60 items-center justify-center'
                                        disabled={loading || items.length === 0}
                                    >
                                        {loading ? (
                                            <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Processing...</>
                                        ) : (
                                            'Complete Purchase'
                                        )}
                                    </Button>

                                    {/* Trust badges */}
                                    <div className='flex items-center justify-center gap-2 mt-5 text-neutral-400'>
                                        <Shield className='w-3.5 h-3.5' />
                                        <span className='text-[10px] uppercase tracking-widest font-bold'>Secure Checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
