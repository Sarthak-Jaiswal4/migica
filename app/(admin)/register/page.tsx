"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, Sparkles, Gift } from 'lucide-react'
import { Headers } from '@/components/Headers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Registration failed.')
                setLoading(false)
                return
            }

            // Success! Send user to login
            router.push('/login?message=registered')
        } catch (err) {
            console.error('Registration error:', err)
            setError('Connection error. Please check if the server is running.')
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full bg-[#F6F4F1] flex flex-col'>
            <Headers />

            <main className='flex-grow flex items-center justify-center px-4 pt-28 pb-16'>
                <div
                    className='w-full max-w-5xl flex rounded-[2rem] overflow-hidden shadow-2xl shadow-neutral-900/10 relative'
                    style={{ background: 'linear-gradient(to right, #EDE4DB 0%, #F2EAE2 20%, #F7F1EC 35%, #FBFAF9 50%, #ffffff 65%)' }}
                >
                    {/* Decorative glows — positioned on the outer wrapper */}
                    <div className='absolute top-0 left-0 w-72 h-72 bg-rose-300/20 blur-[120px] rounded-full -ml-10 -mt-20 pointer-events-none' />
                    <div className='absolute bottom-0 left-0 w-64 h-64 bg-amber-300/20 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none' />
                    <div className='absolute top-1/2 left-[20%] -translate-y-1/2 w-80 h-80 bg-rose-200/10 blur-[100px] rounded-full pointer-events-none' />
                    <div
                        className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none rounded-[2rem]"
                        style={{ backgroundImage: "url('/gaussian-noise.png')", backgroundRepeat: 'repeat' }}
                    />

                    {/* Left decorative panel */}
                    <div className='hidden lg:flex flex-col justify-between w-[45%] text-neutral-800 p-12 relative'>

                        <div className='relative z-10'>
                            <h2 className='mt-2 font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
                                Silver Star
                            </h2>
                            <p className='mt-4 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600 sm:text-base'>Artisanal Candles & Luxury Goods</p>
                        </div>

                        <div className='relative z-10 space-y-6'>
                            <div className='flex items-start gap-4'>
                                <div className='p-2.5 bg-white/60 border border-rose-200/50 rounded-xl shrink-0 mt-0.5 shadow-sm'>
                                    <Sparkles className='h-5 w-5 text-amber-600' />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-sm text-neutral-800'>Welcome Email & Offers</h4>
                                    <p className='text-neutral-500 text-xs mt-1 leading-relaxed'>Get a personalized welcome and exclusive member deals right in your inbox.</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4'>
                                <div className='p-2.5 bg-white/60 border border-rose-200/50 rounded-xl shrink-0 mt-0.5 shadow-sm'>
                                    <Gift className='h-5 w-5 text-amber-600' />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-sm text-neutral-800'>Early Access & Rewards</h4>
                                    <p className='text-neutral-500 text-xs mt-1 leading-relaxed'>Be the first to know about limited drops, new collections, and seasonal sales.</p>
                                </div>
                            </div>
                        </div>

                        <p className='text-neutral-400 text-[11px] relative z-10'>© 2026 Silver Star Inc.</p>
                    </div>

                    {/* Right form panel */}
                    <div className='flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative'>
                        <div className='max-w-sm mx-auto w-full'>
                            <div className='mb-8'>
                                <h1 className='text-3xl font-bold tracking-tight text-neutral-900'>Create Account</h1>
                                <p className='text-neutral-500 text-sm mt-2'>Join us and explore the world of artisan luxury</p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-5'>
                                <div className='space-y-2'>
                                    <Label htmlFor='name' className='text-sm font-medium text-neutral-700'>Full Name</Label>
                                    <Input
                                        id='name'
                                        placeholder='John Doe'
                                        type='text'
                                        className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='email' className='text-sm font-medium text-neutral-700'>Email</Label>
                                    <Input
                                        id='email'
                                        placeholder='name@example.com'
                                        type='email'
                                        className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='password' className='text-sm font-medium text-neutral-700'>Password</Label>
                                    <div className='relative'>
                                        <Input
                                            id='password'
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='••••••••'
                                            className='h-12 bg-[#F6F4F1]/50 border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 pr-12 transition-colors'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none'
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className='text-[11px] text-neutral-400 ml-1'>Must be at least 6 characters</p>
                                </div>

                                {error && (
                                    <div className='bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2'>
                                        <span className='shrink-0'>⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button
                                    type='submit'
                                    className='w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-neutral-900/15 active:scale-[0.98] disabled:opacity-60'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Creating Account...</>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </form>

                            <div className='mt-8 text-center'>
                                <div className='relative flex items-center gap-4 mb-6'>
                                    <div className='flex-1 h-px bg-neutral-200' />
                                    <span className='text-xs text-neutral-400 font-medium uppercase tracking-widest'>Already a member?</span>
                                    <div className='flex-1 h-px bg-neutral-200' />
                                </div>
                                <Link
                                    href='/login'
                                    className='inline-flex items-center justify-center w-full h-12 border-2 border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 rounded-xl font-semibold transition-all duration-300 text-sm'
                                >
                                    Sign In Instead
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
