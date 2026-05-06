"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full px-4 pb-8 pt-10 bg-[#F6F4F1]">
            <div className="max-w-7xl mx-auto bg-neutral-900 text-white rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -ml-20 -mb-20" />
                <div
                    className="absolute inset-0 opacity-[0.5] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: "url('/gaussian-noise.png')", backgroundRepeat: 'repeat' }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter">Silver Star</h2>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                            Hand-poured artisanal candles and premium luxury goods designed to bring a touch of magic to your everyday life.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 border border-neutral-700 rounded-full hover:bg-white hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 border border-neutral-700 rounded-full hover:bg-white hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 border border-neutral-700 rounded-full hover:bg-white hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Shop</h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li><Link href="/shop/Candles" className="hover:text-amber-500 transition-colors">Candles</Link></li>
                            <li><Link href="/shop/Scarves" className="hover:text-amber-500 transition-colors">Scarves</Link></li>
                            <li><Link href="/shop/Jewelry" className="hover:text-amber-500 transition-colors">Jewelry</Link></li>
                            <li><Link href="/shop/all" className="hover:text-amber-500 transition-colors">Collections</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Support</h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li><Link href="/shipping-policy" className="hover:text-amber-500 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-amber-500 transition-colors">Refund Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
                            <li><Link href="/faqs" className="hover:text-amber-500 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold">Newsletter</h3>
                        <p className="text-sm text-neutral-400">Join our mailing list for weekly updates and exclusive magic.</p>
                        <div className="flex flex-col gap-3">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-neutral-800 border-neutral-700 text-white rounded-xl h-12 focus-visible:ring-amber-500"
                            />
                            <Button className="w-full bg-white text-black hover:bg-neutral-200 h-12 rounded-xl font-bold transition-all">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 text-xs text-neutral-500">
                    <p>© 2026 magica Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies-settings" className="hover:text-white transition-colors">Cookies Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
