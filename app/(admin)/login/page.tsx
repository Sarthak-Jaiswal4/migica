"use client"

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Headers } from '@/components/Headers'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
// import { supabase } from '@/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // const { data, error } = await supabase.auth.signInWithPassword({
        //     email: email,
        //     password: password,
        // })
        // if (error) {
        //     console.log(error)
        // } else {
        //     console.log(data)
        //     router.push('/allproduct')
        // }
    }

    return (
        <div className='min-h-screen w-full relative bg-[#F6F4F1] flex flex-col'>
            <Headers />

            <main className='flex-grow flex items-center justify-center p-4 pt-24'>
                <Card className='w-full max-w-md shadow-xl border-none bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden'>
                    <CardHeader className='space-y-1 text-center pt-8'>
                        <CardTitle className='text-3xl font-bold tracking-tight'>Welcome Back</CardTitle>
                        <CardDescription className='text-neutral-500'>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4 px-8 pb-8'>
                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-sm font-medium ml-1'>Email</Label>
                            <Input
                                id='email'
                                placeholder='name@example.com'
                                type='email'
                                className='h-12 bg-white border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <Label htmlFor='password' className='text-sm font-medium ml-1'>Password</Label>
                                <a href='#' className='text-xs text-amber-600 hover:text-amber-700 transition-colors'>
                                    Forgot password?
                                </a>
                            </div>
                            <div className='relative'>
                                <Input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='••••••••'
                                    className='h-12 bg-white border-neutral-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 focus-visible:ring-amber-500 pr-12'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none'
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button className='w-full h-12 mt-4 bg-black text-white hover:bg-neutral-800 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-black/10' onClick={handleSubmit}>
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
