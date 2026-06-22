"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { Headers } from '@/components/Headers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed. Please check your credentials.')
                setLoading(false)
                return
            }

            // Success! 
            // We keep loading true while we redirect
            const searchParams = new URLSearchParams(window.location.search)
            const redirectUrl = searchParams.get('redirect') || '/'
            router.push(redirectUrl)
        } catch (err) {
            console.error('Login error:', err)
            setError('Connection error. Please check if the server is running.')
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full bg-background flex flex-col'>
            <Headers />

            <main className='flex-grow flex items-center justify-center px-4 pt-28 pb-16'>
                <div
                    className='w-full max-w-5xl flex rounded-[2rem] overflow-hidden shadow-2xl shadow-neutral-900/10 relative'
                    style={{ background: 'linear-gradient(to right, var(--muted) 0%, var(--card) 20%, var(--background) 65%)' }}
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
                    <div className='hidden lg:flex flex-col justify-between w-[45%] text-foreground p-12 relative'>

                        <div className='relative z-10'>
                            <h2 className='mt-2 font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
                                Silver Star
                            </h2>
                            <p className='mt-4 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600 sm:text-base'>Artisanal Candles & Luxury Goods</p>
                        </div>

                        <div className='relative z-10 space-y-6'>
                            <div className='flex items-start gap-4'>
                                <div className='p-2.5 bg-card/60 border border-rose-200/50 rounded-xl shrink-0 mt-0.5 shadow-sm'>
                                    <Sparkles className='h-5 w-5 text-amber-600' />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-sm text-foreground'>Hand-Crafted with Love</h4>
                                    <p className='text-muted-foreground text-xs mt-1 leading-relaxed'>Every product is meticulously crafted in small batches for the finest quality.</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4'>
                                <div className='p-2.5 bg-card/60 border border-rose-200/50 rounded-xl shrink-0 mt-0.5 shadow-sm'>
                                    <Sparkles className='h-5 w-5 text-amber-600' />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-sm text-foreground'>Exclusive Collections</h4>
                                    <p className='text-muted-foreground text-xs mt-1 leading-relaxed'>Access members-only launches, deals & early drops when you sign in.</p>
                                </div>
                            </div>
                        </div>

                        <p className='text-muted-foreground text-[11px] relative z-10'>© 2026 Silver Star Inc.</p>
                    </div>

                    {/* Right form panel */}
                    <div className='flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative'>
                        <div className='max-w-sm mx-auto w-full'>
                            <div className='mb-8'>
                                <h1 className='text-3xl font-bold tracking-tight text-foreground'>Welcome Back</h1>
                                <p className='text-muted-foreground text-sm mt-2'>Enter your credentials to access your account</p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-5'>
                                <div className='space-y-2'>
                                    <Label htmlFor='email' className='text-sm font-medium text-neutral-700'>Email</Label>
                                    <Input
                                        id='email'
                                        placeholder='name@example.com'
                                        type='email'
                                        className='h-12 bg-background/50 border-border rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 transition-colors'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <Label htmlFor='password' className='text-sm font-medium text-neutral-700'>Password</Label>
                                        <Link href='/login/forgot-password' className='text-xs text-amber-600 hover:text-amber-700 transition-colors font-medium'>
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className='relative'>
                                        <Input
                                            id='password'
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='••••••••'
                                            className='h-12 bg-background/50 border-border rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 pr-12 transition-colors'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neutral-600 transition-colors focus:outline-none'
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className='bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2'>
                                        <span className='shrink-0'>⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button
                                    type='submit'
                                    className='w-full h-12 bg-[#F0DDD0] text-[#3D2314] border border-[#DEC4B4] hover:bg-[#E8D0C0] hover:text-[#2C1810] rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-brand/15 active:scale-[0.98] disabled:opacity-60'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Signing in...</>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>

                            <div className='mt-8 text-center'>
                                <div className='relative flex items-center gap-4 mb-6'>
                                    <div className='flex-1 h-px bg-neutral-200' />
                                    <span className='text-xs text-muted-foreground font-medium uppercase tracking-widest'>New here?</span>
                                    <div className='flex-1 h-px bg-neutral-200' />
                                </div>
                                <Link
                                    href='/register'
                                    className='inline-flex items-center justify-center w-full h-12 border-2 border-border text-neutral-700 hover:border-neutral-900 hover:text-foreground rounded-xl font-semibold transition-all duration-300 text-sm'
                                >
                                    Create an Account
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
